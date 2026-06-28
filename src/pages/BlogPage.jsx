import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Tutorials", "Design Tips", "AI & ML", "Product Updates", "Case Studies"];

export const POSTS = [
  {
    slug: "ai-prompt-mastery",
    category: "Tutorials",
    title: "AI Prompt Mastery: How to Write Design Prompts That Actually Work",
    excerpt: "Learn the exact prompt patterns our top users use to generate stunning multi-page dashboards, landing pages, and mobile apps in seconds.",
    author: "Priya Nair",
    authorRole: "Head of Design",
    authorInitials: "PN",
    date: "June 15, 2026",
    readTime: "8 min read",
    tags: ["prompts", "tutorials", "AI"],
    featured: true,
    accentColor: "#7c3aed"
  },
  {
    slug: "multi-page-generation",
    category: "Product Updates",
    title: "Introducing True Multi-Page Generation: Build Entire App Flows",
    excerpt: "Our latest update generates 5+ interconnected screens with working navigation and consistent design tokens across every page.",
    author: "Marcus Webb",
    authorRole: "CTO",
    authorInitials: "MW",
    date: "June 10, 2026",
    readTime: "5 min read",
    tags: ["product", "multi-page", "updates"],
    featured: false,
    accentColor: "#06b6d4"
  },
  {
    slug: "figma-export-workflow",
    category: "Tutorials",
    title: "From AI Prompt to Figma Component Library in 10 Minutes",
    excerpt: "A complete step-by-step walkthrough of using our Figma export to create a production-ready component library from an AI-generated schema.",
    author: "Aria Chen",
    authorRole: "Product Designer",
    authorInitials: "AC",
    date: "June 5, 2026",
    readTime: "10 min read",
    tags: ["figma", "export", "workflow"],
    featured: false,
    accentColor: "#ec4899"
  },
  {
    slug: "design-tokens-explained",
    category: "Design Tips",
    title: "Design Tokens Explained: Why They're the Secret to Consistent AI Design",
    excerpt: "Understanding how our AI generates color palettes, typography scales, and spacing systems — and how to override them for your brand.",
    author: "Priya Nair",
    authorRole: "Head of Design",
    authorInitials: "PN",
    date: "May 28, 2026",
    readTime: "6 min read",
    tags: ["tokens", "design-system", "colors"],
    featured: false,
    accentColor: "#f59e0b"
  },
  {
    slug: "fintech-dashboard-casestudy",
    category: "Case Studies",
    title: "How BuildFast Cut Wireframing Time by 85% with AI Design Generation",
    excerpt: "Marcus and his team at BuildFast used our platform to prototype 3 product ideas before their Series A. Here's exactly how they did it.",
    author: "Marcus Webb",
    authorRole: "CTO at BuildFast",
    authorInitials: "MW",
    date: "May 20, 2026",
    readTime: "12 min read",
    tags: ["case-study", "fintech", "startup"],
    featured: false,
    accentColor: "#10b981"
  },
  {
    slug: "llm-design-pipeline",
    category: "AI & ML",
    title: "Inside Our LLM Design Pipeline: How We Turn Text into UI Schemas",
    excerpt: "A deep dive into the two-stage classification and generation pipeline, prompt engineering tricks, and how we handle edge cases.",
    author: "Aria Chen",
    authorRole: "ML Engineer",
    authorInitials: "AC",
    date: "May 12, 2026",
    readTime: "15 min read",
    tags: ["AI", "LLM", "engineering"],
    featured: false,
    accentColor: "#8b5cf6"
  },
  {
    slug: "glassmorphism-with-ai",
    category: "Design Tips",
    title: "Generating Glassmorphism UIs with AI: Tips and Prompt Templates",
    excerpt: "Glassmorphism is beautiful but tricky to get right. Here are the exact prompts and tweaks to consistently produce stunning glass-effect UIs.",
    author: "Priya Nair",
    authorRole: "Head of Design",
    authorInitials: "PN",
    date: "May 5, 2026",
    readTime: "7 min read",
    tags: ["glassmorphism", "design", "tips"],
    featured: false,
    accentColor: "#06b6d4"
  },
  {
    slug: "responsive-design-breakpoints",
    category: "Tutorials",
    title: "Mastering Responsive Breakpoints in AI-Generated Designs",
    excerpt: "Our grid system uses 12-8-4 column breakpoints. Learn how to inspect, override, and optimize responsive layouts from the preview canvas.",
    author: "Marcus Webb",
    authorRole: "CTO",
    authorInitials: "MW",
    date: "April 28, 2026",
    readTime: "9 min read",
    tags: ["responsive", "grid", "mobile"],
    featured: false,
    accentColor: "#f43f5e"
  }
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const featured = POSTS.find(p => p.featured);
  const rest = POSTS.filter(p => !p.featured);

  const filtered = rest.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ color: "var(--text-primary)" }}>

      {/* Hero */}
      <section style={{
        padding: "72px 40px 56px",
        background: "radial-gradient(ellipse 80% 60% at 50% -5%, rgba(124,58,237,0.12) 0%, transparent 70%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--secondary)", background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
            padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "16px"
          }}>
            <i className="fa-solid fa-rss" style={{ marginRight: "6px" }} /> Blog
          </span>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: "900", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "10px" }}>
                Design, AI & <span style={{ background: "var(--gradient-btn)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Building Faster</span>
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "480px" }}>
                Tutorials, case studies, and insights from the team building the future of AI-powered UI design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px 80px" }}>

        {/* Featured post */}
        {featured && (
          <div
            onClick={() => navigate(`/blog/${featured.slug}`)}
            style={{
              background: `linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))`,
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "24px",
              padding: "36px",
              marginBottom: "40px",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "32px",
              alignItems: "center",
              transition: "transform 0.25s, box-shadow 0.25s",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(124,58,237,0.15)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <div style={{
              position: "absolute", top: "-30%", right: "15%", width: "300px", height: "300px",
              borderRadius: "50%", background: `radial-gradient(circle, ${featured.accentColor}25, transparent 70%)`,
              pointerEvents: "none"
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "#f59e0b", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                  padding: "3px 10px", borderRadius: "999px"
                }}>
                  <i className="fa-solid fa-fire" style={{ marginRight: "4px" }} /> Featured
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{featured.category}</span>
              </div>
              <h2 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: "800", lineHeight: "1.2", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px", maxWidth: "560px" }}>
                {featured.excerpt}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gradient-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" }}>
                    {featured.authorInitials}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{featured.author}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{featured.date}</p>
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: "4px" }} />{featured.readTime}
                </span>
              </div>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <button className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                <i className="fa-solid fa-arrow-right" /> Read Article
              </button>
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: "200px", maxWidth: "320px" }}>
            <i className="fa-solid fa-magnifying-glass search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          <div className="explore-filter-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Post grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-newspaper" /></div>
            <h4>No articles found</h4>
            <p>Try a different category or search term.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {filtered.map(post => (
              <article
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                style={{
                  background: "rgba(30,41,59,0.6)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                {/* Color accent bar */}
                <div style={{ height: "4px", background: `linear-gradient(90deg, ${post.accentColor}, ${post.accentColor}44)` }} />

                <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em",
                      color: post.accentColor, background: `${post.accentColor}15`,
                      border: `1px solid ${post.accentColor}30`, padding: "2px 8px", borderRadius: "999px"
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: "3px" }} />{post.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.35", letterSpacing: "-0.01em", margin: 0 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0, flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: "10px", padding: "2px 8px", borderRadius: "999px",
                        background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
                        color: "var(--secondary)"
                      }}>#{tag}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--gradient-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>
                        {post.authorInitials}
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: "600", margin: 0 }}>{post.author}</p>
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: 0 }}>{post.date}</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: "12px", color: "var(--text-muted)" }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div style={{
          marginTop: "60px",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
          border: "1px solid var(--border-glow)",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center"
        }}>
          <i className="fa-solid fa-envelope-open-text" style={{ fontSize: "32px", color: "var(--secondary)", marginBottom: "16px", display: "block" }} />
          <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>Stay in the loop</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            Get new articles, tutorials, and product updates delivered to your inbox.
          </p>
          <div style={{ display: "flex", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ flex: 1, padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border)", background: "rgba(8,13,24,0.8)", color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit" }}
            />
            <button className="btn-primary" style={{ flexShrink: 0 }}>Subscribe</button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="gridTemplateColumns: 1fr auto"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
