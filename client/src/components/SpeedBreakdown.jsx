import { adjustedSeconds, toLongForm, toCompact } from '../utils/formatDuration';

const SPEEDS = [1.25, 1.5, 1.75, 2];

function formatTime(secs) {
  return secs >= 3600 ? toLongForm(secs) : toCompact(secs);
}

export default function SpeedBreakdown({ totalSeconds }) {
  return (
    <div>
      <p className="label-sm" style={{ marginBottom: 12 }}>Watch time at speed</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
      }}>
        {SPEEDS.map((speed) => {
          const adj = adjustedSeconds(totalSeconds, speed);
          return (
            <div key={speed} className="card-sm" style={{ textAlign: 'center' }}>
              <p className="label-sm" style={{ marginBottom: 8, color: 'var(--accent-red)' }}>{speed}x</p>
              <p style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
                {formatTime(adj)}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 560px) {
          .speed-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
