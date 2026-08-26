import React from "react";
import { Megaphone } from "lucide-react";
import styles from "./AnnouncementBanner.module.css";

export default function AnnouncementBanner() {
  const sentence = (
    <div
      className={styles.item}
      style={{ color: "#ffffff", fontWeight: 700 }}
    >
      <Megaphone className={styles.icon} size={18} strokeWidth={2.5} />
      <span style={{ color: "#ffffff", fontWeight: 700 }}>
        <strong style={{ fontWeight: 700 }}>Important Notice:</strong> Online Registration for Student Laptop Scheme 2026 is open from <strong style={{ fontWeight: 700 }}>01st September 2026</strong>. Last date to apply is <strong style={{ fontWeight: 700 }}>15th September 2026</strong>. Apply as soon as possible!
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
        fontWeight: 700,
        width: "100%",
        overflow: "hidden"
      }}
    >
      <div className={styles.bannerWrapper} style={{ fontWeight: 700 }}>
        <div className={styles.marqueeTrack} style={{ fontWeight: 700 }}>
          {sentence}
          {sentence}
        </div>
        <div className={styles.marqueeTrack} style={{ fontWeight: 700 }} aria-hidden="true">
          {sentence}
          {sentence}
        </div>
      </div>
    </aside>
  );
}