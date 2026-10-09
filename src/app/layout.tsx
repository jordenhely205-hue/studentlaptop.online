import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STUDENT LAPTOP ONLINE",
  description: "Official Online Application Portal for Student Laptop Online. Honahar Students Laptop Scheme based on Merit & Online Test.",
  metadataBase: new URL("https://www.studentlaptop.online"),
  alternates: {
    canonical: "https://www.studentlaptop.online",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "STUDENT LAPTOP ONLINE",
    description: "Official Online Application Portal for Student Laptop Online. Honahar Students Laptop Scheme based on Merit & Online Test.",
    url: "https://www.studentlaptop.online",
    siteName: "STUDENT LAPTOP ONLINE",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "STUDENT LAPTOP ONLINE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STUDENT LAPTOP ONLINE",
    description: "Official Online Application Portal for Student Laptop Online. Honahar Students Laptop Scheme based on Merit & Online Test.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AnnouncementBanner />
        {children}
      </body>
    </html>
  );
}

