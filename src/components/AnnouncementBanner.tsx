import React from 'react';

export default function AnnouncementBanner() {
  return (
    <div style={{
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '0.45rem 0',
      fontSize: '0.9rem',
      fontWeight: 500,
      width: '100%%',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center'
    }}>
      <marquee behavior="scroll" direction="left" scrollamount="7" onMouseOver={(e) => e.currentTarget.stop()} onMouseOut={(e) => e.currentTarget.start()}>
        <strong style={{ marginRight: '8px' }}>[Important Notice]:</strong>
        Online Registration for Student Laptop Scheme 2026 is open from 01st September 2026. Last date to apply is 15th September 2026. Apply as soon as possible!
      </marquee>
    </div>
  );
}
