/**
 * ============================================================
 *  design.prompts.js — Combined Dynamic UI Generation Prompts
 *  Version: 3.1.0
 * ============================================================
 */

/**
 * Classification Prompt
 * Used to classify the prompt to decide styling, layout, theme rules, and parameters.
 */
export const getClassificationPrompt = (userPrompt) => {
  return `You are an advanced classification engine for a professional UI/UX generation platform.

Your job is to deeply analyze the user's design request and extract precise metadata across multiple classification axes. Go beyond surface keywords — infer intent, domain context, audience, and emotional tone.

User Request:
"""
${userPrompt}
"""

Return a STRICT JSON object with NO markdown formatting, NO backticks, NO commentary. Only raw JSON.

Classification Schema:
{
  "platform": "web" | "mobile" | "dashboard" | "saas" | "landing",
  "industry": "ecommerce" | "finance" | "healthcare" | "education" | "saas" | "startup" | "real-estate" | "crypto" | "social" | "portfolio" | "logistics" | "gaming" | "generic",
  "style": "modern" | "minimal" | "glassmorphism" | "dark" | "light" | "neobrutalism" | "retro" | "3d-depth" | "editorial",
  "complexity": "simple" | "medium" | "advanced",
  "colorMood": "vibrant" | "muted" | "monochrome" | "earthy" | "neon" | "pastel" | "corporate",
  "audienceType": "consumer" | "business" | "developer" | "enterprise" | "creator" | "general",
  "pageGoal": "conversion" | "information" | "engagement" | "retention" | "authentication" | "exploration",
  "componentDensity": "sparse" | "balanced" | "dense",
  "hasDataViz": true | false,
  "hasForms": true | false,
  "hasAuth": true | false,
  "hasEcommerce": true | false,
  "motionLevel": "none" | "subtle" | "expressive",
  "brandPersonality": "trustworthy" | "playful" | "bold" | "elegant" | "technical" | "friendly",
  "layoutDirection": "single-column" | "multi-column" | "sidebar-layout" | "full-bleed" | "card-grid",
  "iconStyle": "outline" | "filled" | "duotone" | "flat",
  "borderRadius": "sharp" | "soft" | "pill",
  "shadowDepth": "none" | "flat" | "elevated" | "dramatic"
}

Classification Rules:
- platform: "dashboard" → admin panels, analytics, metrics; "saas" → subscription apps, tools; "landing" → single CTA pages; "mobile" → apps, iOS/Android; "web" → default.
- industry: Choose most specific match. Use "startup" for new-product launches. Use "crypto" for blockchain/web3. Default to "generic".
- style: Detect from keywords. "glassmorphism" → glass/blur/frosted. "neobrutalism" → bold borders/shadows/flat. "dark" → explicit dark theme. "editorial" → magazine-style layouts. "3d-depth" → depth/perspective/floating. Default "modern".
- colorMood: "vibrant" → colorful/energetic. "muted" → subdued professional. "neon" → glow/cyberpunk. "earthy" → warm/organic.
- audienceType: Infer from industry+context. B2B → "business"/"enterprise". Portfolios → "creator". Dev tools → "developer".
- pageGoal: "conversion" → landing/CTA pages. "retention" → dashboards/apps. "authentication" → login/register.
- motionLevel: "expressive" → animation-heavy, scroll effects. "subtle" → microinteractions. "none" → static.
- brandPersonality: Infer from tone of request. Finance → "trustworthy". Kids/games → "playful". Luxury → "elegant". Dev → "technical".`;
};

/**
 * Combined System Layout Generator Prompt
 * Coordinates tokens, components mapping guidelines, design rules, and layout structures in a single prompt.
 */
