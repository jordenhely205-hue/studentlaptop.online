import React from 'react';
import styles from './AnnouncementBanner.module.css';

export default function AnnouncementBanner() {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.marquee}>
        <strong style={{marginRight: '8px'}}>[Important Notice]:</strong>
        Online Registration for Student Laptop Scheme 2026 is open from 01st September 2026. Last date to apply is 15th September 2026. Apply as soon as possible!
      </div>
    </div>
  );
}
