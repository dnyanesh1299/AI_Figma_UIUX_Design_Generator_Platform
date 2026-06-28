import { useState } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    icon: "fa-database",
    content: "We collect information you provide directly to us when you create an account, generate design schemas, or communicate with support. This includes personal identifiers (name, email address), credentials, text prompts, Figma API integration tokens, and billing information (if on a paid tier). We also automatically collect telemetry data, such as IP addresses, browser types, page engagement, and generation success rates."
  },
  {
    title: "2. How We Use Information",
    icon: "fa-circle-check",
    content: "We use the collected information to power, customize, and analyze our AI design generation systems. This includes training and refining classification modules (excluding private prompt datasets under enterprise restrictions), validating Figma API requests, processing transaction details, and sending security notifications or product updates. Your Figma API tokens are encrypted at rest and are used solely to push nodes to your designated Figma files."
  },
  {
    title: "3. Sharing and Disclosures",
    icon: "fa-share-nodes",
    content: "We do not sell, rent, or trade your personal information or design prompts to third parties. We share information with trusted third-party subprocessors for database hosting, payment processing (e.g., Stripe), and platform analytics. We may disclose information if required by legal processes, law enforcement, or to protect the safety and rights of our users."
  },
  {
    title: "4. Data Security and Retention",
    icon: "fa-shield-halved",
    content: "We implement industry-standard administrative and technical safeguards to secure your account credentials, generated layout schemas, and third-party API configurations. Your Figma tokens are stored using AES-256 encryption. We retain data as long as your account is active or as necessary to comply with legal compliance audits. You may request deletion of your account and related records at any time."
  },
  {
    title: "5. Your Rights and Preferences (GDPR / CCPA)",
    icon: "fa-user-gear",
    content: "Under various regulations like GDPR and CCPA, you have the right to access, rectify, or erase the personal records we maintain. You may also object to processing, request data portability, or opt-out of commercial marketing emails. To exercise these rights, please edit your details in your Profile settings page or email our data protection officer at compliance@aifigmadesign.com."
  }
];

export default function PrivacyPage() {
  const [openSection, setOpenSection] = useState(0);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Hero */}
      <section style={{
        padding: "72px 40px 56px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(6,182,212,0.12) 0%, transparent 70%)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--accent)", background: "var(--accent-muted)", border: "1px solid rgba(6,182,212,0.3)",
            padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "16px"
          }}>
            Legal Center
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "950", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "12px" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "480px", margin: "0 auto" }}>
            Last updated: June 18, 2026. Please read this policy to understand how we protect your personal and design data.
          </p>
        </div>
      </section>

      {/* Accordion List */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 40px 80px" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
          {SECTIONS.map((sec, index) => {
            const isOpen = openSection === index;
            return (
              <div
                key={index}
                style={{
                  background: "rgba(30,41,59,0.55)",
                  border: isOpen ? "1px solid var(--border-glow)" : "1px solid var(--border-light)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all 0.25s"
                }}
              >
                <button
                  onClick={() => setOpenSection(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    background: isOpen ? "rgba(124,58,237,0.06)" : "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={e => { if(!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseOut={e => { if(!isOpen) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <i className={`fa-solid ${sec.icon}`} style={{ color: isOpen ? "var(--secondary)" : "var(--text-muted)", fontSize: "15px" }} />
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>{sec.title}</span>
                  </div>
                  <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"}`} style={{ fontSize: "12px", color: "var(--text-muted)" }} />
                </button>

                {isOpen && (
                  <div style={{
                    padding: "20px 24px 24px",
                    borderTop: "1px solid var(--border-light)",
                    fontSize: "14px",
                    lineHeight: "1.65",
                    color: "var(--text-secondary)",
                    animation: "fadeIn 0.25s ease"
                  }}>
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Contact */}
        <div style={{
          background: "rgba(30,41,59,0.3)",
          border: "1px solid var(--border-light)",
          borderRadius: "20px",
          padding: "24px",
          textAlign: "center"
        }}>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px" }}>Questions about our data privacy policies?</h4>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
            Our compliance officers are happy to assist with any questions regarding data usage or audits.
          </p>
          <a href="mailto:privacy@aifigmadesign.com" style={{ fontSize: "13px", color: "var(--secondary)", fontWeight: "600" }}>
            <i className="fa-regular fa-envelope" style={{ marginRight: "6px" }} /> privacy@aifigmadesign.com
          </a>
        </div>

      </section>
    </div>
  );
}
