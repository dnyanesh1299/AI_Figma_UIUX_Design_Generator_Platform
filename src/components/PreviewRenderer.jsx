import React from "react";
import { API_BASE_URL } from "../lib/api";

/**
 * Helper to compute Tailwind Grid classes from component positions.
 * Supports Desktop (12 cols), Tablet (8 cols), and Mobile (4 cols).
 */
const getGridPositionClasses = (comp, device) => {
  const position = comp?.position || {};
  const responsivePosition = comp?.responsive?.[device]?.position;

  if (device === "mobile") {
    // Check if there is a generated mobile override
    const x = responsivePosition?.x ?? 0;
    const w = responsivePosition?.w ?? 4; // Default to full width (4 columns)
    const colStart = Math.max(1, Math.min(4, x + 1));
    const colSpan = Math.max(1, Math.min(4, w));
    return `col-span-${colSpan} col-start-${colStart}`;
  }

  if (device === "tablet") {
    // Check if there is a generated tablet override
    if (responsivePosition) {
      const x = responsivePosition.x ?? 0;
      const w = responsivePosition.w ?? 8;
      const colStart = Math.max(1, Math.min(8, x + 1));
      const colSpan = Math.max(1, Math.min(8, w));
      return `col-span-${colSpan} col-start-${colStart}`;
    }

    // Scale down from 12-column coordinate to 8-column layout (fallback)
    const w = position.w ?? 12;
    const x = position.x ?? 0;
    const tabletW = Math.max(1, Math.min(8, Math.round((w / 12) * 8)));
    const tabletX = Math.max(1, Math.min(8, Math.round((x / 12) * 8) + 1));
    return `col-span-${tabletW} col-start-${tabletX}`;
  }

  // Desktop (12-column layout)
  const x = responsivePosition?.x ?? position.x ?? 0;
  const w = responsivePosition?.w ?? position.w ?? 12;
  const colStart = Math.max(1, Math.min(12, x + 1));
  const colSpan = Math.max(1, Math.min(12, w));
  return `col-span-${colSpan} col-start-${colStart}`;
};

/**
 * Dynamically resolves column names (case-insensitive/clean) to object properties in data tables.
 */
const getRowValue = (row, colName) => {
  if (!row || !colName) return "";
  const cleanCol = colName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Direct key matches
  for (const key of Object.keys(row)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanKey === cleanCol) return row[key];
  }

  // Fallbacks for common columns like "Product" / "Item" / "User" / "Customer"
  if (["product", "item", "user", "customer", "name", "record"].includes(cleanCol)) {
    for (const fb of ["name", "title", "label", "productname", "itemname", "username", "customername"]) {
      for (const k of Object.keys(row)) {
        const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanK === fb) return row[k];
      }
    }
  }

  // Fallbacks for financial metrics like "Price" / "Amount" / "Total"
  if (["total", "amount", "price", "cost", "sum", "subtotal"].includes(cleanCol)) {
    for (const fb of ["price", "amount", "total", "cost", "sum"]) {
      for (const k of Object.keys(row)) {
        const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanK === fb) return row[k];
      }
    }
  }

  // Substring matches
  for (const key of Object.keys(row)) {
    if (key.toLowerCase().includes(cleanCol) || cleanCol.includes(key.toLowerCase())) {
      return row[key];
    }
  }

  // Fall back to first non-link, non-object property value
  const values = Object.entries(row)
    .filter(([k, v]) => k !== "link" && k !== "id" && typeof v !== "object")
    .map(([k, v]) => v);

  return values[0] || "";
};

/**
 * Generates a stable numeric seed from a string to prevent image flickering on re-renders.
 */
const getStableSeed = (str) => {
  if (!str) return 42;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 1000000;
};

/**
 * Returns a stable Pollinations AI image URL.
 * Bypasses Cloudflare Turnstile by routing through backend proxy on localhost.
 */
