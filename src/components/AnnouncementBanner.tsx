import React from "react";
import { Megaphone } from "lucide-react";
import styles from "./AnnouncementBanner.module.css";

export default function AnnouncementBanner() {
  const tickerItem = (
    <div className={styles.tickerItem}>
      <span className={styles.iconWrapper} aria-hidden="true">
        <Megaphone size={16} strokeWidth={2.2} />
        <span>📢</span>
      </span>
      <span>
        <strong className={styles.noticeLabel}>Important Notice:</strong>
        {" "}Online Registration for Student Laptop Scheme 2026 is open from{" "}
        <strong className={styles.dateHighlight}>01st September 2026</strong>. Last date to apply is{" "}
        <strong className={styles.dateHighlight}>15th September 2026</strong>. Apply as soon as possible!
      </span>
    </div>
  );

  return (
    <aside className={styles.bannerContainer} role="region" aria-label="Announcement Banner">
      <div className={styles.tickerTrack}>
        {/* Track 1 */}
        {tickerItem}
        {tickerItem}
        {/* Track 2 (Seamless loop duplicate) */}
        {tickerItem}
        {tickerItem}
      </div>
    </aside>
  );
}
