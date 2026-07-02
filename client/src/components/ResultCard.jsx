import { toLongForm, toCompact } from '../utils/formatDuration';
import SpeedBreakdown from './SpeedBreakdown';
import DailyWatchPlan from './DailyWatchPlan';
import VideoListExpand from './VideoListExpand';
import ExportExcelButton from './ExportExcelButton';
import ShareButton from './ShareButton';

/**
 * Renders one result card — either a video or a playlist.
 * @param {{ type: 'video'|'playlist', data: object, originalInput: string }} props
 */
export default function ResultCard({ type, data, originalInput }) {
  const isPlaylist   = type === 'playlist';
  const totalSeconds = isPlaylist ? data.totalDurationSeconds : data.durationSeconds;

  const compactDur   = toCompact(totalSeconds);
  const longDur      = toLongForm(totalSeconds);
  const showLongForm = totalSeconds >= 3600;

  return (
    <div className="card fade-in" style={{ marginBottom: 24 }}>
      {/* ── Header row ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
        {/* Thumbnail placeholder / type icon */}
        <div style={{
          width: 72, height: 72,
          background: 'var(--bg-input)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
          border: '1px solid var(--border)',
        }}>
          {isPlaylist ? '📋' : '▶'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className={`badge ${isPlaylist ? 'badge-info' : 'badge-success'}`}>
              {isPlaylist ? '📋 Playlist' : '▶ Video'}
            </span>
            {isPlaylist && data.excludedCount > 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                ({data.excludedCount} private/live videos excluded)
              </span>
            )}
          </div>

          <h2 style={{
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.3,
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {data.title}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>
            {data.channelTitle}
          </p>

          {isPlaylist && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {data.fetchedVideoCount} of {data.requestedVideoCount} videos
            </p>
          )}
        </div>
      </div>

      {/* ── Total Duration ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: 24,
      }}>
        <p className="label-sm" style={{ marginBottom: 8 }}>Total Duration</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {compactDur}
          </span>
          {showLongForm && (
            <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{longDur}</span>
          )}
        </div>
        {!showLongForm && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            {totalSeconds} seconds
          </p>
        )}
      </div>

      {/* ── Speed Breakdown ────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <SpeedBreakdown totalSeconds={totalSeconds} />
      </div>

      {/* ── Daily Watch Plan ───────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <DailyWatchPlan totalSeconds={totalSeconds} />
      </div>

      {/* ── Video List (playlist only) ──────────────────────────── */}
      {isPlaylist && data.videos?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <VideoListExpand videos={data.videos} />
        </div>
      )}

      <div className="divider" />

      {/* ── Actions ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {isPlaylist && (
          <ExportExcelButton data={data} type={type} />
        )}
        <ShareButton originalInput={originalInput} />
        <a
          href={
            isPlaylist
              ? `https://www.youtube.com/playlist?list=${data.id}`
              : `https://www.youtube.com/watch?v=${data.id}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ textDecoration: 'none' }}
        >
          ↗ Open on YouTube
        </a>
      </div>
    </div>
  );
}