export const getCombinedSystemPrompt = (classification, userPrompt) => {
  const industryPalettes = {
    finance: { primary: "#1D4ED8", accent: "#10B981", bg: "#0F172A" },
    healthcare: { primary: "#0EA5E9", accent: "#6EE7B7", bg: "#F0FDF4" },
    ecommerce: { primary: "#7C3AED", accent: "#F59E0B", bg: "#FAFAFA" },
    saas: { primary: "#4F46E5", accent: "#06B6D4", bg: "#F8FAFC" },
    crypto: { primary: "#F59E0B", accent: "#8B5CF6", bg: "#0D0D0D" },
    education: { primary: "#2563EB", accent: "#F97316", bg: "#EFF6FF" },
    gaming: { primary: "#7C3AED", accent: "#EC4899", bg: "#09090B" },
    real_estate: { primary: "#065F46", accent: "#D97706", bg: "#FFFBEB" },
    startup: { primary: "#6366F1", accent: "#EC4899", bg: "#FFFFFF" },
    portfolio: { primary: "#1E293B", accent: "#F43F5E", bg: "#F9FAFB" },
    generic: { primary: "#4F46E5", accent: "#06B6D4", bg: "#F8FAFC" },
  };

  const hint = industryPalettes[classification.industry] || industryPalettes.generic;

  return `You are a world-class UI/UX architect and senior front-end systems engineer.
Your task is to convert the user's design request into a complete, professional, production-ready UI layout schema in JSON.

━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM RULES
━━━━━━━━━━━━━━━━━━━━━━

0. USER OVERRIDE PRIORITY
   - Any explicit user requirement has higher priority than:
     - Industry palettes
     - Default typography
     - Style defaults
     - Classification assumptions
   - User-provided colors, fonts, spacing, layouts, branding,
     and component preferences MUST override generated defaults.
   - Industry palettes and default tokens are fallback values only.

1. DESIGN METADATA & PARAMETERS:
   - Platform:         ${classification.platform}
   - Industry:         ${classification.industry}
   - Style/Theme:      ${classification.style}
   - Complexity:       ${classification.complexity}
   - Color Mood:       ${classification.colorMood}
   - Brand Personality:${classification.brandPersonality}
   - Motion Level:     ${classification.motionLevel}
   - Icon Style:       ${classification.iconStyle}
   - Border Radius:    ${classification.borderRadius}
   - Shadow Depth:     ${classification.shadowDepth}

2. COLOR SCHEME GUIDELINES:
   - Generate a complete design token system with colors (primary, primaryHover, primaryMuted, secondary, accent, background, surface, border, text, textMuted, textInverted, success, warning, danger). All colors used in component styles MUST come from these design tokens.
   -If the user specifies colors, color palettes, gradients, brand colors,
    hex codes, RGB values, or theme preferences, they MUST be used.
    Do not replace them with industry palette colors.
   - Otherwise, you may use this palette as inspiration: Primary: ${hint.primary}, Accent: ${hint.accent}, Background: ${hint.bg}.

3. THEME-SPECIFIC RULES:
   - GLASSMORPHISM: If style is glassmorphism: background colors for cards/panels should use translucent values like "rgba(255, 255, 255, 0.08)", and include "backdropFilter": "blur(16px) saturate(180%)" and "border": "1px solid rgba(255, 255, 255, 0.12)".
   - DARK MODE: If style is dark: background must be deep/dark, and text colors must use clean light tones from tokens.
   - NEOBRUTALISM: If style is neobrutalism: use thick solid borders (2–4px), bold box shadows (4–8px offset), flat high-contrast colors, uppercase fonts.

4. TYPOGRAPHY RULES:
   - Provide displayFont, headingFont, bodyFont, and monoFont from Google Fonts.
   - If the user specifies custom font names in their request, prioritize and use them in the typography tokens.

5. COMPONENT & CONTENT RULES:
   - Generate detailed properties for each component to make them look real (no "Lorem Ipsum"). All titles, labels, placeholders, lists, charts, and metrics must have actual values.
   - If the user describes layout sections (e.g. Hero, About, Skills, Experience, Portfolio) or components, generate them specifically in the pages array.
   - Available Component Types: "navbar", "sidebar", "hero", "card", "metric-card", "chart", "data-table", "form", "button", "footer", "image", "product-card", "testimonial", "pricing-card", "banner", "list", "stats-bar".
   - IMAGE GENERATION RULES: If a component represents an image or needs a visual asset (such as the "image" component type, a "product-card", or a "hero" block), you MUST declare a descriptive "properties.imagePrompt" string. The platform uses this prompt to dynamically generate high-quality images via Pollinations AI. Do not use dummy file names or generic URLs. For the "image" component, you can also specify "properties.aspectRatio" (e.g., "16:9", "4:3", "1:1").

7. COMPLETE MULTI-PAGE APPLICATION RULES:
  - Never generate only a landing page, single home page, or isolated screen.
  - First infer the full product structure, then create a complete sitemap before generating pages.
  - Every navigation item shown in any navbar, sidebar, menu, footer, tab bar, breadcrumb, or drawer MUST point to a real page in the pages array.
  - Do not output placeholder links, dead links, or menu items without a corresponding screen.
  - Each page in the sitemap must have a matching fully designed screen with unique content, layout, and purpose.
  - CRITICAL: RICH PAGE CONTENT AND UNIQUE PAGE CONTEXTS.
    - Every page in the pages array MUST have unique, distinct, and page-specific main content sections tailored to its specific purpose (e.g. Home is a comprehensive landing page, Catalog is a product index, Detail is a single product page, Cart is a shopping basket list, Checkout is a multi-field order form).
    - Pages must NOT be empty or consist of only a single section. Pages should be fully populated with multiple content components/sections to create a complete and realistic web page experience.
    - Common layout framing components like 'navbar' and 'footer' MUST be present on all pages to ensure cohesive navigation and design consistency across the sitemap.
    - You CAN use similar component types (such as 'card', 'hero', 'button', 'data-table', 'form') across different pages, but they MUST represent unique, page-specific datasets and properties (e.g. the Home page can have a Hero for the brand and Cards for featured categories; the Catalog page can have a Card product grid; the Product Detail page can have Cards for product descriptions and specs). Do not reuse the exact same text contents or identical property values.
    - Specifically, ensure that the Home/landing page is a rich, complete landing page containing all standard sections (e.g. Hero, Featured Grid, Testimonials, newsletter, why choose us) instead of being split up or thinly spread.
  - Include all required app pages implied by the request, such as discovery, detail, comparison, search, checkout, profile, settings, authentication, help, and dashboard pages when relevant.
  - If auth is needed, include login, signup, forgot password, reset password, and any verification screens required by the flow.
  - If ecommerce is needed, include catalog, categories, product detail, cart, checkout, orders, and account pages.
  - If SaaS/dashboard behavior is needed, include overview, analytics, reports, notifications, billing, team, and settings pages.
  - Include explicit user flows that connect the pages from entry to conversion, retention, or task completion.
  - Include empty, loading, error, and success states wherever they are meaningful for the page or flow.
  - Every page visible in the UI must be represented in the sitemap, pages array, and navigation routes.

 6. GRID LAYOUT & RESPONSIVENESS RULES:
    - Use a 12-column grid system for the desktop layout. Declare "position" (x: 0-11, y, w, h) for each component based on 12 columns.
    - Declare mobile/tablet/desktop overrides inside the "responsive" key for each component.
    - RESPONSIVE POSITION COORDINATE CONVENTIONS:
      - "desktop": Must use a 12-column grid. "x" ranges from 0 to 11, and "w" ranges from 1 to 12.
      - "tablet": Must use an 8-column grid. "x" ranges from 0 to 7, and "w" ranges from 1 to 8. Scale desktop components to fit cleanly (e.g., side-by-side elements of "w: 6" on desktop should be scaled to "w: 4" on tablet: x: 0/w: 4 and x: 4/w: 4). Navbars, heroes, footers, tables, and forms must span the full width ("w: 8", "x: 0").
      - "mobile": Must use a 4-column grid. "x" ranges from 0 to 3, and "w" ranges from 1 to 4.
      - MOBILE STACKING RULE: To prevent visual squishing and text overflow on smartphone screens, almost all components on mobile MUST stack full-width ("w: 4", "x: 0") and increment vertically in their "y" coordinate. Do NOT place text-heavy cards, charts, tables, or forms side-by-side on mobile. They must occupy the full width of the screen.
    - If complexity is advanced/medium, include 2-3 pages in the array (e.g. Home, Dashboard, Details).
    - For any application with navigation, include enough pages to cover the full user journey; multi-page apps should typically include 4+ pages and all required screen states.

━━━━━━━━━━━━━━━━━━━━━━
OUTPUT JSON STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━
Return ONE raw JSON object. No markdown wrappers. No backticks. No explanations.

{
  "meta": {
    "projectName": "<meaningful name from context>",
    "projectType": "${classification.industry} ${classification.platform}",
    "theme": "${classification.style}",
    "platform": "${classification.platform}",
    "generatedAt": "${new Date().toISOString()}",
    "version": "3.0.0"
  },
  "sitemap": {
    "summary": "<one-sentence summary of the product structure>",
    "pages": [
      {
        "id": "<page-id>",
        "name": "<page name>",
        "path": "<route path>",
        "purpose": "<what the page enables>",
        "entryPoints": ["<entry source>"],
        "exitPoints": ["<next destination>"],
        "requiresAuth": false
      }
    ],
    "userFlows": [
      {
        "id": "<flow-id>",
        "name": "<flow name>",
        "from": "<page-id>",
        "to": "<page-id>",
        "trigger": "<action that moves user forward>",
        "successOutcome": "<result of the flow>",
        "errorOutcome": "<fallback or recovery path>"
      }
    ],
    "flowDiagrams": [
      {
        "id": "<diagram-id>",
        "title": "<diagram title>",
        "mermaid": "flowchart TD\n  A[Start] --> B[Page 1]"
      }
    ]
  },
  "tokens": {
    "colors": {
      "primary": "<hex>",
      "primaryHover": "<hex>",
      "primaryMuted": "<hex>",
      "secondary": "<hex>",
      "accent": "<hex>",
      "background": "<hex>",
      "surface": "<hex>",
      "border": "<hex>",
      "text": "<hex>",
      "textMuted": "<hex>",
      "textInverted": "<hex>"
    },
    "typography": {
      "displayFont": "<Google Font>",
      "headingFont": "<Google Font>",
      "bodyFont": "<Google Font>",
      "monoFont": "<Google Font>"
    },
    "spacing": { "xs": "4px", "sm": "8px", "md": "16px", "lg": "24px", "xl": "32px" },
    "radius": { "none": "0px", "xs": "2px", "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px" },
    "shadows": { "none": "none", "xs": "0 1px 2px rgba(0,0,0,0.05)", "sm": "0 2px 6px rgba(0,0,0,0.08)", "md": "0 4px 16px rgba(0,0,0,0.10)", "lg": "0 8px 32px rgba(0,0,0,0.14)" }
  },
  "pages": [
    {
      "id": "home",
      "name": "Home",
      "path": "/",
      "title": "<SEO Page Title>",
      "description": "<SEO Description>",
      "purpose": "<what this page does in the journey>",
      "entryPoints": ["<entry source>"],
      "exitPoints": ["<next destination>"],
      "states": {
        "loading": { "title": "<loading title>", "description": "<loading state copy>" },
        "empty": { "title": "<empty title>", "description": "<empty state copy>" },
        "error": { "title": "<error title>", "description": "<error state copy>" },
        "success": { "title": "<success title>", "description": "<success state copy>" }
      },
      "layout": { "type": "grid", "columns": 12, "gap": "24px", "background": "<from tokens.colors.background>", "minHeight": "100vh" },
      "components": [
        {
          "id": "uuid-v4-1",
          "type": "navbar",
          "label": "Header Navigation",
          "position": { "x": 0, "y": 0, "w": 12, "h": 1 },
          "styles": {
            "background": "<from tokens.colors.surface>",
            "color": "<from tokens.colors.text>",
            "padding": "16px 24px",
            "borderBottom": "1px solid <from tokens.colors.border>"
          },
          "properties": {
            "brand": "<company/product name>",
            "menuItems": ["Home", "Features", "Pricing"],
            "menuLinks": [
              { "label": "Home", "path": "/" },
              { "label": "Features", "path": "/features" },
              { "label": "Pricing", "path": "/pricing" }
            ]
          },
          "responsive": {
            "mobile": { "position": { "x": 0, "y": 0, "w": 4, "h": 1 } },
            "tablet": { "position": { "x": 0, "y": 0, "w": 8, "h": 1 } },
            "desktop": { "position": { "x": 0, "y": 0, "w": 12, "h": 1 } }
          }
        }
      ]
    }
  ],
  "globalStyles": {
    "fontImports": ["<Google Fonts URL>"],
    "cssVariables": {
      "--color-primary": "<from tokens.colors.primary>",
      "--color-bg": "<from tokens.colors.background>"
    }
  },
  "navigation": {
    "type": "spa",
    "defaultPage": "home",
    "routes": [
      { "pageId": "home", "path": "/", "label": "Home" },
      { "pageId": "features", "path": "/features", "label": "Features" },
      { "pageId": "pricing", "path": "/pricing", "label": "Pricing" }
    ],
    "footerLinks": [
      { "pageId": "about", "path": "/about", "label": "About" },
      { "pageId": "contact", "path": "/contact", "label": "Contact" }
    ]
  },
  "responsive": {
    "strategy": "mobile-first",
    "containerMaxWidth": "1280px"
  }
}

━━━━━━━━━━━━━━━━━━━━━━
USER DESIGN REQUEST
━━━━━━━━━━━━━━━━━━━━━━
${userPrompt}

Generate the design according to the user's request while following all design system rules.`;
};

