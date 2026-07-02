# PlaylistTime ⏱️

> Calculate how long any YouTube playlist or video takes to finish — at any playback speed.

**Live demo:** _[Deploy to Vercel + Render, then add link here]_

---

## Features

- 🎥 **Single video** or full **playlist** duration
- 🔗 Handles all YouTube URL formats (watch, playlist, youtu.be, shorts, raw IDs)
- ⚡ **Speed breakdowns** — 1.25x / 1.5x / 1.75x / 2x
- 📅 **Daily watch planner** — "if I watch X minutes/day, I'll finish in N days"
- 📊 **Export to Excel** (playlist video list + summary)
- 🔗 **Share** — native Web Share API or clipboard copy
- 🔒 API key kept server-side only — never exposed to the browser

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| API | YouTube Data API v3 |
| Caching | node-cache (1h TTL, in-memory) |
| Rate limiting | express-rate-limit |
| Excel export | SheetJS (xlsx) — client-side |
| Deployment | Frontend → Vercel, Backend → Render |

---

## Setup

### 1. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use an existing one)
3. Enable **YouTube Data API v3**
4. Create credentials → **API Key**
5. (Optional) Restrict the key to your Render server's IP

---

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env and paste your YOUTUBE_API_KEY
npm install
npm run dev        # starts on http://localhost:5000
```

**`server/.env`**
```
YOUTUBE_API_KEY=AIza...your_key_here
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

---

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000 for local dev
npm install
npm run dev        # starts on http://localhost:5173
```

---

### 4. Running Both Together

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

Then open `http://localhost:5173`.

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Environment variables:
   - `YOUTUBE_API_KEY` = your API key
   - `CLIENT_ORIGIN` = your Vercel frontend URL (e.g. `https://playlisttime.vercel.app`)
7. Deploy → note the Render URL (e.g. `https://playlisttime-api.onrender.com`)

### Frontend → Vercel

1. Create a new project on [Vercel](https://vercel.com) from the same repo
2. Root directory: `client`
3. Framework preset: **Vite**
4. Environment variables:
   - `VITE_API_URL` = your Render backend URL
5. Deploy

> ⚠️ **Important:** Keep your `YOUTUBE_API_KEY` in Render's dashboard only. Never commit it to git.

---

## Personalizing

### Buy Me a Coffee
Edit the `BMAC_USERNAME` constant in [`client/src/components/BuyMeCoffeeButton.jsx`](client/src/components/BuyMeCoffeeButton.jsx):

```js
const BMAC_USERNAME = 'your-username-here';
```

---

## API Reference

### `POST /api/calculate`

**Request body:**
```json
{ "url": "https://www.youtube.com/playlist?list=PLxxx" }
```

**Response (playlist):**
```json
{
  "type": "playlist",
  "playlist": {
    "id": "PLxxx",
    "title": "...",
    "channelTitle": "...",
    "requestedVideoCount": 50,
    "fetchedVideoCount": 48,
    "excludedCount": 2,
    "totalDurationSeconds": 72000,
    "videos": [
      { "id": "...", "title": "...", "durationSeconds": 1800 }
    ]
  }
}
```

**Error response:**
```json
{ "error": "INVALID_URL", "message": "Could not extract a video or playlist ID." }
```

**Error codes:** `INVALID_URL` | `PLAYLIST_NOT_FOUND` | `VIDEO_UNAVAILABLE` | `QUOTA_EXCEEDED`

---

## Quota Usage

- YouTube Data API v3 default: **10,000 units/day**
- `playlistItems.list` = 1 unit per call (50 items/call)
- `videos.list` = 1 unit per call (50 IDs/call)
- A 500-video playlist ≈ 20 units. Budget: ~500 calculations/day safely
- Popular playlists are cached for 1 hour — repeat lookups cost 0 units

---

## License

MIT — use freely for personal and portfolio projects.
