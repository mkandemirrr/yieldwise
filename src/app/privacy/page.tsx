import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — YieldWise AI",
  description: "YieldWise AI privacy policy. Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 40, fontSize: 14 }}>Last updated: April 20, 2026</p>

      {[
        { title: "1. Information We Collect", content: "We collect information you provide directly, including your name, email address, and portfolio data you choose to enter. We also collect usage data such as pages visited and features used." },
        { title: "2. How We Use Your Information", content: "We use your data to provide AI-powered financial analysis, personalized investment insights, and to improve our services. We never sell your personal data to third parties." },
        { title: "3. Data Storage & Security", content: "Your data is stored securely using Supabase with enterprise-grade encryption. We use industry-standard security measures including HTTPS, encrypted databases, and secure authentication." },
        { title: "4. Financial Data", content: "YieldWise AI does not have access to your brokerage accounts. All portfolio data is manually entered by you. We use read-only financial market data APIs for stock prices and analysis." },
        { title: "5. AI Analysis", content: "Your portfolio data may be processed by AI models (Anthropic Claude) to generate analysis and recommendations. This data is not stored by the AI provider and is used solely for generating your requested analysis." },
        { title: "6. Cookies", content: "We use essential cookies for authentication and session management. We do not use third-party tracking cookies." },
        { title: "7. Your Rights", content: "You may request access to, correction, or deletion of your personal data at any time by contacting us at privacy@yieldwise.ai." },
        { title: "8. Disclaimer", content: "YieldWise AI provides informational content only. Nothing on this platform constitutes financial, investment, tax, or legal advice. Always consult a qualified financial advisor before making investment decisions." },
        { title: "9. Contact", content: "For privacy-related inquiries, contact us at privacy@yieldwise.ai." },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>{s.content}</p>
        </div>
      ))}
    </div>
  );
}