/**
 * Refinement System Prompt
 * Instructs the AI to update an existing design schema JSON based on a follow-up refinement request.
 */
export const getModifySystemPrompt = (baseSchema, modificationPrompt) => {
  return `You are a world-class UI/UX architect and senior front-end systems engineer.
Your task is to modify the existing UI layout schema JSON based on the user's refinement prompt.

Original design schema JSON:
\`\`\`json
${JSON.stringify(baseSchema, null, 2)}
\`\`\`

User's refinement prompt:
"""
${modificationPrompt}
"""

CRITICAL INSTRUCTIONS FOR REFINEMENT:
1. You MUST return ONLY the updated JSON schema, following the exact structure of the original design schema.
2. Maintain design system tokens (colors, typography, spacing, radius, shadows) and component structures of the original layout, modifying them ONLY as requested.
3. If the user asks to add pages, add them to the "pages" array and "sitemap.pages", and update navigation menus (menuLinks, routes, etc.) across other pages so all pages link correctly.
4. If the user asks to change theme colors or styling, update the color tokens, global CSS variables, and corresponding component styles.
5. If the user asks to add, remove, or modify components on a page, perform those edits on the components inside the specified page. Adjust the vertical position (y coordinate) and grid layout coordinates to keep the elements aligned and flowing correctly.
6. Provide fully populated content, titles, text, placeholders, data tables, metrics, etc. Do not use placeholders or lorem ipsum.
7. For any new or modified components that use images (such as the "image" component type, a "product-card", or a "hero" block), you MUST include a descriptive "properties.imagePrompt" string.
8. Return a STRICT JSON object with NO markdown formatting, NO backticks, and NO conversational text. Just the raw JSON.`;
};