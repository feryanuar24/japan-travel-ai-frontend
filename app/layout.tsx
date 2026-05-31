import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Japan Travel AI | Smart Trip Planning",
  description:
    "Plan Japan trips with AI itinerary generation, budget estimates, smart place recommendations, transport planning, and an AI chat assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top_left,rgba(241,208,155,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(130,163,255,0.18),transparent_30%),linear-gradient(180deg,#fffaf3_0%,#f8f4ee_38%,#f3efe9_100%)] text-slate-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
