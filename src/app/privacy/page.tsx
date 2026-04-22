// src/app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            background: "var(--ig)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
          }}
        >
          Legal
        </p>
        <h1 style={{ marginBottom: 8, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: -1.5 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 48 }}>
          Last updated: January 2026
        </p>

        {[
          {
            title: "Information We Collect",
            body: "We collect your email address when you sign up or sign in. If you use Google OAuth, we receive your name and email from Google. We also collect usage data such as videos generated, topics entered, and platform activity to improve our service.",
          },
          {
            title: "How We Use Your Information",
            body: "Your email is used to send OTP verification codes and transactional notifications (account alerts, subscription updates). We never sell your data. Usage data is used only to improve the product and monitor platform health.",
          },
          {
            title: "Data Storage",
            body: "User data is stored in Supabase (PostgreSQL) with row-level security enabled on every table. Generated videos are stored in Cloudflare R2 with signed URLs — they are never publicly accessible without a time-limited link.",
          },
          {
            title: "Cookies",
            body: "We use a single httpOnly cookie (mmfv_token) to maintain your authenticated session. This cookie is not accessible via JavaScript and expires after 7 days. We do not use tracking cookies or third-party advertising cookies.",
          },
          {
            title: "Payments",
            body: "Payments are processed by Razorpay. We never store your card details. All payment data is handled by Razorpay's PCI-compliant infrastructure.",
          },
          {
            title: "Data Retention",
            body: "You can delete your account at any time. Upon deletion, your personal data and generated videos are removed within 30 days. Anonymised aggregate usage data may be retained for analytics.",
          },
          {
            title: "Contact",
            body: "For privacy questions or data deletion requests, email us at hello@makemyfacelessvideo.com.",
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h3 style={{ marginBottom: 10, fontSize: 18 }}>{section.title}</h3>
            <p style={{ lineHeight: 1.7, color: "var(--text-secondary)" }}>{section.body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
