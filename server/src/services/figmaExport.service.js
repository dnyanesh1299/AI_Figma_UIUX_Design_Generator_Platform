/**
 * figmaExport.service.js
 * Core service that converts AI-generated design schemas into Figma file structures
 * and pushes them to the Figma REST API.
 *
 * Figma REST API Docs: https://www.figma.com/developers/api
 */

import axios from "axios";

const FIGMA_API_BASE = "https://api.figma.com";

// ─── Utility helpers ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return { r, g, b, a: 1 };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    return { r, g, b, a: 1 };
  }
  return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
}

function parseColorToRgb(colorStr) {
  if (!colorStr) return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
  if (colorStr.startsWith("#")) return hexToRgb(colorStr);
  // Handle rgb/rgba
  const rgba = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) {
    return {
      r: parseInt(rgba[1]) / 255,
      g: parseInt(rgba[2]) / 255,
      b: parseInt(rgba[3]) / 255,
      a: rgba[4] !== undefined ? parseFloat(rgba[4]) : 1
    };
  }
  return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
}

function parsePx(val, fallback = 0) {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

function parsePadding(paddingStr) {
  if (!paddingStr) return { top: 16, right: 16, bottom: 16, left: 16 };
  const parts = String(paddingStr).split(/\s+/).map((p) => parsePx(p, 16));
  if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}

let _nodeIdCounter = 1;
function newId() {
  return `${Date.now()}:${_nodeIdCounter++}`;
}

function solidFill(colorStr) {
  return [{ type: "SOLID", color: parseColorToRgb(colorStr) }];
}

function gradientFill(colorStr) {
  // Simple gradient — try to extract two colors from gradient string
  const colors = (colorStr || "").match(/#[0-9a-fA-F]{3,8}/g);
  if (colors && colors.length >= 2) {
    return [{
      type: "GRADIENT_LINEAR",
      gradientHandlePositions: [
        { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }
      ],
      gradientStops: [
        { position: 0, color: hexToRgb(colors[0]) },
        { position: 1, color: hexToRgb(colors[colors.length - 1]) }
      ]
    }];
  }
  // Fallback to solid
  if (colors && colors.length === 1) return solidFill(colors[0]);
  return solidFill("#1E293B");
}

function parseFill(background) {
  if (!background) return solidFill("#1E293B");
  if (background.includes("gradient")) return gradientFill(background);
  return solidFill(background);
}

function textFill(colorStr) {
  return [{ type: "SOLID", color: parseColorToRgb(colorStr || "#F8FAFC") }];
}

function makeShadow(elevation = "medium") {
  const shadows = {
    low: { offsetX: 0, offsetY: 2, radius: 8, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.2 } },
    medium: { offsetX: 0, offsetY: 8, radius: 24, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.35 } },
    high: { offsetX: 0, offsetY: 20, radius: 60, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.5 } }
  };
  const s = shadows[elevation] || shadows.medium;
  return [{
    type: "DROP_SHADOW",
    color: s.color,
    offset: { x: s.offsetX, y: s.offsetY },
    radius: s.radius,
    spread: s.spread,
    visible: true,
    blendMode: "NORMAL"
  }];
}

// ─── Node builders ─────────────────────────────────────────────────────────────

function makeFrame({ id, name, x = 0, y = 0, width = 1440, height = 100, fills, children = [], cornerRadius = 0, effects = [], layoutMode = "NONE", paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0, itemSpacing = 0, primaryAxisAlignItems = "MIN", counterAxisAlignItems = "MIN", clipsContent = true }) {
  return {
    id: id || newId(),
    name,
    type: "FRAME",
    x,
    y,
    width,
    height,
    fills: fills || solidFill("#1E293B"),
    children,
    cornerRadius,
    effects,
    layoutMode,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    itemSpacing,
    primaryAxisAlignItems,
    counterAxisAlignItems,
    clipsContent
  };
}

function makeRect({ id, name, x = 0, y = 0, width = 100, height = 40, fills, cornerRadius = 8, effects = [], strokes = [], strokeWeight = 0 }) {
  return {
    id: id || newId(),
    name,
    type: "RECTANGLE",
    x,
    y,
    width,
    height,
    fills: fills || solidFill("#7C3AED"),
    cornerRadius,
    effects,
    strokes,
    strokeWeight
  };
}

function makeText({ id, name, x = 0, y = 0, width = 200, height = 24, characters, fontSize = 14, fontWeight = 400, fills, fontFamily = "Inter", textAlignHorizontal = "LEFT" }) {
  return {
    id: id || newId(),
    name,
    type: "TEXT",
    x,
    y,
    width,
    height,
    characters: characters || "",
    style: {
      fontFamily,
      fontWeight,
      fontSize,
      textAlignHorizontal,
      lineHeightPx: fontSize * 1.4,
      letterSpacing: 0
    },
    fills: fills || textFill("#F8FAFC")
  };
}

function makeComponent({ id, name, x = 0, y = 0, width = 300, height = 160, fills, children = [], cornerRadius = 12, effects = [] }) {
  return {
    id: id || newId(),
    name,
    type: "COMPONENT",
    x,
    y,
    width,
    height,
    fills: fills || solidFill("#1E293B"),
    children,
    cornerRadius,
    effects
  };
}

// ─── Component-type node builders ──────────────────────────────────────────────

