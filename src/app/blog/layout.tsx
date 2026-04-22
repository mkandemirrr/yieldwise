import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — YieldWise AI | Investing Insights & Market Analysis",
  description: "Expert investing insights, dividend strategies, portfolio tips, and AI-powered market analysis. Learn how to invest smarter with YieldWise AI.",
  openGraph: {
    title: "YieldWise AI Blog — Investing Insights",
    description: "Expert investing insights, dividend strategies, and AI-powered market analysis.",
    url: "https://yieldwise.ai/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
