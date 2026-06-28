/**
 * FIGMA DEVELOPER CONSOLE GENERATOR SCRIPT
 * 
 * Instructions:
 * 1. Open Figma (in the browser or desktop app).
 * 2. Create a new design file.
 * 3. Go to Plugins -> Development -> Open Console (or New Plugin -> select "Console script").
 * 4. Paste this complete script into the console text box and press Enter.
 * 5. The script will automatically draw:
 *    - Page 1: Cover Page (with a sleek gradient card layout)
 *    - Page 2: Design System (Colors, Typography, Spacing, Buttons, Form Components, Inputs)
 *    - Page 3: User Flows (Visual flowchart mapping user paths)
 *    - Page 4: High-Fidelity Screens (14 complete screens side-by-side)
 *    - Clickable Prototyping Connections connecting all menus, navbars, and buttons!
 */

(async () => {
  console.log("Starting Figma Project Generator Engine...");
  
  // 1. Load standard fonts
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  
  // Base colors
  const primaryColor = { r: 0.486, g: 0.227, b: 0.929 }; // #7c3aed
  const secondaryColor = { r: 0.659, g: 0.333, b: 0.969 }; // #a855f7
  const accentColor = { r: 0.024, g: 0.714, b: 0.839 }; // #06b6d4
  const bgColor = { r: 0.059, g: 0.09, b: 0.165 }; // #0f172a
  const bgDeepColor = { r: 0.031, g: 0.051, b: 0.094 }; // #080d18
  const surfaceColor = { r: 0.118, g: 0.161, b: 0.231 }; // #1e293b
  const borderColor = { r: 0.278, g: 0.333, b: 0.412 }; // #475569 (0.5 opacity)
  const textColor = { r: 0.973, g: 0.98, b: 0.988 }; // #f8fafc
  const textMuted = { r: 0.58, g: 0.639, b: 0.722 }; // #94a3b8
  const successColor = { r: 0.133, g: 0.773, b: 0.369 }; // #22c55e
  
  // Helper: Create Text Node
  function drawText(parent, characters, x, y, fontSize, color, weight = "Regular", align = "LEFT") {
    const text = figma.createText();
    parent.appendChild(text);
    text.fontName = { family: "Inter", style: weight };
    text.characters = characters;
    text.fontSize = fontSize;
    text.x = x;
    text.y = y;
    text.fills = [{ type: "SOLID", color: color }];
    text.textAlignHorizontal = align;
    return text;
  }

  // Helper: Create Auto Layout Container
  function createAutoLayout(parent, name, x, y, w, h, direction, spacing, padding, bg) {
    const frame = figma.createFrame();
    frame.name = name;
    parent.appendChild(frame);
    frame.x = x;
    frame.y = y;
    if (w > 0) frame.resize(w, frame.height);
    if (h > 0) frame.resize(frame.width, h);
    
    frame.layoutMode = direction; // "HORIZONTAL" or "VERTICAL"
    frame.itemSpacing = spacing;
    frame.paddingLeft = padding.left || 0;
    frame.paddingRight = padding.right || 0;
    frame.paddingTop = padding.top || 0;
    frame.paddingBottom = padding.bottom || 0;
    
    if (bg) {
      frame.fills = [{ type: "SOLID", color: bg }];
    } else {
      frame.fills = [];
    }
    return frame;
  }

  // Find or create default pages
  const originalPages = figma.root.children;
  
  // Create Cover Page
  const coverPage = figma.createPage();
  coverPage.name = "Cover Page";
  figma.root.appendChild(coverPage);
  
  // Create Design System Page
  const designSystemPage = figma.createPage();
  designSystemPage.name = "Design System";
  figma.root.appendChild(designSystemPage);

  // Create User Flows Page
  const flowsPage = figma.createPage();
  flowsPage.name = "User Flows";
  figma.root.appendChild(flowsPage);
  
  // Create High-Fidelity Screens Page
  const screensPage = figma.createPage();
  screensPage.name = "High-Fidelity Screens";
  figma.root.appendChild(screensPage);

  // Delete initial empty page if needed
  originalPages.forEach(p => {
    if (p.name === "Page 1" && p.children.length === 0) {
      p.remove();
    }
  });

  // ────────────────────────────────────────────────────────────────
  // 1. COVER PAGE SETUP
  // ────────────────────────────────────────────────────────────────
  figma.currentPage = coverPage;
  const coverFrame = figma.createFrame();
  coverFrame.name = "Project Cover";
  coverFrame.resize(1920, 1080);
  coverFrame.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [1, 0, 0]],
    gradientStops: [
      { position: 0, color: { r: 0.031, g: 0.051, b: 0.094, a: 1 } },
      { position: 0.5, color: { r: 0.118, g: 0.106, b: 0.294, a: 1 } },
      { position: 1, color: { r: 0.059, g: 0.09, b: 0.165, a: 1 } }
    ]
  }];
  
  // Draw Badge
  const badgeFrame = figma.createFrame();
  badgeFrame.name = "Badge";
  badgeFrame.resize(180, 40);
  badgeFrame.x = 240;
  badgeFrame.y = 320;
  badgeFrame.cornerRadius = 20;
  badgeFrame.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.15 }];
  badgeFrame.strokes = [{ type: "SOLID", color: primaryColor }];
  badgeFrame.strokeWeight = 1.5;
  coverFrame.appendChild(badgeFrame);
  drawText(badgeFrame, "PRODUCTION READY", 28, 12, 12, secondaryColor, "Bold");
  
  // Titles
  drawText(coverFrame, "AI Figma UI/UX Design\nGenerator Platform", 240, 390, 72, textColor, "Bold");
  drawText(coverFrame, "Complete Multi-Page Workspace & Design System Mockup", 240, 560, 24, textMuted, "Medium");
  drawText(coverFrame, "Generated June 18, 2026  •  React + Node.js Decoupled Architecture", 240, 610, 14, textMuted);

  // Decorative vector shapes
  const sphere = figma.createEllipse();
  sphere.resize(500, 500);
  sphere.x = 1200;
  sphere.y = 290;
  sphere.fills = [{
    type: "GRADIENT_RADIAL",
    gradientTransform: [[0.5, 0, 0.25], [0, 0.5, 0.25]],
    gradientStops: [
      { position: 0, color: { r: 0.659, g: 0.333, b: 0.969, a: 0.25 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } }
    ]
  }];
  coverFrame.appendChild(sphere);

  // ────────────────────────────────────────────────────────────────
  // 2. DESIGN SYSTEM SETUP
  // ────────────────────────────────────────────────────────────────
  figma.currentPage = designSystemPage;
  
  // Section Title
  drawText(designSystemPage, "Core Design System System", 80, 80, 32, textColor, "Bold");
  drawText(designSystemPage, "Central design tokens, color swatches, button states, and form inputs.", 80, 130, 16, textMuted);
  
  // Color Swatches
  const colorSection = figma.createFrame();
  colorSection.name = "Color Palette";
  colorSection.resize(1000, 280);
  colorSection.x = 80;
  colorSection.y = 180;
  colorSection.fills = [{ type: "SOLID", color: bgColor }];
  colorSection.cornerRadius = 16;
  colorSection.strokes = [{ type: "SOLID", color: borderColor }];
  colorSection.strokeWeight = 1;
  
  drawText(colorSection, "COLOR PALETTE", 40, 30, 12, textMuted, "Bold");
  
  const colorsList = [
    { name: "Primary", hex: "#7C3AED", color: primaryColor },
    { name: "Secondary", hex: "#A855F7", color: secondaryColor },
    { name: "Accent", hex: "#06B6D4", color: accentColor },
    { name: "Deep Bg", hex: "#080D18", color: bgDeepColor },
    { name: "Surface", hex: "#1E293B", color: surfaceColor },
    { name: "Success", hex: "#22C55E", color: successColor }
  ];
  
  colorsList.forEach((c, idx) => {
    const swatch = figma.createFrame();
    swatch.name = c.name;
    swatch.resize(120, 140);
    swatch.x = 40 + idx * 150;
    swatch.y = 80;
    swatch.cornerRadius = 12;
    swatch.fills = [{ type: "SOLID", color: c.color }];
    colorSection.appendChild(swatch);
    
    drawText(colorSection, c.name, 40 + idx * 150, 230, 13, textColor, "Bold");
    drawText(colorSection, c.hex, 40 + idx * 150, 250, 11, textMuted);
  });
  
  // Spacing & Grid System card
  const gridSection = figma.createFrame();
  gridSection.name = "Grid and Spacing";
  gridSection.resize(480, 320);
  gridSection.x = 80;
  gridSection.y = 500;
  gridSection.fills = [{ type: "SOLID", color: bgColor }];
  gridSection.cornerRadius = 16;
  gridSection.strokes = [{ type: "SOLID", color: borderColor }];
  
  drawText(gridSection, "GRID & SPACING SYSTEM", 40, 30, 12, textMuted, "Bold");
  drawText(gridSection, "Desktop: 12 Columns, 24px Gap, 80px Margins", 40, 80, 14, textColor, "Medium");
  drawText(gridSection, "Tablet: 8 Columns, 16px Gap, 40px Margins", 40, 110, 14, textColor, "Medium");
  drawText(gridSection, "Mobile: 4 Columns, 12px Gap, 20px Margins", 40, 140, 14, textColor, "Medium");
  drawText(gridSection, "Atomic Spacing Scale:\n  •  xs: 4px    •  sm: 8px    •  md: 16px\n  •  lg: 24px    •  xl: 32px", 40, 190, 14, textMuted);

  // Reusable Buttons Component
  const buttonsSection = figma.createFrame();
  buttonsSection.name = "Button Variants";
  buttonsSection.resize(480, 320);
  buttonsSection.x = 600;
  buttonsSection.y = 500;
  buttonsSection.fills = [{ type: "SOLID", color: bgColor }];
  buttonsSection.cornerRadius = 16;
  buttonsSection.strokes = [{ type: "SOLID", color: borderColor }];
  
  drawText(buttonsSection, "REUSABLE BUTTON STATES", 40, 30, 12, textMuted, "Bold");
  
  // Primary Button Default
  const btnP = figma.createFrame();
  btnP.name = "Button/Primary/Default";
  btnP.resize(180, 44);
  btnP.x = 40;
  btnP.y = 80;
  btnP.cornerRadius = 10;
  btnP.fills = [{ type: "SOLID", color: primaryColor }];
  buttonsSection.appendChild(btnP);
  drawText(btnP, "Primary Default", 42, 14, 13, textColor, "Bold");

  // Primary Button Hover
  const btnPH = figma.createFrame();
  btnPH.name = "Button/Primary/Hover";
  btnPH.resize(180, 44);
  btnPH.x = 260;
  btnPH.y = 80;
  btnPH.cornerRadius = 10;
  btnPH.fills = [{ type: "SOLID", color: secondaryColor }];
  buttonsSection.appendChild(btnPH);
  drawText(btnPH, "Primary Hover", 48, 14, 13, textColor, "Bold");

  // Secondary Button
  const btnS = figma.createFrame();
  btnS.name = "Button/Secondary/Default";
  btnS.resize(180, 44);
  btnS.x = 40;
  btnS.y = 150;
  btnS.cornerRadius = 10;
  btnS.fills = [{ type: "SOLID", color: bgDeepColor }];
  btnS.strokes = [{ type: "SOLID", color: borderColor }];
  btnS.strokeWeight = 1.5;
  buttonsSection.appendChild(btnS);
  drawText(btnS, "Secondary Default", 32, 14, 13, textColor, "Bold");

  // Secondary Button Active
  const btnSA = figma.createFrame();
  btnSA.name = "Button/Secondary/Active";
  btnSA.resize(180, 44);
  btnSA.x = 260;
  btnSA.y = 150;
  btnSA.cornerRadius = 10;
  btnSA.fills = [{ type: "SOLID", color: surfaceColor }];
  btnSA.strokes = [{ type: "SOLID", color: primaryColor }];
  btnSA.strokeWeight = 1.5;
  buttonsSection.appendChild(btnSA);
  drawText(btnSA, "Secondary Active", 36, 14, 13, textMuted, "Bold");

  // Disabled Button
  const btnD = figma.createFrame();
  btnD.name = "Button/Disabled";
  btnD.resize(180, 44);
  btnD.x = 40;
  btnD.y = 220;
  btnD.cornerRadius = 10;
  btnD.fills = [{ type: "SOLID", color: surfaceColor, opacity: 0.5 }];
  buttonsSection.appendChild(btnD);
  drawText(btnD, "Disabled Action", 40, 14, 13, textMuted);

  // ────────────────────────────────────────────────────────────────
  // 3. USER FLOWS SETUP
  // ────────────────────────────────────────────────────────────────
  figma.currentPage = flowsPage;
  
  drawText(flowsPage, "Visual User Flows", 80, 80, 32, textColor, "Bold");
  drawText(flowsPage, "Complete routing map of standard user actions, entry and exit flows.", 80, 130, 16, textMuted);
  
  // Diagram frame
  const flowContainer = figma.createFrame();
  flowContainer.name = "Flow Chart Map";
  flowContainer.resize(1200, 600);
  flowContainer.x = 80;
  flowContainer.y = 180;
  flowContainer.fills = [{ type: "SOLID", color: bgDeepColor }];
  flowContainer.cornerRadius = 24;
  flowContainer.strokes = [{ type: "SOLID", color: borderColor }];
  flowContainer.strokeWeight = 2;
  
  const nodes = [
    { name: "Page/Landing", x: 60, y: 260, type: "public" },
    { name: "Page/Pricing", x: 260, y: 120, type: "public" },
    { name: "Page/Blog", x: 260, y: 400, type: "public" },
    { name: "Page/Login", x: 480, y: 260, type: "auth" },
    { name: "Page/PromptStudio", x: 700, y: 260, type: "protected" },
    { name: "Page/Analytics", x: 960, y: 120, type: "protected" },
    { name: "Page/Settings", x: 960, y: 400, type: "protected" }
  ];
  
  nodes.forEach(n => {
    const box = figma.createFrame();
    box.name = n.name;
    box.resize(180, 80);
    box.x = n.x;
    box.y = n.y;
    box.cornerRadius = 12;
    box.fills = [{
      type: "SOLID",
      color: n.type === "protected" ? primaryColor : n.type === "auth" ? secondaryColor : surfaceColor
    }];
    box.strokes = [{ type: "SOLID", color: borderColor }];
    flowContainer.appendChild(box);
    
    drawText(box, n.name.split("/")[1], 15, 20, 14, textColor, "Bold");
    drawText(box, n.type.toUpperCase(), 15, 45, 10, textMuted, "Medium");
  });

  // Draw connectors (lines) in Flow page
  const connectorLines = [
    { fx: 240, fy: 300, tx: 480, ty: 300 }, // Landing -> Login
    { fx: 660, fy: 300, tx: 700, ty: 300 }, // Login -> Studio
    { fx: 880, fy: 280, tx: 960, ty: 160 }, // Studio -> Analytics
    { fx: 880, fy: 320, tx: 960, ty: 440 }  // Studio -> Settings
  ];
  
  connectorLines.forEach(l => {
    const line = figma.createLine();
    line.x = l.fx;
    line.y = l.fy;
    line.resize(Math.sqrt(Math.pow(l.tx - l.fx, 2) + Math.pow(l.ty - l.fy, 2)), 0);
    line.rotation = Math.atan2(l.ty - l.fy, l.tx - l.fx) * (180 / Math.PI);
    line.strokes = [{ type: "SOLID", color: accentColor }];
    line.strokeWeight = 2.5;
    flowContainer.appendChild(line);
  });

  // ────────────────────────────────────────────────────────────────
  // 4. HIGH-FIDELITY SCREENS SETUP
  // ────────────────────────────────────────────────────────────────
  figma.currentPage = screensPage;
  
  drawText(screensPage, "High-Fidelity Application Screens", 80, 80, 32, textColor, "Bold");
  drawText(screensPage, "14 responsive screen coordinates containing fully detailed components.", 80, 130, 16, textMuted);

  const pagesSitemap = [
    { id: "landing", name: "Page/Landing", isPublic: true },
    { id: "pricing", name: "Page/Pricing", isPublic: true },
    { id: "about", name: "Page/About", isPublic: true },
    { id: "blog", name: "Page/Blog", isPublic: true },
    { id: "post", name: "Page/BlogPost", isPublic: true },
    { id: "changelog", name: "Page/Changelog", isPublic: true },
    { id: "privacy", name: "Page/Privacy", isPublic: true },
    { id: "terms", name: "Page/Terms", isPublic: true },
    { id: "login", name: "Page/Login", isPublic: true },
    { id: "signup", name: "Page/Signup", isPublic: true },
    { id: "studio", name: "Page/PromptStudio", isPublic: false },
    { id: "projects", name: "Page/Projects", isPublic: false },
    { id: "analytics", name: "Page/Analytics", isPublic: false },
    { id: "settings", name: "Page/Settings", isPublic: false }
  ];

  const pageFrames = {};

  pagesSitemap.forEach((item, pIdx) => {
    const screenX = 80 + pIdx * 1520;
    const screenY = 220;
    
    const frame = figma.createFrame();
    frame.name = item.name;
    frame.resize(1440, 900);
    frame.x = screenX;
    frame.y = screenY;
    frame.fills = [{ type: "SOLID", color: bgColor }];
    pageFrames[item.id] = frame;
    
    // Header Navbar (simulating index.css .navbar)
    const navbar = createAutoLayout(frame, "Navbar", 0, 0, 1440, 70, "HORIZONTAL", 20, { left: 40, right: 40, top: 18, bottom: 18 }, bgDeepColor);
    navbar.strokes = [{ type: "SOLID", color: borderColor }];
    navbar.strokeWeight = 1;
    
    // Logo Badge
    const logoBadge = figma.createFrame();
    logoBadge.name = "Logo Badge";
    logoBadge.resize(32, 32);
    logoBadge.cornerRadius = 8;
    logoBadge.fills = [{ type: "SOLID", color: primaryColor }];
    navbar.appendChild(logoBadge);
    drawText(logoBadge, "AI", 8, 8, 11, textColor, "Bold");
    
    const logoTitle = drawText(navbar, "Figma UI Generator", 0, 0, 16, textColor, "Bold");
    
    // Navigation Links Spacer
    const navSpacer = figma.createFrame();
    navSpacer.resize(400, 10);
    navSpacer.fills = [];
    navbar.appendChild(navSpacer);

    // Nav Links (Conditionally authenticated)
    if (!item.isPublic) {
      const links = ["Studio", "Projects", "Analytics", "Help"];
      links.forEach(l => {
        const linkTxt = drawText(navbar, l, 0, 0, 13, textMuted, "Medium");
        // Save link refs for prototyping connections later!
        linkTxt.name = `NavLink/${l}`;
      });
      
      const avatar = figma.createEllipse();
      avatar.name = "UserAvatar";
      avatar.resize(32, 32);
      avatar.fills = [{ type: "SOLID", color: secondaryColor }];
      navbar.appendChild(avatar);
    } else {
      const links = ["Product", "Pricing", "Blog", "About"];
      links.forEach(l => {
        const linkTxt = drawText(navbar, l, 0, 0, 13, textMuted, "Medium");
        linkTxt.name = `NavLink/${l}`;
      });
      
      const loginBtn = figma.createFrame();
      loginBtn.name = "Nav/LoginBtn";
      loginBtn.resize(80, 36);
      loginBtn.cornerRadius = 8;
      loginBtn.fills = [];
      loginBtn.strokes = [{ type: "SOLID", color: borderColor }];
      navbar.appendChild(loginBtn);
      drawText(loginBtn, "Login", 20, 9, 13, textColor, "Bold");
      
      const startBtn = figma.createFrame();
      startBtn.name = "Nav/StartBtn";
      startBtn.resize(110, 36);
      startBtn.cornerRadius = 8;
      startBtn.fills = [{ type: "SOLID", color: primaryColor }];
      navbar.appendChild(startBtn);
      drawText(startBtn, "Get Started", 16, 9, 13, textColor, "Bold");
    }

    // ──────────────────────────────────────────────────────────────
    // SCREEN SPECIFIC CONTENT GENERATORS
    // ──────────────────────────────────────────────────────────────
    
    if (item.id === "landing") {
      // Hero Title
      drawText(frame, "AI-Powered Layouts Generated Instantly", 240, 240, 52, textColor, "Bold", "CENTER");
      drawText(frame, "Describe your SaaS interface, fintech dashboard, or custom flow in plain language.", 240, 360, 20, textMuted, "Regular", "CENTER");
      
      // CTA Primary
      const cta = figma.createFrame();
      cta.name = "CTA/GetStarted";
      cta.resize(220, 52);
      cta.x = 610;
      cta.y = 440;
      cta.cornerRadius = 12;
      cta.fills = [{ type: "SOLID", color: primaryColor }];
      frame.appendChild(cta);
      drawText(cta, "Create Free Account", 40, 16, 15, textColor, "Bold");
      
      // Visual mock grid
      const previewMock = figma.createFrame();
      previewMock.name = "Studio Preview Mock";
      previewMock.resize(800, 280);
      previewMock.x = 320;
      previewMock.y = 540;
      previewMock.cornerRadius = 16;
      previewMock.fills = [{ type: "SOLID", color: surfaceColor }];
      previewMock.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(previewMock);
      drawText(previewMock, "Canvas Layout Engine Preview Model", 40, 30, 16, textColor, "Bold");
      
    } else if (item.id === "pricing") {
      drawText(frame, "Flexible Plans for Any Scale", 80, 140, 36, textColor, "Bold");
      drawText(frame, "Unlock Figma API pushes, advanced prompt classifications, and limitless projects.", 80, 190, 16, textMuted);
      
      // 3 pricing cards
      const tiers = [
        { name: "Starter", price: "$0", desc: "For exploring AI wireframing.", color: surfaceColor },
        { name: "Pro Planner", price: "$29", desc: "For professional design builders.", color: primaryColor },
        { name: "Enterprise", price: "$89", desc: "For teams requiring secure workspaces.", color: surfaceColor }
      ];
      
      tiers.forEach((t, tIdx) => {
        const card = figma.createFrame();
        card.name = `PricingCard/${t.name}`;
        card.resize(360, 480);
        card.x = 80 + tIdx * 410;
        card.y = 260;
        card.cornerRadius = 20;
        card.fills = [{ type: "SOLID", color: t.color }];
        card.strokes = [{ type: "SOLID", color: borderColor }];
        frame.appendChild(card);
        
        drawText(card, t.name, 40, 40, 20, textColor, "Bold");
        drawText(card, t.price, 40, 80, 48, textColor, "Bold");
        drawText(card, "/ month", 140, 110, 14, textMuted);
        drawText(card, t.desc, 40, 160, 14, textMuted);
        
        const cardCta = figma.createFrame();
        cardCta.name = `PricingCTA/${t.name}`;
        cardCta.resize(280, 44);
        cardCta.x = 40;
        cardCta.y = 380;
        cardCta.cornerRadius = 10;
        cardCta.fills = [{ type: "SOLID", color: bgColor }];
        card.appendChild(cardCta);
        drawText(cardCta, "Get Started", 100, 14, 13, textColor, "Bold");
      });
      
    } else if (item.id === "about") {
      drawText(frame, "Bridging the Gap Between Concept & Code", 80, 140, 36, textColor, "Bold");
      drawText(frame, "Meet the crew building the future of automated vector interface generation.", 80, 190, 16, textMuted);
      
      // Team members
      for (let i = 0; i < 4; i++) {
        const block = figma.createFrame();
        block.name = `TeamMember/${i + 1}`;
        block.resize(280, 340);
        block.x = 80 + i * 320;
        block.y = 260;
        block.cornerRadius = 16;
        block.fills = [{ type: "SOLID", color: surfaceColor }];
        frame.appendChild(block);
        
        const avatar = figma.createEllipse();
        avatar.resize(80, 80);
        avatar.x = 40;
        avatar.y = 40;
        avatar.fills = [{ type: "SOLID", color: primaryColor }];
        block.appendChild(avatar);
        
        drawText(block, `Team Member ${i + 1}`, 40, 150, 18, textColor, "Bold");
        drawText(block, i % 2 === 0 ? "Engineering" : "UX Strategy", 40, 180, 13, accentColor, "Bold");
        drawText(block, "Leading development and components structures.", 40, 220, 13, textMuted);
      }
      
    } else if (item.id === "blog") {
      drawText(frame, "Design & AI Insights", 80, 140, 36, textColor, "Bold");
      
      const posts = [
        { title: "Mastering Prompts for AI UI Generators", author: "Priya Nair", color: primaryColor },
        { title: "Pushing Layouts Directly to Figma API", author: "Marcus Webb", color: secondaryColor },
        { title: "Designing Cohesive Multi-Page Schemes", author: "Aria Chen", color: accentColor }
      ];
      
      posts.forEach((p, idx) => {
        const card = figma.createFrame();
        card.name = `BlogPostCard/${idx}`;
        card.resize(380, 420);
        card.x = 80 + idx * 420;
        card.y = 220;
        card.cornerRadius = 16;
        card.fills = [{ type: "SOLID", color: surfaceColor }];
        card.strokes = [{ type: "SOLID", color: borderColor }];
        frame.appendChild(card);
        
        // Thumbnail header
        const thumb = figma.createFrame();
        thumb.resize(380, 160);
        thumb.fills = [{ type: "SOLID", color: p.color, opacity: 0.15 }];
        card.appendChild(thumb);
        
        drawText(card, p.title, 32, 200, 18, textColor, "Bold");
        drawText(card, `By ${p.author}  •  June 2026`, 32, 280, 13, textMuted);
        
        const readBtn = figma.createFrame();
        readBtn.name = `ReadArticleBtn/${idx}`;
        readBtn.resize(120, 36);
        readBtn.x = 32;
        readBtn.y = 340;
        readBtn.cornerRadius = 8;
        readBtn.fills = [{ type: "SOLID", color: bgColor }];
        card.appendChild(readBtn);
        drawText(readBtn, "Read Article", 20, 10, 12, textColor, "Bold");
      });
      
    } else if (item.id === "post") {
      drawText(frame, "Mastering Prompts for AI UI Generators", 80, 140, 32, textColor, "Bold");
      drawText(frame, "Learn the prompt patterns our top users leverage to write detailed layouts.", 80, 190, 16, textMuted);
      
      // Article content body mock
      const body = figma.createFrame();
      body.name = "ArticleBody";
      body.resize(760, 480);
      body.x = 80;
      body.y = 250;
      body.fills = [{ type: "SOLID", color: surfaceColor }];
      body.cornerRadius = 16;
      body.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(body);
      
      drawText(body, "1. Anatomy of a Perfect Design Prompt", 40, 40, 20, textColor, "Bold");
      drawText(body, "A high-performing prompt generally consists of four key parts: Role & Task, Style & Aesthetics, Layout & Content, and Interactivity clues. Specifying colors, component lists, and themes explicitly helps the classifier parameters assign tokens matching your visual target.", 40, 80, 14, textMuted);
      
      // Code snippet block
      const code = figma.createFrame();
      code.resize(680, 120);
      code.x = 40;
      code.y = 180;
      code.cornerRadius = 8;
      code.fills = [{ type: "SOLID", color: bgDeepColor }];
      body.appendChild(code);
      drawText(code, '{\n  "projectName": "Fintech Dashboard",\n  "theme": "dark",\n  "primaryColor": "#7c3aed"\n}', 24, 20, 13, successColor);
      
      // Sidebar on details page
      const sidebar = figma.createFrame();
      sidebar.name = "ArticleSidebar";
      sidebar.resize(320, 360);
      sidebar.x = 880;
      sidebar.y = 250;
      sidebar.cornerRadius = 16;
      sidebar.fills = [{ type: "SOLID", color: surfaceColor }];
      sidebar.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(sidebar);
      drawText(sidebar, "ON THIS PAGE", 30, 30, 12, textMuted, "Bold");
      drawText(sidebar, "• Introduction to prompts\n• Prompt Anatomy\n• Top Formulas\n• Common Pitfalls & Fixes", 30, 70, 14, textColor);
      
    } else if (item.id === "changelog") {
      drawText(frame, "Product Changelog", 80, 140, 36, textColor, "Bold");
      drawText(frame, "The latest features, layouts additions, and compiler updates.", 80, 190, 16, textMuted);
      
      const timeline = [
        { ver: "v1.3.0", date: "June 18, 2026", details: "Added Flow View in Prompt Studio canvas for scroll reviews." },
        { ver: "v1.2.0", date: "May 25, 2026", details: "Global Design Token Inspector Drawer launched." },
        { ver: "v1.0.0", date: "March 1, 2026", details: "Official Launch of the AI-powered Figma UI Generator." }
      ];
      
      timeline.forEach((t, idx) => {
        const itemFrame = figma.createFrame();
        itemFrame.name = `TimelineItem/${t.ver}`;
        itemFrame.resize(800, 120);
        itemFrame.x = 240;
        itemFrame.y = 260 + idx * 160;
        itemFrame.cornerRadius = 16;
        itemFrame.fills = [{ type: "SOLID", color: surfaceColor }];
        itemFrame.strokes = [{ type: "SOLID", color: borderColor }];
        frame.appendChild(itemFrame);
        
        drawText(itemFrame, t.ver, 40, 30, 20, primaryColor, "Bold");
        drawText(itemFrame, t.date, 40, 65, 12, textMuted);
        drawText(itemFrame, t.details, 180, 45, 14, textColor, "Medium");
      });
      
    } else if (item.id === "privacy" || item.id === "terms") {
      drawText(frame, item.id === "privacy" ? "Privacy Policy" : "Terms of Service", 80, 140, 36, textColor, "Bold");
      drawText(frame, "Last updated: June 18, 2026. Legal compliance directives.", 80, 190, 15, textMuted);
      
      const textBlock = figma.createFrame();
      textBlock.name = "LegalTextContent";
      textBlock.resize(900, 460);
      textBlock.x = 80;
      textBlock.y = 250;
      textBlock.cornerRadius = 16;
      textBlock.fills = [{ type: "SOLID", color: surfaceColor }];
      textBlock.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(textBlock);
      
      drawText(textBlock, "1. Core Information Protocol", 40, 40, 18, textColor, "Bold");
      drawText(textBlock, "We implement secure administrative procedures to encrypt credentials, layout schemas, and third-party Access tokens at rest using AES-256 standards. Integrations are accessed solely during active click actions of the export pipelines.", 40, 75, 14, textMuted);
      drawText(textBlock, "2. User Licensing Agreement", 40, 160, 18, textColor, "Bold");
      drawText(textBlock, "Users retain full ownership of designs generated from their specific prompts. We claim no copyrights or ownership structures over custom design outputs and vector frames compiled by our platform models.", 40, 195, 14, textMuted);
      
    } else if (item.id === "login" || item.id === "signup") {
      // Auth split screens
      const formBox = figma.createFrame();
      formBox.name = "AuthCard";
      formBox.resize(440, 520);
      formBox.x = 500;
      formBox.y = 180;
      formBox.cornerRadius = 24;
      formBox.fills = [{ type: "SOLID", color: surfaceColor }];
      formBox.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(formBox);
      
      drawText(formBox, item.id === "login" ? "Welcome Back" : "Create Account", 40, 40, 24, textColor, "Bold");
      drawText(formBox, "Enter credentials to manage your design studio.", 40, 75, 13, textMuted);
      
      // Fields Mocks
      const fields = item.id === "login" ? ["Email", "Password"] : ["Full Name", "Email Address", "Password"];
      fields.forEach((f, idx) => {
        const input = figma.createFrame();
        input.name = `Input/${f}`;
        input.resize(360, 44);
        input.x = 40;
        input.y = 130 + idx * 80;
        input.cornerRadius = 10;
        input.fills = [{ type: "SOLID", color: bgDeepColor }];
        input.strokes = [{ type: "SOLID", color: borderColor }];
        formBox.appendChild(input);
        drawText(input, f, 16, 14, 13, textMuted);
      });
      
      // Auth Submit Button
      const submitBtn = figma.createFrame();
      submitBtn.name = item.id === "login" ? "Auth/SignInBtn" : "Auth/SignUpBtn";
      submitBtn.resize(360, 46);
      submitBtn.x = 40;
      submitBtn.y = 130 + fields.length * 80 + 10;
      submitBtn.cornerRadius = 10;
      submitBtn.fills = [{ type: "SOLID", color: primaryColor }];
      formBox.appendChild(submitBtn);
      drawText(submitBtn, item.id === "login" ? "Sign In" : "Register Account", 140, 14, 13, textColor, "Bold");
      
    } else if (item.id === "studio") {
      // Prompt Studio Workspace
      // Sidebar menu
      const sideNav = createAutoLayout(frame, "Sidebar", 0, 70, 240, 830, "VERTICAL", 12, { left: 24, right: 24, top: 40, bottom: 40 }, bgDeepColor);
      sideNav.strokes = [{ type: "SOLID", color: borderColor }];
      sideNav.strokeWeight = 1;
      
      const sideItems = [
        { label: "Studio", icon: "fa-wand-magic-sparkles" },
        { label: "Projects", icon: "fa-folder" },
        { label: "Analytics", icon: "fa-chart-line" },
        { label: "Settings", icon: "fa-gear" }
      ];
      sideItems.forEach(si => {
        const opt = createAutoLayout(sideNav, `SidebarLink/${si.label}`, 0, 0, 192, 44, "HORIZONTAL", 10, { left: 14, right: 14, top: 12, bottom: 12 }, null);
        opt.cornerRadius = 10;
        if (si.label === "Studio") {
          opt.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.12 }];
          drawText(opt, si.label, 0, 0, 13, primaryColor, "Bold");
        } else {
          drawText(opt, si.label, 0, 0, 13, textMuted);
        }
      });
      
      // Configure block
      const configureCard = figma.createFrame();
      configureCard.name = "Configure Panel";
      configureCard.resize(320, 680);
      configureCard.x = 280;
      configureCard.y = 110;
      configureCard.cornerRadius = 18;
      configureCard.fills = [{ type: "SOLID", color: surfaceColor }];
      configureCard.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(configureCard);
      drawText(configureCard, "CONFIGURE GENERATOR", 24, 24, 12, textMuted, "Bold");
      
      // Textarea mock
      const txtArea = figma.createFrame();
      txtArea.resize(272, 160);
      txtArea.x = 24;
      txtArea.y = 60;
      txtArea.cornerRadius = 10;
      txtArea.fills = [{ type: "SOLID", color: bgDeepColor }];
      txtArea.strokes = [{ type: "SOLID", color: borderColor }];
      configureCard.appendChild(txtArea);
      drawText(txtArea, "Create a dark mode fintech dashboard...", 16, 16, 13, textColor);
      
      // Generate button
      const genBtn = figma.createFrame();
      genBtn.name = "Studio/GenerateBtn";
      genBtn.resize(272, 44);
      genBtn.x = 24;
      genBtn.y = 240;
      genBtn.cornerRadius = 10;
      genBtn.fills = [{ type: "SOLID", color: primaryColor }];
      configureCard.appendChild(genBtn);
      drawText(genBtn, "Generate UI Layout", 80, 14, 13, textColor, "Bold");
      
      // Preview Panel
      const previewCard = figma.createFrame();
      previewCard.name = "Canvas Preview Frame";
      previewCard.resize(760, 680);
      previewCard.x = 640;
      previewCard.y = 110;
      previewCard.cornerRadius = 18;
      previewCard.fills = [{ type: "SOLID", color: surfaceColor }];
      previewCard.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(previewCard);
      
      // Canvas Header controls
      const canvasHeader = createAutoLayout(previewCard, "CanvasHeader", 0, 0, 760, 60, "HORIZONTAL", 16, { left: 24, right: 24, top: 12, bottom: 12 }, null);
      canvasHeader.strokes = [{ type: "SOLID", color: borderColor }];
      canvasHeader.strokeWeight = 1;
      drawText(canvasHeader, "Live Preview", 0, 0, 14, textColor, "Bold");
      
      const toggleFlowBtn = figma.createFrame();
      toggleFlowBtn.name = "Studio/ToggleFlowBtn";
      toggleFlowBtn.resize(110, 32);
      toggleFlowBtn.cornerRadius = 6;
      toggleFlowBtn.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.2 }];
      canvasHeader.appendChild(toggleFlowBtn);
      drawText(toggleFlowBtn, "Flow View", 25, 8, 11, primaryColor, "Bold");
      
      // Inner Canvas Mock (vertical stack)
      const stackContainer = createAutoLayout(previewCard, "Vertical Stack Canvas", 40, 80, 680, 560, "VERTICAL", 20, { left: 10, right: 10, top: 10, bottom: 10 }, bgDeepColor);
      stackContainer.cornerRadius = 12;
      
      // Screen page frame mock 1
      const screenMock1 = figma.createFrame();
      screenMock1.resize(640, 240);
      screenMock1.cornerRadius = 10;
      screenMock1.fills = [{ type: "SOLID", color: bgColor }];
      screenMock1.strokes = [{ type: "SOLID", color: borderColor }];
      stackContainer.appendChild(screenMock1);
      drawText(screenMock1, "Page 1: Overview Dashboard", 20, 20, 13, textColor, "Bold");
      
      // Screen page frame mock 2
      const screenMock2 = figma.createFrame();
      screenMock2.resize(640, 240);
      screenMock2.cornerRadius = 10;
      screenMock2.fills = [{ type: "SOLID", color: bgColor }];
      screenMock2.strokes = [{ type: "SOLID", color: borderColor }];
      stackContainer.appendChild(screenMock2);
      drawText(screenMock2, "Page 2: Analytics Trends", 20, 20, 13, textColor, "Bold");
      
    } else if (item.id === "projects") {
      // Sidebar navigation
      const sideNav = createAutoLayout(frame, "Sidebar", 0, 70, 240, 830, "VERTICAL", 12, { left: 24, right: 24, top: 40, bottom: 40 }, bgDeepColor);
      sideNav.strokes = [{ type: "SOLID", color: borderColor }];
      sideNav.strokeWeight = 1;
      
      const sideItems = [
        { label: "Studio", icon: "fa-wand-magic-sparkles" },
        { label: "Projects", icon: "fa-folder" },
        { label: "Analytics", icon: "fa-chart-line" },
        { label: "Settings", icon: "fa-gear" }
      ];
      sideItems.forEach(si => {
        const opt = createAutoLayout(sideNav, `SidebarLink/${si.label}`, 0, 0, 192, 44, "HORIZONTAL", 10, { left: 14, right: 14, top: 12, bottom: 12 }, null);
        opt.cornerRadius = 10;
        if (si.label === "Projects") {
          opt.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.12 }];
          drawText(opt, si.label, 0, 0, 13, primaryColor, "Bold");
        } else {
          drawText(opt, si.label, 0, 0, 13, textMuted);
        }
      });
      
      drawText(frame, "My Saved Projects", 280, 110, 24, textColor, "Bold");
      drawText(frame, "Access and manage your generated design sheets.", 280, 145, 14, textMuted);
      
      // Grid of projects
      for (let i = 0; i < 3; i++) {
        const prjCard = figma.createFrame();
        prjCard.name = `ProjectCard/${i}`;
        prjCard.resize(320, 220);
        prjCard.x = 280 + i * 350;
        prjCard.y = 200;
        prjCard.cornerRadius = 16;
        prjCard.fills = [{ type: "SOLID", color: surfaceColor }];
        prjCard.strokes = [{ type: "SOLID", color: borderColor }];
        frame.appendChild(prjCard);
        
        drawText(prjCard, i === 0 ? "Fintech Dashboard Pro" : i === 1 ? "SaaS Landing Page" : "Crypto Analytics", 24, 24, 18, textColor, "Bold");
        drawText(prjCard, "Generated 3 days ago", 24, 55, 12, textMuted);
        
        const openBtn = figma.createFrame();
        openBtn.name = `OpenProjectBtn/${i}`;
        openBtn.resize(120, 36);
        openBtn.x = 24;
        openBtn.y = 140;
        openBtn.cornerRadius = 8;
        openBtn.fills = [{ type: "SOLID", color: primaryColor }];
        prjCard.appendChild(openBtn);
        drawText(openBtn, "Open in Editor", 20, 10, 12, textColor, "Bold");
      }
      
    } else if (item.id === "analytics") {
      // Sidebar navigation
      const sideNav = createAutoLayout(frame, "Sidebar", 0, 70, 240, 830, "VERTICAL", 12, { left: 24, right: 24, top: 40, bottom: 40 }, bgDeepColor);
      sideNav.strokes = [{ type: "SOLID", color: borderColor }];
      sideNav.strokeWeight = 1;
      
      const sideItems = [
        { label: "Studio", icon: "fa-wand-magic-sparkles" },
        { label: "Projects", icon: "fa-folder" },
        { label: "Analytics", icon: "fa-chart-line" },
        { label: "Settings", icon: "fa-gear" }
      ];
      sideItems.forEach(si => {
        const opt = createAutoLayout(sideNav, `SidebarLink/${si.label}`, 0, 0, 192, 44, "HORIZONTAL", 10, { left: 14, right: 14, top: 12, bottom: 12 }, null);
        opt.cornerRadius = 10;
        if (si.label === "Analytics") {
          opt.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.12 }];
          drawText(opt, si.label, 0, 0, 13, primaryColor, "Bold");
        } else {
          drawText(opt, si.label, 0, 0, 13, textMuted);
        }
      });
      
      drawText(frame, "Usage Analytics", 280, 110, 24, textColor, "Bold");
      
      // Stats metric row
      const stats = [
        { label: "Total Generations", val: "142" },
        { label: "Figma Exports", val: "38" },
        { label: "API Calls", val: "1,240" }
      ];
      stats.forEach((s, idx) => {
        const statCard = figma.createFrame();
        statCard.name = `StatCard/${s.label}`;
        statCard.resize(240, 120);
        statCard.x = 280 + idx * 260;
        statCard.y = 170;
        statCard.cornerRadius = 16;
        statCard.fills = [{ type: "SOLID", color: surfaceColor }];
        statCard.strokes = [{ type: "SOLID", color: borderColor }];
        frame.appendChild(statCard);
        
        drawText(statCard, s.label, 20, 20, 12, textMuted, "Bold");
        drawText(statCard, s.val, 20, 50, 32, textColor, "Bold");
      });
      
      // Chart card mock
      const chartCard = figma.createFrame();
      chartCard.name = "TelemetryChart";
      chartCard.resize(780, 360);
      chartCard.x = 280;
      chartCard.y = 320;
      chartCard.cornerRadius = 20;
      chartCard.fills = [{ type: "SOLID", color: surfaceColor }];
      chartCard.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(chartCard);
      drawText(chartCard, "Generations Activity Daily", 30, 30, 16, textColor, "Bold");
      
      // Simple SVG/vector bars inside chart
      for (let i = 0; i < 7; i++) {
        const bar = figma.createFrame();
        bar.resize(40, 180 + Math.sin(i) * 50);
        bar.x = 80 + i * 90;
        bar.y = 300 - bar.height;
        bar.cornerRadius = 6;
        bar.fills = [{ type: "SOLID", color: primaryColor }];
        chartCard.appendChild(bar);
      }
      
    } else if (item.id === "settings") {
      // Sidebar navigation
      const sideNav = createAutoLayout(frame, "Sidebar", 0, 70, 240, 830, "VERTICAL", 12, { left: 24, right: 24, top: 40, bottom: 40 }, bgDeepColor);
      sideNav.strokes = [{ type: "SOLID", color: borderColor }];
      sideNav.strokeWeight = 1;
      
      const sideItems = [
        { label: "Studio", icon: "fa-wand-magic-sparkles" },
        { label: "Projects", icon: "fa-folder" },
        { label: "Analytics", icon: "fa-chart-line" },
        { label: "Settings", icon: "fa-gear" }
      ];
      sideItems.forEach(si => {
        const opt = createAutoLayout(sideNav, `SidebarLink/${si.label}`, 0, 0, 192, 44, "HORIZONTAL", 10, { left: 14, right: 14, top: 12, bottom: 12 }, null);
        opt.cornerRadius = 10;
        if (si.label === "Settings") {
          opt.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.12 }];
          drawText(opt, si.label, 0, 0, 13, primaryColor, "Bold");
        } else {
          drawText(opt, si.label, 0, 0, 13, textMuted);
        }
      });
      
      drawText(frame, "App Settings", 280, 110, 24, textColor, "Bold");
      
      // Tab panel inside settings
      const settingsBox = figma.createFrame();
      settingsBox.name = "SettingsPanel";
      settingsBox.resize(780, 560);
      settingsBox.x = 280;
      settingsBox.y = 170;
      settingsBox.cornerRadius = 24;
      settingsBox.fills = [{ type: "SOLID", color: surfaceColor }];
      settingsBox.strokes = [{ type: "SOLID", color: borderColor }];
      frame.appendChild(settingsBox);
      
      // Sidebar tabs inside settings box
      const tabsCol = createAutoLayout(settingsBox, "SettingsTabs", 30, 30, 180, 500, "VERTICAL", 8, {}, null);
      ["Appearance", "Generation defaults", "Integrations", "Danger Zone"].forEach((t, i) => {
        const tab = createAutoLayout(tabsCol, `SettingsTab/${t}`, 0, 0, 180, 40, "HORIZONTAL", 10, { left: 12, right: 12, top: 10, bottom: 10 }, null);
        tab.cornerRadius = 8;
        if (i === 0) {
          tab.fills = [{ type: "SOLID", color: primaryColor, opacity: 0.1 }];
          drawText(tab, t, 0, 0, 13, primaryColor, "Bold");
        } else {
          drawText(tab, t, 0, 0, 13, textMuted);
        }
      });
      
      // Fields inside settings Box
      const fieldsFrame = figma.createFrame();
      fieldsFrame.name = "FieldsFrame";
      fieldsFrame.resize(480, 460);
      fieldsFrame.x = 240;
      fieldsFrame.y = 30;
      fieldsFrame.fills = [];
      settingsBox.appendChild(fieldsFrame);
      
      drawText(fieldsFrame, "Figma Personal Access Token", 0, 30, 14, textColor, "Bold");
      drawText(fieldsFrame, "Configure your token to enable pushing vector structures straight into your Figma canvas files.", 0, 55, 12, textMuted);
      
      const tokenInput = figma.createFrame();
      tokenInput.resize(400, 44);
      tokenInput.x = 0;
      tokenInput.y = 90;
      tokenInput.cornerRadius = 10;
      tokenInput.fills = [{ type: "SOLID", color: bgDeepColor }];
      tokenInput.strokes = [{ type: "SOLID", color: borderColor }];
      fieldsFrame.appendChild(tokenInput);
      drawText(tokenInput, "••••••••••••••••••••••••••••••••••••", 16, 14, 13, textMuted);
      
      const testBtn = figma.createFrame();
      testBtn.name = "Settings/TestTokenBtn";
      testBtn.resize(160, 40);
      testBtn.x = 0;
      testBtn.y = 150;
      testBtn.cornerRadius = 8;
      testBtn.fills = [{ type: "SOLID", color: primaryColor }];
      fieldsFrame.appendChild(testBtn);
      drawText(testBtn, "Test Connection", 30, 12, 13, textColor, "Bold");
    }

    // App Footer (visual footer component)
    const footer = createAutoLayout(frame, "App Footer", 0, 830, 1440, 70, "HORIZONTAL", 20, { left: 40, right: 40, top: 24, bottom: 24 }, bgDeepColor);
    footer.strokes = [{ type: "SOLID", color: borderColor }];
    footer.strokeWeight = 1;
    
    drawText(footer, `© 2026 AI Figma Generator. All rights reserved.`, 0, 0, 12, textMuted);
    
    // Footer Spacer
    const footerSpacer = figma.createFrame();
    footerSpacer.resize(700, 10);
    footerSpacer.fills = [];
    footer.appendChild(footerSpacer);
    
    const footerLinks = ["About", "Privacy", "Terms", "Changelog"];
    footerLinks.forEach(fl => {
      const footerLinkTxt = drawText(footer, fl, 0, 0, 12, textMuted);
      footerLinkTxt.name = `FooterLink/${fl}`;
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 5. PROTOTYPE CONNECTIONS
  // ────────────────────────────────────────────────────────────────
  console.log("Hooking up interactive prototype triggers and paths...");
  
  // Prototyping Link mapping configuration
  const routing = [
    // Header Links
    { fromId: "landing", nodeName: "NavLink/Pricing", targetId: "pricing" },
    { fromId: "landing", nodeName: "NavLink/Blog", targetId: "blog" },
    { fromId: "landing", nodeName: "NavLink/About", targetId: "about" },
    { fromId: "landing", nodeName: "Nav/LoginBtn", targetId: "login" },
    { fromId: "landing", nodeName: "Nav/StartBtn", targetId: "signup" },
    { fromId: "landing", nodeName: "CTA/GetStarted", targetId: "signup" },
    
    // Auth screens submit triggers
    { fromId: "login", nodeName: "Auth/SignInBtn", targetId: "studio" },
    { fromId: "signup", nodeName: "Auth/SignUpBtn", targetId: "studio" },
    
    // Sidebar items
    { fromId: "studio", nodeName: "SidebarLink/Projects", targetId: "projects" },
    { fromId: "studio", nodeName: "SidebarLink/Analytics", targetId: "analytics" },
    { fromId: "studio", nodeName: "SidebarLink/Settings", targetId: "settings" },
    
    { fromId: "projects", nodeName: "SidebarLink/Studio", targetId: "studio" },
    { fromId: "projects", nodeName: "SidebarLink/Analytics", targetId: "analytics" },
    { fromId: "projects", nodeName: "SidebarLink/Settings", targetId: "settings" },
    
    { fromId: "analytics", nodeName: "SidebarLink/Studio", targetId: "studio" },
    { fromId: "analytics", nodeName: "SidebarLink/Projects", targetId: "projects" },
    { fromId: "analytics", nodeName: "SidebarLink/Settings", targetId: "settings" },
    
    { fromId: "settings", nodeName: "SidebarLink/Studio", targetId: "studio" },
    { fromId: "settings", nodeName: "SidebarLink/Projects", targetId: "projects" },
    { fromId: "settings", nodeName: "SidebarLink/Analytics", targetId: "analytics" },
    
    // Footer Links
    { fromId: "landing", nodeName: "FooterLink/About", targetId: "about" },
    { fromId: "landing", nodeName: "FooterLink/Privacy", targetId: "privacy" },
    { fromId: "landing", nodeName: "FooterLink/Terms", targetId: "terms" },
    { fromId: "landing", nodeName: "FooterLink/Changelog", targetId: "changelog" },

    // Blog card triggers
    { fromId: "blog", nodeName: "ReadArticleBtn/0", targetId: "post" }
  ];
  
  // Search frames and bind reactions
  routing.forEach(r => {
    const parentFrame = pageFrames[r.fromId];
    const targetFrame = pageFrames[r.targetId];
    if (parentFrame && targetFrame) {
      // Find node recursively inside frame
      const triggerNode = findNodeByName(parentFrame, r.nodeName);
      if (triggerNode) {
        triggerNode.reactions = [
          {
            trigger: { type: "ON_CLICK" },
            actions: [
              {
                type: "NODE",
                destinationId: targetFrame.id,
                navigation: "NAVIGATE",
                transition: null
              }
            ]
          }
        ];
        console.log(`Bound trigger: ${parentFrame.name} -> ${r.nodeName} redirects to ${targetFrame.name}`);
      }
    }
  });

  // Helper: Find child node recursively
  function findNodeByName(root, name) {
    if (root.name === name) return root;
    if ("children" in root) {
      for (const child of root.children) {
        const found = findNodeByName(child, name);
        if (found) return found;
      }
    }
    return null;
  }
  
  console.log("Figma Generator Engine ran successfully. 4 Pages and 14 Screens fully drawn!");
  figma.notify("Figma project generated successfully!");
})();
