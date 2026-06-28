import { useState } from "react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    badge: null,
    desc: "Perfect for exploring AI-driven design generation.",
    color: "#64748b",
    gradient: "linear-gradient(135deg, rgba(100,116,139,0.15), rgba(100,116,139,0.05))",
    border: "rgba(100,116,139,0.3)",
    cta: "Get Started Free",
    ctaLink: "/signup",
    ctaStyle: "secondary",
    features: [
      { label: "200 AI designs / month", included: true },
      { label: "3 active projects", included: true },
      { label: "JSON schema export", included: true },
      { label: "Desktop preview only", included: true },
      { label: "Community templates", included: true },
      { label: "Figma API export", included: false },
      { label: "Tablet & mobile preview", included: false },
      { label: "Prompt history (8 entries)", included: true },
      { label: "Custom design tokens", included: false },
      { label: "Priority generation", included: false },
      { label: "API access", included: false },
      { label: "Team collaboration", included: false },
    ]
  },
  {
    name: "Pro",
    price: { monthly: 29, annual: 19 },
    badge: "Most Popular",
    desc: "For serious designers and solo founders who ship fast.",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))",
    border: "rgba(124,58,237,0.5)",
    cta: "Start Pro Trial",
    ctaLink: "/signup",
    ctaStyle: "primary",
    features: [
      { label: "Unlimited AI designs", included: true },
      { label: "Unlimited projects", included: true },
      { label: "JSON schema export", included: true },
      { label: "Desktop, tablet & mobile preview", included: true },
      { label: "All community templates", included: true },
      { label: "Figma API export", included: true },
      { label: "Responsive preview all devices", included: true },
      { label: "Unlimited prompt history", included: true },
      { label: "Custom design tokens", included: true },
      { label: "Priority generation (2× faster)", included: true },
      { label: "API access (1K calls/month)", included: true },
      { label: "Team collaboration", included: false },
    ]
  },
  {
    name: "Enterprise",
    price: { monthly: 99, annual: 79 },
    badge: "For Teams",
    desc: "For agencies and product teams building at scale.",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.08))",
    border: "rgba(6,182,212,0.4)",
    cta: "Contact Sales",
    ctaLink: "/about",
    ctaStyle: "secondary",
    features: [
      { label: "Unlimited AI designs", included: true },
      { label: "Unlimited projects", included: true },
      { label: "JSON schema export", included: true },
      { label: "All device previews", included: true },
      { label: "All community templates", included: true },
      { label: "Figma API export (unlimited)", included: true },
      { label: "Responsive preview all devices", included: true },
      { label: "Unlimited prompt history", included: true },
      { label: "Custom design tokens", included: true },
      { label: "Priority generation (5× faster)", included: true },
      { label: "Unlimited API access", included: true },
      { label: "Team collaboration (up to 20)", included: true },
    ]
  }
];

