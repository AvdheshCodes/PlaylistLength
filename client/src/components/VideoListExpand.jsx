import { useState } from 'react';
import { toCompact } from '../utils/formatDuration';

const PAGE_SIZE = 50;

export default function VideoListExpand({ videos }) {
  const [open, setOpen]   = useState(false);
  const [page, setPage]   = useState(1);

  if (!videos || videos.length === 0) return null;

  const visible    = videos.slice(0, page * PAGE_SIZE);
  const hasMore    = visible.length < videos.length;

  return (
    <div>
      <button
        id="toggle-video-list"
        onClick={() => setOpen((v) => !v)}
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'space-between' }}
        aria-expanded={open}
      >
        <span>{open ? '▲ Hide' : '▼ View all'} videos ({videos.length})</span>
      </button>

      {open && (
        <div className="fade-in" style={{ marginTop: 12 }}>
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '44px 1fr 80px',
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
            }}>
              <span className="label-sm">#</span>
              <span className="label-sm">Title</span>
              <span className="label-sm" style={{ textAlign: 'right' }}>Duration</span>
            </div>

            {/* Video rows */}
            {visible.map((video, idx) => (
              <div
                key={video.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr 80px',
                  padding: '11px 16px',
                  borderBottom: idx < visible.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  alignItems: 'center',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'monospace' }}>
                  {idx + 1}
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: 14,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 12,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  {video.title}
                </a>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'right', fontFamily: 'monospace' }}>
                  {toCompact(video.durationSeconds)}
                </span>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <div style={{ padding: '12px 16px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <button
                  id="load-more-videos"
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: '8px 20px' }}
                >
                  Load more ({videos.length - visible.length} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
