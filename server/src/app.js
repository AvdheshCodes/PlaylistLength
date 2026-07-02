require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const calculateRouter = require('./routes/calculate');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — supports comma-separated origins e.g. "https://app.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


// JSON body parsing
app.use(express.json());

// Health check (useful for Render uptime checks)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply rate limiting to API routes
app.use('/api', rateLimiter);

// Routes
app.use('/api', calculateRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PlaylistTime server running on port ${PORT}`);
  console.log(`   Allowing requests from: ${allowedOrigins.join(', ')}`);
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('⚠️  WARNING: YOUTUBE_API_KEY is not set! API calls will fail.');
  }
});

module.exports = app;
