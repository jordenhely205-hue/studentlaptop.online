import React from 'react';

export default function AnnouncementBanner() {
  return (
    <div style={{
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '0.45rem 0',
      width: '100%%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      display: 'flex',
      zIndex: 50,
      position: 'relative'
    }}>
      <style>{`
        @keyframes smoothMarquee {
          0%% { transform: translateX(0%%); }
          100%% { transform: translateX(-50%%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: smoothMarquee 25s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          padding: 0 2.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
      <div className="ticker-track">
        <div className="ticker-item">
          <strong style={{ marginRight: '8px' }}>[Important Notice]:</strong>
          Online Registration for Student Laptop Scheme 2026 is open from 01st September 2026. Last date to apply is 15th September 2026. Apply as soon as possible!
        </div>
        <div className="ticker-item">
          <strong style={{ marginRight: '8px' }}>[Important Notice]:</strong>
          Online Registration for Student Laptop Scheme 2026 is open from 01st September 2026. Last date to apply is 15th September 2026. Apply as soon as possible!
        </div>
      </div>
    </div>
  );
}
