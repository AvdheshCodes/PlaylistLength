const ERROR_MESSAGES = {
  INVALID_URL: { icon: '🔗', title: 'Invalid URL', hint: 'Paste a YouTube video or playlist URL, or a raw video/playlist ID.' },
  PLAYLIST_NOT_FOUND: { icon: '🔒', title: 'Playlist not found', hint: 'The playlist may be private, deleted, or the ID is incorrect.' },
  VIDEO_UNAVAILABLE: { icon: '🚫', title: 'Video unavailable', hint: 'The video may be private, deleted, or age-restricted.' },
  QUOTA_EXCEEDED: { icon: '⏳', title: 'API quota exceeded', hint: 'Daily YouTube API limit reached. Please try again tomorrow.' },
  NETWORK_ERROR: { icon: '📡', title: 'Cannot connect to server', hint: 'Make sure the backend is running, then try again.' },
  API_ERROR: { icon: '⚠️', title: 'API error', hint: 'Something went wrong with the YouTube API. Please try again.' },
};

export default function ErrorBanner({ code, message }) {
  const info = ERROR_MESSAGES[code] || { icon: '⚠️', title: 'Something went wrong', hint: '' };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '18px 22px',
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 24,
    }}
    className="fade-in"
    role="alert"
    >
      <span style={{ fontSize: 22, lineHeight: 1.3 }}>{info.icon}</span>
      <div>
        <p style={{ fontWeight: 600, color: '#fca5a5', marginBottom: 4 }}>{info.title}</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {message || info.hint}
        </p>
        {info.hint && message && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{info.hint}</p>
        )}
      </div>
    </div>
  );
}
