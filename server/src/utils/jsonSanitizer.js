/**
 * Sanitizes raw text response from AI, extracting and parsing JSON.
 * It filters out DeepSeek thinking tags, markdown wrappers, finds the JSON block bounds,
 * and fixes minor JSON errors like trailing commas.
 * 
 * @param {string} rawText 
 * @returns {object} parsed JSON object
 */
export function sanitizeAndParseJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Raw response is empty or not a string");
  }

  let cleaned = rawText;

  // 1. Strip out DeepSeek reasoning tokens (<think>...</think>) if present
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, "");

  // 2. Remove markdown code block delimiters if present
  cleaned = cleaned.replace(/```json/gi, "");
  cleaned = cleaned.replace(/```/g, "");

  // 3. Find the index bounds of the outer JSON object or array
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = cleaned.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = cleaned.lastIndexOf("]");
  }

  if (start === -1 || end === -1 || end < start) {
    throw new Error("No valid JSON structure (object or array) found in raw output");
  }

  cleaned = cleaned.substring(start, end + 1);

  // 4. Sanitize trailing commas inside JSON lists or objects
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // 5. Try parsing
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // Attempt minor parsing repair if possible
    try {
      // Replace single quotes with double quotes around key-value candidates
      const singleQuoteFixed = cleaned
        .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')
        .replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(singleQuoteFixed);
    } catch (retryError) {
      throw new Error(`Failed to parse AI JSON response: ${error.message}`);
    }
  }
}

/**
 * Returns a high-quality fallback mockup JSON schema based on the user prompt classification.
 * This is used to ensure the API never fails to return a valid design schema.
 * 
 * @param {string} prompt 
 * @param {object} classification 
 * @returns {object} design JSON schema
 */
