import { useParams, Link, useNavigate } from "react-router-dom";
import { POSTS } from "./BlogPage";

const POST_CONTENT = {
  "ai-prompt-mastery": {
    toc: [
      { id: "intro", text: "Introduction to AI Design Prompts" },
      { id: "anatomy", text: "Anatomy of a Perfect Prompt" },
      { id: "formulas", text: "Top Prompting Formulas" },
      { id: "pitfalls", text: "Common Pitfalls & Fixes" }
    ],
    html: `
      <p>Writing prompts for design generation is different from writing standard text prompts. You aren't just asking for text; you are asking for visual layout, structure, density, color palettes, and component distributions. In this guide, we'll demystify how the AI translates your words into beautiful designs.</p>
      
      <h3 id="intro" style="margin: 28px 0 12px; font-size: 20px;">Introduction to AI Design Prompts</h3>
      <p>When you input a prompt into our studio, the system parses it across 14 design dimensions including platform (mobile, web, tablet), industry, style (glassmorphism, clean flat, neon cyberpunk), color mood (warm, cool, dark, vibrant), and density (spacious vs complex dashboard). The more specific you are in these dimensions, the higher the accuracy of the output.</p>
      
      <h3 id="anatomy" style="margin: 28px 0 12px; font-size: 20px;">Anatomy of a Perfect Prompt</h3>
      <p>A high-performing prompt generally consists of four key parts:</p>
      <ul style="margin-left: 20px; margin-bottom: 16px; line-height: 1.7;">
        <li><strong>Role & Task:</strong> e.g., "Create a dashboard for..."</li>
        <li><strong>Style & Aesthetics:</strong> e.g., "Sleek glassmorphism style, dark violet theme, neon accents..."</li>
        <li><strong>Layout & Content:</strong> e.g., "3 key metrics cards at top, a user growth chart in middle, a list of recent transactions on the right..."</li>
        <li><strong>Interactivity clues:</strong> e.g., "include search bar in header, navigation sidebar, profile dropdown..."</li>
      </ul>
      
      <div style="background: var(--primary-muted); border: 1px solid var(--border-glow); padding: 18px; border-radius: 12px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; color: var(--secondary);"><i class="fa-solid fa-lightbulb"></i> Prompt Tip</h4>
        <p style="margin: 0; font-size: 13.5px; color: var(--text-secondary);">Using adjectives like "premium", "corporate", "playful", or "dashboard" instantly primes the AI color and layout generator to use the appropriate visual token mappings.</p>
      </div>

      <h3 id="formulas" style="margin: 28px 0 12px; font-size: 20px;">Top Prompting Formulas</h3>
      <p>Here's a formula you can copy and paste:</p>
      <pre style="background: rgba(8,13,24,0.6); border: 1px solid var(--border); padding: 16px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; overflow-x: auto; margin-bottom: 16px;">
"A premium Dark Mode Fintech Dashboard for a crypto asset tracker.
Style: modern glassmorphism, glowing borders, deep violet backgrounds.
Components: Sidebar navigation, top header with search, 3 statistics cards 
(balance, profits, portfolio status), a dynamic line chart showing asset 
performance over 30 days, and a table of transaction history."</pre>

      <h3 id="pitfalls" style="margin: 28px 0 12px; font-size: 20px;">Common Pitfalls & Fixes</h3>
      <p>Avoid saying "make it look nice" or "cool UI." The AI doesn't know what "nice" means. Instead, explain the structural tokens: "minimalist layout, high contrast, subtle borders, outfit typography." This gives explicit styling parameters for the generator to build on.</p>
    `
  },
  "multi-page-generation": {
    toc: [
      { id: "why", text: "Why Multi-Page Generation?" },
      { id: "how", text: "How the Multi-Page Flow Works" },
      { id: "linking", text: "Interconnecting Your Pages" },
      { id: "figma", text: "Exporting Multi-Page to Figma" }
    ],
    html: `
      <p>Building prototypes one screen at a time is tedious. The real power of design tools lies in flows — how a user goes from a dashboard, to a detailed settings page, to an analytics report. That's why we're proud to launch True Multi-Page Generation.</p>
      
      <h3 id="why" style="margin: 28px 0 12px; font-size: 20px;">Why Multi-Page Generation?</h3>
      <p>Instead of generating a single dashboard page and manually cloning it to design settings or profile sub-views, our generator now creates a full set of connected screens based on the prompt description. If the AI detects navigation items like 'Analytics', 'Settings', or 'Profile', it will automatically create screens for them and wire them up with working routes.</p>
      
      <h3 id="how" style="margin: 28px 0 12px; font-size: 20px;">How the Multi-Page Flow Works</h3>
      <p>When you type a prompt, our classifier analyzes whether it describes an entire system or a single screen. If it detects a system, it creates a sitemap inside the layout schema. The engine then runs parallel generation passes to generate the layout components for all routes, maintaining global variables like font family, primary accent colors, and border radius across all sheets.</p>

      <h3 id="linking" style="margin: 28px 0 12px; font-size: 20px;">Interconnecting Your Pages</h3>
      <p>Inside the interactive preview, you can click tabs or sidebar links. The page renderer checks the component links and swaps active screens. In our latest update in PromptStudio, you can now toggle <strong>"Flow View"</strong> to see all pages stacked vertically at once. This makes it incredibly easy to review the cohesion of your design system.</p>

      <h3 id="figma" style="margin: 28px 0 12px; font-size: 20px;">Exporting Multi-Page to Figma</h3>
      <p>When you click export to Figma, the platform sends all generated pages as separate Frames into your Figma project. It maintains link triggers between buttons and pages, letting you play the interactive prototype directly in Figma with working click interactions.</p>
    `
  },
  "figma-export-workflow": {
    toc: [
      { id: "setup", text: "Setting Up Your Token" },
      { id: "export", text: "Exporting the Schema" },
      { id: "mapping", text: "Figma Component Mapping" },
      { id: "troubleshoot", text: "Troubleshooting & Limits" }
    ],
    html: `
      <p>Exporting design files from AI generators can often yield messy, ungrouped vectors. Our platform is different: we export structured auto-layout frames, color tokens, and font styles. Let's look at the optimal workflow to get your AI generation straight into Figma.</p>
      
      <h3 id="setup" style="margin: 28px 0 12px; font-size: 20px;">Setting Up Your Token</h3>
      <p>Before you can export, you must obtain a Figma Personal Access Token. Here is how:</p>
      <ol style="margin-left: 20px; margin-bottom: 16px; line-height: 1.7;">
        <li>Log in to your Figma account and go to Settings.</li>
        <li>Scroll down to the Personal Access Tokens section.</li>
        <li>Click "Generate new token", name it "AI UI Generator", and copy the key.</li>
        <li>Paste it into your profile settings page on our platform under "API Keys".</li>
      </ol>
      
      <h3 id="export" style="margin: 28px 0 12px; font-size: 20px;">Exporting the Schema</h3>
      <p>Once your token is saved, go to the <strong>Preview</strong> mode for any generated project. Click on the 'Export' drawer in the right-hand panel, select 'Push to Figma', and select your target file URL or create a new file. Our system will call the Figma API to build the vector frames.</p>

      <h3 id="mapping" style="margin: 28px 0 12px; font-size: 20px;">Figma Component Mapping</h3>
      <p>To keep files clean, the generator translates components into corresponding Figma equivalents:</p>
      <ul style="margin-left: 20px; margin-bottom: 16px; line-height: 1.7;">
        <li><strong>Metric Cards:</strong> Exported as auto-layout frames with text layers.</li>
        <li><strong>Data Tables:</strong> Formatted into structured rows with layout grids.</li>
        <li><strong>Buttons:</strong> Exported with corresponding padding and fill tokens.</li>
        <li><strong>Icons:</strong> Mapped to high-quality SVG vector nodes.</li>
      </ul>

      <h3 id="troubleshoot" style="margin: 28px 0 12px; font-size: 20px;">Troubleshooting & Limits</h3>
      <p>If your designs are not showing up, ensure your Figma file is shared with "anyone with the link can edit" access, or verify your personal access token has the correct write permissions. If an export contains complex charts, they are rendered as vectors, which might take a few extra seconds to write.</p>
    `
  },
  "design-tokens-explained": {
    toc: [
      { id: "concept", text: "What are Design Tokens?" },
      { id: "schema", text: "Tokens in the JSON Schema" },
      { id: "customizing", text: "Customizing and Overriding" }
    ],
    html: `
      <p>Design tokens are the atomic elements of a design system — colors, fonts, spacing, shadows, and border radii. Instead of hardcoding hex values across hundreds of components, design tokens act as variables that maintain visual coherence throughout your application.</p>
      
      <h3 id="concept" style="margin: 28px 0 12px; font-size: 20px;">What are Design Tokens?</h3>
      <p>When our AI generates a sitemap, it first constructs a <code>tokens</code> dictionary. It generates standard semantic variables such as <code>--primary</code>, <code>--secondary</code>, <code>--background</code>, <code>--text-main</code>, and <code>--radius</code>. Every component created uses these token names rather than absolute styling values, allowing the theme to be updated dynamically.</p>
      
      <h3 id="schema" style="margin: 28px 0 12px; font-size: 20px;">Tokens in the JSON Schema</h3>
      <p>If you inspect the raw export of any generated design, you will see a top-level tokens object:</p>
      <pre style="background: rgba(8,13,24,0.6); border: 1px solid var(--border); padding: 16px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; overflow-x: auto; margin-bottom: 16px;">
"tokens": {
  "colors": {
    "primary": "#7c3aed",
    "secondary": "#a855f7",
    "background": "#0f172a"
  },
  "typography": {
    "headingFont": "Outfit",
    "bodyFont": "Inter"
  },
  "spacing": {
    "cardPadding": "24px"
  }
}</pre>

      <h3 id="customizing" style="margin: 28px 0 12px; font-size: 20px;">Customizing and Overriding</h3>
      <p>Because variables are centralized, you can click on the "Token Inspector" in the editor side panel, select color swatches, and swap them out. Changing the <code>primary</code> color immediately cascades to all button borders, header highlights, active menu links, and chart lines across all screens.</p>
    `
  }
};