function buildNavbarNode(comp, schema, x, y, frameWidth) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const textColor = comp.styles?.color || colors.text || "#F8FAFC";
  const padding = parsePadding(comp.styles?.padding);
  const height = 64;

  const children = [];

  // Brand logo placeholder
  children.push(makeRect({
    name: "Brand Logo",
    x: padding.left,
    y: (height - 32) / 2,
    width: 32,
    height: 32,
    fills: solidFill(colors.primary || "#7C3AED"),
    cornerRadius: 8
  }));

  // Brand name
  children.push(makeText({
    name: "Brand Name",
    x: padding.left + 40,
    y: (height - 20) / 2,
    width: 180,
    height: 20,
    characters: comp.properties?.brand || schema?.meta?.projectName || "App",
    fontSize: 16,
    fontWeight: 700,
    fills: textFill(textColor),
    fontFamily: schema?.tokens?.typography?.headingFont || "Inter"
  }));

  // Menu items
  const menuItems = comp.properties?.menuItems || [];
  let menuX = padding.left + 240;
  menuItems.slice(0, 5).forEach((item, idx) => {
    children.push(makeText({
      name: `Menu Item — ${item}`,
      x: menuX,
      y: (height - 16) / 2,
      width: item.length * 8 + 24,
      height: 16,
      characters: item,
      fontSize: 13,
      fontWeight: idx === 0 ? 600 : 400,
      fills: textFill(idx === 0 ? (colors.primary || "#7C3AED") : textColor),
      fontFamily: schema?.tokens?.typography?.bodyFont || "Inter"
    }));
    menuX += item.length * 8 + 40;
  });

  // CTA button
  children.push(makeRect({
    name: "CTA Button",
    x: frameWidth - padding.right - 120,
    y: (height - 36) / 2,
    width: 120,
    height: 36,
    fills: solidFill(colors.primary || "#7C3AED"),
    cornerRadius: 8
  }));
  children.push(makeText({
    name: "CTA Button Text",
    x: frameWidth - padding.right - 112,
    y: (height - 16) / 2,
    width: 104,
    height: 16,
    characters: "Get Started",
    fontSize: 13,
    fontWeight: 600,
    fills: textFill("#FFFFFF"),
    textAlignHorizontal: "CENTER"
  }));

  return makeFrame({
    name: comp.label || "Navbar",
    x,
    y,
    width: frameWidth,
    height,
    fills: parseFill(bg),
    children,
    effects: makeShadow("low")
  });
}

function buildHeroNode(comp, schema, x, y, frameWidth) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || `linear-gradient(135deg, ${colors.primary || "#7C3AED"}, ${colors.background || "#0F172A"})`;
  const textColor = comp.styles?.color || colors.text || "#F8FAFC";
  const height = 340;
  const children = [];

  // Headline
  children.push(makeText({
    name: "Hero Headline",
    x: 60,
    y: 80,
    width: Math.min(frameWidth - 120, 700),
    height: 80,
    characters: comp.properties?.title || "Design the Future",
    fontSize: 56,
    fontWeight: 900,
    fills: textFill(textColor),
    fontFamily: schema?.tokens?.typography?.headingFont || "Outfit"
  }));

  // Subtitle
  children.push(makeText({
    name: "Hero Subtitle",
    x: 60,
    y: 180,
    width: Math.min(frameWidth - 120, 540),
    height: 48,
    characters: comp.properties?.subtitle || "Build beautiful interfaces powered by AI.",
    fontSize: 18,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8"),
    fontFamily: schema?.tokens?.typography?.bodyFont || "Inter"
  }));

  // CTA Button
  const ctaText = comp.properties?.ctaText || "Get Started";
  children.push(makeRect({
    name: "Hero CTA Button",
    x: 60,
    y: 254,
    width: 160,
    height: 48,
    fills: solidFill(colors.primary || "#7C3AED"),
    cornerRadius: 12
  }));
  children.push(makeText({
    name: "Hero CTA Text",
    x: 68,
    y: 266,
    width: 144,
    height: 24,
    characters: ctaText,
    fontSize: 15,
    fontWeight: 700,
    fills: textFill("#FFFFFF"),
    textAlignHorizontal: "CENTER"
  }));

  // Decorative shape
  children.push(makeRect({
    name: "Hero Decoration",
    x: frameWidth - 300,
    y: 40,
    width: 260,
    height: 260,
    fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.1 } })),
    cornerRadius: 40
  }));

  return makeFrame({
    name: comp.label || "Hero Section",
    x,
    y,
    width: frameWidth,
    height,
    fills: parseFill(bg),
    children
  });
}

function buildMetricCardNode(comp, schema, x, y, cardWidth = 300) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const height = 140;
  const children = [];

  // Card background decoration
  children.push(makeRect({
    name: "Card Accent",
    x: cardWidth - 56,
    y: 16,
    width: 40,
    height: 40,
    fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.15 } })),
    cornerRadius: 10
  }));

  // Title
  children.push(makeText({
    name: "Metric Title",
    x: 20,
    y: 20,
    width: cardWidth - 80,
    height: 16,
    characters: comp.properties?.title || "Metric",
    fontSize: 12,
    fontWeight: 500,
    fills: textFill(colors.textMuted || "#94A3B8"),
    fontFamily: schema?.tokens?.typography?.bodyFont || "Inter"
  }));

  // Value
  children.push(makeText({
    name: "Metric Value",
    x: 20,
    y: 52,
    width: cardWidth - 40,
    height: 40,
    characters: comp.properties?.content || "0",
    fontSize: 32,
    fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC"),
    fontFamily: schema?.tokens?.typography?.headingFont || "Outfit"
  }));

  // Change badge
  const change = comp.properties?.change || "+0%";
  const isPositive = !change.startsWith("-");
  children.push(makeRect({
    name: "Change Badge",
    x: 20,
    y: 100,
    width: 70,
    height: 24,
    fills: solidFill(isPositive ? "#10B98120" : "#EF444420"),
    cornerRadius: 999
  }));
  children.push(makeText({
    name: "Change Value",
    x: 28,
    y: 105,
    width: 54,
    height: 14,
    characters: change,
    fontSize: 12,
    fontWeight: 700,
    fills: textFill(isPositive ? "#10B981" : "#EF4444"),
    textAlignHorizontal: "CENTER"
  }));

  return makeComponent({
    name: comp.label || "Metric Card",
    x,
    y,
    width: cardWidth,
    height,
    fills: solidFill(bg),
    children,
    cornerRadius: 16,
    effects: makeShadow("medium")
  });
}

function buildChartNode(comp, schema, x, y, chartWidth, chartHeight = 240) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const children = [];

  // Chart title
  children.push(makeText({
    name: "Chart Title",
    x: 20,
    y: 20,
    width: chartWidth - 40,
    height: 20,
    characters: comp.properties?.title || "Chart",
    fontSize: 14,
    fontWeight: 700,
    fills: textFill(colors.text || "#F8FAFC")
  }));

  // Simulated chart bars
  const barColors = [colors.primary || "#7C3AED", colors.secondary || "#10B981", colors.accent || "#06B6D4"];
  const barCount = 7;
  const barW = Math.floor((chartWidth - 60) / barCount) - 6;
  const chartAreaHeight = chartHeight - 80;
  const barHeights = [0.6, 0.85, 0.45, 0.92, 0.7, 0.55, 0.88];
  barHeights.slice(0, barCount).forEach((h, i) => {
    const bh = Math.floor(h * chartAreaHeight);
    children.push(makeRect({
      name: `Bar ${i + 1}`,
      x: 30 + i * (barW + 6),
      y: chartHeight - 40 - bh,
      width: barW,
      height: bh,
      fills: solidFill(barColors[i % barColors.length]),
      cornerRadius: 4
    }));
  });

  // X-axis labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  months.slice(0, barCount).forEach((m, i) => {
    children.push(makeText({
      name: `X Label ${m}`,
      x: 30 + i * (barW + 6),
      y: chartHeight - 28,
      width: barW,
      height: 14,
      characters: m,
      fontSize: 10,
      fontWeight: 400,
      fills: textFill(colors.textMuted || "#94A3B8"),
      textAlignHorizontal: "CENTER"
    }));
  });

  return makeFrame({
    name: comp.label || "Chart",
    x,
    y,
    width: chartWidth,
    height: chartHeight,
    fills: solidFill(bg),
    children,
    cornerRadius: 16,
    effects: makeShadow("medium")
  });
}

