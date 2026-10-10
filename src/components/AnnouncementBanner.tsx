"use client";

import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import styles from "./AnnouncementBanner.module.css";

export default function AnnouncementBanner() {
  const [bannerText, setBannerText] = useState(
    "Application is Open! Last Date to Apply: 25 October 2026. Apply now for Student Laptop Online."
  );

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcement_banner) {
          setBannerText(data.announcement_banner);
        }
      })
      .catch(() => {});
  }, []);

  const sentence = (
    <div
      className={styles.item}
      style={{ color: "#ffffff", fontWeight: 700 }}
    >
      <Megaphone className={styles.icon} size={18} strokeWidth={2.5} />
      <span style={{ color: "#ffffff", fontWeight: 700 }}>
        {bannerText}
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
        overflow: "hidden",
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