export function getFallbackDesign(prompt, classification = {}) {
  const platform = classification.platform || "web";
  const industry = classification.industry || "generic";
  const style = classification.style || "modern";
  const complexity = classification.complexity || "medium";
  const promptText = `${prompt || ""}`.toLowerCase();

  const isDark = style === "dark";
  const isAuth = /login|sign ?up|signup|signin|forgot|reset|password|register|authentication/.test(promptText);
  const isEcommerce = /shop|store|product|cart|checkout|order|catalog|category|ecommerce|marketplace/.test(promptText);
  const isDashboard = /dashboard|analytics|report|metric|admin|overview|insight|stats/.test(promptText);
  const isPortfolio = /portfolio|project|case study|resume|about me|experience|freelance|creator/.test(promptText);

  const primaryColor = industry === "finance" ? "#10b981" : "#6366f1";
  const secondaryColor = industry === "ecommerce" ? "#f59e0b" : "#06b6d4";
  const backgroundColor = isDark ? "#0b0f19" : "#f3f4f6";
  const surfaceColor = isDark ? "#1e293b" : "#ffffff";
  const borderColor = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#f8fafc" : "#111827";
  const textMuted = isDark ? "#94a3b8" : "#6b7280";
  const brandName = `${industry.charAt(0).toUpperCase() + industry.slice(1)}Flow`;

  const tokens = {
    colors: {
      primary: primaryColor,
      primaryHover: primaryColor,
      primaryMuted: `${primaryColor}22`,
      secondary: secondaryColor,
      accent: "#8b5cf6",
      background: backgroundColor,
      surface: surfaceColor,
      border: borderColor,
      text: textColor,
      textMuted: textMuted,
      textInverted: "#ffffff",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444"
    },
    typography: {
      displayFont: "Outfit",
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "IBM Plex Mono"
    },
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
    radius: { none: "0px", xs: "2px", sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
    shadows: { none: "none", xs: "0 1px 2px rgba(0,0,0,0.05)", sm: "0 2px 6px rgba(0,0,0,0.08)", md: "0 4px 16px rgba(0,0,0,0.10)", lg: "0 8px 32px rgba(0,0,0,0.14)" }
  };

  const sharedStates = {
    loading: { title: "Loading", description: "Content and interactions are loading." },
    empty: { title: "Nothing here yet", description: "There is no content to show in this state." },
    error: { title: "Something went wrong", description: "The screen shows a recoverable error state." },
    success: { title: "Action completed", description: "The interaction completed successfully." }
  };

  const navLinks = [];

  const baseNavbar = (id, y) => ({
    id,
    type: "navbar",
    content: "Primary navigation",
    position: { x: 0, y, w: 12, h: 1 },
    styles: {
      background: surfaceColor,
      height: "70px",
      padding: "16px 24px",
      color: textColor,
      borderBottom: `1px solid ${borderColor}`
    },
    properties: {
      brand: brandName,
      menuItems: navLinks.map((item) => item.label),
      menuLinks: navLinks
    }
  });

  const baseFooter = (id, y) => ({
    id,
    type: "footer",
    content: "Footer links and support",
    position: { x: 0, y, w: 12, h: 1 },
    styles: {
      background: surfaceColor,
      color: textMuted,
      padding: "20px 24px",
      borderTop: `1px solid ${borderColor}`
    },
    properties: {
      links: navLinks.map((item) => ({ label: item.label, path: item.path }))
    }
  });

  const makePage = ({ id, name, path, title, description, purpose, entryPoints, exitPoints, components, requiresAuth = false }) => ({
    id,
    name,
    path,
    title,
    description,
    purpose,
    entryPoints,
    exitPoints,
    requiresAuth,
    states: sharedStates,
    layout: {
      type: "grid",
      columns: 12,
      gap: "24px",
      background: backgroundColor,
      minHeight: "100vh"
    },
    components
  });

  const pages = [];
  const userFlows = [];
  const flowDiagrams = [];

  if (isAuth) {
    navLinks.push(
      { label: "Home", path: "/" },
      { label: "Login", path: "/login" },
      { label: "Sign Up", path: "/signup" },
      { label: "Help", path: "/help" }
    );

    pages.push(
      makePage({
        id: "home",
        name: "Home",
        path: "/",
        title: `${brandName} | Secure access and account management`,
        description: `A multi-page authentication experience for ${prompt}.`,
        purpose: "Introduce the product, trust signals, and routes into the auth flow.",
        entryPoints: ["direct visit", "marketing campaign"],
        exitPoints: ["login", "signup"],
        components: [
          baseNavbar("auth-nav-1", 0),
          {
            id: "auth-hero-1",
            type: "hero",
            content: "Authentication hero",
            position: { x: 0, y: 1, w: 12, h: 4 },
            styles: { background: isDark ? "#0f172a" : "#eef2ff", padding: "72px 24px", textAlign: "center", minHeight: "360px" },
            properties: {
              title: `Access ${brandName} in one secure flow`,
              subtitle: `Designed for the requirement: ${prompt}`,
              ctaText: "Sign In",
              ctaVariant: "primary"
            }
          },
          baseFooter("auth-footer-1", 5)
        ]
      }),
      makePage({
        id: "login",
        name: "Login",
        path: "/login",
        title: `${brandName} | Login`,
        description: "Sign in screen with recovery and validation states.",
        purpose: "Authenticate returning users.",
        entryPoints: ["home", "email invite"],
        exitPoints: ["dashboard", "forgot-password"],
        requiresAuth: false,
        components: [
          baseNavbar("auth-nav-2", 0),
          {
            id: "login-form-1",
            type: "form",
            content: "Login form",
            position: { x: 2, y: 1, w: 8, h: 3 },
            styles: { background: surfaceColor, padding: "32px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: {
              title: "Welcome back",
              fields: ["Email address", "Password"],
              primaryAction: "Sign In",
              secondaryAction: "Forgot password"
            }
          },
          baseFooter("auth-footer-2", 4)
        ]
      }),
      makePage({
        id: "signup",
        name: "Sign Up",
        path: "/signup",
        title: `${brandName} | Sign Up`,
        description: "Account creation screen with trust and confirmation states.",
        purpose: "Create a new account and collect the minimum required information.",
        entryPoints: ["home", "login"],
        exitPoints: ["dashboard", "email verification"],
        components: [
          baseNavbar("auth-nav-3", 0),
          {
            id: "signup-form-1",
            type: "form",
            content: "Signup form",
            position: { x: 2, y: 1, w: 8, h: 4 },
            styles: { background: surfaceColor, padding: "32px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: {
              title: "Create your account",
              fields: ["Full name", "Email address", "Password", "Confirm password"],
              primaryAction: "Create Account",
              helperText: "Includes email verification and success confirmation state."
            }
          },
          baseFooter("auth-footer-3", 5)
        ]
      }),
      makePage({
        id: "forgot-password",
        name: "Forgot Password",
        path: "/forgot-password",
        title: `${brandName} | Forgot Password`,
        description: "Password recovery screen with email submission and success state.",
        purpose: "Start the password recovery flow.",
        entryPoints: ["login"],
        exitPoints: ["reset-password"],
        components: [
          baseNavbar("auth-nav-4", 0),
          {
            id: "forgot-form-1",
            type: "form",
            content: "Password recovery form",
            position: { x: 3, y: 1, w: 6, h: 2 },
            styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Reset your password", fields: ["Email address"], primaryAction: "Send reset link" }
          },
          baseFooter("auth-footer-4", 3)
        ]
      }),
      makePage({
        id: "reset-password",
        name: "Reset Password",
        path: "/reset-password",
        title: `${brandName} | Reset Password`,
        description: "Set a new password after email verification.",
        purpose: "Complete the password recovery flow.",
        entryPoints: ["forgot-password"],
        exitPoints: ["login"],
        components: [
          baseNavbar("auth-nav-5", 0),
          {
            id: "reset-form-1",
            type: "form",
            content: "Reset form",
            position: { x: 3, y: 1, w: 6, h: 3 },
            styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Create a new password", fields: ["New password", "Confirm new password"], primaryAction: "Update password" }
          },
          baseFooter("auth-footer-5", 4)
        ]
      })
    );

    userFlows.push(
      { id: "flow-auth-1", name: "Landing to Login", from: "home", to: "login", trigger: "Click Sign In", successOutcome: "User reaches login screen", errorOutcome: "Show help and retry options" },
      { id: "flow-auth-2", name: "Login Recovery", from: "login", to: "forgot-password", trigger: "Click Forgot Password", successOutcome: "Recovery email requested", errorOutcome: "Email validation error shown" },
      { id: "flow-auth-3", name: "Password Reset", from: "forgot-password", to: "reset-password", trigger: "Open reset link", successOutcome: "Password can be updated", errorOutcome: "Expired link message and resend option" }
    );

    flowDiagrams.push({
      id: "diagram-auth-1",
      title: "Authentication Flow",
      mermaid: "flowchart TD\n  A[Home] --> B[Login]\n  A --> C[Sign Up]\n  B --> D[Forgot Password]\n  D --> E[Reset Password]\n  E --> B"
    });
  } else if (isEcommerce) {
    navLinks.push(
      { label: "Home", path: "/" },
      { label: "Catalog", path: "/catalog" },
      { label: "Product", path: "/product" },
      { label: "Cart", path: "/cart" },
      { label: "Checkout", path: "/checkout" },
      { label: "Account", path: "/account" }
    );

    pages.push(
      makePage({
        id: "home",
        name: "Home",
        path: "/",
        title: `${brandName} | Shop the collection`,
        description: "Landing page that drives discovery into the catalog and product details.",
        purpose: "Introduce the store and route users into shopping flows.",
        entryPoints: ["ads", "organic search", "social"],
        exitPoints: ["catalog", "product", "cart"],
        components: [
          baseNavbar("shop-nav-1", 0),
          {
            id: "shop-hero-1",
            type: "hero",
            content: "Store hero",
            position: { x: 0, y: 1, w: 12, h: 4 },
            styles: { background: isDark ? "#111827" : "#fff7ed", padding: "72px 24px", textAlign: "center" },
            properties: { title: "Discover curated products built for the way you shop", subtitle: `Tailored to: ${prompt}`, ctaText: "Browse Catalog" }
          },
          baseFooter("shop-footer-1", 5)
        ]
      }),
      makePage({
        id: "catalog",
        name: "Catalog",
        path: "/catalog",
        title: `${brandName} | Catalog`,
        description: "Browse categories, filters, and featured products.",
        purpose: "Let users explore the inventory and find items.",
        entryPoints: ["home", "search"],
        exitPoints: ["product", "cart"],
        components: [
          baseNavbar("shop-nav-2", 0),
          {
            id: "catalog-grid-1",
            type: "card",
            content: "Featured product grid",
            position: { x: 0, y: 1, w: 12, h: 3 },
            styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Featured products", content: "A responsive grid of product cards with filters and sorting." }
          },
          baseFooter("shop-footer-2", 4)
        ]
      }),
      makePage({
        id: "product",
        name: "Product",
        path: "/product",
        title: `${brandName} | Product details`,
        description: "Product detail screen with imagery, specs, reviews, and purchase CTA.",
        purpose: "Help users evaluate and add the product to cart.",
        entryPoints: ["catalog"],
        exitPoints: ["cart"],
        components: [
          baseNavbar("shop-nav-3", 0),
          {
            id: "product-hero-1",
            type: "hero",
            content: "Product detail hero",
            position: { x: 0, y: 1, w: 12, h: 2 },
            styles: { background: surfaceColor, padding: "32px 24px" },
            properties: { title: "Premium product detail", subtitle: "Size, color, stock, and review context are all visible." }
          },
          {
            id: "product-card-1",
            type: "card",
            content: "Specifications",
            position: { x: 0, y: 3, w: 6, h: 2 },
            styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Specifications", content: "Material, dimensions, availability, and shipping estimate." }
          },
          {
            id: "product-card-2",
            type: "card",
            content: "Reviews and trust signals",
            position: { x: 6, y: 3, w: 6, h: 2 },
            styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Reviews", content: "Verified buyer reviews, rating distribution, and highlight summaries." }
          }
        ]
      }),
      makePage({
        id: "cart",
        name: "Cart",
        path: "/cart",
        title: `${brandName} | Cart`,
        description: "Shopping cart overview with quantity, totals, and saved items.",
        purpose: "Review cart contents before checkout.",
        entryPoints: ["product", "catalog"],
        exitPoints: ["checkout"],
        components: [
          baseNavbar("shop-nav-4", 0),
          {
            id: "cart-table-1",
            type: "data-table",
            content: "Cart items",
            position: { x: 0, y: 1, w: 8, h: 2 },
            styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Your cart", rows: ["Item", "Quantity", "Price", "Subtotal"] }
          },
          {
            id: "cart-card-1",
            type: "card",
            content: "Order summary",
            position: { x: 8, y: 1, w: 4, h: 2 },
            styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Order summary", content: "Subtotal, shipping, tax, and total are shown before checkout." }
          }
        ]
      }),
      makePage({
        id: "checkout",
        name: "Checkout",
        path: "/checkout",
        title: `${brandName} | Checkout`,
        description: "Multi-step checkout with payment and confirmation states.",
        purpose: "Capture shipping and payment details and complete the order.",
        entryPoints: ["cart"],
        exitPoints: ["account", "order confirmation"],
        components: [
          baseNavbar("shop-nav-5", 0),
          {
            id: "checkout-form-1",
            type: "form",
            content: "Checkout form",
            position: { x: 0, y: 1, w: 8, h: 3 },
            styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Shipping and payment", fields: ["Name", "Address", "Card number", "Expiry", "CVC"], primaryAction: "Place order" }
          },
          {
            id: "checkout-card-1",
            type: "card",
            content: "Secure checkout summary",
            position: { x: 8, y: 1, w: 4, h: 3 },
            styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Secure payment", content: "Trust badges, refund policy, and final confirmation are visible." }
          }
        ]
      }),
      makePage({
        id: "account",
        name: "Account",
        path: "/account",
        title: `${brandName} | Account`,
        description: "Customer account screen for orders, addresses, and saved preferences.",
        purpose: "Manage order history and user profile settings.",
        entryPoints: ["checkout", "login"],
        exitPoints: ["home", "orders"],
        components: [
          baseNavbar("shop-nav-6", 0),
          {
            id: "account-form-1",
            type: "form",
            content: "Account settings form",
            position: { x: 0, y: 1, w: 6, h: 3 },
            styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Profile details", fields: ["Name", "Email", "Phone", "Default address"], primaryAction: "Save changes" }
          },
          {
            id: "account-table-1",
            type: "data-table",
            content: "Order history",
            position: { x: 6, y: 1, w: 6, h: 3 },
            styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Recent orders", rows: ["Order ID", "Date", "Status", "Total"] }
          }
        ]
      })
    );

    userFlows.push(
      { id: "flow-shop-1", name: "Browse to Product", from: "home", to: "catalog", trigger: "Click Browse Catalog", successOutcome: "User reaches filtered product list", errorOutcome: "Show retry and search fallback" },
      { id: "flow-shop-2", name: "Product to Cart", from: "product", to: "cart", trigger: "Click Add to Cart", successOutcome: "Cart updates with selected item", errorOutcome: "Stock warning and alternative suggestions" },
      { id: "flow-shop-3", name: "Cart to Checkout", from: "cart", to: "checkout", trigger: "Click Checkout", successOutcome: "Checkout flow starts", errorOutcome: "Prompt for required fields or login" }
    );

    flowDiagrams.push({
      id: "diagram-shop-1",
      title: "Shopping Flow",
      mermaid: "flowchart TD\n  A[Home] --> B[Catalog]\n  B --> C[Product]\n  C --> D[Cart]\n  D --> E[Checkout]\n  E --> F[Account]"
    });
  } else if (isDashboard) {
    navLinks.push(
      { label: "Overview", path: "/" },
      { label: "Analytics", path: "/analytics" },
      { label: "Reports", path: "/reports" },
      { label: "Notifications", path: "/notifications" },
      { label: "Settings", path: "/settings" }
    );

    pages.push(
      makePage({
        id: "overview",
        name: "Overview",
        path: "/",
        title: `${brandName} | Overview`,
        description: "A dashboard overview with metrics, charts, and recent activity.",
        purpose: "Show the operational snapshot and drive deeper analysis.",
        entryPoints: ["login", "direct access"],
        exitPoints: ["analytics", "reports", "notifications"],
        components: [
          baseNavbar("dash-nav-1", 0),
          {
            id: "dash-metric-1",
            type: "metric-card",
            content: "Primary metric",
            position: { x: 0, y: 1, w: 3, h: 1 },
            styles: { background: surfaceColor, padding: "20px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Active users", content: "12,840", change: "+8.7%" }
          },
          {
            id: "dash-chart-1",
            type: "chart",
            content: "Trend chart",
            position: { x: 0, y: 2, w: 8, h: 2 },
            styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Monthly performance" }
          },
          baseFooter("dash-footer-1", 4)
        ]
      }),
      makePage({
        id: "analytics",
        name: "Analytics",
        path: "/analytics",
        title: `${brandName} | Analytics`,
        description: "Detailed analytics screen for trends, segments, and conversion paths.",
        purpose: "Enable deep analysis of the data.",
        entryPoints: ["overview"],
        exitPoints: ["reports"],
        components: [
          baseNavbar("dash-nav-2", 0),
          {
            id: "dash-chart-2",
            type: "chart",
            content: "Segment analysis",
            position: { x: 0, y: 1, w: 6, h: 2 },
            styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Segments and cohorts" }
          },
          {
            id: "dash-chart-3",
            type: "chart",
            content: "Conversion analysis",
            position: { x: 6, y: 1, w: 6, h: 2 },
            styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Conversion funnel" }
          }
        ]
      }),
      makePage({
        id: "reports",
        name: "Reports",
        path: "/reports",
        title: `${brandName} | Reports`,
        description: "Exportable reports and tabular history.",
        purpose: "Review historical data and generate exports.",
        entryPoints: ["analytics"],
        exitPoints: ["notifications", "settings"],
        components: [
          baseNavbar("dash-nav-3", 0),
          {
            id: "dash-table-1",
            type: "data-table",
            content: "Report table",
            position: { x: 0, y: 1, w: 12, h: 3 },
            styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Monthly reports", rows: ["Report", "Owner", "Status", "Last updated"] }
          }
        ]
      }),
      makePage({
        id: "notifications",
        name: "Notifications",
        path: "/notifications",
        title: `${brandName} | Notifications`,
        description: "Alerts, updates, and system messages.",
        purpose: "Track important changes and system activity.",
        entryPoints: ["overview", "reports"],
        exitPoints: ["settings"],
        components: [
          baseNavbar("dash-nav-4", 0),
          {
            id: "dash-card-1",
            type: "card",
            content: "Recent alerts",
            position: { x: 0, y: 1, w: 12, h: 2 },
            styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Notification center", content: "Security alerts, product updates, and completion messages." }
          }
        ]
      }),
      makePage({
        id: "settings",
        name: "Settings",
        path: "/settings",
        title: `${brandName} | Settings`,
        description: "Profile and configuration settings.",
        purpose: "Allow users to manage account and workspace preferences.",
        entryPoints: ["overview", "notifications"],
        exitPoints: ["overview"],
        components: [
          baseNavbar("dash-nav-5", 0),
          {
            id: "dash-form-1",
            type: "form",
            content: "Settings form",
            position: { x: 0, y: 1, w: 6, h: 3 },
            styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` },
            properties: { title: "Workspace settings", fields: ["Display name", "Email notifications", "Language", "Time zone"], primaryAction: "Save settings" }
          }
        ]
      })
    );

    userFlows.push(
      { id: "flow-dash-1", name: "Overview to Analytics", from: "overview", to: "analytics", trigger: "Click Analytics", successOutcome: "User explores deeper metrics", errorOutcome: "Show chart loading fallback" },
      { id: "flow-dash-2", name: "Analytics to Reports", from: "analytics", to: "reports", trigger: "Click Reports", successOutcome: "Report table is displayed", errorOutcome: "Show no-data state" },
      { id: "flow-dash-3", name: "Reports to Settings", from: "reports", to: "settings", trigger: "Open Settings", successOutcome: "User can update preferences", errorOutcome: "Validation errors are shown" }
    );

    flowDiagrams.push({
      id: "diagram-dash-1",
      title: "Dashboard Flow",
      mermaid: "flowchart TD\n  A[Overview] --> B[Analytics]\n  B --> C[Reports]\n  C --> D[Notifications]\n  C --> E[Settings]"
    });
  } else if (isPortfolio) {
    navLinks.push(
      { label: "Home", path: "/" },
      { label: "Projects", path: "/projects" },
      { label: "Case Study", path: "/case-study" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" }
    );

    pages.push(
      makePage({
        id: "home",
        name: "Home",
        path: "/",
        title: `${brandName} | Portfolio home`,
        description: "A portfolio homepage that routes into projects, case studies, and contact.",
        purpose: "Present the creator and drive browsing into work samples.",
        entryPoints: ["social", "search", "direct"],
        exitPoints: ["projects", "about", "contact"],
        components: [baseNavbar("portfolio-nav-1", 0), baseFooter("portfolio-footer-1", 4)]
      }),
      makePage({
        id: "projects",
        name: "Projects",
        path: "/projects",
        title: `${brandName} | Projects`,
        description: "Project gallery with cards and filters.",
        purpose: "Showcase selected work.",
        entryPoints: ["home"],
        exitPoints: ["case-study", "contact"],
        components: [baseNavbar("portfolio-nav-2", 0), { id: "portfolio-grid-1", type: "card", content: "Project gallery", position: { x: 0, y: 1, w: 12, h: 3 }, styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Selected projects", content: "Cards with filters, outcomes, and CTA buttons." } }]
      }),
      makePage({
        id: "case-study",
        name: "Case Study",
        path: "/case-study",
        title: `${brandName} | Case Study`,
        description: "Detailed project write-up with outcomes and process.",
        purpose: "Explain the work process and measurable impact.",
        entryPoints: ["projects"],
        exitPoints: ["contact"],
        components: [baseNavbar("portfolio-nav-3", 0), { id: "portfolio-table-1", type: "data-table", content: "Case study timeline", position: { x: 0, y: 1, w: 12, h: 2 }, styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Process and results" } }]
      }),
      makePage({
        id: "about",
        name: "About",
        path: "/about",
        title: `${brandName} | About`,
        description: "About page with background, skills, and experience.",
        purpose: "Build trust and context around the creator.",
        entryPoints: ["home"],
        exitPoints: ["contact"],
        components: [baseNavbar("portfolio-nav-4", 0), { id: "portfolio-card-1", type: "card", content: "About narrative", position: { x: 0, y: 1, w: 12, h: 2 }, styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "About the creator", content: "A concise bio, skill summary, and credentials." } }]
      }),
      makePage({
        id: "contact",
        name: "Contact",
        path: "/contact",
        title: `${brandName} | Contact`,
        description: "Contact form and response expectations.",
        purpose: "Convert visitors into inquiries.",
        entryPoints: ["home", "about"],
        exitPoints: ["home"],
        components: [baseNavbar("portfolio-nav-5", 0), { id: "portfolio-form-1", type: "form", content: "Contact form", position: { x: 2, y: 1, w: 8, h: 3 }, styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Send a message", fields: ["Name", "Email", "Project details"], primaryAction: "Submit inquiry" } }]
      })
    );

    userFlows.push(
      { id: "flow-port-1", name: "Home to Projects", from: "home", to: "projects", trigger: "Click Projects", successOutcome: "Viewer sees work samples", errorOutcome: "Fallback to about page" },
      { id: "flow-port-2", name: "Projects to Case Study", from: "projects", to: "case-study", trigger: "Open a project", successOutcome: "Viewer reads detailed case study", errorOutcome: "Suggest contacting the creator" },
      { id: "flow-port-3", name: "About to Contact", from: "about", to: "contact", trigger: "Click Contact", successOutcome: "Inquiry form opens", errorOutcome: "Show alternate contact links" }
    );

    flowDiagrams.push({
      id: "diagram-port-1",
      title: "Portfolio Flow",
      mermaid: "flowchart TD\n  A[Home] --> B[Projects]\n  B --> C[Case Study]\n  A --> D[About]\n  D --> E[Contact]"
    });
  } else {
    navLinks.push(
      { label: "Home", path: "/" },
      { label: "Explore", path: "/explore" },
      { label: "Details", path: "/details" },
      { label: "Profile", path: "/profile" },
      { label: "Settings", path: "/settings" }
    );

    pages.push(
      makePage({
        id: "home",
        name: "Home",
        path: "/",
        title: `${brandName} | Home`,
        description: `A multi-page application for ${prompt}.`,
        purpose: "Introduce the product and route users into the main journey.",
        entryPoints: ["direct visit", "shared link"],
        exitPoints: ["explore", "details"],
        components: [
          baseNavbar("generic-nav-1", 0),
          {
            id: "generic-hero-1",
            type: "hero",
            content: "Primary hero",
            position: { x: 0, y: 1, w: 12, h: 4 },
            styles: { background: isDark ? "#111827" : "#eef2ff", padding: "72px 24px", textAlign: "center" },
            properties: { title: `A complete multi-page experience for ${brandName}`, subtitle: `Built from the requirement: ${prompt}`, ctaText: "Explore" }
          },
          baseFooter("generic-footer-1", 5)
        ]
      }),
      makePage({
        id: "explore",
        name: "Explore",
        path: "/explore",
        title: `${brandName} | Explore`,
        description: "Discovery page with cards, filters, and search state.",
        purpose: "Let users browse the available options.",
        entryPoints: ["home"],
        exitPoints: ["details", "profile"],
        components: [
          baseNavbar("generic-nav-2", 0),
          { id: "generic-card-1", type: "card", content: "Browse cards", position: { x: 0, y: 1, w: 4, h: 2 }, styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Featured item", content: "One of the available options with strong visual hierarchy." } },
          { id: "generic-card-2", type: "card", content: "Filters", position: { x: 4, y: 1, w: 4, h: 2 }, styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Filter panel", content: "Search, sort, and segment controls with active states." } },
          { id: "generic-card-3", type: "card", content: "Quick actions", position: { x: 8, y: 1, w: 4, h: 2 }, styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Actions", content: "Bookmark, compare, share, or continue." } }
        ]
      }),
      makePage({
        id: "details",
        name: "Details",
        path: "/details",
        title: `${brandName} | Details`,
        description: "Detail screen with supporting data and state handling.",
        purpose: "Show a selected item in depth and move the user toward the next action.",
        entryPoints: ["explore"],
        exitPoints: ["profile", "settings"],
        components: [
          baseNavbar("generic-nav-3", 0),
          { id: "generic-chart-1", type: "chart", content: "Detail insights", position: { x: 0, y: 1, w: 8, h: 2 }, styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Relationship overview" } },
          { id: "generic-table-1", type: "data-table", content: "Supporting details", position: { x: 0, y: 3, w: 12, h: 2 }, styles: { background: surfaceColor, borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Key data points" } }
        ]
      }),
      makePage({
        id: "profile",
        name: "Profile",
        path: "/profile",
        title: `${brandName} | Profile`,
        description: "Profile management and personalized preferences.",
        purpose: "Let the user update their account details.",
        entryPoints: ["details"],
        exitPoints: ["settings"],
        components: [
          baseNavbar("generic-nav-4", 0),
          { id: "generic-form-1", type: "form", content: "Profile form", position: { x: 2, y: 1, w: 8, h: 3 }, styles: { background: surfaceColor, padding: "28px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Profile details", fields: ["Name", "Email", "Bio"], primaryAction: "Save profile" } }
        ]
      }),
      makePage({
        id: "settings",
        name: "Settings",
        path: "/settings",
        title: `${brandName} | Settings`,
        description: "Application settings and preferences.",
        purpose: "Configure the app and close the user journey.",
        entryPoints: ["profile", "details"],
        exitPoints: ["home"],
        components: [
          baseNavbar("generic-nav-5", 0),
          { id: "generic-card-4", type: "card", content: "Settings summary", position: { x: 0, y: 1, w: 12, h: 2 }, styles: { background: surfaceColor, padding: "24px", borderRadius: "16px", border: `1px solid ${borderColor}` }, properties: { title: "Preferences", content: "Theme, notifications, privacy, and account controls." } }
        ]
      })
    );

    userFlows.push(
      { id: "flow-gen-1", name: "Home to Explore", from: "home", to: "explore", trigger: "Click Explore", successOutcome: "User enters discovery flow", errorOutcome: "Show empty state suggestions" },
      { id: "flow-gen-2", name: "Explore to Details", from: "explore", to: "details", trigger: "Open an item", successOutcome: "User sees the detail screen", errorOutcome: "No-content and retry state" },
      { id: "flow-gen-3", name: "Details to Profile", from: "details", to: "profile", trigger: "Open profile", successOutcome: "User can edit profile", errorOutcome: "Validation and help state" }
    );

    flowDiagrams.push({
      id: "diagram-gen-1",
      title: "Generic App Flow",
      mermaid: "flowchart TD\n  A[Home] --> B[Explore]\n  B --> C[Details]\n  C --> D[Profile]\n  D --> E[Settings]"
    });
  }

  const routes = pages.map((page) => ({ pageId: page.id, path: page.path, label: page.name }));

  return {
    projectType: `${industry} ${platform}`,
    theme: style,
    platform,
    meta: {
      projectName: brandName,
      projectType: `${industry} ${platform}`,
      theme: style,
      platform
    },
    sitemap: {
      summary: `A complete multi-page ${industry} ${platform} experience based on the prompt and inferred user journey.`,
      pages: pages.map((page) => ({
        id: page.id,
        name: page.name,
        path: page.path,
        purpose: page.purpose,
        entryPoints: page.entryPoints,
        exitPoints: page.exitPoints,
        requiresAuth: page.requiresAuth
      })),
      userFlows,
      flowDiagrams
    },
    tokens,
    pages,
    globalStyles: {
      fontImports: ["https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"],
      cssVariables: {
        "--color-primary": tokens.colors.primary,
        "--color-bg": tokens.colors.background,
        "--color-surface": tokens.colors.surface,
        "--color-border": tokens.colors.border,
        "--color-text": tokens.colors.text,
        "--color-text-muted": tokens.colors.textMuted
      }
    },
    navigation: {
      type: "spa",
      defaultPage: pages[0]?.id || "home",
      routes,
      footerLinks: routes.slice(Math.max(routes.length - 2, 0))
    },
    colors: tokens.colors,
    typography: tokens.typography,
    responsive: {
      desktop: { columns: 12, padding: "24px" },
      tablet: { columns: 8, padding: "16px" },
      mobile: { columns: 4, padding: "12px" }
    }
  };
}
