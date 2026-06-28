/**
 * svgExport.js
 * Generates vector SVGs from the design schema to enable instant Copy-and-Paste import into Figma.
 */

// Pollinations AI Image helpers
function getStableSeed(str) {
  if (!str) return 42;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 1000000;
}

function getPollinationsImageUrl(prompt, width = 600, height = 400, seed = null) {
  const cleanPrompt = encodeURIComponent(String(prompt || "mockup").trim());
  const publishableKey = import.meta.env.VITE_POLLINATIONS_API_KEY;
  let url = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&nologo=true&private=true`;
  if (publishableKey) {
    url += `&key=${publishableKey}`;
  }
  if (seed !== null) {
    url += `&seed=${seed}`;
  }
  return url;
}

// XML Escaping
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getEstimatedHeight(type, deviceMode) {
  const isMobile = deviceMode === "mobile";
  const isTablet = deviceMode === "tablet";
  switch (type) {
    case "navbar":
      return isMobile ? 56 : 72;
    case "sidebar":
      return isMobile ? 64 : 800;
    case "hero":
      return isMobile ? 240 : isTablet ? 280 : 340;
    case "card":
      return 180;
    case "metric-card":
      return 130;
    case "chart":
      return 260;
    case "table":
    case "data-table":
      return 300;
    case "form":
      return 280;
    case "button":
      return 60;
    case "footer":
      return isMobile ? 120 : 80;
    case "product-card":
      return 200;
    case "testimonial":
      return 160;
    case "pricing-card":
      return 250;
    case "banner":
      return isMobile ? 110 : 80;
    case "list":
      return 200;
    case "stats-bar":
      return isMobile ? 180 : 100;
    case "image":
      return isMobile ? 180 : 260;
    default:
      return 120;
  }
}

/**
 * Calculates the exact X, Y, Width, and Height coordinates for each component
 * on the canvas, matching the CSS Grid rendering in the React app.
 */
export function layoutPageComponents(page, schema, deviceMode) {
  const cols = deviceMode === "mobile" ? 4 : deviceMode === "tablet" ? 8 : 12;
  const layoutWidth = deviceMode === "mobile" ? 375 : deviceMode === "tablet" ? 768 : 1440;
  const padding = deviceMode === "desktop" ? 24 : 16;
  const gap = deviceMode === "mobile" ? 12 : 16;

  const sidebarComp = page.components?.find((c) => c.type === "sidebar");
  const otherComps = page.components?.filter((c) => c.type !== "sidebar") || [];

  let sidebarWidth = 0;
  let mainX = padding;
  let mainWidth = layoutWidth - 2 * padding;

  if (sidebarComp && deviceMode !== "mobile") {
    sidebarWidth = deviceMode === "tablet" ? 64 : 200;
    mainX = padding + sidebarWidth + 12;
    mainWidth = layoutWidth - 2 * padding - sidebarWidth - 12;
  }

  const colWidth = (mainWidth - (cols - 1) * gap) / cols;
  const colHeights = Array(cols).fill(padding);
  const placedComps = [];

  let compsToLayout = [...otherComps];
  if (sidebarComp && deviceMode === "mobile") {
    // Treat sidebar as first component on mobile (spans full 4 columns)
    compsToLayout.unshift({
      ...sidebarComp,
      position: { x: 0, w: 4, h: 1 }
    });
  }

  compsToLayout.forEach((comp) => {
    const pos = comp?.responsive?.[deviceMode]?.position || comp?.position || {};
    const colStart = Math.max(1, Math.min(cols, (pos.x ?? 0) + 1));
    const colSpan = Math.max(1, Math.min(cols - colStart + 1, pos.w ?? cols));

    // Find the max Y height across columns that this component will cover
    let startY = 0;
    for (let c = colStart - 1; c < colStart - 1 + colSpan; c++) {
      if (colHeights[c] > startY) {
        startY = colHeights[c];
      }
    }

    if (startY > padding) {
      startY += gap;
    }

    const compHeight = getEstimatedHeight(comp.type, deviceMode);
    const itemX = mainX + (colStart - 1) * (colWidth + gap);
    const itemY = startY;
    const itemW = colSpan * colWidth + (colSpan - 1) * gap;
    const itemH = compHeight;

    const newHeight = startY + compHeight;
    for (let c = colStart - 1; c < colStart - 1 + colSpan; c++) {
      colHeights[c] = newHeight;
    }

    placedComps.push({ comp, x: itemX, y: itemY, w: itemW, h: itemH });
  });

  const maxColHeight = Math.max(...colHeights);
  let totalHeight = maxColHeight + padding;

  let sidebarItem = null;
  if (sidebarComp && deviceMode !== "mobile") {
    sidebarItem = {
      comp: sidebarComp,
      x: padding,
      y: padding,
      w: sidebarWidth,
      h: maxColHeight - padding
    };
  }

  return {
    layoutWidth,
    totalHeight,
    placedComps,
    sidebarItem
  };
}

/**
 * Builds SVG group representation for a specific component
 */
function renderComponentToSVG(placed, colors, deviceMode) {
  const { comp, x, y, w, h } = placed;
  const isDark = colors.background?.includes("#0") || colors.background?.includes("#1") || true;
  const cardBg = comp.styles?.background || colors.surface || "#1e293b";
  const textColor = comp.styles?.color || colors.text || "#f8fafc";
  const borderCol = colors.border || "#334155";
  const primary = colors.primary || "#7c3aed";
  const secondary = colors.secondary || "#a855f7";
  const accent = colors.accent || "#06b6d4";
  const textMuted = colors.textMuted || "#94a3b8";

  let svg = `<g id="${esc(comp.id || comp.type)}" transform="translate(${x}, ${y})">`;

  switch (comp.type) {
    case "navbar": {
      const brand = comp.properties?.brand || "AppBrand";
      const items = comp.properties?.menuItems || ["Home", "Features", "Pricing", "Contact"];
      
      // Background
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" stroke="${borderCol}" stroke-opacity="0.5" rx="12" />`;
      // Brand logo
      svg += `<rect x="16" y="${(h - 32) / 2}" width="32" height="32" fill="${primary}" rx="8" />`;
      svg += `<text x="32" y="${(h - 32) / 2 + 20}" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle" class="heading">${esc(brand.slice(0, 1))}</text>`;
      // Brand Name
      svg += `<text x="56" y="${h / 2 + 5}" fill="${textColor}" font-size="16" font-weight="700" class="heading">${esc(brand)}</text>`;
      
      // Menu Items (if not mobile)
      if (deviceMode !== "mobile") {
        let itemX = 160;
        items.slice(0, 4).forEach((item) => {
          svg += `<text x="${itemX}" y="${h / 2 + 4}" fill="${textColor}" font-size="13" font-weight="500" opacity="0.8">${esc(item)}</text>`;
          itemX += item.length * 8 + 32;
        });
        
        // CTA Button
        const btnX = w - 120 - 16;
        svg += `<rect x="${btnX}" y="${(h - 36) / 2}" width="120" height="36" fill="${primary}" rx="8" />`;
        svg += `<text x="${btnX + 60}" y="${h / 2 + 4}" fill="#ffffff" font-size="12" font-weight="600" text-anchor="middle">Get Started</text>`;
      } else {
        // Mobile Hamburger icon
        svg += `<g opacity="0.7" transform="translate(${w - 36}, ${(h - 20) / 2})">`;
        svg += `<line x1="0" y1="2" x2="20" y2="2" stroke="${textColor}" stroke-width="2" stroke-linecap="round" />`;
        svg += `<line x1="0" y1="8" x2="20" y2="8" stroke="${textColor}" stroke-width="2" stroke-linecap="round" />`;
        svg += `<line x1="0" y1="14" x2="20" y2="14" stroke="${textColor}" stroke-width="2" stroke-linecap="round" />`;
        svg += `</g>`;
      }
      break;
    }

    case "sidebar": {
      const items = comp.properties?.menuItems || [
        { label: "Dashboard", icon: "fa-chart-pie" },
        { label: "Transactions", icon: "fa-exchange-alt" },
        { label: "Customers", icon: "fa-users" },
        { label: "Reports", icon: "fa-file-alt" },
        { label: "Settings", icon: "fa-cog" }
      ];
      
      // Background
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" stroke="${borderCol}" stroke-opacity="0.5" rx="12" />`;
      
      if (deviceMode === "mobile") {
        // Horizontal Sidebar on mobile
        svg += `<text x="16" y="36" fill="${textColor}" font-size="13" font-weight="700" class="heading">Workspace</text>`;
        let itemX = w - 160;
        items.slice(0, 3).forEach((item, idx) => {
          const label = typeof item === "string" ? item : item.label;
          const isActive = idx === 0;
          if (isActive) {
            svg += `<rect x="${itemX - 4}" y="18" width="40" height="28" fill="${primary}" fill-opacity="0.15" rx="6" />`;
          }
          svg += `<text x="${itemX + 16}" y="36" fill="${isActive ? primary : textColor}" fill-opacity="${isActive ? 1 : 0.6}" font-size="11" font-weight="600" text-anchor="middle">${esc(label.slice(0, 2))}</text>`;
          itemX += 44;
        });
      } else {
        // Vertical Sidebar on Tablet/Desktop
        const isTablet = deviceMode === "tablet";
        
        // Brand logo
        svg += `<rect x="${(w - 32) / 2}" y="20" width="32" height="32" fill="${primary}" rx="8" />`;
        svg += `<text x="${(w - 32) / 2 + 16}" y="41" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle" class="heading">W</text>`;
        
        if (!isTablet) {
          svg += `<text x="64" y="41" fill="${textColor}" font-size="16" font-weight="700" class="heading">Workspace</text>`;
        }
        
        let itemY = 80;
        items.forEach((item, idx) => {
          const label = typeof item === "string" ? item : item.label;
          const isActive = idx === 0;
          
          if (isActive) {
            svg += `<rect x="12" y="${itemY}" width="${w - 24}" height="38" fill="${primary}" fill-opacity="0.15" rx="8" />`;
          }
          
          if (isTablet) {
            // Just initials or dot
            svg += `<text x="${w / 2}" y="${itemY + 23}" fill="${isActive ? primary : textColor}" fill-opacity="${isActive ? 1 : 0.7}" font-size="12" font-weight="700" text-anchor="middle">${esc(label.slice(0, 1))}</text>`;
          } else {
            // Icon spacer + Text label
            svg += `<rect x="22" y="${itemY + 13}" width="12" height="12" rx="3" fill="${isActive ? primary : textColor}" fill-opacity="${isActive ? 0.9 : 0.5}" />`;
            svg += `<text x="44" y="${itemY + 23}" fill="${isActive ? primary : textColor}" fill-opacity="${isActive ? 1 : 0.7}" font-size="13" font-weight="600">${esc(label)}</text>`;
          }
          itemY += 46;
        });

        // User footer
        const footerY = h - 60;
        svg += `<line x1="12" y1="${footerY - 10}" x2="${w - 12}" y2="${footerY - 10}" stroke="${borderCol}" stroke-opacity="0.3" />`;
        svg += `<circle cx="${isTablet ? w / 2 : 28}" cy="${footerY + 16}" r="14" fill="${secondary}" />`;
        svg += `<text x="${isTablet ? w / 2 : 28}" y="${footerY + 20}" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">U</text>`;
        if (!isTablet) {
          svg += `<text x="50" y="${footerY + 15}" fill="${textColor}" font-size="12" font-weight="600">User Account</text>`;
          svg += `<text x="50" y="${footerY + 27}" fill="${textMuted}" font-size="10">user@example.com</text>`;
        }
      }
      break;
    }

    case "hero": {
      const title = comp.properties?.title || "Empower Your Digital Experience";
      const subtitle = comp.properties?.subtitle || "We build premium design components and layouts using advanced AI generation systems.";
      const ctaText = comp.properties?.ctaText || "Get Started Today";
      const imagePrompt = comp.properties?.imagePrompt;
      const isMobile = deviceMode === "mobile";
      
      // Backdrop / background
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="16" />`;
      svg += `<circle cx="${w - 60}" cy="60" r="100" fill="${primary}" fill-opacity="0.08" />`;
      
      if (imagePrompt && !isMobile) {
        const contentW = w / 2 - 32;
        const imgW = w / 2 - 32;
        const imgH = h - 64;
        const imgX = w / 2 + 16;
        const imgY = 32;

        const titleSize = deviceMode === "tablet" ? 22 : 28;
        svg += `<text x="32" y="70" fill="${textColor}" font-size="${titleSize}" font-weight="800" class="heading">${esc(title)}</text>`;
        
        const subLines = subtitle.length > 60 ? [subtitle.slice(0, 50) + "...", subtitle.slice(50, 100)] : [subtitle];
        subLines.forEach((line, li) => {
          svg += `<text x="32" y="${120 + li * 20}" fill="${textMuted}" font-size="12" opacity="0.9">${esc(line.trim())}</text>`;
        });

        const btnY = h - 78;
        const btnW = 120;
        const btnH = 36;
        svg += `<rect x="32" y="${btnY}" width="${btnW}" height="${btnH}" fill="${primary}" rx="8" />`;
        svg += `<text x="${32 + btnW / 2}" y="${btnY + btnH / 2 + 4}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">${esc(ctaText)}</text>`;

        svg += `<rect x="32 + btnW + 12" y="${btnY}" width="${btnW}" height="${btnH}" fill="none" stroke="${primary}" stroke-width="1.5" rx="8" />`;
        svg += `<text x="${32 + btnW + 12 + btnW / 2}" y="${btnY + btnH / 2 + 4}" fill="${primary}" font-size="11" font-weight="700" text-anchor="middle">Learn More</text>`;

        const imgUrl = getPollinationsImageUrl(imagePrompt, 600, 450, getStableSeed(imagePrompt));
        svg += `<image href="${esc(imgUrl)}" x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" />`;
      } else {
        // Centered / Mobile fallback
        const titleSize = isMobile ? 20 : deviceMode === "tablet" ? 28 : 36;
        svg += `<text x="${w / 2}" y="${isMobile ? 60 : 80}" fill="${textColor}" font-size="${titleSize}" font-weight="800" text-anchor="middle" class="heading">${esc(title)}</text>`;
        
        const subLines = w > 600 ? [subtitle] : [subtitle.slice(0, subtitle.length / 2), subtitle.slice(subtitle.length / 2)];
        subLines.forEach((line, li) => {
          svg += `<text x="${w / 2}" y="${isMobile ? 110 + li * 18 : 140 + li * 20}" fill="${textMuted}" font-size="${isMobile ? 11 : 13}" text-anchor="middle" opacity="0.9">${esc(line.trim())}</text>`;
        });
        
        const btnW = isMobile ? 130 : 160;
        const btnH = isMobile ? 38 : 46;
        const btnY = isMobile ? 170 : 210;
        const gap = 16;
        const totalBtnW = btnW * 2 + gap;
        const startBtnX = (w - totalBtnW) / 2;
        
        svg += `<rect x="${startBtnX}" y="${btnY}" width="${btnW}" height="${btnH}" fill="${primary}" rx="10" />`;
        svg += `<text x="${startBtnX + btnW / 2}" y="${btnY + btnH / 2 + 5}" fill="#ffffff" font-size="${isMobile ? 12 : 13}" font-weight="700" text-anchor="middle">${esc(ctaText)}</text>`;
        
        svg += `<rect x="${startBtnX + btnW + gap}" y="${btnY}" width="${btnW}" height="${btnH}" fill="none" stroke="${primary}" stroke-width="2" rx="10" />`;
        svg += `<text x="${startBtnX + btnW + gap + btnW / 2}" y="${btnY + btnH / 2 + 5}" fill="${primary}" font-size="${isMobile ? 12 : 13}" font-weight="700" text-anchor="middle">Learn More</text>`;
      }
      
      break;
    }

    case "card": {
      const title = comp.properties?.title || "Feature Title";
      const content = comp.properties?.content || "Feature description details showing components properties.";
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="12" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      // Icon square
      svg += `<rect x="20" y="20" width="36" height="36" fill="${primary}" fill-opacity="0.15" rx="8" />`;
      svg += `<circle cx="38" cy="38" r="6" fill="${primary}" />`;
      
      // Title
      svg += `<text x="20" y="80" fill="${textColor}" font-size="16" font-weight="700" class="heading">${esc(title)}</text>`;
      
      // Body Content
      const textLines = content.length > 50 ? [content.slice(0, 45) + "...", content.slice(45, 90)] : [content];
      textLines.forEach((line, li) => {
        svg += `<text x="20" y="${104 + li * 16}" fill="${textMuted}" font-size="12" line-height="1.5">${esc(line.trim())}</text>`;
      });
      
      // Read more link
      svg += `<text x="20" y="${h - 20}" fill="${secondary}" font-size="11" font-weight="600">Read More →</text>`;
      break;
    }

    case "metric-card": {
      const title = comp.properties?.title || "Active Users";
      const value = comp.properties?.content || comp.properties?.value || "$45,231";
      const change = comp.properties?.change || "+12.4%";
      const isNeg = change.includes("-");
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="12" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      
      // Title
      svg += `<text x="16" y="28" fill="${textMuted}" font-size="12" font-weight="500">${esc(title)}</text>`;
      
      // Value
      svg += `<text x="16" y="68" fill="${textColor}" font-size="26" font-weight="800" class="heading">${esc(value)}</text>`;
      
      // Change Badge
      const badgeW = change.length * 6 + 16;
      const badgeX = w - badgeW - 16;
      svg += `<rect x="${badgeX}" y="48" width="${badgeW}" height="20" fill="${isNeg ? "#ef4444" : "#10b981"}" fill-opacity="0.15" rx="99" />`;
      svg += `<text x="${badgeX + badgeW / 2}" y="62" fill="${isNeg ? "#f87171" : "#34d399"}" font-size="10" font-weight="700" text-anchor="middle">${esc(change)}</text>`;
      
      // Sparkline (tiny graphic bars)
      svg += `<g opacity="0.3" transform="translate(16, ${h - 36})">`;
      const barCount = 8;
      const barW = (w - 32) / barCount - 3;
      const sparkHeights = [12, 18, 10, 24, 15, 30, 20, 32];
      sparkHeights.forEach((sh, idx) => {
        svg += `<rect x="${idx * (barW + 3)}" y="${32 - sh}" width="${barW}" height="${sh}" fill="${isNeg ? secondary : primary}" rx="2" />`;
      });
      svg += `</g>`;
      break;
    }

    case "chart": {
      const title = comp.properties?.title || "Monthly Analytics";
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="14" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      // Title
      svg += `<text x="20" y="32" fill="${textColor}" font-size="14" font-weight="700" class="heading">${esc(title)}</text>`;
      
      // Horizontal grid lines
      svg += `<g stroke="${borderCol}" stroke-opacity="0.2" stroke-dasharray="3,3">`;
      svg += `<line x1="20" y1="80" x2="${w - 20}" y2="80" />`;
      svg += `<line x1="20" y1="130" x2="${w - 20}" y2="130" />`;
      svg += `<line x1="20" y1="180" x2="${w - 20}" y2="180" />`;
      svg += `</g>`;
      
      // Chart columns
      svg += `<g transform="translate(20, 60)">`;
      const numCols = deviceMode === "mobile" ? 6 : 10;
      const barH = 130;
      const spaceW = (w - 40) / numCols;
      const colData = [40, 65, 80, 50, 95, 70, 85, 60, 75, 90];
      
      colData.slice(0, numCols).forEach((val, idx) => {
        const itemH = (val / 100) * barH;
        const colX = idx * spaceW + (spaceW - 14) / 2;
        const colY = barH - itemH + 20;
        
        // Linear gradient simulated via color
        svg += `<rect x="${colX}" y="${colY}" width="14" height="${itemH}" fill="${primary}" rx="4" />`;
        // Overlay secondary color on top part
        svg += `<rect x="${colX}" y="${colY}" width="14" height="6" fill="${accent}" rx="2" opacity="0.8" />`;
        // Label
        svg += `<text x="${colX + 7}" y="166" fill="${textMuted}" font-size="9" text-anchor="middle">M${idx + 1}</text>`;
      });
      svg += `</g>`;
      break;
    }

    case "table":
    case "data-table": {
      const title = comp.properties?.title || "Recent Records";
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="14" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      
      // Header
      svg += `<text x="20" y="32" fill="${textColor}" font-size="14" font-weight="700" class="heading">${esc(title)}</text>`;
      svg += `<text x="${w - 20}" y="32" fill="${secondary}" font-size="12" font-weight="600" text-anchor="end">View All</text>`;
      
      // Table Header Row
      const tableY = 56;
      svg += `<rect x="16" y="${tableY}" width="${w - 32}" height="28" fill="${colors.background || "#0f172a"}" fill-opacity="0.5" rx="6" />`;
      svg += `<text x="28" y="${tableY + 18}" fill="${textMuted}" font-size="10" font-weight="700">USER</text>`;
      svg += `<text x="${w - 120}" y="${tableY + 18}" fill="${textMuted}" font-size="10" font-weight="700">STATUS</text>`;
      svg += `<text x="${w - 28}" y="${tableY + 18}" fill="${textMuted}" font-size="10" font-weight="700" text-anchor="end">AMOUNT</text>`;
      
      // Row data
      const tableData = [
        { name: "Sarah Jenkins", email: "sarah.j@example.com", status: "Completed", amount: "$350.00" },
        { name: "David Vance", email: "d.vance@example.com", status: "Pending", amount: "$89.50" },
        { name: "Elena Rostova", email: "elena.r@example.com", status: "Completed", amount: "$1,240.00" },
        { name: "Marcus Brody", email: "marcus.b@example.com", status: "Failed", amount: "$45.00" }
      ];
      
      let rowY = tableY + 36;
      tableData.slice(0, deviceMode === "mobile" ? 3 : 4).forEach((row, rIdx) => {
        // Divider
        svg += `<line x1="20" y1="${rowY}" x2="${w - 20}" y2="${rowY}" stroke="${borderCol}" stroke-opacity="0.2" />`;
        
        // Name / email
        svg += `<text x="24" y="${rowY + 18}" fill="${textColor}" font-size="12" font-weight="600">${esc(row.name)}</text>`;
        if (deviceMode !== "mobile") {
          svg += `<text x="24" y="${rowY + 30}" fill="${textMuted}" font-size="10">${esc(row.email)}</text>`;
        }
        
        // Status badge
        const badgeColor = row.status === "Completed" ? "#10b981" : row.status === "Pending" ? "#f59e0b" : "#ef4444";
        const badgeTextCol = row.status === "Completed" ? "#34d399" : row.status === "Pending" ? "#fde68a" : "#f87171";
        
        svg += `<rect x="${w - 120}" y="${rowY + 10}" width="68" height="18" fill="${badgeColor}" fill-opacity="0.15" rx="99" />`;
        svg += `<text x="${w - 120 + 34}" y="${rowY + 22}" fill="${badgeTextCol}" font-size="9" font-weight="700" text-anchor="middle">${esc(row.status)}</text>`;
        
        // Amount
        svg += `<text x="${w - 24}" y="${rowY + 23}" fill="${textColor}" font-size="12" font-weight="700" text-anchor="end">${esc(row.amount)}</text>`;
        rowY += 46;
      });
      break;
    }

    case "form": {
      const title = comp.properties?.title || "Get in Touch";
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="14" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      
      // Title
      svg += `<text x="20" y="36" fill="${textColor}" font-size="16" font-weight="800" class="heading">${esc(title)}</text>`;
      
      // Input 1 (Name)
      svg += `<text x="20" y="66" fill="${textMuted}" font-size="11" font-weight="600">NAME</text>`;
      svg += `<rect x="20" y="74" width="${w - 40}" height="36" fill="${colors.background || "#0f172a"}" fill-opacity="0.6" stroke="${borderCol}" stroke-opacity="0.5" rx="8" />`;
      svg += `<text x="32" y="96" fill="${textColor}" fill-opacity="0.4" font-size="12">John Doe</text>`;
      
      // Input 2 (Email)
      svg += `<text x="20" y="132" fill="${textMuted}" font-size="11" font-weight="600">EMAIL ADDRESS</text>`;
      svg += `<rect x="20" y="140" width="${w - 40}" height="36" fill="${colors.background || "#0f172a"}" fill-opacity="0.6" stroke="${borderCol}" stroke-opacity="0.5" rx="8" />`;
      svg += `<text x="32" y="162" fill="${textColor}" fill-opacity="0.4" font-size="12">john@example.com</text>`;
      
      // Button
      svg += `<rect x="20" y="202" width="${w - 40}" height="42" fill="${primary}" rx="10" />`;
      svg += `<text x="${w / 2}" y="228" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Submit Application</text>`;
      break;
    }

    case "button": {
      const label = comp.properties?.label || comp.content || "Action Button";
      const variant = comp.properties?.variant || "primary";
      
      svg += `<rect x="${(w - 160) / 2}" y="${(h - 42) / 2}" width="160" height="42" fill="${variant === "primary" ? primary : "none"}" stroke="${primary}" stroke-width="2" rx="8" />`;
      svg += `<text x="${w / 2}" y="${h / 2 + 5}" fill="${variant === "primary" ? "#ffffff" : primary}" font-size="13" font-weight="700" text-anchor="middle">${esc(label)}</text>`;
      break;
    }

    case "footer": {
      const brand = comp.properties?.brand || "AppBrand";
      const copyright = `© ${new Date().getFullYear()} ${brand}. All rights reserved.`;
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" stroke="${borderCol}" stroke-opacity="0.3" rx="12" />`;
      svg += `<line x1="0" y1="0" x2="${w}" y2="0" stroke="${borderCol}" stroke-opacity="0.4" />`;
      
      if (deviceMode === "mobile") {
        svg += `<text x="${w / 2}" y="36" fill="${primary}" font-size="13" font-weight="700" text-anchor="middle" class="heading">${esc(brand)}</text>`;
        svg += `<text x="${w / 2}" y="62" fill="${textMuted}" font-size="10" text-anchor="middle">${esc(copyright)}</text>`;
        svg += `<text x="${w / 2}" y="88" fill="${textColor}" fill-opacity="0.8" font-size="11" text-anchor="middle">Privacy · Terms</text>`;
      } else {
        svg += `<text x="24" y="${h / 2 + 5}" fill="${primary}" font-size="14" font-weight="800" class="heading">${esc(brand)}</text>`;
        svg += `<text x="${w / 2}" y="${h / 2 + 5}" fill="${textMuted}" font-size="11" text-anchor="middle">${esc(copyright)}</text>`;
        
        let linkX = w - 24;
        svg += `<text x="${linkX}" y="${h / 2 + 5}" fill="${textColor}" fill-opacity="0.7" font-size="11" font-weight="600" text-anchor="end">Terms</text>`;
        svg += `<text x="${linkX - 54}" y="${h / 2 + 5}" fill="${textColor}" fill-opacity="0.7" font-size="11" font-weight="600" text-anchor="end">Privacy</text>`;
      }
      break;
    }

    case "product-card": {
      const name = comp.properties?.title || "Wireless Headphones";
      const price = comp.properties?.price || "$129.99";
      const badge = comp.properties?.badge || "New";
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="12" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      // Gradient image box
      svg += `<rect width="${w}" height="100" fill="${primary}" fill-opacity="0.1" rx="12" />`;
      // Circular device graphic inside image box
      svg += `<circle cx="${w / 2}" cy="50" r="24" fill="${primary}" fill-opacity="0.2" />`;
      svg += `<circle cx="${w / 2}" cy="50" r="12" fill="${primary}" />`;
      
      if (badge) {
        svg += `<rect x="8" y="8" width="40" height="18" fill="${primary}" rx="4" />`;
        svg += `<text x="28" y="20" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">${esc(badge)}</text>`;
      }
      
      // Name
      svg += `<text x="12" y="124" fill="${textColor}" font-size="12" font-weight="600">${esc(name.length > 28 ? name.slice(0, 25) + "..." : name)}</text>`;
      
      // Price
      svg += `<text x="12" y="156" fill="${primary}" font-size="15" font-weight="850" class="heading">${esc(price)}</text>`;
      
      // Button
      const btnX = w - 60 - 12;
      svg += `<rect x="${btnX}" y="138" width="60" height="24" fill="${primary}" rx="6" />`;
      svg += `<text x="${btnX + 30}" y="154" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">Add</text>`;
      
      break;
    }

    case "testimonial": {
      const quote = comp.properties?.content || "This platform transformed our design workflow. We ship 3x faster now.";
      const author = comp.properties?.author || "Sarah Chen";
      const role = comp.properties?.role || "Designer @ Stripe";
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="12" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      
      // Stars (5 yellow dots)
      let starX = 20;
      for (let i = 0; i < 5; i++) {
        svg += `<circle cx="${starX}" cy="26" r="4" fill="#f59e0b" />`;
        starX += 12;
      }
      
      // Quote
      const qLines = quote.length > 50 ? [quote.slice(0, 42) + "...", quote.slice(42, 85)] : [quote];
      qLines.forEach((line, li) => {
        svg += `<text x="20" y="${52 + li * 16}" fill="${textColor}" font-size="12" font-style="italic" fill-opacity="0.9">${esc(line.trim())}</text>`;
      });
      
      // Avatar
      svg += `<circle cx="36" cy="${h - 30}" r="14" fill="${primary}" />`;
      svg += `<text x="36" y="${h - 26}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">${esc(author.split(" ").map(n => n[0]).join(""))}</text>`;
      
      // Author info
      svg += `<text x="60" y="${h - 34}" fill="${textColor}" font-size="12" font-weight="600">${esc(author)}</text>`;
      svg += `<text x="60" y="${h - 22}" fill="${textMuted}" font-size="9">${esc(role)}</text>`;
      
      break;
    }

    case "pricing-card": {
      const plan = comp.properties?.title || "Pro Plan";
      const price = comp.properties?.price || "$49";
      const features = comp.properties?.features || ["Unlimited generations", "Figma API export", "Priority support"];
      const highlighted = comp.properties?.highlighted || false;
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="14" stroke="${highlighted ? primary : borderCol}" stroke-width="${highlighted ? 2 : 1}" stroke-opacity="${highlighted ? 0.9 : 0.3}" filter="url(#card-shadow)" />`;
      
      if (highlighted) {
        svg += `<rect x="${w - 68}" y="12" width="56" height="18" fill="${primary}" rx="4" />`;
        svg += `<text x="${w - 68 + 28}" y="24" fill="#ffffff" font-size="8" font-weight="700" text-anchor="middle">POPULAR</text>`;
      }
      
      // Plan
      svg += `<text x="20" y="32" fill="${textMuted}" font-size="11" font-weight="700" text-transform="uppercase">${esc(plan)}</text>`;
      
      // Price
      svg += `<text x="20" y="72" fill="${textColor}" font-size="32" font-weight="900" class="heading">${esc(price)}<tspan font-size="13" font-weight="400" fill="${textMuted}">/mo</tspan></text>`;
      
      // Features
      let featureY = 96;
      (Array.isArray(features) ? features : [features]).slice(0, 3).forEach((f) => {
        // Bullet dot
        svg += `<circle cx="26" cy="${featureY + 5}" r="3" fill="${primary}" />`;
        svg += `<text x="38" y="${featureY + 9}" fill="${textColor}" font-size="11" fill-opacity="0.8">${esc(f)}</text>`;
        featureY += 22;
      });
      
      // Button
      svg += `<rect x="20" y="${h - 48}" width="${w - 40}" height="32" fill="${highlighted ? primary : "none"}" stroke="${primary}" stroke-width="1.5" rx="6" />`;
      svg += `<text x="${w / 2}" y="${h - 28}" fill="${highlighted ? "#ffffff" : primary}" font-size="11" font-weight="700" text-anchor="middle">Get Started</text>`;
      
      break;
    }

    case "banner": {
      const title = comp.properties?.title || "🎉 Limited Time Offer";
      const subtitle = comp.properties?.subtitle || "Get 3 months free on any Pro plan.";
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" stroke="${primary}" stroke-opacity="0.4" rx="10" />`;
      // Gradient visual glow
      svg += `<rect width="10" height="${h}" fill="${primary}" rx="4" />`;
      
      // Text
      svg += `<text x="24" y="${h / 2 - 5}" fill="${textColor}" font-size="13" font-weight="700" class="heading">${esc(title)}</text>`;
      svg += `<text x="24" y="${h / 2 + 13}" fill="${textMuted}" font-size="11">${esc(subtitle)}</text>`;
      
      if (deviceMode !== "mobile") {
        const btnX = w - 100 - 16;
        svg += `<rect x="${btnX}" y="${(h - 32) / 2}" width="100" height="32" fill="${primary}" rx="6" />`;
        svg += `<text x="${btnX + 50}" y="${h / 2 + 4}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">Claim Now</text>`;
      }
      break;
    }

    case "list": {
      const title = comp.properties?.title || "Quick Links";
      const items = comp.properties?.items || ["Dashboard", "Settings", "Analytics"];
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="12" stroke="${borderCol}" stroke-opacity="0.3" />`;
      svg += `<text x="16" y="28" fill="${textMuted}" font-size="12" font-weight="700" text-transform="uppercase">${esc(title)}</text>`;
      
      let itemY = 44;
      (Array.isArray(items) ? items : [items]).slice(0, 4).forEach((item) => {
        svg += `<line x1="16" y1="${itemY}" x2="${w - 16}" y2="${itemY}" stroke="${borderCol}" stroke-opacity="0.2" />`;
        svg += `<text x="20" y="${itemY + 22}" fill="${textColor}" font-size="12">${esc(item)}</text>`;
        svg += `<text x="${w - 24}" y="${itemY + 22}" fill="${primary}" font-size="12" font-weight="700" text-anchor="end">›</text>`;
        itemY += 34;
      });
      break;
    }

    case "stats-bar": {
      const stats = comp.properties?.stats || [
        { label: "Revenue", value: "$248K", change: "+14%" },
        { label: "Users", value: "12.8K", change: "+8.7%" },
        { label: "Churn", value: "1.8%", change: "-0.3%" }
      ];
      
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" rx="12" stroke="${borderCol}" stroke-opacity="0.3" />`;
      
      const numStats = stats.length;
      const cellW = w / numStats;
      
      stats.forEach((s, idx) => {
        const cellX = idx * cellW;
        svg += `<g transform="translate(${cellX}, 0)">`;
        
        // Label
        svg += `<text x="${cellW / 2}" y="28" fill="${textMuted}" font-size="10" font-weight="700" text-anchor="middle" text-transform="uppercase">${esc(s.label)}</text>`;
        
        // Value
        svg += `<text x="${cellW / 2}" y="56" fill="${textColor}" font-size="18" font-weight="800" text-anchor="middle" class="heading">${esc(s.value)}</text>`;
        
        // Change
        const isNeg = String(s.change || "").includes("-");
        svg += `<text x="${cellW / 2}" y="76" fill="${isNeg ? "#f87171" : "#34d399"}" font-size="10" font-weight="700" text-anchor="middle">${esc(s.change)}</text>`;
        
        svg += `</g>`;
        
        // Divider
        if (idx < numStats - 1) {
          svg += `<line x1="${cellX + cellW}" y1="16" x2="${cellX + cellW}" y2="${h - 16}" stroke="${borderCol}" stroke-opacity="0.3" />`;
        }
      });
      break;
    }

    case "image": {
      const prompt = comp.properties?.imagePrompt || comp.properties?.title || comp.properties?.content || "modern UI illustration";
      const imgUrl = getPollinationsImageUrl(prompt, w, h, getStableSeed(prompt));
      svg += `<rect width="${w}" height="${h}" fill="rgba(255,255,255,0.02)" rx="12" stroke="${borderCol}" stroke-opacity="0.3" filter="url(#card-shadow)" />`;
      svg += `<image href="${esc(imgUrl)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" />`;
      break;
    }

    default: {
      svg += `<rect width="${w}" height="${h}" fill="${cardBg}" stroke="${borderCol}" stroke-opacity="0.5" rx="10" />`;
      svg += `<text x="20" y="32" fill="${textColor}" font-size="13" font-weight="700" class="heading">${esc(comp.label || comp.type)}</text>`;
      svg += `<text x="20" y="56" fill="${textMuted}" font-size="11">Custom responsive block node</text>`;
      break;
    }
  }

  svg += `</g>`;
  return svg;
}

