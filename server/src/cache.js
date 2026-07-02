const NodeCache = require('node-cache');

// TTL: 3600 seconds (1 hour)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Get a value from cache.
 * @param {string} key
 * @returns {any | undefined}
 */
function get(key) {
  return cache.get(key);
}

/**
 * Set a value in cache.
 * @param {string} key
 * @param {any} value
 * @param {number} [ttl] - optional override TTL in seconds
 */
function set(key, value, ttl) {
  if (ttl !== undefined) {
    cache.set(key, value, ttl);
  } else {
    cache.set(key, value);
  }
}

/**
 * Delete a key from cache.
 * @param {string} key
 */
function del(key) {
  cache.del(key);
}

module.exports = { get, set, del };