const DEFAULT_POST_CONTENT = {
  toc: [
    { id: "intro", text: "Introduction" },
    { id: "details", text: "Key Insights" },
    { id: "summary", text: "Summary & Action Items" }
  ],
  html: `
    <p>Understanding user experience design is key to building systems that are intuitive and robust. In this post, we look at modern practices in engineering, design, and product building, and outline how AI tools can accelerate your workflow.</p>
    <h3 id="intro" style="margin: 28px 0 12px; font-size: 20px;">Introduction</h3>
    <p>As AI models evolve, their ability to create coherent structures has improved. Layout mapping engines allow developers to skip the initial boilerplate phases of UI development and jump directly into refining layout cards, grids, and workflows.</p>
    <h3 id="details" style="margin: 28px 0 12px; font-size: 20px;">Key Insights</h3>
    <p>By leveraging structured UI schemas, platforms can construct design patterns that align with user goals. Important design factors include grid consistency, balanced color contrasts, and micro-animations that respond to hover states.</p>
    <h3 id="summary" style="margin: 28px 0 12px; font-size: 20px;">Summary & Action Items</h3>
    <p>Start by identifying your core pages and building out simple sitemaps, then use prompt keywords that specify visual details like gradients, dark themes, and specific container shapes to get perfect mockups.</p>
  `
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = POSTS.find(p => p.slug === slug);
  if (!post) {
    return (
      <div style={{ padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Post Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>The article you are looking for does not exist or has been moved.</p>
        <Link to="/blog"><button className="btn-primary">Back to Blog</button></Link>
      </div>
    );
  }

  const content = POST_CONTENT[slug] || DEFAULT_POST_CONTENT;

  // Find related posts (excluding active post)
  const related = POSTS.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div style={{ color: "var(--text-primary)" }}>
      {/* Blog Hero */}
      <section style={{
        padding: "80px 40px 56px",
        background: `radial-gradient(ellipse 80% 60% at 50% -5%, ${post.accentColor}18 0%, transparent 70%)`,
        borderBottom: "1px solid var(--border-light)"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
            <Link to="/blog" style={{ fontSize: "13px", color: "var(--secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-arrow-left" /> Back to Blog
            </Link>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span style={{
              fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em",
              color: post.accentColor, background: `${post.accentColor}15`,
              border: `1px solid ${post.accentColor}30`, padding: "2px 10px", borderRadius: "999px"
            }}>
              {post.category}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: "900", letterSpacing: "-0.02em", lineHeight: "1.15", marginBottom: "20px" }}>
            {post.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--gradient-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
                {post.authorInitials}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{post.author}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{post.authorRole}</p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>
                <i className="fa-regular fa-calendar-days" style={{ marginRight: "6px" }} />
                {post.date}
              </span>
              <span>
                <i className="fa-regular fa-clock" style={{ marginRight: "6px" }} />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "48px", alignItems: "start" }}>
          
          {/* Main content area */}
          <article className="animate-fade-in" style={{ fontSize: "15px", lineHeight: "1.75", color: "var(--text-secondary)" }}>
            <div dangerouslySetInnerHTML={{ __html: content.html }} />
            
            {/* Share / Tags */}
            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {post.tags.map(t => (
                  <span key={t} style={{
                    fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
                    background: "var(--primary-muted)", border: "1px solid var(--border-glow)",
                    color: "var(--secondary)"
                  }}>#{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Share:</span>
                <button style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", display: "grid", placeItems: "center", cursor: "pointer" }}><i className="fa-brands fa-twitter" /></button>
                <button style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", display: "grid", placeItems: "center", cursor: "pointer" }}><i className="fa-brands fa-linkedin" /></button>
                <button style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", display: "grid", placeItems: "center", cursor: "pointer" }}><i className="fa-brands fa-figma" /></button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* TOC Panel */}
            {content.toc && content.toc.length > 0 && (
              <div style={{
                background: "rgba(30,41,59,0.4)", border: "1px solid var(--border-light)",
                borderRadius: "16px", padding: "20px"
              }}>
                <h4 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px", color: "var(--text-primary)" }}>
                  On This Page
                </h4>
                <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {content.toc.map(t => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      style={{ fontSize: "13px", color: "var(--text-secondary)", transition: "color 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.color = "var(--secondary)"}
                      onMouseOut={e => e.currentTarget.style.color = "var(--text-secondary)"}
                    >
                      {t.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Author box */}
            <div style={{
              background: "rgba(30,41,59,0.4)", border: "1px solid var(--border-light)",
              borderRadius: "16px", padding: "20px", textAlign: "center"
            }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--gradient-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "18px", margin: "0 auto 12px" }}>
                {post.authorInitials}
              </div>
              <h4 style={{ fontSize: "14px", fontWeight: "700", margin: "0 0 2px 0" }}>{post.author}</h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 12px 0" }}>{post.authorRole}</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", margin: 0 }}>
                Writing about design operations, front-end ecosystems, and product tooling.
              </p>
            </div>

          </aside>

        </div>
      </section>

      {/* Related posts */}
      <section style={{ background: "var(--bg-deep)", borderTop: "1px solid var(--border)", padding: "64px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "24px" }}>
            Related Articles
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {related.map(p => (
              <div
                key={p.slug}
                onClick={() => { navigate(`/blog/${p.slug}`); window.scrollTo(0, 0); }}
                style={{
                  background: "rgba(30,41,59,0.4)", border: "1px solid var(--border-light)",
                  borderRadius: "16px", padding: "20px", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: "10px", color: p.accentColor, fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  {p.category}
                </span>
                <h4 style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.35", marginBottom: "8px" }}>
                  {p.title}
                </h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineClamp: 2, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>
                  {p.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          div[style*="gridTemplateColumns: 1fr 280px"] { grid-template-columns: 1fr !important; gap: 32px !important; }
          aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}
