/**
 * Parses an ISO 8601 duration string into total seconds.
 *
 * Examples:
 *   PT1H2M3S  → 3723
 *   PT30M     → 1800
 *   PT45S     → 45
 *   P0D       → 0
 *   P1DT2H    → 93600
 *
 * @param {string} iso - ISO 8601 duration string (e.g. "PT1H2M3S")
 * @returns {number} total seconds (0 if unparseable or live/premiere)
 */
function parseDuration(iso) {
  if (!iso || typeof iso !== 'string') return 0;

  // P0D or PT0S — zero-length (live streams / premieres)
  if (iso === 'P0D' || iso === 'PT0S' || iso === 'PT0M0S') return 0;

  // Regex captures optional days, hours, minutes, seconds
  const regex = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
  const match = iso.match(regex);

  if (!match) return 0;

  const days    = parseFloat(match[1] || 0);
  const hours   = parseFloat(match[2] || 0);
  const minutes = parseFloat(match[3] || 0);
  const seconds = parseFloat(match[4] || 0);

  return Math.round(days * 86400 + hours * 3600 + minutes * 60 + seconds);
}

/**
 * Returns true if a duration represents a live stream or premiere (zero duration).
 * @param {string} iso
 * @returns {boolean}
 */
function isLiveOrPremiere(iso) {
  return parseDuration(iso) === 0;
}

module.exports = { parseDuration, isLiveOrPremiere };
