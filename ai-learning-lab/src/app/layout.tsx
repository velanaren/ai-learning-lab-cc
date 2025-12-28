import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Learning Lab | Learn Technical Topics Daily",
  description: "A hyper-personal learning system that adapts to your goals, time, and pace. Build real skills through structured 10-30 minute daily sessions.",
  keywords: ["learning", "technical skills", "daily learning", "personalized education", "AI learning"],
  authors: [{ name: "AI Learning Lab" }],
  creator: "AI Learning Lab",
  openGraph: {
    title: "AI Learning Lab | Learn Technical Topics Daily",
    description: "10-30 minute sessions. Tailored to you. No fluff.",
    url: "https://ai-learning-lab.com",
    siteName: "AI Learning Lab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Learning Lab | Learn Technical Topics Daily",
    description: "10-30 minute sessions. Tailored to you. No fluff.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ viewTransitionName: "root" } as React.CSSProperties}>
      <body className={`${instrumentSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
