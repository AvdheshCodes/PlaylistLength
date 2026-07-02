import { useState } from 'react';

export default function UrlInputForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError('Please enter a YouTube URL or ID.');
      return;
    }
    setValidationError('');
    onSubmit(trimmed);
  };

  return (
    <div className="card" style={{ marginBottom: 32 }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url-input" style={{ display: 'block', fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
          YouTube URL or Playlist ID
        </label>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            id="url-input"
            type="text"
            className="input-field"
            style={{ flex: 1, minWidth: 240 }}
            placeholder="https://youtube.com/playlist?list=... or paste a video/playlist ID"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setValidationError(''); }}
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            id="calculate-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ whiteSpace: 'nowrap', minWidth: 180 }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid #0a0a0f', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Calculating…
              </>
            ) : (
              <>▶ Calculate Duration</>
            )}
          </button>
        </div>

        {validationError && (
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--accent-red)' }}>{validationError}</p>
        )}

        {/* Advanced options (collapsed placeholder) */}
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ transform: showAdvanced ? 'rotate(90deg)' : 'none', transition: 'transform 200ms', display: 'inline-block' }}>▶</span>
            Advanced options
          </button>

          {showAdvanced && (
            <div style={{
              marginTop: 12,
              padding: '16px 20px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                🚧 Advanced filters (exclude videos under X seconds, etc.) coming in v1.1.
              </p>
            </div>
          )}
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