function buildDataTableNode(comp, schema, x, y, tableWidth, tableHeight = 280) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const children = [];

  // Title
  children.push(makeText({
    name: "Table Title",
    x: 20,
    y: 18,
    width: tableWidth - 40,
    height: 20,
    characters: comp.properties?.title || "Data Table",
    fontSize: 14,
    fontWeight: 700,
    fills: textFill(colors.text || "#F8FAFC")
  }));

  // Header row background
  children.push(makeRect({
    name: "Header Row",
    x: 0,
    y: 52,
    width: tableWidth,
    height: 36,
    fills: solidFill(colors.background || "#0F172A"),
    cornerRadius: 0
  }));

  // Column headers
  const cols = ["ID", "Name", "Status", "Amount", "Date"];
  const colWidths = [60, tableWidth * 0.3 - 20, tableWidth * 0.2, tableWidth * 0.15, tableWidth * 0.2];
  let colX = 20;
  cols.forEach((col, i) => {
    children.push(makeText({
      name: `Header — ${col}`,
      x: colX,
      y: 60,
      width: colWidths[i],
      height: 20,
      characters: col,
      fontSize: 11,
      fontWeight: 700,
      fills: textFill(colors.textMuted || "#94A3B8")
    }));
    colX += colWidths[i] + 12;
  });

  // Data rows (5 rows)
  const rowData = [
    ["001", "Dashboard Design", "Active", "$1,200", "Jun 2026"],
    ["002", "Landing Page", "Review", "$890", "Jun 2026"],
    ["003", "Mobile App UI", "Done", "$2,100", "May 2026"],
    ["004", "Admin Panel", "Active", "$750", "Jun 2026"],
    ["005", "Component Lib", "Draft", "$500", "Jul 2026"]
  ];
  rowData.forEach((row, ri) => {
    const rowY = 88 + ri * 36;
    // Row separator
    if (ri > 0) {
      children.push(makeRect({
        name: `Row Separator ${ri}`,
        x: 20,
        y: rowY - 1,
        width: tableWidth - 40,
        height: 1,
        fills: solidFill(colors.border || "#334155"),
        cornerRadius: 0
      }));
    }
    colX = 20;
    row.forEach((cell, ci) => {
      if (ci === 2) {
        // Status badge
        const statusColors = { Active: "#10B981", Review: "#F59E0B", Done: "#3B82F6", Draft: "#6B7280" };
        children.push(makeRect({
          name: `Status Badge Row${ri}`,
          x: colX,
          y: rowY + 7,
          width: 60,
          height: 22,
          fills: solidFill(statusColors[cell] || "#6B7280").map(f => ({ ...f, color: { ...f.color, a: 0.2 } })),
          cornerRadius: 999
        }));
        children.push(makeText({
          name: `Status Text Row${ri}`,
          x: colX + 4,
          y: rowY + 11,
          width: 52,
          height: 14,
          characters: cell,
          fontSize: 11,
          fontWeight: 600,
          fills: textFill(statusColors[cell] || "#94A3B8"),
          textAlignHorizontal: "CENTER"
        }));
      } else {
        children.push(makeText({
          name: `Cell R${ri}C${ci}`,
          x: colX,
          y: rowY + 8,
          width: colWidths[ci],
          height: 20,
          characters: cell,
          fontSize: 12,
          fontWeight: 400,
          fills: textFill(colors.text || "#F8FAFC")
        }));
      }
      colX += colWidths[ci] + 12;
    });
  });

  return makeFrame({
    name: comp.label || "Data Table",
    x,
    y,
    width: tableWidth,
    height: tableHeight,
    fills: solidFill(bg),
    children,
    cornerRadius: 16,
    effects: makeShadow("medium")
  });
}

function buildFormNode(comp, schema, x, y, formWidth = 480) {
  const colors = schema?.tokens?.colors || {};
  const children = [];
  const fields = [
    { label: "Full Name", placeholder: "John Doe", type: "text" },
    { label: "Email Address", placeholder: "john@example.com", type: "email" },
    { label: "Password", placeholder: "••••••••", type: "password" },
    { label: "Message", placeholder: "Write your message...", type: "textarea" }
  ];

  children.push(makeText({
    name: "Form Title",
    x: 0,
    y: 0,
    width: formWidth,
    height: 28,
    characters: comp.properties?.title || "Contact Us",
    fontSize: 20,
    fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC")
  }));

  let fieldY = 48;
  fields.forEach((f) => {
    // Label
    children.push(makeText({
      name: `Label — ${f.label}`,
      x: 0,
      y: fieldY,
      width: formWidth,
      height: 16,
      characters: f.label,
      fontSize: 12,
      fontWeight: 600,
      fills: textFill(colors.textMuted || "#94A3B8")
    }));
    // Input field
    const fieldH = f.type === "textarea" ? 80 : 44;
    children.push(makeRect({
      name: `Field — ${f.label}`,
      x: 0,
      y: fieldY + 22,
      width: formWidth,
      height: fieldH,
      fills: solidFill(colors.background || "#0F172A"),
      cornerRadius: 10,
      strokes: [{ type: "SOLID", color: parseColorToRgb(colors.border || "#334155") }],
      strokeWeight: 1
    }));
    children.push(makeText({
      name: `Placeholder — ${f.label}`,
      x: 14,
      y: fieldY + 22 + (fieldH - 16) / 2,
      width: formWidth - 28,
      height: 16,
      characters: f.placeholder,
      fontSize: 13,
      fontWeight: 400,
      fills: textFill(colors.textMuted || "#94A3B8")
    }));
    fieldY += fieldH + 32;
  });

  // Submit button
  children.push(makeRect({
    name: "Submit Button",
    x: 0,
    y: fieldY,
    width: formWidth,
    height: 48,
    fills: solidFill(colors.primary || "#7C3AED"),
    cornerRadius: 12
  }));
  children.push(makeText({
    name: "Submit Button Text",
    x: 0,
    y: fieldY + 15,
    width: formWidth,
    height: 18,
    characters: comp.properties?.submitText || "Send Message",
    fontSize: 15,
    fontWeight: 700,
    fills: textFill("#FFFFFF"),
    textAlignHorizontal: "CENTER"
  }));

  return makeFrame({
    name: comp.label || "Form",
    x,
    y,
    width: formWidth,
    height: fieldY + 70,
    fills: solidFill(colors.surface || "#1E293B"),
    children,
    cornerRadius: 20,
    effects: makeShadow("medium")
  });
}

