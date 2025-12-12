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

// Local fonts are loaded via @font-face in globals.css
// Usage: className="font-mooner" or style={{ fontFamily: "Mooner" }}

export const metadata: Metadata = {
  title: "Matthew - AI-Powered Tax Calculator for Nigeria | SmartTax NG",
  description:
    "Calculate your corporate income tax, VAT, and capital gains instantly with Matthew AI. File taxes confidently with blockchain-verified reports and expert guidance for SMEs, corporates, and crypto investors in Nigeria.",
  keywords: [
    "Nigeria tax calculator",
    "CIT calculator",
    "VAT calculator",
    "Capital gains tax",
    "Crypto tax Nigeria",
    "FIRS filing",
    "Tax compliance",
    "SME taxes",
    "Enterprise tax planning",
    "AI tax assistant",
  ],
  authors: [{ name: "Matthew - SmartTax NG" }],
  openGraph: {
    title: "Matthew - AI Tax Calculator for Nigeria",
    description:
      "Instant tax calculations, blockchain-verified reports, and compliance guidance for Nigerian businesses and investors.",
    url: "https://matthew-tax.ng",
    siteName: "Matthew",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew - AI Tax Assistant Nigeria",
    description:
      "Calculate taxes instantly with AI-powered insights for Nigerian businesses",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://matthew-tax.ng",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
