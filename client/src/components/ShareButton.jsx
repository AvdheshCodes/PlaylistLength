import { useState } from 'react';

export default function ShareButton({ originalInput }) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg]         = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2600);
  };

  const buildShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    return `${base}?url=${encodeURIComponent(originalInput)}`;
  };

  const handleShare = async () => {
    const shareUrl = buildShareUrl();
    const shareData = {
      title: 'PlaylistTime',
      text: 'Check out how long this YouTube playlist is!',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('✅ Shareable link copied to clipboard!');
      } catch {
        // Fallback: select text manually
        showToast('⚠️ Could not copy — try copying the URL manually.');
      }
    }
  };

  return (
    <>
      <button id="share-btn" onClick={handleShare} className="btn-secondary">
        🔗 Share
      </button>

      {toastVisible && (
        <div className="toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </>
  );
}