function buildGenericComponentNode(comp, schema, x, y, compWidth = 340, compHeight = 160) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const children = [];

  // Icon placeholder
  children.push(makeRect({
    name: "Icon",
    x: 20,
    y: 20,
    width: 40,
    height: 40,
    fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.2 } })),
    cornerRadius: 10
  }));

  // Title
  children.push(makeText({
    name: "Component Title",
    x: 72,
    y: 28,
    width: compWidth - 92,
    height: 20,
    characters: comp.label || comp.type || "Component",
    fontSize: 14,
    fontWeight: 700,
    fills: textFill(colors.text || "#F8FAFC")
  }));

  // Description
  children.push(makeText({
    name: "Component Description",
    x: 20,
    y: 80,
    width: compWidth - 40,
    height: 36,
    characters: comp.properties?.description || `${comp.type} component with responsive layout and design tokens applied.`,
    fontSize: 12,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8")
  }));

  // Divider
  children.push(makeRect({
    name: "Divider",
    x: 20,
    y: compHeight - 44,
    width: compWidth - 40,
    height: 1,
    fills: solidFill(colors.border || "#334155"),
    cornerRadius: 0
  }));

  // Status
  children.push(makeRect({
    name: "Type Badge",
    x: 20,
    y: compHeight - 32,
    width: 80,
    height: 22,
    fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.15 } })),
    cornerRadius: 999
  }));
  children.push(makeText({
    name: "Type Text",
    x: 24,
    y: compHeight - 27,
    width: 72,
    height: 12,
    characters: comp.type || "component",
    fontSize: 10,
    fontWeight: 600,
    fills: textFill(colors.primary || "#A78BFA"),
    textAlignHorizontal: "CENTER"
  }));

  return makeComponent({
    name: comp.label || comp.type || "Component",
    x,
    y,
    width: compWidth,
    height: compHeight,
    fills: solidFill(bg),
    children,
    cornerRadius: 16,
    effects: makeShadow("medium")
  });
}

function buildFooterNode(comp, schema, x, y, frameWidth) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const height = 200;
  const children = [];

  // Divider line at top
  children.push(makeRect({
    name: "Footer Divider",
    x: 0,
    y: 0,
    width: frameWidth,
    height: 1,
    fills: solidFill(colors.border || "#334155"),
    cornerRadius: 0
  }));

  // Brand
  children.push(makeText({
    name: "Footer Brand",
    x: 60,
    y: 40,
    width: 200,
    height: 24,
    characters: schema?.meta?.projectName || "Product",
    fontSize: 18,
    fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC")
  }));

  children.push(makeText({
    name: "Footer Tagline",
    x: 60,
    y: 72,
    width: 280,
    height: 16,
    characters: "Building the future of design with AI.",
    fontSize: 12,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8")
  }));

  // Links
  const linkGroups = [
    { title: "Product", links: ["Features", "Pricing", "Changelog"] },
    { title: "Company", links: ["About", "Blog", "Careers"] },
    { title: "Legal", links: ["Privacy", "Terms", "Security"] }
  ];
  linkGroups.forEach((group, gi) => {
    const gx = 60 + (gi + 1) * 220;
    children.push(makeText({
      name: `Footer Group ${group.title}`,
      x: gx,
      y: 40,
      width: 180,
      height: 16,
      characters: group.title,
      fontSize: 12,
      fontWeight: 700,
      fills: textFill(colors.text || "#F8FAFC")
    }));
    group.links.forEach((link, li) => {
      children.push(makeText({
        name: `Footer Link ${link}`,
        x: gx,
        y: 64 + li * 22,
        width: 180,
        height: 16,
        characters: link,
        fontSize: 12,
        fontWeight: 400,
        fills: textFill(colors.textMuted || "#94A3B8")
      }));
    });
  });

  // Copyright
  children.push(makeText({
    name: "Copyright",
    x: 60,
    y: height - 30,
    width: frameWidth - 120,
    height: 14,
    characters: `© ${new Date().getFullYear()} ${schema?.meta?.projectName || "Product"}. All rights reserved.`,
    fontSize: 11,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8")
  }));

  return makeFrame({
    name: comp.label || "Footer",
    x,
    y,
    width: frameWidth,
    height,
    fills: solidFill(bg),
    children
  });
}

