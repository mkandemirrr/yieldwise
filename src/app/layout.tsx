import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YieldWise AI — AI-Powered Financial Assistant",
  description: "Your intelligent financial assistant. AI portfolio analysis, dividend tracking, stock screening, and market signals — all powered by artificial intelligence.",
  keywords: ["AI financial assistant", "portfolio analysis", "dividend tracker", "stock screener", "AI investing", "market signals", "yield analysis"],
  openGraph: {
    title: "YieldWise AI — AI-Powered Financial Assistant",
    description: "Your intelligent financial assistant. AI portfolio analysis, dividend tracking, stock screening, and market signals.",
    url: "https://yieldwise.ai",
    siteName: "YieldWise AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YieldWise AI — AI-Powered Financial Assistant",
    description: "Your intelligent financial assistant. AI portfolio analysis, dividend tracking, and market signals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0e17" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PRWRZ2HBJM"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PRWRZ2HBJM');
        `}} />
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof Paddle !== 'undefined') {
            Paddle.Initialize({ token: 'live_3cc6f5f672faaa7d53220bad010' });
          }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