/**
 * Builds the complete vector SVG markup for a page and breakpoint
 */
export function generateSVGForPage(page, schema, deviceMode) {
  const { layoutWidth, totalHeight, placedComps, sidebarItem } = layoutPageComponents(page, schema, deviceMode);
  const colors = schema.tokens?.colors || {};
  const bg = page.layout?.background || colors.background || "#0F172A";

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${layoutWidth}" height="${totalHeight}" viewBox="0 0 ${layoutWidth} ${totalHeight}">`;
  
  // Style and font imports
  svg += `<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
    text {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .heading {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>`;

  // Defs (Filters and gradients)
  svg += `<defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
  </defs>`;

  // Canvas background rect
  svg += `<rect width="${layoutWidth}" height="${totalHeight}" fill="${bg}" />`;

  // Render sidebar if not mobile
  if (sidebarItem) {
    svg += renderComponentToSVG(sidebarItem, colors, deviceMode);
  }

  // Render all other components
  placedComps.forEach((placed) => {
    svg += renderComponentToSVG(placed, colors, deviceMode);
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Copies the SVG to clipboard as text and html block (for direct Figma copy-paste capability)
 */
export async function copySvgToClipboard(svgString) {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([svgString], { type: "text/plain" });
      const htmlBlob = new Blob([svgString], { type: "text/html" });
      
      const item = new ClipboardItem({
        "text/plain": textBlob,
        "text/html": htmlBlob
      });
      await navigator.clipboard.write([item]);
      return true;
    } else {
      await navigator.clipboard.writeText(svgString);
      return true;
    }
  } catch (err) {
    try {
      await navigator.clipboard.writeText(svgString);
      return true;
    } catch (fbErr) {
      console.error("Figma Clipboard Paste support error:", fbErr);
      return false;
    }
  }
}
