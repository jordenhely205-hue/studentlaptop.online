import React from 'react';

export default function AnnouncementBanner() {
  return (
    <div style={{
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '0.6rem 1rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      textAlign: 'center',
      width: '100%%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      lineHeight: '1.4',
      zIndex: 50
    }}>
      <span style={{fontSize: '1rem'}}>??</span> <strong>Important Notice:</strong> Online Registration for Student Laptop Scheme 2026 is open from 01st September 2026. Last date to apply is 15th September 2026. Apply as soon as possible!
    </div>
  );
}