function buildModalNode(comp, schema, x, y, modalWidth = 520) {
  const colors = schema?.tokens?.colors || {};
  const modalHeight = 360;
  const overlayWidth = 1440;
  const children = [];

  // Overlay
  children.push(makeRect({
    name: "Overlay",
    x: 0,
    y: 0,
    width: overlayWidth,
    height: 600,
    fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0, a: 0.6 } }],
    cornerRadius: 0
  }));

  // Modal card
  const mx = (overlayWidth - modalWidth) / 2;
  const my = (600 - modalHeight) / 2;
  children.push(makeRect({
    name: "Modal Card",
    x: mx,
    y: my,
    width: modalWidth,
    height: modalHeight,
    fills: solidFill(colors.surface || "#1E293B"),
    cornerRadius: 20
  }));

  // Modal title
  children.push(makeText({
    name: "Modal Title",
    x: mx + 32,
    y: my + 32,
    width: modalWidth - 80,
    height: 26,
    characters: comp.properties?.title || "Modal Dialog",
    fontSize: 20,
    fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC")
  }));

  // Close button
  children.push(makeRect({
    name: "Close Button",
    x: mx + modalWidth - 52,
    y: my + 28,
    width: 32,
    height: 32,
    fills: solidFill(colors.border || "#334155"),
    cornerRadius: 8
  }));

  // Content area
  children.push(makeText({
    name: "Modal Content",
    x: mx + 32,
    y: my + 80,
    width: modalWidth - 64,
    height: 64,
    characters: comp.properties?.description || "This modal contains important information or a confirmation action for the user.",
    fontSize: 14,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8")
  }));

  // Action buttons
  children.push(makeRect({
    name: "Primary Action",
    x: mx + modalWidth - 160 - 32,
    y: my + modalHeight - 72,
    width: 160,
    height: 44,
    fills: solidFill(colors.primary || "#7C3AED"),
    cornerRadius: 10
  }));
  children.push(makeText({
    name: "Primary Action Text",
    x: mx + modalWidth - 160 - 32,
    y: my + modalHeight - 61,
    width: 160,
    height: 22,
    characters: "Confirm",
    fontSize: 14,
    fontWeight: 700,
    fills: textFill("#FFFFFF"),
    textAlignHorizontal: "CENTER"
  }));

  children.push(makeRect({
    name: "Cancel Action",
    x: mx + modalWidth - 160 - 32 - 120 - 12,
    y: my + modalHeight - 72,
    width: 120,
    height: 44,
    fills: solidFill(colors.background || "#0F172A"),
    cornerRadius: 10
  }));

  return makeComponent({
    name: comp.label || "Modal",
    x,
    y,
    width: overlayWidth,
    height: 600,
    fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0, a: 0 } }],
    children,
    cornerRadius: 0,
    effects: []
  });
}

function buildImageNode(comp, schema, x, y, width, height = 180) {
  const colors = schema?.tokens?.colors || {};
  const bg = comp.styles?.background || colors.surface || "#1E293B";
  const promptText = comp.properties?.imagePrompt || comp.properties?.title || "Image block";
  const children = [];

  // Center visual indicator box
  children.push(makeRect({
    name: "Image Frame Icon",
    x: (width - 48) / 2,
    y: (height - 48) / 2 - 16,
    width: 48,
    height: 48,
    fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.15 } })),
    cornerRadius: 12
  }));

  // Visual label for prompt
  children.push(makeText({
    name: "Image Prompt Label",
    x: 20,
    y: (height - 48) / 2 + 40,
    width: width - 40,
    height: 30,
    characters: `Image: "${promptText}"`,
    fontSize: 11,
    fontWeight: 650,
    fills: textFill(colors.textMuted || "#94A3B8"),
    textAlignHorizontal: "CENTER"
  }));

  return makeFrame({
    name: comp.label || "Image Block",
    x,
    y,
    width,
    height,
    fills: solidFill(bg),
    children,
    cornerRadius: 12,
    effects: makeShadow("low")
  });
}

// ─── Route component node builder (dispatcher) ─────────────────────────────────

function buildComponentNode(comp, schema, x, y, frameWidth) {
  const compGridCols = 12;
  const colW = frameWidth / compGridCols;
  const compW = comp.position ? Math.max(1, comp.position.w || 12) * colW : frameWidth;

  switch (comp.type) {
    case "navbar":
      return buildNavbarNode(comp, schema, x, y, frameWidth);
    case "hero":
      return buildHeroNode(comp, schema, x, y, frameWidth);
    case "metric-card":
      return buildMetricCardNode(comp, schema, x, y, compW);
    case "chart":
      return buildChartNode(comp, schema, x, y, compW, 260);
    case "data-table":
      return buildDataTableNode(comp, schema, x, y, frameWidth, 300);
    case "form":
      return buildFormNode(comp, schema, x, y, Math.min(compW, 520));
    case "footer":
      return buildFooterNode(comp, schema, x, y, frameWidth);
    case "modal":
    case "popup":
      return buildModalNode(comp, schema, x, y);
    case "image":
      return buildImageNode(comp, schema, x, y, compW, 200);
    default:
      return buildGenericComponentNode(comp, schema, x, y, compW, 160);
  }
}

// ─── Page builders ─────────────────────────────────────────────────────────────

/**
 * Build a screen frame for a given page at a given breakpoint
 */
function buildScreenFrame(page, schema, frameX, frameY, breakpoint) {
  const widths = { desktop: 1440, tablet: 768, mobile: 375 };
  const frameWidth = widths[breakpoint] || 1440;
  const colors = schema?.tokens?.colors || {};
  const bg = page.layout?.background || colors.background || "#0F172A";

  const children = [];
  let cursorY = 0;

  (page.components || []).forEach((comp) => {
    // For metric cards, lay them out side-by-side
    if (comp.type === "metric-card") return; // handled as group below

    const node = buildComponentNode(comp, schema, 0, cursorY, frameWidth);
    children.push(node);
    cursorY += (node.height || 100) + 24;
  });

  // Group metric cards side-by-side
  const metricCards = (page.components || []).filter(c => c.type === "metric-card");
  if (metricCards.length > 0) {
    // Find where they should be inserted — after navbar
    const navbarIdx = children.findIndex(c => c.name.toLowerCase().includes("navbar") || c.name.toLowerCase().includes("nav"));
    const insertY = navbarIdx >= 0 ? (children[navbarIdx].y + (children[navbarIdx].height || 64) + 24) : 16;

    // Shift subsequent children down
    const cardW = breakpoint === "mobile" ? frameWidth : Math.floor((frameWidth - 24 * (metricCards.length - 1) - 48) / metricCards.length);
    const cardH = 140;
    let cardX = 24;

    metricCards.forEach((comp, i) => {
      const card = buildMetricCardNode(comp, schema, cardX, insertY, cardW);
      children.push(card);
      cardX += cardW + 24;
    });

    // Adjust subsequent items
    const cardRowHeight = cardH + 24;
    children.forEach(c => {
      if (c.y > insertY && !c.name.includes("Metric")) {
        c.y += cardRowHeight;
      }
    });
    cursorY += cardRowHeight;
  }

  const totalHeight = Math.max(800, cursorY + 60);

  return makeFrame({
    name: `${page.name} — ${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}`,
    x: frameX,
    y: frameY,
    width: frameWidth,
    height: totalHeight,
    fills: solidFill(bg),
    children,
    cornerRadius: 16,
    effects: makeShadow("high"),
    clipsContent: true
  });
}

/**
 * Build the Cover page
 */
