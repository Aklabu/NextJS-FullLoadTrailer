import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FullLoadTrailer — Freight Marketplace",
  description:
    "The freight community that keeps deals on-platform — from bulletin board to booked load.",
};

// Root layout is the HTML shell only.
// Navbar/Footer live in (marketing)/layout.tsx so auth pages get a bare chrome.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
