const express = require('express');
const router = express.Router();
const { parseUrl } = require('../utils/parseUrl');
const { getVideoDetails, getPlaylistDetails } = require('../services/youtubeService');

/**
 * POST /api/calculate
 * Body: { url: string }
 *
 * Response shape:
 * {
 *   type: "video" | "playlist" | "both",
 *   video?: { id, title, channelTitle, durationSeconds, thumbnailUrl },
 *   playlist?: { id, title, channelTitle, requestedVideoCount, fetchedVideoCount, excludedCount, totalDurationSeconds, videos[] }
 * }
 */
router.post('/calculate', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({
      error: 'INVALID_URL',
      message: 'Please provide a YouTube URL or ID.',
    });
  }

  // Parse URL
  let parsed;
  try {
    parsed = parseUrl(url.trim());
  } catch (err) {
    return res.status(400).json({
      error: err.code || 'INVALID_URL',
      message: err.message,
    });
  }

  const { videoId, playlistId } = parsed;

  try {
    // Both video and playlist
    if (videoId && playlistId) {
      const [video, playlist] = await Promise.all([
        getVideoDetails(videoId),
        getPlaylistDetails(playlistId),
      ]);
      return res.json({ type: 'both', video, playlist });
    }

    // Video only
    if (videoId) {
      const video = await getVideoDetails(videoId);
      return res.json({ type: 'video', video });
    }

    // Playlist only
    if (playlistId) {
      const playlist = await getPlaylistDetails(playlistId);
      return res.json({ type: 'playlist', playlist });
    }
  } catch (err) {
    const statusMap = {
      PLAYLIST_NOT_FOUND: 404,
      VIDEO_UNAVAILABLE: 404,
      QUOTA_EXCEEDED: 429,
      INVALID_URL: 400,
    };
    const status = statusMap[err.code] || 500;
    return res.status(status).json({
      error: err.code || 'API_ERROR',
      message: err.message || 'An unexpected error occurred.',
    });
  }
});

module.exports = router;