const getPollinationsImageUrl = (prompt, width = 600, height = 400, seed = null) => {
  const cleanPrompt = encodeURIComponent(String(prompt || "modern interface element").trim());
  const publishableKey = import.meta.env.VITE_POLLINATIONS_API_KEY;

  if (publishableKey) {
    // Direct call if publishable key is available
    let url = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&nologo=true&private=true&key=${publishableKey}`;
    if (seed !== null) {
      url += `&seed=${seed}`;
    }
    return url;
  }

  // Fallback: route through backend proxy to bypass turnstile checks on localhost
  let url = `${API_BASE_URL}/images/pollinations?prompt=${cleanPrompt}&width=${width}&height=${height}`;
  if (seed !== null) {
    url += `&seed=${seed}`;
  }
  return url;
};

// --- Component Renderers ---

const NavbarComponent = ({ comp, colors, deviceMode }) => {
  const brand = comp.properties?.brand || "AppBrand";
  const items = comp.properties?.menuItems || ["Home", "Features", "Pricing", "Contact"];
  const isDark = comp.styles?.background?.includes("#1e293b") || comp.styles?.background?.includes("#0f") || false;
  const isMobile = deviceMode === "mobile";

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || colors.background,
        color: comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937"),
        height: comp.styles?.height || "auto",
        padding: isMobile ? "0.75rem 1rem" : (comp.styles?.padding || "1rem"),
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`
      }}
      className="flex items-center justify-between rounded-lg transition-all duration-300 w-full"
    >
      <div className="flex items-center gap-3">
        <span
          style={{ background: colors.primary }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
        >
          {brand.slice(0, 1)}
        </span>
        <span className="font-bold text-base md:text-lg tracking-tight">{brand}</span>
      </div>
      
      {!isMobile ? (
        <div className="flex items-center gap-4 md:gap-6">
          {items.map((item, idx) => {
            const label = typeof item === "string" ? item : item.label || item.name || "";
            return (
              <a
                key={idx}
                href="#"
                className="text-xs md:text-sm font-medium hover:opacity-80 transition-opacity"
              >
                {label}
              </a>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        {!isMobile && (
          <button
            style={{ backgroundColor: colors.primary }}
            className="text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-white font-semibold shadow hover:brightness-110 transition-all"
          >
            Get Started
          </button>
        )}
        {isMobile && (
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <i className="fa-solid fa-bars text-base"></i>
          </button>
        )}
      </div>
    </div>
  );
};

const SidebarComponent = ({ comp, colors, deviceMode }) => {
  const items = comp.properties?.menuItems || [
    { label: "Dashboard", icon: "fa-chart-pie" },
    { label: "Transactions", icon: "fa-exchange-alt" },
    { label: "Customers", icon: "fa-users" },
    { label: "Reports", icon: "fa-file-alt" },
    { label: "Settings", icon: "fa-cog" }
  ];
  const isDark = comp.styles?.background?.includes("#1") || false;
  const isTablet = deviceMode === "tablet";
  const isMobile = deviceMode === "mobile";

  // On mobile, render sidebar as a horizontal navbar or compact row instead of a massive block
  if (isMobile) {
    return (
      <div
        style={{
          backgroundColor: comp.styles?.background || colors.background,
          color: comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937"),
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`
        }}
        className="w-full rounded-lg p-3 flex items-center justify-between gap-2 shadow-sm"
      >
        <div className="flex items-center gap-2 font-bold text-sm">
          <i className="fa-solid fa-cube text-base" style={{ color: colors.primary }}></i>
          <span>Workspace</span>
        </div>
        <div className="flex items-center gap-1">
          {items.slice(0, 3).map((item, idx) => {
            const label = typeof item === "string" ? item : item.label;
            const icon = typeof item === "string" ? "fa-circle-dot" : item.icon;
            const isActive = idx === 0;

            return (
              <a
                key={idx}
                href="#"
                title={label}
                style={{
                  backgroundColor: isActive ? `${colors.primary}15` : "transparent",
                  color: isActive ? colors.primary : "inherit"
                }}
                className="p-2 rounded-lg text-xs transition-all flex items-center justify-center"
              >
                <i className={`fa-solid ${icon} text-sm`}></i>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || colors.background,
        color: comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937"),
        padding: isTablet ? "1.5rem 0.5rem" : (comp.styles?.padding || "1.5rem"),
        borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`
      }}
      className={`h-full rounded-lg flex flex-col gap-6 ${isTablet ? "items-center w-20" : "w-64"}`}
    >
      <div className="flex items-center gap-2 font-bold text-lg mb-4 justify-center">
        <i className="fa-solid fa-cube text-xl" style={{ color: colors.primary }}></i>
        {!isTablet && <span>Workspace</span>}
      </div>
      
      <nav className="flex flex-col gap-1.5 flex-1 w-full items-center">
        {items.map((item, idx) => {
          const label = typeof item === "string" ? item : item.label;
          const icon = typeof item === "string" ? "fa-circle-dot" : item.icon;
          const isActive = idx === 0;

          return (
            <a
              key={idx}
              href="#"
              title={label}
              style={{
                backgroundColor: isActive ? `${colors.primary}15` : "transparent",
                color: isActive ? colors.primary : "inherit"
              }}
              className={`flex items-center ${isTablet ? "justify-center w-10 h-10" : "gap-3 px-3 py-2.5 w-full"} rounded-lg text-sm font-medium transition-all ${
                isActive ? "font-semibold" : "hover:bg-opacity-5 hover:bg-slate-500"
              }`}
            >
              <i className={`fa-solid ${icon} text-base w-5 text-center`}></i>
              {!isTablet && <span>{label}</span>}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-500/20 pt-4 flex items-center gap-3 justify-center w-full">
        <div className="w-9 h-9 rounded-full bg-slate-500/20 flex items-center justify-center font-bold flex-shrink-0">U</div>
        {!isTablet && (
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate">User Account</p>
            <p className="text-[10px] opacity-60 truncate">user@example.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HeroComponent = ({ comp, colors, deviceMode }) => {
  const title = comp.properties?.title || comp.content || "Empower Your Digital Experience";
  const subtitle = comp.properties?.subtitle || "We build premium design components and layouts using advanced AI generation systems.";
  const ctaText = comp.properties?.ctaText || "Get Started Today";
  const imagePrompt = comp.properties?.imagePrompt;
  
  const isMobile = deviceMode === "mobile";
  const isTablet = deviceMode === "tablet";
  const padding = isMobile ? "2.5rem 1.25rem" : isTablet ? "3.5rem 1.75rem" : (comp.styles?.padding || "4rem 2.5rem");
  const titleSize = isMobile ? "text-xl leading-snug" : isTablet ? "text-2xl leading-snug" : "text-3xl md:text-5xl leading-tight";
  const subtitleSize = isMobile ? "text-xs mb-6" : isTablet ? "text-sm mb-6" : "text-base md:text-lg mb-8";

  const renderContent = () => (
    <div className={`relative z-10 flex flex-col ${imagePrompt && !isMobile ? "text-left items-start" : "items-center text-center"} max-w-2xl`}>
      <h1 className={`${titleSize} font-extrabold tracking-tight mb-4`}>
        {title}
      </h1>
      <p className={`${subtitleSize} opacity-85 leading-relaxed`}>
        {subtitle}
      </p>
      <div className={`flex flex-row flex-wrap gap-3 w-full ${imagePrompt && !isMobile ? "justify-start" : "justify-center"}`}>
        <button
          style={{ backgroundColor: colors.primary }}
          className="px-4 py-2 md:px-6 md:py-3 rounded-lg text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs md:text-sm"
        >
          {ctaText}
        </button>
        <button
          style={{ borderColor: colors.primary, color: colors.primary }}
          className="px-4 py-2 md:px-6 md:py-3 rounded-lg bg-transparent border-2 font-bold hover:bg-slate-500/10 active:scale-95 transition-all text-xs md:text-sm"
        >
          Learn More
        </button>
      </div>
    </div>
  );

  if (imagePrompt) {
    const imageUrl = getPollinationsImageUrl(imagePrompt, 800, 600, getStableSeed(imagePrompt));
    return (
      <div
        style={{
          background: comp.styles?.background || `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}15)`,
          padding: padding,
          borderRadius: "1rem"
        }}
        className="shadow-inner relative overflow-hidden w-full flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-20" style={{ background: colors.primary }}></div>
        
        <div className={`flex ${isMobile ? "flex-col gap-6" : "flex-row items-center gap-8"} w-full z-10 relative`}>
          <div className={`${isMobile ? "w-full" : "w-1/2"}`}>
            {renderContent()}
          </div>
          <div className={`${isMobile ? "w-full" : "w-1/2"} flex justify-center`}>
            <div className="w-full max-h-[320px] rounded-lg overflow-hidden border border-slate-500/20 shadow-md hover:scale-[1.01] transition-transform duration-300">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover object-center max-h-[320px]" style={{ minHeight: "220px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: comp.styles?.background || `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}15)`,
        padding: padding,
        borderRadius: "1rem"
      }}
      className="flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden w-full"
    >
      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-20" style={{ background: colors.primary }}></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 rounded-full filter blur-3xl opacity-20" style={{ background: colors.secondary }}></div>

      {renderContent()}
    </div>
  );
};

const CardComponent = ({ comp, colors }) => {
  const title = comp.properties?.title || "Feature Title";
  const body = comp.properties?.content || comp.content || "Feature description details showing components properties.";
  const icon = comp.properties?.icon || "fa-cubes";

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  // Helper to derive gradient colors from product name
  const getProductGradientStyle = (name) => {
    const l = (name || '').toLowerCase();
    let c1 = colors.primary || '#7c3aed';
    let c2 = colors.secondary || '#a855f7';
    if (/gold|golden|luxury/.test(l)) { c1 = '#b8860b'; c2 = '#d4af37'; }
    else if (/diamond|crystal|gem/.test(l)) { c1 = '#a8d8f0'; c2 = '#6cb4e4'; }
    else if (/silver|steel|metal/.test(l)) { c1 = '#708090'; c2 = '#a9b9c0'; }
    else if (/rose|pink|blush/.test(l)) { c1 = '#c4627a'; c2 = '#e8a0b0'; }
    else if (/ruby|red|garnet/.test(l)) { c1 = '#9b1b30'; c2 = '#d9534f'; }
    else if (/emerald|green|jade/.test(l)) { c1 = '#046307'; c2 = '#3cb371'; }
    else if (/sapphire|blue|aqua/.test(l)) { c1 = '#0f3460'; c2 = '#16213e'; }
    else if (/pearl|white|ivory/.test(l)) { c1 = '#f8f8ff'; c2 = '#d3d3d3'; }
    return `linear-gradient(135deg, ${c1}20, ${c2}25)`;
  };

  let cardContent = null;

  // 1. If card contains products list or items list (e.g. Featured Products on Home)
  const productList = comp.properties?.products || comp.properties?.items;
  if (productList && Array.isArray(productList)) {
    cardContent = (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }} className="w-10 h-10 rounded-lg flex items-center justify-center">
            <i className={`fa-solid ${icon} text-lg`}></i>
          </div>
          <h3 className="font-bold text-lg leading-snug">{title}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {productList.map((p, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                border: `1px solid ${borderColorStyle}`,
                borderRadius: "8px",
                padding: "0.75rem"
              }}
              className="flex flex-col justify-between hover:scale-[1.02] transition-all"
            >
              <div
                style={{
                  height: "100px",
                  borderRadius: "6px",
                  overflow: "hidden"
                }}
                className="mb-2 flex items-center justify-center bg-slate-500/5 border border-slate-500/10"
              >
                <img
                  src={getPollinationsImageUrl(p.imagePrompt || p.name || p.title || "product thumbnail", 300, 200, getStableSeed(p.name || p.title))}
                  alt={p.name || p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-xs line-clamp-1" style={{ color: textColor }}>{p.name || p.title}</p>
                <div className="flex justify-between items-center mt-2 gap-1">
                  <span className="text-xs font-bold" style={{ color: textMutedColor }}>{p.price || ""}</span>
                  <button
                    style={{ backgroundColor: colors.primary }}
                    className="text-[10px] px-2 py-0.5 rounded text-white font-semibold shadow hover:brightness-110 active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // 2. If card contains profile / detail fields (e.g. Account Page Info)
  else if (comp.properties?.details && Array.isArray(comp.properties.details)) {
    cardContent = (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }} className="w-10 h-10 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-user text-lg"></i>
          </div>
          <h3 className="font-bold text-lg leading-snug">{title}</h3>
        </div>
        <div className="flex flex-col gap-2.5 mt-2">
          {comp.properties.details.map((d, idx) => (
            <div key={idx} style={{ borderColor: borderColorStyle }} className="flex justify-between border-b pb-2 text-xs">
              <span className="opacity-60">{d.label}</span>
              <span className="font-semibold" style={{ color: textColor }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // 3. If card represents a detail item page view (e.g. Product Info)
  else if (comp.properties?.price || comp.properties?.image || comp.properties?.imagePrompt) {
    const desc = comp.properties.description || comp.properties.content || body;
    cardContent = (
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "10px",
            overflow: "hidden"
          }}
          className="flex-shrink-0 flex items-center justify-center bg-slate-500/5 border border-slate-500/10"
        >
          <img
            src={getPollinationsImageUrl(comp.properties.imagePrompt || title || "product detail", 400, 400, getStableSeed(title))}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 w-full flex flex-col justify-center">
          <h2 className="font-bold text-xl md:text-2xl mb-2" style={{ color: textColor }}>{title}</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: textColor, opacity: 0.8 }}>{desc}</p>
          {comp.properties.price && (
            <div>
              <span className="text-2xl font-black" style={{ color: colors.primary }}>
                {comp.properties.price}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  // 4. Default feature/simple card fallback
  else {
    cardContent = (
      <>
        {comp.properties?.imagePrompt && (
          <div className="w-full h-32 rounded-lg overflow-hidden mb-2 border border-slate-500/10 bg-slate-500/5">
            <img
              src={getPollinationsImageUrl(comp.properties.imagePrompt, 400, 250, getStableSeed(comp.properties.imagePrompt))}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div
          style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
          className="w-10 h-10 rounded-lg flex items-center justify-center"
        >
          <i className={`fa-solid ${icon} text-lg`}></i>
        </div>
        <div>
          <h3 className="font-bold text-lg leading-snug mb-1">{title}</h3>
          <p className="text-sm opacity-75 leading-relaxed">{body}</p>
        </div>
        <a
          href="#"
          style={{ color: colors.secondary }}
          className="text-xs font-semibold mt-auto flex items-center gap-1.5 hover:underline"
        >
          <span>Read More</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </>
    );
  }

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || (isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff"),
        border: comp.styles?.border || `1px solid ${borderColorStyle}`,
        borderRadius: comp.styles?.borderRadius || "12px",
        padding: comp.styles?.padding || "1.5rem",
        color: textColor
      }}
      className="flex flex-col gap-4 shadow hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {cardContent}
    </div>
  );
};

const MetricCardComponent = ({ comp, colors }) => {
  const label = comp.properties?.title || "Active Users";
  const value = comp.properties?.content || comp.properties?.value || "$45,231";
  const change = comp.properties?.change || "+12.4%";
  const isNegative = change.includes("-");

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || (isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff"),
        border: comp.styles?.border || `1px solid ${borderColorStyle}`,
        padding: comp.styles?.padding || "1.25rem",
        borderRadius: "12px",
        color: textColor
      }}
      className="flex flex-col gap-2 shadow"
    >
      <div className="flex items-center justify-between text-xs font-medium" style={{ color: textMutedColor }}>
        <span>{label}</span>
        <i className="fa-solid fa-ellipsis-v"></i>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-bold tracking-tight" style={{ color: textColor }}>{value}</span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isNegative ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"
          }`}
        >
          {change}
        </span>
      </div>
      <div className="w-full h-8 flex items-end gap-1 mt-2">
        {/* Render a tiny sparkline layout using bars */}
        {[30, 45, 35, 60, 40, 75, 50, 90, 70].map((val, idx) => (
          <div
            key={idx}
            style={{
              height: `${val}%`,
              backgroundColor: isNegative ? colors.secondary : colors.primary
            }}
            className="flex-1 rounded-t opacity-40 hover:opacity-100 transition-opacity"
          ></div>
        ))}
      </div>
    </div>
  );
};

const ChartComponent = ({ comp, colors, deviceMode }) => {
  const title = comp.properties?.title || "Monthly Analytics";
  const isMobile = deviceMode === "mobile";
  
  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  // Render fewer data bars on mobile to prevent squishing layout
  const rawData = [60, 80, 45, 90, 70, 100, 55, 75, 90, 65, 80, 95];
  const chartData = isMobile ? rawData.slice(6) : rawData; 
  const gapClass = isMobile ? "gap-1.5" : "gap-3";

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || (isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff"),
        border: comp.styles?.border || `1px solid ${borderColorStyle}`,
        padding: isMobile ? "1rem" : "1.5rem",
        borderRadius: "12px",
        color: textColor
      }}
      className="flex flex-col gap-4 shadow h-full w-full"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm" style={{ color: textColor }}>{title}</h3>
        <select
          style={{ borderColor: borderColorStyle, color: textMutedColor, backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "#ffffff" }}
          className="border text-xs px-1.5 py-0.5 rounded focus:outline-none"
        >
          <option value="7" style={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", color: textColor }}>Last 7d</option>
          <option value="30" style={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", color: textColor }}>Last 30d</option>
        </select>
      </div>

      <div style={{ borderColor: borderColorStyle }} className={`flex-1 min-h-[150px] flex items-end ${gapClass} pt-6 border-b px-1 pb-1`}>
        {chartData.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div
              style={{
                height: `${val}%`,
                background: `linear-gradient(to top, ${colors.primary}, ${colors.secondary}dd)`
              }}
              className="w-full rounded-t-md hover:brightness-110 transition-all cursor-pointer relative group"
            >
              <div
                style={{ backgroundColor: isDark ? "#1e293b" : "#f1f5f9", color: textColor, border: `1px solid ${borderColorStyle}` }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none"
              >
                {val}%
              </div>
            </div>
            <span className="text-[9px] font-medium" style={{ color: textMutedColor, opacity: 0.7 }}>
              {isMobile ? `P${idx + 1}` : `M${idx + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableComponent = ({ comp, colors }) => {
  const title = comp.properties?.title || "Recent Records";
  const columns = comp.properties?.columns || ["User", "Status", "Amount"];
  const rows = comp.properties?.data || [
    { id: "1024", name: "Sarah Jenkins", email: "sarah.j@example.com", status: "Completed", amount: "$350.00" },
    { id: "1025", name: "David Vance", email: "d.vance@example.com", status: "Pending", amount: "$89.50" },
    { id: "1026", name: "Elena Rostova", email: "elena.r@example.com", status: "Completed", amount: "$1,240.00" },
    { id: "1027", name: "Marcus Brody", email: "marcus.b@example.com", status: "Failed", amount: "$45.00" }
  ];

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || (isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff"),
        border: `1px solid ${borderColorStyle}`,
        borderRadius: "12px",
        padding: "1.5rem",
        color: textColor
      }}
      className="shadow overflow-hidden w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm" style={{ color: textColor }}>{title}</h3>
        <button className="text-xs hover:underline" style={{ color: colors.secondary || colors.primary }}>View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderColorStyle}` }} className="text-xs opacity-60">
              {columns.map((col, idx) => (
                <th key={idx} className={`pb-3 font-semibold ${idx === columns.length - 1 ? "text-right" : ""}`} style={{ color: textColor }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ color: textColor }} className="text-xs">
            {rows.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} style={{ borderBottom: rowIdx < rows.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` : "none" }} className="hover:bg-white/5 transition-colors">
                {columns.map((col, colIdx) => {
                  const val = getRowValue(row, col);
                  const isRightAlign = colIdx === columns.length - 1;
                  const isFirst = colIdx === 0;
                  const cleanCol = col.toLowerCase();

                  if (cleanCol.includes("status")) {
                    const statusClass = val === "Completed" || val === "Success" || val === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : val === "Pending" || val === "Processing"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-red-500/10 text-red-400";
                    return (
                      <td key={colIdx} className="py-3.5 pr-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass}`}>
                          {val}
                        </span>
                      </td>
                    );
                  }

                  if (cleanCol.includes("action")) {
                    return (
                      <td key={colIdx} className={`py-3.5 ${isRightAlign ? "text-right" : "pr-2"}`}>
                        <button
                          style={{ backgroundColor: colors.primary }}
                          className="text-[10px] px-2.5 py-1 rounded text-white font-semibold shadow hover:brightness-110 active:scale-95 transition-all"
                        >
                          {val}
                        </button>
                      </td>
                    );
                  }

                  if (cleanCol.includes("user") && row.email) {
                    return (
                      <td key={colIdx} className="py-3.5 pr-2">
                        <p className="font-semibold" style={{ color: textColor }}>{val}</p>
                        <p className="text-[10px]" style={{ color: textMutedColor }}>{row.email}</p>
                      </td>
                    );
                  }

                  return (
                    <td 
                      key={colIdx} 
                      className={`py-3.5 ${isRightAlign ? "text-right font-bold" : "pr-2"} ${isFirst ? "font-semibold" : ""}`}
                      style={{ color: isFirst ? colors.primary : "inherit" }}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FormComponent = ({ comp, colors }) => {
  const title = comp.properties?.title || "Get in Touch";
  const fields = comp.properties?.fields || [
    { label: "Name", type: "text", placeholder: "John Doe" },
    { label: "Email Address", type: "email", placeholder: "john@example.com" },
    { label: "Message", type: "textarea", placeholder: "How can we help?" }
  ];

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const inputBg = isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.6)";

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || (isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff"),
        border: comp.styles?.border || `1px solid ${borderColorStyle}`,
        borderRadius: "12px",
        padding: "1.5rem",
        color: textColor
      }}
      className="shadow w-full"
    >
      <h3 className="font-bold text-lg mb-4" style={{ color: textColor }}>{title}</h3>
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
        {fields.map((field, idx) => {
          const label = typeof field === "string" ? field : field.label || "";
          const type = typeof field === "string" ? "text" : field.type || "text";
          const placeholder = typeof field === "string" ? `Enter ${field}` : field.placeholder || "";
          const options = field.options || [];

          if (type === "select") {
            return (
              <div key={idx}>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: textMutedColor }}>{label}</label>
                <select
                  style={{ backgroundColor: inputBg, borderColor: borderColorStyle, color: textColor }}
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {options.map((opt, oIdx) => (
                    <option key={oIdx} value={opt} style={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", color: textColor }}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (type === "textarea") {
            return (
              <div key={idx}>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: textMutedColor }}>{label}</label>
                <textarea
                  placeholder={placeholder}
                  rows={3}
                  style={{ backgroundColor: inputBg, borderColor: borderColorStyle, color: textColor }}
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            );
          }

          return (
            <div key={idx}>
              <label className="text-xs mb-1.5 block font-medium" style={{ color: textMutedColor }}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                style={{ backgroundColor: inputBg, borderColor: borderColorStyle, color: textColor }}
                className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          );
        })}
        <button
          type="submit"
          style={{ backgroundColor: colors.primary }}
          className="w-full text-xs font-semibold py-2.5 rounded-lg text-white mt-2 shadow hover:brightness-110 active:scale-95 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const ButtonComponent = ({ comp, colors }) => {
  const label = comp.properties?.label || comp.content || "Action Button";
  const variant = comp.properties?.variant || "primary";

  return (
    <div className="flex justify-center p-2">
      <button
        style={{
          backgroundColor: variant === "primary" ? colors.primary : "transparent",
          borderColor: colors.primary,
          color: variant === "primary" ? "#ffffff" : colors.primary
        }}
        className={`px-5 py-2.5 rounded-lg text-xs font-semibold shadow border-2 hover:brightness-110 active:scale-95 transition-all`}
      >
        {label}
      </button>
    </div>
  );
};

const FooterComponent = ({ comp, colors, deviceMode }) => {
  const text = comp.properties?.brand || "AppBrand";
  const copyright = `© ${new Date().getFullYear()} ${text}. All rights reserved.`;
  const isMobile = deviceMode === "mobile";

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div
      style={{
        backgroundColor: comp.styles?.background || (isDark ? "rgba(255, 255, 255, 0.02)" : "#ffffff"),
        borderTop: `1px solid ${borderColorStyle}`,
        padding: comp.styles?.padding || "2rem 1.5rem",
        color: textColor
      }}
      className={`rounded-lg text-center flex ${
        isMobile ? "flex-col gap-3" : "flex-row justify-between"
      } items-center gap-4 text-xs font-medium mt-6 w-full`}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold" style={{ color: colors.primary }}>{text}</span>
      </div>
      <div style={{ color: textMutedColor }}>{copyright}</div>
      <div className="flex gap-4">
        <a href="#" style={{ color: textMutedColor }} className="hover:underline">Privacy</a>
        <a href="#" style={{ color: textMutedColor }} className="hover:underline">Terms</a>
      </div>
    </div>
  );
};

// ─── Extended Component Types ───
const ProductCardComponent = ({ comp, colors }) => {
  const name = comp.properties?.title || "Wireless Noise-Cancelling Headphones";
  const price = comp.properties?.price || "$129.99";
  const badge = comp.properties?.badge || "New";

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div style={{ background: comp.styles?.background || (isDark ? "rgba(255,255,255,0.03)" : "#ffffff"), border: `1px solid ${borderColorStyle}`, borderRadius: "12px", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", color: textColor }}
      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <img
          src={getPollinationsImageUrl(comp.properties?.imagePrompt || name || "product item", 400, 240, getStableSeed(name))}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {badge && <span style={{ position: "absolute", top: "8px", right: "8px", background: colors.primary, color: "white", fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "999px" }}>{badge}</span>}
      </div>
      <div style={{ padding: "12px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: textColor }}>{name}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "800", color: colors.primary }}>{price}</span>
          <button style={{ background: colors.primary, border: "none", color: "white", borderRadius: "6px", padding: "4px 10px", fontSize: "10px", fontWeight: "600", cursor: "pointer" }}>Add</button>
        </div>
      </div>
    </div>
  );
};

const ImageComponent = ({ comp, colors }) => {
  const prompt = comp.properties?.imagePrompt || comp.properties?.title || comp.properties?.content || "modern UI illustration";
  const aspectRatio = comp.properties?.aspectRatio || "16:9";
  
  let paddingBottom = "56.25%"; // default 16:9
  if (aspectRatio === "1:1") paddingBottom = "100%";
  else if (aspectRatio === "4:3") paddingBottom = "75%";
  else if (aspectRatio === "21:9") paddingBottom = "42.85%";
  else if (aspectRatio === "3:2") paddingBottom = "66.67%";

  const seed = getStableSeed(prompt);
  const imageUrl = getPollinationsImageUrl(prompt, 800, 450, seed);

  return (
    <div 
      style={{ 
        border: comp.styles?.border || `1px solid ${colors.border || "rgba(255,255,255,0.08)"}`,
        borderRadius: comp.styles?.borderRadius || "12px",
        overflow: "hidden",
        position: "relative",
        width: "100%",
        paddingBottom: paddingBottom,
        backgroundColor: "rgba(255,255,255,0.02)"
      }}
      className="shadow hover:scale-[1.005] transition-transform duration-300"
    >
      <img 
        src={imageUrl} 
        alt={prompt} 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center"
        }}
      />
    </div>
  );
};

const TestimonialComponent = ({ comp, colors }) => {
  const quote = comp.properties?.content || "This platform transformed our design workflow. We ship 3x faster now.";
  const author = comp.properties?.author || "Sarah Chen";
  const role = comp.properties?.role || "Product Designer @ Stripe";

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div style={{ background: comp.styles?.background || (isDark ? "rgba(255,255,255,0.03)" : "#ffffff"), border: `1px solid ${borderColorStyle}`, borderRadius: "12px", padding: "1.5rem", color: textColor }}>
      <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
        {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star" style={{ color: "#f59e0b", fontSize: "11px" }} />)}
      </div>
      <p style={{ fontSize: "13px", lineHeight: "1.7", opacity: 0.85, marginBottom: "16px", color: textColor }}>"{quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "white", flexShrink: 0 }}>
          {author.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <p style={{ fontSize: "12px", fontWeight: "600", margin: 0, color: textColor }}>{author}</p>
          <p style={{ fontSize: "11px", color: textMutedColor, margin: 0 }}>{role}</p>
        </div>
      </div>
    </div>
  );
};

const PricingCardComponent = ({ comp, colors }) => {
  const plan = comp.properties?.title || "Pro";
  const price = comp.properties?.price || "$49";
  const period = comp.properties?.period || "/month";
  const features = comp.properties?.features || ["Unlimited generations", "Figma API export", "Priority support", "Custom design tokens"];
  const highlighted = comp.properties?.highlighted || false;

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div style={{ background: highlighted ? `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)` : (comp.styles?.background || (isDark ? "rgba(255,255,255,0.03)" : "#ffffff")), border: `1px solid ${highlighted ? colors.primary + "50" : borderColorStyle}`, borderRadius: "14px", padding: "1.5rem", position: "relative", overflow: "hidden", color: textColor }}>
      {highlighted && <div style={{ position: "absolute", top: "12px", right: "12px", background: colors.primary, color: "white", fontSize: "9px", fontWeight: "700", padding: "3px 8px", borderRadius: "999px" }}>Popular</div>}
      <p style={{ fontSize: "13px", fontWeight: "700", color: textMutedColor, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{plan}</p>
      <div style={{ marginBottom: "16px" }}><span style={{ fontSize: "32px", fontWeight: "900", color: textColor }}>{price}</span><span style={{ fontSize: "13px", color: textMutedColor }}>{period}</span></div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px", padding: 0 }}>
        {(Array.isArray(features) ? features : [features]).map((f, i) => (
          <li key={i} style={{ fontSize: "12px", display: "flex", gap: "6px", alignItems: "center", color: textColor }}>
            <i className="fa-solid fa-check" style={{ color: colors.primary, fontSize: "10px", flexShrink: 0 }} />{f}
          </li>
        ))}
      </ul>
      <button style={{ width: "100%", padding: "9px", borderRadius: "8px", border: `1px solid ${colors.primary}`, cursor: "pointer", background: highlighted ? colors.primary : "transparent", color: highlighted ? "white" : colors.primary, fontSize: "12px", fontWeight: "600", fontFamily: "inherit" }}>
        Get Started
      </button>
    </div>
  );
};

const BannerComponent = ({ comp, colors }) => {
  const title = comp.properties?.title || "🎉 Limited Time Offer";
  const subtitle = comp.properties?.subtitle || "Get 3 months free on any Pro plan. Ends Friday.";

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div style={{ background: comp.styles?.background || `linear-gradient(135deg, ${colors.primary}20, ${(colors.accent || colors.secondary)}15)`, border: `1px solid ${colors.primary}30`, borderRadius: "10px", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", color: textColor }}>
      <div><p style={{ fontSize: "13px", fontWeight: "700", marginBottom: "2px", color: textColor }}>{title}</p><p style={{ fontSize: "12px", color: textMutedColor, margin: 0 }}>{subtitle}</p></div>
      <button style={{ background: colors.primary, border: "none", color: "white", borderRadius: "8px", padding: "7px 16px", fontSize: "12px", fontWeight: "600", cursor: "pointer", flexShrink: 0, fontFamily: "inherit" }}>Claim Now</button>
    </div>
  );
};

const ListComponent = ({ comp, colors }) => {
  const title = comp.properties?.title || "Quick Links";
  const items = comp.properties?.items || ["Dashboard Overview", "Recent Projects", "Account Settings", "API Documentation", "Support Center"];

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div style={{ background: comp.styles?.background || (isDark ? "rgba(255,255,255,0.03)" : "#ffffff"), border: `1px solid ${borderColorStyle}`, borderRadius: "12px", padding: "1.25rem", color: textColor }}>
      <h3 style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: textMutedColor }}>{title}</h3>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0", padding: 0, margin: 0 }}>
        {(Array.isArray(items) ? items : [items]).map((item, i) => {
          const label = typeof item === "string" ? item : item.label || item.name || item.title || "";
          return (
            <li key={i} style={{ borderBottom: `1px solid ${borderColorStyle}`, padding: "8px 0", fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", color: textColor }}>
              <span>{label}</span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: "9px", color: textMutedColor, opacity: 0.6 }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const StatsBarComponent = ({ comp, colors }) => {
  const stats = comp.properties?.stats || [
    { label: "Revenue", value: "$248K", change: "+14%" },
    { label: "Users", value: "12.8K", change: "+8.7%" },
    { label: "Conversion", value: "3.2%", change: "+1.1%" },
    { label: "Churn", value: "1.8%", change: "-0.3%" }
  ];

  const compBg = comp.styles?.background || colors.background || "";
  const isDark = compBg.includes("#0") || compBg.includes("#1") || compBg.includes("#2") || compBg.includes("rgba(0") || compBg.includes("rgba(255, 255, 255, 0.0") || colors.text === "#f8fafc";
  const textColor = comp.styles?.color || (isDark ? "#f8fafc" : "#1f2937");
  const textMutedColor = isDark ? "#94a3b8" : "#4b5563";
  const borderColorStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  return (
    <div style={{ display: "flex", gap: "0", border: `1px solid ${borderColorStyle}`, borderRadius: "12px", overflow: "hidden", color: textColor }}>
      {(Array.isArray(stats) ? stats : []).map((s, i) => (
        <div key={i} style={{ flex: 1, padding: "1rem", textAlign: "center", borderRight: i < stats.length - 1 ? `1px solid ${borderColorStyle}` : "none", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
          <p style={{ fontSize: "11px", color: textMutedColor, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
          <p style={{ fontSize: "18px", fontWeight: "800", marginBottom: "2px", color: textColor }}>{s.value}</p>
          <span style={{ fontSize: "10px", fontWeight: "600", color: String(s.change || "").includes("-") ? "#f87171" : "#34d399" }}>{s.change}</span>
        </div>
      ))}
    </div>
  );
};

// Component Router
const renderComponent = (comp, colors, deviceMode) => {
  switch (comp.type) {
    case "navbar":
      return <NavbarComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "sidebar":
      return <SidebarComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "hero":
      return <HeroComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "card":
      return <CardComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "metric-card":
      return <MetricCardComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "chart":
      return <ChartComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "table":
    case "data-table":
      return <TableComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "form":
      return <FormComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "button":
      return <ButtonComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "footer":
      return <FooterComponent comp={comp} colors={colors} deviceMode={deviceMode} />;
    case "product-card":
      return <ProductCardComponent comp={comp} colors={colors} />;
    case "testimonial":
      return <TestimonialComponent comp={comp} colors={colors} />;
    case "pricing-card":
      return <PricingCardComponent comp={comp} colors={colors} />;
    case "banner":
      return <BannerComponent comp={comp} colors={colors} />;
    case "list":
      return <ListComponent comp={comp} colors={colors} />;
    case "stats-bar":
      return <StatsBarComponent comp={comp} colors={colors} />;
    case "image":
      return <ImageComponent comp={comp} colors={colors} />;
    default:
      return (
        <div style={{ padding: "14px", background: "rgba(30,41,59,0.4)", border: "1px solid rgba(71,85,105,0.4)", borderRadius: "10px", textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", margin: 0 }}>{comp.type}</p>
          {comp.label && <p style={{ fontSize: "10px", opacity: 0.6, margin: "4px 0 0" }}>{comp.label}</p>}
        </div>
      );
  }
};

/**
 * Main Live Preview Canvas Renderer
 * @param {object} schema - Full design schema
 * @param {string} deviceMode - 'desktop' | 'tablet' | 'mobile'
 * @param {number} [pageIndex=0] - Which page in schema.pages[] to render
 */
export default function PreviewRenderer({ schema, deviceMode, pageIndex = 0 }) {
  const pages = Array.isArray(schema?.pages) ? schema.pages : [];

  if (!schema || pages.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", color: "#94a3b8", textAlign: "center", minHeight: "280px", gap: "8px" }}>
        <i className="fa-solid fa-shapes" style={{ fontSize: "32px", opacity: 0.4 }}></i>
        <p style={{ fontWeight: "600", color: "#cbd5e1", margin: 0 }}>Invalid or empty design schema</p>
        <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>Generate a new design to see layout preview.</p>
      </div>
    );
  }

  const page = pages[Math.min(pageIndex, pages.length - 1)] || pages[0];
  const schemaColors = schema.colors || schema.tokens?.colors || {};
  const isBackgroundDark = schemaColors.background?.includes("#0") || schemaColors.background?.includes("#1") || schemaColors.background?.includes("#2") || false;
  const colors = {
    primary: "#7c3aed",
    secondary: "#a855f7",
    background: isBackgroundDark ? "#0f172a" : "#fafafa",
    accent: "#06b6d4",
    text: isBackgroundDark ? "#f8fafc" : "#111827",
    textMuted: isBackgroundDark ? "#94a3b8" : "#4b5563",
    ...schemaColors
  };
  const typography = schema.typography || schema.tokens?.typography || { headingFont: "Outfit", bodyFont: "Inter" };
  const fontFamily = typography.bodyFont || "Inter";

  const components = Array.isArray(page.components) ? page.components : [];
  const sidebarComp = components.find((c) => c && c.type === "sidebar");
  const otherComps = components.filter((c) => c && c.type !== "sidebar");

  const isTablet = deviceMode === "tablet";
  const isMobile = deviceMode === "mobile";
  const cols = isMobile ? 4 : isTablet ? 8 : 12;

  return (
    <div style={{ fontFamily: `'${fontFamily}', Inter, sans-serif`, color: colors.text || "#f8fafc", width: "100%", minWidth: 0, overflowX: "hidden" }}>
      <div style={{ display: "flex", gap: "12px", minWidth: 0, width: "100%" }}>
        {/* Sidebar */}
        {sidebarComp && !isMobile && (
          <div style={{ width: isTablet ? "64px" : "200px", flexShrink: 0, minWidth: 0 }}>
            {renderComponent(sidebarComp, colors, deviceMode)}
          </div>
        )}

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", minWidth: 0, maxWidth: "100%" }}>
          {sidebarComp && isMobile && (
            <div>{renderComponent(sidebarComp, colors, deviceMode)}</div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: "12px", alignContent: "start", minWidth: 0, maxWidth: "100%" }}>
            {otherComps.map((comp) => {
              const pos = comp?.responsive?.[deviceMode]?.position || comp?.position || {};
              const x = pos.x ?? 0;
              const w = pos.w ?? cols;
              const colStart = Math.max(1, Math.min(cols, x + 1));
              const colSpan = Math.max(1, Math.min(cols - colStart + 1, w));
              return (
                <div
                  key={comp.id || Math.random()}
                  style={{ gridColumn: `${colStart} / span ${colSpan}`, display: "flex", flexDirection: "column", minWidth: 0, maxWidth: "100%" }}
                >
                  {renderComponent(comp, colors, deviceMode)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
