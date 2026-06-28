import { useState } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  {
    id: "acceptance",
    num: "1",
    title: "Acceptance of Terms",
    content: "By creating an account, accessing, or using the AI Figma UI/UX Design Generator Platform (referred to as the 'Service'), you agree to be bound by these Terms of Service. If you do not agree to all terms outlined here, you are prohibited from using the platform. These terms constitute a legally binding agreement between you and the platform operators."
  },
  {
    id: "account",
    num: "2",
    title: "Account Registration and Security",
    content: "To generate and export designs, you must create a registered account. You agree to provide accurate, current, and complete registration info and keep it updated. You are solely responsible for securing your password, API keys, and Figma Access Tokens. Any unauthorized use of your account must be reported immediately. We are not liable for losses caused by unauthorized account access."
  },
  {
    id: "usage",
    num: "3",
    title: "Permitted Use and API Limits",
    content: "Your license to use the Service is subject to rate-limiting and pricing tier rules. You may not use automated scripts to scrap the editor canvas, bypass token checks, or scrape models. Pro and Enterprise API keys are intended for standard software design workflows; resell of generated raw JSON sheets as stand-alone templates is prohibited without written authorization."
  },
  {
    id: "intellectual",
    num: "4",
    title: "Intellectual Property Rights",
    content: "The layout rendering engine, classification models, codebases, and marketing branding are the exclusive property of the platform. The UI layouts and Figma vector schemas generated from your specific prompts are owned by you. We do not claim ownership of user-generated prompts or output designs, and you are free to deploy them in commercial software or websites."
  },
  {
    id: "termination",
    num: "5",
    title: "Termination of Service",
    content: "We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that violates these Terms of Service, including non-payment of subscriptions, abuse of system servers, or fraudulent behavior. Upon termination, your right to use the platform ends immediately, and stored schemas may be deleted."
  },
  {
    id: "liability",
    num: "6",
    title: "Limitation of Liability",
    content: "The Service is provided 'as is' and 'as available' without warranties of any kind. We do not guarantee that the AI-generated designs will be error-free, compatible with all third-party systems, or fit for specific purposes. In no event shall we be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform."
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Hero */}
      <section style={{
        padding: "72px 40px 56px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(168,85,247,0.12) 0%, transparent 70%)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
            padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "16px"
          }}>
            Legal Center
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "950", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "12px" }}>
            Terms of Service
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "480px", margin: "0 auto" }}>
            Effective date: June 18, 2026. Review these terms carefully to understand your rights and obligations when using our platform.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "48px", alignItems: "start" }}>
          
          {/* Sticky Sidebar Navigation */}
          <aside style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "12px", paddingLeft: "12px" }}>
              Sections
            </h4>
            {SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: activeSection === sec.id ? "700" : "500",
                  color: activeSection === sec.id ? "var(--secondary)" : "var(--text-secondary)",
                  background: activeSection === sec.id ? "var(--primary-muted)" : "transparent",
                  border: activeSection === sec.id ? "1px solid var(--border-glow)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {sec.num}. {sec.title}
              </button>
            ))}
          </aside>

          {/* Core Terms Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {SECTIONS.map(sec => (
              <div
                key={sec.id}
                id={sec.id}
                style={{
                  background: "rgba(30,41,59,0.4)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "16px",
                  padding: "28px",
                  scrollMarginTop: "120px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{
                    width: "24px", height: "24px", borderRadius: "6px",
                    background: "var(--gradient-btn)", color: "white",
                    display: "grid", placeItems: "center", fontSize: "11px", fontWeight: "700"
                  }}>
                    {sec.num}
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
                    {sec.title}
                  </h3>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
                  {sec.content}
                </p>
              </div>
            ))}

            {/* General Agreement Disclaimer */}
            <div style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
              border: "1px solid var(--border-glow)",
              borderRadius: "20px",
              padding: "28px",
              textAlign: "center"
            }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>Need a customized SLA / Enterprise agreement?</h4>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.5" }}>
                We offer custom support, uptime SLAs, and IP indemnification clauses for teams with over 50 seats.
              </p>
              <Link to="/pricing"><button className="btn-primary">Contact Sales Team</button></Link>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="gridTemplateColumns: 240px 1fr"] { grid-template-columns: 1fr !important; }
          aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}