function buildCoverPage(schema) {
  const colors = schema?.tokens?.colors || {};
  const W = 1440, H = 900;
  const children = [];

  // Background gradient via rect
  children.push(makeRect({
    name: "Background",
    x: 0, y: 0, width: W, height: H,
    fills: parseFill(`linear-gradient(135deg, ${colors.primary || "#7C3AED"}, ${colors.background || "#0F172A"})`),
    cornerRadius: 0
  }));

  // Decorative circle
  children.push(makeRect({
    name: "Decorative Circle",
    x: W - 500, y: -100, width: 600, height: 600,
    fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.08 } })),
    cornerRadius: 999
  }));

  // Project name
  children.push(makeText({
    name: "Project Name",
    x: 80, y: 320, width: 900, height: 100,
    characters: schema?.meta?.projectName || "Untitled Design",
    fontSize: 72,
    fontWeight: 900,
    fills: textFill("#FFFFFF"),
    fontFamily: schema?.tokens?.typography?.headingFont || "Outfit"
  }));

  // Project type
  children.push(makeText({
    name: "Project Type",
    x: 80, y: 440, width: 500, height: 32,
    characters: (schema?.meta?.projectType || "UI/UX Design")
      .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    fontSize: 22,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8"),
    fontFamily: schema?.tokens?.typography?.bodyFont || "Inter"
  }));

  // Color swatches
  const tokenColors = Object.entries(colors).slice(0, 6);
  tokenColors.forEach(([name, val], i) => {
    children.push(makeRect({
      name: `Swatch — ${name}`,
      x: 80 + i * 68, y: 520, width: 56, height: 56,
      fills: solidFill(val),
      cornerRadius: 12
    }));
    children.push(makeText({
      name: `Swatch Label — ${name}`,
      x: 80 + i * 68, y: 584, width: 56, height: 14,
      characters: name,
      fontSize: 11,
      fontWeight: 500,
      fills: textFill(colors.textMuted || "#94A3B8"),
      textAlignHorizontal: "CENTER"
    }));
  });

  // Meta info
  children.push(makeText({
    name: "Generated By",
    x: 80, y: H - 60, width: 500, height: 16,
    characters: `Generated by AI Figma UI/UX Design Platform • ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    fontSize: 12,
    fontWeight: 400,
    fills: textFill(colors.textMuted || "#94A3B8")
  }));

  return {
    name: "Cover",
    type: "CANVAS",
    width: W,
    height: H,
    children
  };
}

/**
 * Build the Design System page
 */
function buildDesignSystemPage(schema) {
  const colors = schema?.tokens?.colors || {};
  const typography = schema?.tokens?.typography || {};
  const W = 1440;
  const children = [];
  let cursorY = 60;

  // Section: Colors
  children.push(makeText({
    name: "Section — Colors",
    x: 60, y: cursorY, width: 400, height: 32,
    characters: "Color Palette",
    fontSize: 28, fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC"),
    fontFamily: typography.headingFont || "Outfit"
  }));
  cursorY += 56;

  const colorEntries = Object.entries(colors);
  colorEntries.forEach(([name, val], i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const swatchX = 60 + col * 320;
    const swatchY = cursorY + row * 120;

    children.push(makeRect({
      name: `Color — ${name}`,
      x: swatchX, y: swatchY, width: 280, height: 72,
      fills: solidFill(val),
      cornerRadius: 12,
      effects: makeShadow("low")
    }));
    children.push(makeText({
      name: `Color Name — ${name}`,
      x: swatchX, y: swatchY + 80, width: 140, height: 16,
      characters: name.charAt(0).toUpperCase() + name.slice(1),
      fontSize: 13, fontWeight: 600,
      fills: textFill(colors.text || "#F8FAFC")
    }));
    children.push(makeText({
      name: `Color Value — ${name}`,
      x: swatchX + 150, y: swatchY + 80, width: 130, height: 16,
      characters: val,
      fontSize: 12, fontWeight: 400,
      fills: textFill(colors.textMuted || "#94A3B8"),
      textAlignHorizontal: "RIGHT"
    }));
  });
  cursorY += Math.ceil(colorEntries.length / 4) * 120 + 60;

  // Section: Typography
  children.push(makeText({
    name: "Section — Typography",
    x: 60, y: cursorY, width: 400, height: 32,
    characters: "Typography Scale",
    fontSize: 28, fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC"),
    fontFamily: typography.headingFont || "Outfit"
  }));
  cursorY += 56;

  const typeSamples = [
    { label: "Display / H1", size: 56, weight: 900, font: typography.headingFont || "Outfit", sample: "Headline Display" },
    { label: "Heading / H2", size: 36, weight: 800, font: typography.headingFont || "Outfit", sample: "Section Heading" },
    { label: "Heading / H3", size: 24, weight: 700, font: typography.headingFont || "Outfit", sample: "Card Heading" },
    { label: "Body Large", size: 16, weight: 400, font: typography.bodyFont || "Inter", sample: "Body text at 16px — The quick brown fox jumps over the lazy dog." },
    { label: "Body Regular", size: 14, weight: 400, font: typography.bodyFont || "Inter", sample: "Body text at 14px — The quick brown fox jumps over the lazy dog." },
    { label: "Caption", size: 11, weight: 500, font: typography.bodyFont || "Inter", sample: "Caption text · Labels · Meta" }
  ];

  typeSamples.forEach((t) => {
    children.push(makeText({
      name: `Type Label — ${t.label}`,
      x: 60, y: cursorY, width: 200, height: 16,
      characters: t.label,
      fontSize: 11, fontWeight: 600,
      fills: textFill(colors.textMuted || "#94A3B8")
    }));
    const sampleH = Math.ceil(t.size * 1.4);
    children.push(makeText({
      name: `Type Sample — ${t.label}`,
      x: 280, y: cursorY, width: W - 340, height: sampleH,
      characters: t.sample,
      fontSize: t.size,
      fontWeight: t.weight,
      fills: textFill(colors.text || "#F8FAFC"),
      fontFamily: t.font
    }));
    cursorY += sampleH + 24;
  });
  cursorY += 40;

  // Section: Spacing
  children.push(makeText({
    name: "Section — Spacing",
    x: 60, y: cursorY, width: 400, height: 32,
    characters: "Spacing Scale",
    fontSize: 28, fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC"),
    fontFamily: typography.headingFont || "Outfit"
  }));
  cursorY += 56;

  const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 80, 96];
  spacingScale.forEach((sp, i) => {
    children.push(makeRect({
      name: `Spacing — ${sp}px`,
      x: 60 + i * 140, y: cursorY + (96 - sp),
      width: sp, height: sp,
      fills: solidFill(colors.primary || "#7C3AED"),
      cornerRadius: 2
    }));
    children.push(makeText({
      name: `Spacing Label — ${sp}px`,
      x: 60 + i * 140, y: cursorY + 106,
      width: 80, height: 14,
      characters: `${sp}px`,
      fontSize: 11, fontWeight: 600,
      fills: textFill(colors.textMuted || "#94A3B8")
    }));
  });
  cursorY += 140;

  return {
    name: "Design System",
    type: "CANVAS",
    width: W,
    height: cursorY + 60,
    children
  };
}

/**
 * Build Components library page
 */
function buildComponentsPage(schema) {
  const colors = schema?.tokens?.colors || {};
  const W = 1440;
  const children = [];
  let cursorY = 60;

  // Collect all unique component types from the schema
  const allComps = (schema?.pages || []).flatMap(p => p.components || []);
  const seenTypes = new Set();
  const uniqueComps = allComps.filter(c => {
    if (seenTypes.has(c.type)) return false;
    seenTypes.add(c.type);
    return true;
  });

  // Section title
  children.push(makeText({
    name: "Section — Components",
    x: 60, y: cursorY, width: 600, height: 36,
    characters: "Component Library",
    fontSize: 32, fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC"),
    fontFamily: schema?.tokens?.typography?.headingFont || "Outfit"
  }));
  cursorY += 64;

  let colX = 60;
  const compWidth = 360;
  const gap = 24;

  uniqueComps.forEach((comp, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    if (col === 0 && i > 0) cursorY = children[children.length - 1].y + children[children.length - 1].height + gap + 60;

    const cx = 60 + col * (compWidth + gap);
    let node;

    switch (comp.type) {
      case "metric-card":
        node = buildMetricCardNode(comp, schema, cx, cursorY, compWidth);
        break;
      case "chart":
        node = buildChartNode(comp, schema, cx, cursorY, compWidth, 200);
        break;
      case "navbar":
        node = buildNavbarNode(comp, schema, 0, cursorY, W);
        col === 0 && (colX = 0);
        break;
      case "hero":
        node = buildHeroNode(comp, schema, 0, cursorY, W);
        break;
      case "footer":
        node = buildFooterNode(comp, schema, 0, cursorY, W);
        break;
      case "form":
        node = buildFormNode(comp, schema, cx, cursorY, compWidth);
        break;
      default:
        node = buildGenericComponentNode(comp, schema, cx, cursorY, compWidth, 160);
    }

    children.push(node);

    // Add label below
    children.push(makeText({
      name: `Comp Label — ${comp.label}`,
      x: node.x, y: node.y + (node.height || 160) + 8,
      width: node.width || compWidth, height: 16,
      characters: comp.label || comp.type,
      fontSize: 11, fontWeight: 700,
      fills: textFill(colors.textMuted || "#94A3B8"),
      textAlignHorizontal: "CENTER"
    }));
  });

  const lastChild = children[children.length - 1];
  const totalH = lastChild ? lastChild.y + (lastChild.height || 20) + 80 : 800;

  return {
    name: "Components",
    type: "CANVAS",
    width: W,
    height: totalH,
    children
  };
}

/**
 * Build a screens page (Desktop/Tablet/Mobile)
 */
function buildScreensPage(schema, breakpoint) {
  const widths = { desktop: 1440, tablet: 768, mobile: 375 };
  const frameW = widths[breakpoint] || 1440;
  const canvasW = 2000;
  const gap = 80;
  const pages = schema?.pages || [];
  const children = [];

  let frameX = 60;
  let maxH = 0;

  pages.forEach((page, i) => {
    const frame = buildScreenFrame(page, schema, frameX, 60, breakpoint);
    children.push(frame);
    maxH = Math.max(maxH, frame.height || 800);
    frameX += frameW + gap;
  });

  const labels = { desktop: "Desktop Screens", tablet: "Tablet Screens", mobile: "Mobile Screens" };

  return {
    name: labels[breakpoint] || `${breakpoint} Screens`,
    type: "CANVAS",
    width: Math.max(canvasW, frameX + 60),
    height: maxH + 160,
    children
  };
}

/**
 * Build Prototypes page (simplified flow diagram)
 */
function buildPrototypesPage(schema) {
  const colors = schema?.tokens?.colors || {};
  const pages = schema?.pages || [];
  const W = 1800;
  const children = [];

  children.push(makeText({
    name: "Page Title",
    x: 60, y: 40, width: 600, height: 36,
    characters: "User Flow — Prototype Map",
    fontSize: 28, fontWeight: 800,
    fills: textFill(colors.text || "#F8FAFC"),
    fontFamily: schema?.tokens?.typography?.headingFont || "Outfit"
  }));

  pages.forEach((page, i) => {
    const px = 60 + i * 340;
    const py = 140;

    // Page box
    children.push(makeRect({
      name: `Flow Node — ${page.name}`,
      x: px, y: py, width: 280, height: 120,
      fills: solidFill(colors.surface || "#1E293B"),
      cornerRadius: 16,
      effects: makeShadow("medium")
    }));

    // Page icon
    children.push(makeRect({
      name: `Flow Icon — ${page.name}`,
      x: px + 20, y: py + 20, width: 32, height: 32,
      fills: solidFill(colors.primary || "#7C3AED").map(f => ({ ...f, color: { ...f.color, a: 0.2 } })),
      cornerRadius: 8
    }));

    // Page name
    children.push(makeText({
      name: `Flow Label — ${page.name}`,
      x: px + 64, y: py + 26, width: 196, height: 20,
      characters: page.name,
      fontSize: 14, fontWeight: 700,
      fills: textFill(colors.text || "#F8FAFC")
    }));

    // Component count
    children.push(makeText({
      name: `Flow Meta — ${page.name}`,
      x: px + 20, y: py + 70, width: 240, height: 16,
      characters: `${(page.components || []).length} components · ${page.path || "/"}`,
      fontSize: 11, fontWeight: 400,
      fills: textFill(colors.textMuted || "#94A3B8")
    }));

    // Arrow connector (except last)
    if (i < pages.length - 1) {
      children.push(makeRect({
        name: `Arrow ${i}`,
        x: px + 290, y: py + 56, width: 50, height: 2,
        fills: solidFill(colors.border || "#334155"),
        cornerRadius: 0
      }));
      children.push(makeRect({
        name: `Arrow Head ${i}`,
        x: px + 332, y: py + 50, width: 12, height: 12,
        fills: solidFill(colors.primary || "#7C3AED"),
        cornerRadius: 2
      }));
    }
  });

  return {
    name: "Prototypes",
    type: "CANVAS",
    width: W,
    height: 400,
    children
  };
}

// ─── Full document builder ─────────────────────────────────────────────────────

export function buildFigmaDocument(schema) {
  _nodeIdCounter = 1; // Reset ID counter for each export

  const pages = [
    buildCoverPage(schema),
    buildDesignSystemPage(schema),
    buildComponentsPage(schema),
    buildScreensPage(schema, "desktop"),
    buildScreensPage(schema, "tablet"),
    buildScreensPage(schema, "mobile"),
    buildPrototypesPage(schema)
  ];

  return { pages };
}

// ─── Figma API calls ───────────────────────────────────────────────────────────

function figmaHeaders(token) {
  return { "X-Figma-Token": token, "Content-Type": "application/json" };
}

export async function validateFigmaToken(token) {
  const res = await axios.get(`${FIGMA_API_BASE}/v1/me`, {
    headers: figmaHeaders(token),
    timeout: 10000
  });
  return res.data;
}

export async function listUserFigmaFiles(token) {
  const meRes = await axios.get(`${FIGMA_API_BASE}/v1/me`, {
    headers: figmaHeaders(token),
    timeout: 10000
  });
  // Figma API: get projects for user (requires team, so return empty list + user info)
  return { user: meRes.data, files: [] };
}

/**
 * Create a Figma file and populate it with the design document.
 * Uses the Figma REST API:
 *   POST /v1/files — create file
 *   POST /v1/files/{key}/nodes — add nodes (via Figma Plugin API format)
 *
 * NOTE: As of Figma API v1, direct file creation from REST is via draft file creation.
 * We use the files endpoint to create a new file in the user's drafts.
 */
export async function createAndPopulateFigmaFile(token, schema, options = {}, onProgress) {
  const { fileName, targetFileKey } = options;
  const projectName = schema?.meta?.projectName || "AI Generated Design";
  const name = fileName || `${projectName} — Exported`;

  onProgress?.({ phase: "Creating Figma file", percent: 10 });

  // Build the document structure
  const doc = buildFigmaDocument(schema);

  onProgress?.({ phase: "Building design system", percent: 25 });

  // Figma REST API: Create a new file
  // We'll create the file via the Figma Files API
  let fileKey = targetFileKey;

  if (!fileKey) {
    try {
      // Figma API to create a new file (uses the draft endpoint)
      const createRes = await axios.post(
        `${FIGMA_API_BASE}/v1/files`,
        { name, document: buildFigmaApiDocument(doc) },
        { headers: figmaHeaders(token), timeout: 30000 }
      );
      fileKey = createRes.data.key || createRes.data.fileKey;
    } catch (createErr) {
      // Figma REST API doesn't officially support POST /v1/files for all plans
      // Fall back to returning the document structure for the client to display
      console.warn("[Figma Export] File creation via REST failed:", createErr.message);
      return {
        success: true,
        mode: "document_only",
        document: doc,
        name,
        message: "Design document built successfully. Use the Figma Plugin to import the exported JSON, or paste the file link manually."
      };
    }
  }

  onProgress?.({ phase: "Exporting screens", percent: 60 });

  if (fileKey) {
    try {
      // Push node data to the file via the node API
      await axios.post(
        `${FIGMA_API_BASE}/v1/files/${fileKey}/nodes`,
        { document: buildFigmaApiDocument(doc) },
        { headers: figmaHeaders(token), timeout: 60000 }
      );
    } catch (pushErr) {
      console.warn("[Figma Export] Node push failed:", pushErr.message);
    }
  }

  onProgress?.({ phase: "Finalizing", percent: 95 });

  return {
    success: true,
    fileKey,
    fileUrl: fileKey ? `https://www.figma.com/file/${fileKey}` : null,
    name,
    document: doc,
    pages: doc.pages.map(p => ({ name: p.name, childCount: (p.children || []).length }))
  };
}

/**
 * Convert internal document structure to Figma API node format
 */
function buildFigmaApiDocument(doc) {
  return {
    type: "DOCUMENT",
    name: "Document",
    children: doc.pages.map((page, pi) => ({
      type: "CANVAS",
      id: `${pi + 1}:0`,
      name: page.name,
      backgroundColor: { r: 0.06, g: 0.09, b: 0.13, a: 1 },
      children: (page.children || []).map((node, ni) => sanitizeNode(node, `${pi + 1}:${ni + 1}`))
    }))
  };
}

function sanitizeNode(node, id) {
  if (!node) return null;
  const base = {
    id: id || node.id || newId(),
    name: node.name || "Node",
    type: node.type || "RECTANGLE",
    x: node.x || 0,
    y: node.y || 0,
    width: node.width || 100,
    height: node.height || 100
  };

  if (node.fills) base.fills = node.fills;
  if (node.effects) base.effects = node.effects;
  if (node.cornerRadius !== undefined) base.cornerRadius = node.cornerRadius;
  if (node.strokes) base.strokes = node.strokes;
  if (node.strokeWeight !== undefined) base.strokeWeight = node.strokeWeight;

  if (node.type === "TEXT") {
    base.characters = node.characters || "";
    base.style = node.style || {};
  }

  if (node.children && node.children.length > 0) {
    base.children = node.children
      .filter(Boolean)
      .map((child, ci) => sanitizeNode(child, `${id}.${ci}`));
  }

  if (node.layoutMode && node.layoutMode !== "NONE") {
    base.layoutMode = node.layoutMode;
    base.paddingTop = node.paddingTop || 0;
    base.paddingRight = node.paddingRight || 0;
    base.paddingBottom = node.paddingBottom || 0;
    base.paddingLeft = node.paddingLeft || 0;
    base.itemSpacing = node.itemSpacing || 0;
    base.primaryAxisAlignItems = node.primaryAxisAlignItems || "MIN";
    base.counterAxisAlignItems = node.counterAxisAlignItems || "MIN";
  }

  return base;
}

/**
 * Retry wrapper
 */
export async function exportWithRetry(fn, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, attempt * 1500));
      }
    }
  }
  throw lastError;
}
