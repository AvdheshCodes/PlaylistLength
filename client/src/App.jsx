import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UrlInputForm from './components/UrlInputForm';
import SkeletonLoader from './components/SkeletonLoader';
import ErrorBanner from './components/ErrorBanner';
import ResultCard from './components/ResultCard';
import { calculateUrl } from './utils/api';
import './index.css';

export default function App() {
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);  // { code, message }
  const [result,      setResult]      = useState(null);  // API response
  const [inputValue,  setInputValue]  = useState('');    // tracks last submitted URL

  // ── Auto-run from ?url= query param ────────────────────────────
  const runCalculation = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setInputValue(url);

    try {
      const data = await calculateUrl(url);
      setResult(data);
    } catch (err) {
      setError({ code: err.code || 'API_ERROR', message: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      runCalculation(decodeURIComponent(urlParam));
    }
  }, [runCalculation]);

  const handleSubmit = (url) => {
    // Update browser URL bar so sharing works
    const newUrl = `${window.location.pathname}?url=${encodeURIComponent(url)}`;
    window.history.pushState({}, '', newUrl);
    runCalculation(url);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section style={{ padding: '60px 0 40px', textAlign: 'center' }}>
          <div className="container">
            {/* Pill badge */}
            <div style={{ marginBottom: 20 }}>
              <span className="badge badge-free">✨ Free tool · No signup required</span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              <span style={{ color: 'var(--accent-red)' }}>YouTube</span>{' '}
              <span>Playlist Duration Calculator</span>
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}>
              Instantly calculate how long any YouTube playlist or video takes to finish — at any playback speed.
            </p>
          </div>
        </section>

        {/* ── Input ────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 20 }}>
          <div className="container">
            <UrlInputForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </section>

        {/* ── Results ──────────────────────────────────────────── */}
        <section style={{ paddingBottom: 60 }}>
          <div className="container">
            {/* Loading */}
            {loading && <SkeletonLoader />}

            {/* Error */}
            {!loading && error && (
              <ErrorBanner code={error.code} message={error.message} />
            )}

            {/* Results */}
            {!loading && result && (
              <>
                {/* "Multiple results" banner */}
                {result.type === 'both' && (
                  <div className="fade-in" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 20px',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 20,
                  }}>
                    <span style={{ fontSize: 18 }}>ℹ️</span>
                    <p style={{ fontSize: 14, color: '#93c5fd' }}>
                      <strong>Multiple results found:</strong> Your URL contains both a video and a playlist — showing both below.
                    </p>
                  </div>
                )}

                {/* Video card */}
                {(result.type === 'video' || result.type === 'both') && result.video && (
                  <ResultCard type="video" data={result.video} originalInput={inputValue} />
                )}

                {/* Playlist card */}
                {(result.type === 'playlist' || result.type === 'both') && result.playlist && (
                  <ResultCard type="playlist" data={result.playlist} originalInput={inputValue} />
                )}
              </>
            )}

            {/* Empty state (before first search) */}
            {!loading && !result && !error && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏱️</div>
                <p style={{ fontSize: 16, marginBottom: 8, color: 'var(--text-secondary)' }}>
                  Paste a YouTube URL above to get started
                </p>
                <p style={{ fontSize: 14 }}>
                  Works with videos, playlists, and combined URLs
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── How it works section ──────────────────────────────── */}
        {!result && !loading && !error && (
          <section style={{ paddingBottom: 60 }}>
            <div className="container">
              <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 32, color: 'var(--text-secondary)' }}>
                How it works
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {[
                  { icon: '📋', title: 'Paste any URL', desc: 'Video, playlist, or combined URL — we handle them all.' },
                  { icon: '⚡', title: 'Instant calculation', desc: 'Fetches all metadata from YouTube API with smart caching.' },
                  { icon: '🎯', title: 'Speed breakdowns', desc: 'See your time at 1.25x, 1.5x, 1.75x, and 2x speed.' },
                  { icon: '📅', title: 'Daily planner', desc: 'Set your daily watch time and see how many days you need.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="card-sm" style={{ textAlign: 'center', padding: '24px 20px' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                    <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
