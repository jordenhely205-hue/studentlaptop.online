import React from "react";
import { Megaphone } from "lucide-react";
import styles from "./AnnouncementBanner.module.css";

export default function AnnouncementBanner() {
  const sentence = (
    <div className={styles.item} style={{ color: "#ffffff" }}>
      <Megaphone className={styles.icon} size={18} />
      <span>
        <strong>Important Notice:</strong> Online Registration for Student Laptop Scheme 2026 is open from <strong>01st September 2026</strong>. Last date to apply is <strong>15th September 2026</strong>. Apply as soon as possible!
      </span>
    </div>
  );

  return (
    <aside
      className={styles.bannerContainer}
      role="region"
      aria-label="Announcement Banner"
      style={{
        backgroundColor: "#dc2626",
        color: "#ffffff",
        width: "100%",
        overflow: "hidden"
      }}
    >
      <div className={styles.bannerWrapper}>
        <div className={styles.marqueeTrack}>
          {sentence}
          {sentence}
        </div>
        <div className={styles.marqueeTrack} aria-hidden="true">
          {sentence}
          {sentence}
        </div>
      </div>
    </aside>
  );
}