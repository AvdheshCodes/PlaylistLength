const axios = require('axios');
const cache = require('../cache');
const { parseDuration, isLiveOrPremiere } = require('../utils/isoDuration');

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Returns the API key from env, or throws if missing.
 */
function getApiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY environment variable is not set.');
  return key;
}

/**
 * Maps YouTube API error responses to our error codes.
 */
function mapApiError(err) {
  const status = err.response?.status;
  const reason = err.response?.data?.error?.errors?.[0]?.reason;
  const message = err.response?.data?.error?.message || '';

  console.error('[YouTube API Error]', { status, reason, message });

  if (status === 403 && reason === 'quotaExceeded') {
    return createError('QUOTA_EXCEEDED', 'YouTube API daily quota exceeded. Please try again tomorrow.');
  }
  if (status === 403 && (reason === 'accessNotConfigured' || message.includes('not been used') || message.includes('disabled'))) {
    return createError('API_NOT_ENABLED', 'YouTube Data API v3 is not enabled for this API key. Go to Google Cloud Console → APIs & Services → Enable YouTube Data API v3.');
  }
  if (status === 403 && reason === 'keyInvalid') {
    return createError('INVALID_KEY', 'The YouTube API key is invalid. Check that it was copied correctly.');
  }
  if (status === 403) {
    return createError('QUOTA_EXCEEDED', `YouTube API access denied (${reason || 'unknown reason'}). Make sure YouTube Data API v3 is enabled in Google Cloud Console and the key has no HTTP referrer restrictions.`);
  }
  if (status === 404) {
    return createError('VIDEO_UNAVAILABLE', 'The requested video or playlist was not found.');
  }
  return createError('API_ERROR', `YouTube API error: ${err.message}`);
}

function createError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

/**
 * Fetches details for a single video.
 * @param {string} videoId
 * @returns {Promise<{ id, title, channelTitle, durationSeconds }>}
 */
async function getVideoDetails(videoId) {
  const cacheKey = `video:${videoId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let response;
  try {
    response = await axios.get(`${YT_API_BASE}/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: getApiKey(),
      },
    });
  } catch (err) {
    throw mapApiError(err);
  }

  const items = response.data.items;
  if (!items || items.length === 0) {
    throw createError('VIDEO_UNAVAILABLE', 'Video not found or is private/deleted.');
  }

  const item = items[0];
  const durationIso = item.contentDetails?.duration;
  const durationSeconds = parseDuration(durationIso);

  const result = {
    id: item.id,
    title: item.snippet?.title || 'Unknown Title',
    channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
    durationSeconds,
    isLive: isLiveOrPremiere(durationIso),
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || null,
  };

  cache.set(cacheKey, result);
  return result;
}

/**
 * Fetches all details for a playlist (title, channel, all video durations).
 * Paginates playlistItems.list and batches videos.list calls.
 * @param {string} playlistId
 * @returns {Promise<{ id, title, channelTitle, requestedVideoCount, fetchedVideoCount, excludedCount, totalDurationSeconds, videos[] }>}
 */
async function getPlaylistDetails(playlistId) {
  const cacheKey = `playlist:${playlistId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Step 1: Get playlist metadata (title, channel, total item count)
  let playlistMeta;
  try {
    const metaResponse = await axios.get(`${YT_API_BASE}/playlists`, {
      params: {
        part: 'snippet,contentDetails',
        id: playlistId,
        key: getApiKey(),
      },
    });

    const items = metaResponse.data.items;
    if (!items || items.length === 0) {
      throw createError('PLAYLIST_NOT_FOUND', 'Playlist not found. It may be private or deleted.');
    }

    const pl = items[0];
    playlistMeta = {
      id: pl.id,
      title: pl.snippet?.title || 'Unknown Playlist',
      channelTitle: pl.snippet?.channelTitle || 'Unknown Channel',
      requestedVideoCount: pl.contentDetails?.itemCount || 0,
      thumbnailUrl: pl.snippet?.thumbnails?.medium?.url || pl.snippet?.thumbnails?.default?.url || null,
    };
  } catch (err) {
    if (err.code) throw err;
    throw mapApiError(err);
  }

  // Step 2: Paginate playlistItems.list to collect all video IDs
  const allVideoIds = [];
  let pageToken = null;

  do {
    let pageResponse;
    try {
      pageResponse = await axios.get(`${YT_API_BASE}/playlistItems`, {
        params: {
          part: 'contentDetails',
          playlistId,
          maxResults: 50,
          pageToken: pageToken || undefined,
          key: getApiKey(),
        },
      });
    } catch (err) {
      throw mapApiError(err);
    }

    const pageItems = pageResponse.data.items || [];
    for (const item of pageItems) {
      const vid = item.contentDetails?.videoId;
      if (vid) allVideoIds.push(vid);
    }

    pageToken = pageResponse.data.nextPageToken || null;
  } while (pageToken);

  // Step 3: Batch video IDs into groups of 50, call videos.list for durations
  const videos = [];
  let excludedCount = 0;

  for (let i = 0; i < allVideoIds.length; i += 50) {
    const batch = allVideoIds.slice(i, i + 50);
    let batchResponse;

    try {
      batchResponse = await axios.get(`${YT_API_BASE}/videos`, {
        params: {
          part: 'snippet,contentDetails',
          id: batch.join(','),
          key: getApiKey(),
        },
      });
    } catch (err) {
      throw mapApiError(err);
    }

    const batchItems = batchResponse.data.items || [];

    // Note: items that are private/deleted won't appear in the response
    const returnedIds = new Set(batchItems.map((it) => it.id));
    const missingInBatch = batch.filter((id) => !returnedIds.has(id));
    excludedCount += missingInBatch.length;

    for (const item of batchItems) {
      const durationIso = item.contentDetails?.duration;
      const durationSeconds = parseDuration(durationIso);
      const isLive = isLiveOrPremiere(durationIso);

      if (isLive) {
        excludedCount++;
        continue; // skip live/premieres from totals
      }

      videos.push({
        id: item.id,
        title: item.snippet?.title || 'Unknown Title',
        channelTitle: item.snippet?.channelTitle || '',
        durationSeconds,
      });
    }
  }

  const totalDurationSeconds = videos.reduce((sum, v) => sum + v.durationSeconds, 0);

  const result = {
    id: playlistMeta.id,
    title: playlistMeta.title,
    channelTitle: playlistMeta.channelTitle,
    thumbnailUrl: playlistMeta.thumbnailUrl,
    requestedVideoCount: playlistMeta.requestedVideoCount,
    fetchedVideoCount: videos.length,
    excludedCount,
    totalDurationSeconds,
    videos,
  };

  cache.set(cacheKey, result);
  return result;
}

module.exports = { getVideoDetails, getPlaylistDetails };
