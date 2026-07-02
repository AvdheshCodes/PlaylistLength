/**
 * Parses a YouTube URL (or raw ID) and extracts videoId and/or playlistId.
 *
 * Supported formats:
 *   - https://www.youtube.com/watch?v=ID
 *   - https://www.youtube.com/watch?v=ID&list=PLID
 *   - https://www.youtube.com/playlist?list=PLID
 *   - https://youtu.be/ID
 *   - https://youtu.be/ID?list=PLID
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 *   - Raw 11-char video ID
 *   - Raw playlist ID (starts with PL, RD, OL, UU, LL, etc.)
 *
 * @param {string} input
 * @returns {{ videoId: string|null, playlistId: string|null }}
 * @throws {Error} with code INVALID_URL if nothing extractable
 */
function parseUrl(input) {
  if (!input || typeof input !== 'string') {
    throw createError('INVALID_URL', 'Please provide a YouTube URL or ID.');
  }

  const trimmed = input.trim();

  // --- Raw IDs (no protocol) ---
  // YouTube video IDs are exactly 11 chars: [A-Za-z0-9_-]
  const rawVideoIdRegex = /^[A-Za-z0-9_-]{11}$/;
  // Playlist IDs start with known prefixes
  const rawPlaylistIdRegex = /^(PL|RD|OL|UU|LL|FL|WL)[A-Za-z0-9_-]+$/;

  if (rawVideoIdRegex.test(trimmed)) {
    return { videoId: trimmed, playlistId: null };
  }
  if (rawPlaylistIdRegex.test(trimmed)) {
    return { videoId: null, playlistId: trimmed };
  }

  // --- URL parsing ---
  let url;
  try {
    // Prepend protocol if missing so URL() can parse it
    const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    url = new URL(withProtocol);
  } catch {
    throw createError('INVALID_URL', 'That doesn\'t look like a valid YouTube URL or ID.');
  }

  const hostname = url.hostname.replace(/^www\./, '');
  const pathname = url.pathname;
  const params = url.searchParams;

  let videoId = null;
  let playlistId = null;

  if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    // /watch?v=ID[&list=PLID]
    if (pathname === '/watch') {
      videoId = params.get('v') || null;
      playlistId = params.get('list') || null;
    }
    // /playlist?list=PLID
    else if (pathname === '/playlist') {
      playlistId = params.get('list') || null;
    }
    // /embed/ID
    else if (pathname.startsWith('/embed/')) {
      videoId = pathname.split('/embed/')[1].split('?')[0] || null;
      playlistId = params.get('list') || null;
    }
    // /shorts/ID
    else if (pathname.startsWith('/shorts/')) {
      videoId = pathname.split('/shorts/')[1].split('?')[0] || null;
    }
    // /v/ID (old format)
    else if (pathname.startsWith('/v/')) {
      videoId = pathname.split('/v/')[1].split('?')[0] || null;
    }
  } else if (hostname === 'youtu.be') {
    // youtu.be/ID[?list=PLID]
    videoId = pathname.slice(1).split('?')[0] || null;
    playlistId = params.get('list') || null;
  }

  // Validate extracted IDs
  if (videoId && !isValidVideoId(videoId)) videoId = null;
  if (playlistId && !isValidPlaylistId(playlistId)) playlistId = null;

  if (!videoId && !playlistId) {
    throw createError('INVALID_URL', 'Could not extract a video or playlist ID from the URL. Make sure it\'s a valid YouTube link.');
  }

  return { videoId, playlistId };
}

function isValidVideoId(id) {
  return /^[A-Za-z0-9_-]{11}$/.test(id);
}

function isValidPlaylistId(id) {
  return /^[A-Za-z0-9_-]{2,}$/.test(id);
}

function createError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

module.exports = { parseUrl };