const FAQS = [
  { q: "Can I cancel at any time?", a: "Yes. You can cancel your subscription from your account settings at any time. You'll continue to have access until the end of your billing period, then your account automatically downgrades to Free." },
  { q: "What happens to my projects if I downgrade?", a: "All your generated designs and project data are retained. You'll just lose access to Pro-only features like Figma export and multi-device preview. Projects above the Free tier limit (3) will be archived but not deleted." },
  { q: "Is there a free trial for Pro?", a: "Yes! Pro comes with a 14-day free trial — no credit card required. You get full access to all Pro features during the trial period." },
  { q: "Do you offer student or non-profit discounts?", a: "Absolutely. Verified students get 60% off Pro, and registered non-profits get Pro at no cost. Email us with verification documents to apply." },
  { q: "How does the annual plan work?", a: "Annual billing gives you 2 months free (33% off). You're charged once per year. You can switch between monthly and annual at any time from your settings." },
  { q: "What payment methods are accepted?", a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise plans. All payments are processed securely via Stripe." }
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ color: "var(--text-primary)" }}>

      {/* Hero */}
      <section style={{
        padding: "80px 40px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.15) 0%, transparent 70%)"
      }}>
        <div style={{
          position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: "10%", right: "8%", width: "250px", height: "250px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none"
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
            padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "20px"
          }}>
            Simple Pricing
          </span>
          <h1 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: "900", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "16px" }}>
            Plans that grow <span style={{ background: "var(--gradient-btn)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with you</span>
          </h1>
          <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "32px" }}>
            Start free, scale when you're ready. No hidden fees, no lock-in.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            background: "rgba(30,41,59,0.7)", border: "1px solid var(--border)",
            borderRadius: "999px", padding: "6px 8px", backdropFilter: "blur(12px)"
          }}>
            {["monthly", "annual"].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: "7px 20px", borderRadius: "999px", border: "none",
                  cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit",
                  transition: "all 0.2s",
                  background: billing === b ? "var(--primary)" : "transparent",
                  color: billing === b ? "white" : "var(--text-muted)"
                }}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === "annual" && (
                  <span style={{ marginLeft: "6px", fontSize: "10px", background: "#22c55e", color: "white", padding: "1px 6px", borderRadius: "999px" }}>
                    -33%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section style={{ padding: "0 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", alignItems: "stretch" }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.gradient,
                border: `1px solid ${plan.border}`,
                borderRadius: "24px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                position: "relative",
                transition: "transform 0.25s, box-shadow 0.25s",
                boxShadow: plan.badge === "Most Popular" ? `0 0 40px ${plan.color}20` : "none"
              }}
            >
              {plan.badge && (
                <div style={{
                  position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                  background: plan.name === "Pro" ? "var(--gradient-btn)" : `linear-gradient(135deg, ${plan.color}, ${plan.color}aa)`,
                  color: "white", fontSize: "11px", fontWeight: "700", letterSpacing: "0.05em",
                  padding: "4px 16px", borderRadius: "999px", whiteSpace: "nowrap"
                }}>
                  {plan.badge}
                </div>
              )}

              <div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "6px", color: plan.color }}>{plan.name}</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>{plan.desc}</p>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
                <span style={{ fontSize: "48px", fontWeight: "900", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  ${plan.price[billing]}
                </span>
                {plan.price[billing] > 0 && (
                  <span style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>/mo</span>
                )}
                {plan.price[billing] === 0 && (
                  <span style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "8px" }}>forever</span>
                )}
              </div>

              <Link to={plan.ctaLink} style={{ textDecoration: "none" }}>
                <button
                  className={plan.ctaStyle === "primary" ? "btn-primary" : "btn-secondary"}
                  style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "14px" }}
                >
                  {plan.cta}
                </button>
              </Link>

              <div style={{ borderTop: `1px solid ${plan.border}`, paddingTop: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "14px" }}>
                  What's included
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px",
                        background: f.included ? `${plan.color}25` : "rgba(100,116,139,0.1)",
                        color: f.included ? plan.color : "var(--text-muted)"
                      }}>
                        <i className={`fa-solid ${f.included ? "fa-check" : "fa-xmark"}`} />
                      </div>
                      <span style={{
                        fontSize: "13px",
                        color: f.included ? "var(--text-primary)" : "var(--text-muted)",
                        textDecoration: f.included ? "none" : "line-through",
                        opacity: f.included ? 1 : 0.5
                      }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise banner */}
        <div style={{
          marginTop: "32px",
          background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
          backdropFilter: "blur(12px)"
        }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>
              <i className="fa-solid fa-building" style={{ color: "var(--secondary)", marginRight: "10px" }} />
              Need a custom plan for a large organization?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
              Custom seats, SSO, SLA guarantees, dedicated infrastructure, and on-prem deployment available.
            </p>
          </div>
          <Link to="/about">
            <button className="btn-primary" style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
              <i className="fa-solid fa-handshake" /> Talk to Sales
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={{ padding: "60px 40px", background: "rgba(30,41,59,0.2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "40px" }}>
            Compare All Features
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: "600", borderBottom: "1px solid var(--border)", width: "40%" }}>Feature</th>
                  {PLANS.map(p => (
                    <th key={p.name} style={{ padding: "12px 16px", textAlign: "center", color: p.color, fontWeight: "700", borderBottom: "1px solid var(--border)" }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["AI Generations", "200/month", "Unlimited", "Unlimited"],
                  ["Active Projects", "3", "Unlimited", "Unlimited"],
                  ["Export Formats", "JSON", "JSON + Figma", "JSON + Figma"],
                  ["Device Previews", "Desktop only", "All devices", "All devices"],
                  ["Generation Speed", "Standard", "2× Priority", "5× Priority"],
                  ["Prompt History", "8 entries", "Unlimited", "Unlimited"],
                  ["API Access", "None", "1K calls/mo", "Unlimited"],
                  ["Team Members", "1", "1", "Up to 20"],
                  ["Custom Branding", "—", "—", "✓"],
                  ["SLA Guarantee", "—", "—", "99.9% uptime"],
                  ["Support", "Community", "Email", "Dedicated CSM"],
                ].map(([feature, ...vals], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(30,41,59,0.3)" : "transparent" }}>
                    <td style={{ padding: "12px 16px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-light)" }}>
                      {feature}
                    </td>
                    {vals.map((v, j) => (
                      <td key={j} style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid var(--border-light)", color: v === "—" ? "var(--text-muted)" : "var(--text-primary)", fontWeight: v !== "—" ? "600" : "400" }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section style={{ padding: "60px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {[
            { value: "12,000+", label: "Active Designers" },
            { value: "98%", label: "Satisfied Customers" },
            { value: "$0", label: "Hidden Fees" },
            { value: "14-day", label: "Free Pro Trial" }
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(30,41,59,0.5)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "24px", backdropFilter: "blur(8px)"
            }}>
              <div style={{ fontSize: "32px", fontWeight: "900", background: "var(--gradient-btn)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "6px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "60px 40px 80px", background: "rgba(30,41,59,0.2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "40px" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="help-accordion">
                <button
                  className="help-accordion-header"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <i className={`fa-solid ${openFaq === i ? "fa-chevron-up" : "fa-chevron-down"}`}
                    style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div className="help-accordion-body animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "16px" }}>
            Ready to start designing?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
            Join 12,000+ designers using AI to build faster. No credit card required.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup">
              <button className="btn-primary" style={{ padding: "14px 32px", fontSize: "15px", borderRadius: "14px" }}>
                <i className="fa-solid fa-rocket" /> Start Free Today
              </button>
            </Link>
            <Link to="/explore">
              <button className="btn-secondary" style={{ padding: "14px 28px", fontSize: "15px", borderRadius: "14px" }}>
                <i className="fa-solid fa-compass" /> Browse Templates
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          section > div[style*="gridTemplateColumns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          section > div[style*="gridTemplateColumns: repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
