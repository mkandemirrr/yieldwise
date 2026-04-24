import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — YieldWise AI",
  description: "YieldWise AI refund and cancellation policy for subscription plans.",
};

export default function RefundPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "80px 20px", maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>Refund Policy</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 14 }}>Last updated: April 24, 2026</p>

      <div style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 15 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32, marginBottom: 12, color: "var(--text-primary)" }}>1. Subscription Cancellation</h2>
        <p>You may cancel your YieldWise AI subscription at any time. Upon cancellation, you will continue to have access to your paid features until the end of your current billing period. No further charges will be made after cancellation.</p>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32, marginBottom: 12, color: "var(--text-primary)" }}>2. Refund Eligibility</h2>
        <p>We offer a <strong style={{ color: "var(--text-primary)" }}>14-day money-back guarantee</strong> for all new subscriptions. If you are not satisfied with YieldWise AI within the first 14 days of your initial purchase, you may request a full refund.</p>
        <p style={{ marginTop: 12 }}>To be eligible for a refund:</p>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li style={{ marginBottom: 8 }}>The request must be made within 14 days of your first payment</li>
          <li style={{ marginBottom: 8 }}>The request must be your first refund request for YieldWise AI</li>
          <li style={{ marginBottom: 8 }}>You must provide your account email and reason for the refund</li>
        </ul>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32, marginBottom: 12, color: "var(--text-primary)" }}>3. Non-Refundable Situations</h2>
        <p>Refunds will not be issued in the following cases:</p>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li style={{ marginBottom: 8 }}>Requests made after the 14-day guarantee period</li>
          <li style={{ marginBottom: 8 }}>Renewal charges (you must cancel before the renewal date)</li>
          <li style={{ marginBottom: 8 }}>Partial month or unused subscription time after the 14-day period</li>
          <li style={{ marginBottom: 8 }}>Violations of our Terms of Service</li>
        </ul>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32, marginBottom: 12, color: "var(--text-primary)" }}>4. How to Request a Refund</h2>
        <p>To request a refund, please contact us at <a href="mailto:support@yieldwise.ai" style={{ color: "var(--accent)" }}>support@yieldwise.ai</a> with the following information:</p>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li style={{ marginBottom: 8 }}>Your account email address</li>
          <li style={{ marginBottom: 8 }}>Date of purchase</li>
          <li style={{ marginBottom: 8 }}>Reason for the refund request</li>
        </ul>
        <p style={{ marginTop: 12 }}>Refunds are typically processed within 5-10 business days and will be returned to the original payment method.</p>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32, marginBottom: 12, color: "var(--text-primary)" }}>5. Plan Changes</h2>
        <p>If you downgrade from Premium to Pro, or from a paid plan to Free, the change will take effect at the end of your current billing cycle. No partial refunds are issued for downgrades.</p>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32, marginBottom: 12, color: "var(--text-primary)" }}>6. Contact Us</h2>
        <p>If you have any questions about our refund policy, please contact us at <a href="mailto:support@yieldwise.ai" style={{ color: "var(--accent)" }}>support@yieldwise.ai</a>.</p>
      </div>
    </div>
  );
}
