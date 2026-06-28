import { Link } from "react-router-dom";

const STATS = [
  { value: "5.2M+", label: "Designs Generated", icon: "fa-wand-magic-sparkles" },
  { value: "48,000+", label: "Active Designers", icon: "fa-users" },
  { value: "120+", label: "Countries Served", icon: "fa-globe" },
  { value: "85%", label: "Time Saved", icon: "fa-hourglass-half" }
];

const TEAM = [
  {
    name: "Marcus Webb",
    role: "Co-Founder & CTO",
    bio: "Ex-Figma, building compilation pipelines and layout translation engines for the next generation of designers.",
    initials: "MW",
    social: { twitter: "#", linkedin: "#" }
  },
  {
    name: "Priya Nair",
    role: "Co-Founder & Head of Design",
    bio: "Passionate about bridging engineering and aesthetics. Creates standard tokens and layout paradigms for the core generator.",
    initials: "PN",
    social: { twitter: "#", linkedin: "#" }
  },
  {
    name: "Aria Chen",
    role: "Lead ML Engineer",
    bio: "Specializes in multi-modal LLMs and structured JSON generation pipelines. Keeps design schemas fast and accurate.",
    initials: "AC",
    social: { twitter: "#", github: "#" }
  },
  {
    name: "Devon Reed",
    role: "Principal Frontend Engineer",
    bio: "Maintains code translation and sandbox rendering environments. Enjoys glassmorphism, responsive designs, and custom shaders.",
    initials: "DR",
    social: { github: "#", linkedin: "#" }
  },
  {
    name: "Sarah Jenkins",
    role: "VP of Product",
    bio: "Focuses on builder feedback and community integrations. Ensures exports maps seamlessly to real development assets.",
    initials: "SJ",
    social: { twitter: "#", linkedin: "#" }
  },
  {
    name: "Lucas Vance",
    role: "Developer Relations",
    bio: "Runs tutorials, docs, and plugin APIs. Passionate about showing startups how to build wireframes in minutes.",
    initials: "LV",
    social: { twitter: "#", github: "#" }
  }
];

export default function AboutPage() {
  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Hero */}
      <section style={{
        padding: "80px 40px 64px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(124,58,237,0.12) 0%, transparent 70%)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
            padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "16px"
          }}>
            Our Mission
          </span>
          <h1 style={{ fontSize: "clamp(30px,5vw,56px)", fontWeight: "950", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "16px" }}>
            Bridging the Gap Between <br />
            <span style={{ background: "var(--gradient-btn)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Idea and Interface</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            We believe that designing digital experiences should be accessible, instantaneous, and collaborative. Our team builds AI-driven tooling that turns raw concepts into structured, design-system-coherent vector layouts in seconds.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="card"
              style={{
                textAlign: "center",
                background: "rgba(30,41,59,0.45)",
                border: "1px solid var(--border-light)",
                borderRadius: "20px",
                padding: "28px"
              }}
            >
              <i className={`fa-solid ${stat.icon}`} style={{ fontSize: "20px", color: "var(--secondary)", marginBottom: "12px", display: "block" }} />
              <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "4px", letterSpacing: "-0.02em" }}>{stat.value}</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section style={{ background: "var(--bg-deep)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "72px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "16px", letterSpacing: "-0.02em" }}>Why AI Figma Generator?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", lineHeight: "1.7", marginBottom: "16px" }}>
              Traditional wireframing is an iterative bottleneck. Product managers write descriptions, designers spends hours translating them into Figma frames, and engineers spend more hours converting frames back to layout code.
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", lineHeight: "1.7", margin: 0 }}>
              Our engine cuts this cycle. By translating prompts directly into structured JSON schemas (complying with standard UI system structures), we provide both a responsive interactive preview in the browser and clean export mechanisms directly into Figma components.
            </p>
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))",
            border: "1px solid var(--border-glow)",
            borderRadius: "24px",
            padding: "40px",
            position: "relative"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "12px" }}>Our Core Values</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "14px", listStyle: "none" }}>
              <li style={{ display: "flex", gap: "12px" }}>
                <i className="fa-solid fa-check" style={{ color: "var(--secondary)", marginTop: "3px" }} />
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Aesthetics First</h4>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>We aim to generate premium interfaces, not generic layouts.</p>
                </div>
              </li>
              <li style={{ display: "flex", gap: "12px" }}>
                <i className="fa-solid fa-check" style={{ color: "var(--secondary)", marginTop: "3px" }} />
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Developer Alignment</h4>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>Output schemas map to real web layout components.</p>
                </div>
              </li>
              <li style={{ display: "flex", gap: "12px" }}>
                <i className="fa-solid fa-check" style={{ color: "var(--secondary)", marginTop: "3px" }} />
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Integrative Flow</h4>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>We fit into existing Figma toolsets, never replacing them.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.02em" }}>Meet the Creators</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>A remote group of engineers, designers, and AI researchers.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {TEAM.map((member, i) => (
            <div
              key={i}
              className="card"
              style={{
                background: "rgba(30,41,59,0.5)",
                border: "1px solid var(--border-light)",
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              {/* Member avatar */}
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--gradient-btn)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "800",
                fontSize: "20px",
                marginBottom: "16px",
                border: "2px solid var(--border-glow)"
              }}>
                {member.initials}
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "2px" }}>{member.name}</h3>
              <span style={{ fontSize: "12px", color: "var(--secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
                {member.role}
              </span>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "16px", flex: 1 }}>
                {member.bio}
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px" }}>
                {member.social.twitter && (
                  <a href={member.social.twitter} style={{ color: "var(--text-muted)", fontSize: "14px" }} onMouseOver={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    <i className="fa-brands fa-twitter" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a href={member.social.linkedin} style={{ color: "var(--text-muted)", fontSize: "14px" }} onMouseOver={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    <i className="fa-brands fa-linkedin" />
                  </a>
                )}
                {member.social.github && (
                  <a href={member.social.github} style={{ color: "var(--text-muted)", fontSize: "14px" }} onMouseOver={e => e.currentTarget.style.color = "var(--text-primary)"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}>
                    <i className="fa-brands fa-github" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: "60px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
          border: "1px solid var(--border-glow)",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>Ready to join us or build your app?</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            Create your free account today and start designing. No credit card required.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/signup"><button className="btn-primary">Get Started Free</button></Link>
            <Link to="/pricing"><button className="btn-secondary">View Pricing</button></Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
