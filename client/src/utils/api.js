import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30s timeout for large playlists
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Calls POST /api/calculate with the provided YouTube URL or ID.
 * @param {string} url
 * @returns {Promise<{ type: 'video'|'playlist'|'both', video?: object, playlist?: object }>}
 * @throws {Error} with .code and .message from the backend
 */
export async function calculateUrl(url) {
  try {
    const response = await apiClient.post('/api/calculate', { url });
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      const apiError = new Error(err.response.data.message || 'An error occurred.');
      apiError.code = err.response.data.error || 'API_ERROR';
      throw apiError;
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
      const networkError = new Error('Cannot connect to the server. Make sure the backend is running.');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    throw err;
  }
}
