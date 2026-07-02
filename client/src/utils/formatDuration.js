/**
 * Converts total seconds into a compact time string.
 * Under 1 hour: "MM:SS"
 * 1 hour+:      "H:MM:SS"
 *
 * @param {number} totalSeconds
 * @returns {string}
 */
export function toCompact(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) return '0:00';
  const s = Math.round(totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Converts total seconds into a human-readable long-form string.
 * e.g. "1 day 9 hours 17 minutes 3 seconds"
 *
 * @param {number} totalSeconds
 * @returns {string}
 */
export function toLongForm(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) return '0 seconds';
  const s = Math.round(totalSeconds);

  const days    = Math.floor(s / 86400);
  const hours   = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const parts = [];
  if (days)    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours)   parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds && days === 0) parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);

  return parts.length > 0 ? parts.join(' ') : '0 seconds';
}

/**
 * Smart format: uses compact for < 1 hour, long form for >= 1 hour.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatSmart(totalSeconds) {
  if (totalSeconds < 3600) return toCompact(totalSeconds);
  return toLongForm(totalSeconds);
}

/**
 * Returns adjusted duration at a given speed.
 * @param {number} totalSeconds
 * @param {number} speed - e.g. 1.5
 * @returns {number}
 */
export function adjustedSeconds(totalSeconds, speed) {
  return Math.round(totalSeconds / speed);
}
