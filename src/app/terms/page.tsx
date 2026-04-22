// src/app/terms/page.tsx

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 48 }}>
          Last updated: January 2026
        </p>

        {[
          {
            title: "Acceptance of Terms",
            body: "By creating an account or using MakeMyFacelessVideo.com, you agree to these Terms & Conditions. If you do not agree, do not use the service.",
          },
          {
            title: "Use of Service",
            body: "You may use MMFV to generate faceless videos for personal or commercial purposes, subject to your plan's credit limits. You are responsible for the topics and content you submit. You must not use the service to generate content that is illegal, harmful, or violates the rights of others.",
          },
          {
            title: "Intellectual Property",
            body: "You own the output videos generated from your inputs. By submitting a topic, you grant us a limited licence to process your input through our AI pipeline. We do not claim ownership over your generated content.",
          },
          {
            title: "Credits and Payments",
            body: "Credits are non-refundable once consumed. Subscription fees are billed in advance. Cancellation takes effect at the end of the current billing period. We reserve the right to change pricing with 30 days notice.",
          },
          {
            title: "Account Termination",
            body: "We may suspend or terminate your account if you violate these terms, abuse the platform, or engage in fraudulent activity. You may delete your account at any time from the dashboard.",
          },
          {
            title: "Limitation of Liability",
            body: "MMFV is provided 'as is'. We are not liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid in the last 3 months.",
          },
          {
            title: "Changes to Terms",
            body: "We may update these terms from time to time. Continued use after changes constitutes acceptance. Material changes will be notified via email.",
          },
          {
            title: "Contact",
            body: "For questions about these terms, email hello@makemyfacelessvideo.com.",
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
