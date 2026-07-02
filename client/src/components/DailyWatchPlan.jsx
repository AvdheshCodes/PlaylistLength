import { useState } from 'react';

const MINUTES_OPTIONS = [15, 30, 45, 60, 90, 120, 180];
const SPEED_OPTIONS   = [1, 1.25, 1.5, 1.75, 2];

export default function DailyWatchPlan({ totalSeconds }) {
  const [minutesPerDay, setMinutesPerDay] = useState(60);
  const [speed, setSpeed]                 = useState(1);

  const days = Math.ceil(totalSeconds / (minutesPerDay * 60 * speed));

  return (
    <div>
      <p className="label-sm" style={{ marginBottom: 14 }}>Daily watch plan</p>

      <div style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Watch</span>

          <select
            id="minutes-per-day"
            className="select-field"
            value={minutesPerDay}
            onChange={(e) => setMinutesPerDay(Number(e.target.value))}
          >
            {MINUTES_OPTIONS.map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>

          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>per day at</span>

          <select
            id="speed-select"
            className="select-field"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            {SPEED_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}x speed</option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>You'll finish in:</span>
          <span style={{
            fontSize: 36,
            fontWeight: 800,
            color: 'var(--accent-red)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            {isFinite(days) ? days : '—'}
          </span>
          <span style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>
            {days === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    </div>
  );
}
