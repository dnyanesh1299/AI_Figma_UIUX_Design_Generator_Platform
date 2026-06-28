<div align="center">

<img src="https://img.shields.io/badge/AI%20Powered-GPT--4o--mini-6366f1?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/Figma-REST%20API-0891b2?style=for-the-badge&logo=figma&logoColor=white" />
<img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Express%204.21-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Prisma%20ORM-3730a3?style=for-the-badge&logo=postgresql&logoColor=white" />

<br /><br />

# 🎨 AI Figma UI/UX Design Generator Platform

### *From natural language prompt → live responsive preview → Figma export — in seconds.*

<p align="center">
  <strong>Describe a UI in plain English. Get a fully framed, multi-device, production-ready design.</strong><br />
  No Figma expertise required. No coding. Just your idea.
</p>
x   
<br />

<img src="./screenshots/Screenshot (380).png" alt="AI Figma Prompt Studio Screenshot" width="800" />
<img src="./screenshots/Screenshot (381).png" alt="AI Figma Prompt Studio Screenshot" width="800" />
<img src="./screenshots/Screenshot (382).png" alt="AI Figma Prompt Studio Screenshot" width="800" />
<img src="./screenshots/Screenshot (384).png" alt="AI Figma Prompt Studio Screenshot" width="800" />

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg?style=flat-square)](#)

</div>

---

## 📖 Table of Contents

- [✨ What is this?](#-what-is-this)
- [🚀 Key Features](#-key-features)
- [🎬 How It Works](#-how-it-works)
- [🏗️ Architecture](#️-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Tech Stack](#️-tech-stack)
- [🛢️ Database Schema](#️-database-schema)
- [🔐 Security Model](#-security-model)
- [📡 API Reference](#-api-reference)
- [🧠 AI Pipeline](#-ai-pipeline)
- [📦 Export Formats](#-export-formats)
- [🚦 Getting Started](#-getting-started)
- [🌍 Environment Variables](#-environment-variables)
- [🤝 Contributing](#-contributing)
- [🗺️ Roadmap](#️-roadmap)

---

## ✨ What is this?

The **AI Figma UI/UX Design Generator Platform** eliminates the most expensive bottleneck in modern product development: the design-to-code gap.

Traditional workflows look like this:

```
Designer spends hours in Figma → Developer re-codes everything from scratch → Fidelity is lost → Repeat
```

Our platform collapses that into:

```
You type a description → AI generates a structured design schema → Live preview renders instantly → Export to Figma / HTML / ZIP
```

> **Real-world example:** A startup founder types *"dark mode crypto dashboard with coin grid, live chart, and transaction table"* — within 15 seconds they have a fully framed, themed, multi-page Figma file ready to share with their team.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🧠 **Prompt Studio** | Conversational AI workspace with classification engine, preset style pills, and iterative refinement |
| 🖥️ **Live Preview Canvas** | Real-time rendering across Desktop (12-col), Tablet (8-col), and Mobile (4-col stacked) viewports |
| 🎨 **Figma Export** | Pushes complete canvas hierarchy — frames, auto-layouts, components, colours — directly to Figma REST API |
| 📦 **6 Export Formats** | JSON Schema · HTML/CSS · ZIP Archive · SVG · Copy JSON · Figma |
| 🔄 **Design Refinement** | Modify existing designs with plain-language instructions without starting over |
| 🔐 **Enterprise Auth** | Dual-token JWT rotation + Google OAuth + GitHub OAuth + secure HttpOnly cookies |
| 📊 **Analytics Dashboard** | SVG-rendered charts for generation history, export formats, and usage metrics |
| 📁 **Project History** | Every generation saved to database — replay and compare past designs instantly |

---

## 🎬 How It Works

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DESIGN GENERATION PIPELINE                     │
│                                                                        │
│   1. INPUT          2. CLASSIFY         3. GENERATE        4. RENDER  │
│   ─────────         ────────────        ────────────        ─────────  │
│   User types   →   LLM extracts    →   LLM produces   →   Canvas     │
│   a prompt         platform, style,    full JSON           maps JSON   │
│                    complexity,         design schema       → HTML/CSS  │
│                    page goals                                           │
│                                                                        │
│   5. SANITIZE       6. STORE           7. EXPORT                       │
│   ────────────      ──────────         ──────────                      │
│   7-step JSON   →   Save to DB     →   JSON / HTML /                  │
│   purification      for history        ZIP / SVG /                     │
│   chain             & analytics        Figma REST API                  │
└──────────────────────────────────────────────────────────────────────┘
```

### The JSON Sanitizer — Fault-Tolerant Parsing

LLMs don't always return clean JSON. Our sanitizer applies a 7-step recovery chain before falling back:

```
Raw LLM Output
    │
    ├─ 1. Strip <think>…</think> DeepSeek reasoning tokens
    ├─ 2. Remove ```json … ``` markdown fences
    ├─ 3. Extract outermost { } bounding object
    ├─ 4. Regex fix trailing commas  /,\s*([}\]])/g
    ├─ 5. JSON.parse() ──► SUCCESS → return
    ├─ 6. Replace single quotes with double quotes
    ├─ 7. JSON.parse() ──► SUCCESS → return
    └─ 8. getFallbackDesign() → return static template
```

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TD
    Client[⚛️ React Frontend — Port 5173] <-->|HttpOnly Cookies| Server[🖥️ Express Server — Port 4000]
    Server <-->|Prisma ORM| DB[(🐘 PostgreSQL)]
    Server -->|OAuth Callback| OAuth[Google / GitHub]
    Server -->|Transactional Email| SMTP[📧 SMTP Server]
    Server -->|AI Generation| OpenRouter[🤖 OpenRouter API]
    Server -->|Frame Export| FigmaAPI[🎨 Figma REST API]
    Server -->|Image Proxy| Pollinations[🖼️ Pollinations AI]
```

### Backend Layered Architecture

Every HTTP request passes through a strict pipeline:

```
[ HTTP Request ]
       │
       ▼
[ Rate Limiter ]      ← Blocks IPs exceeding request thresholds
       │
       ▼
[ Auth Middleware ]   ← Decodes JWT cookie, appends req.user
       │
       ▼
[ Zod Validator ]     ← Validates payload schema, blocks injections
       │
       ▼
[ Controller ]        ← Extracts params, delegates to service
       │
       ▼
[ Service Layer ]     ← Business logic, prompt compilation, AI calls
       │
       ▼
[ Repository ]        ← Prisma queries, database transactions
       │
       ▼
[ PostgreSQL ]
```

### Frontend SPA Architecture

```
<AuthProvider>               ← Global auth state, token refresh interceptor
  <BrowserRouter>
    <MainLayout>             ← Navbar + Footer wrapper
      /                      → LandingPage
      /explore               → ExplorePage
      /pricing               → PricingPage
      /blog                  → BlogPage
      /help                  → HelpPage
      <ProtectedRoute>       ← Redirects unauthenticated users to /login
        /studio              → PromptStudioPage   ⭐ Core feature
        /export              → ExportCenterPage
        /projects            → ProjectsPage
        /analytics           → AnalyticsPage
        /settings            → SettingsPage
        /profile             → ProfilePage
      </ProtectedRoute>
    </MainLayout>
  </BrowserRouter>
</AuthProvider>
```

---

## 🗂️ Project Structure

```
ai-figma-uiux-design-generator-platform/
│
├── 📄 package.json               # Root project config & scripts
├── 📄 vite.config.js             # Vite build config (port 5173)
├── 📄 start-project.bat          # Windows one-click dev launcher
├── 📄 figma_generator_script.js  # Standalone Figma Plugin API script
│
├── 📁 src/                       # React Frontend SPA
│   ├── main.jsx                  # Application entrypoint
│   ├── App.jsx                   # Router + ProtectedRoute definitions
│   ├── index.css                 # Design system: tokens, glass, animations
│   │
│   ├── 📁 components/
│   │   ├── MainLayout.jsx        # Navbar + Footer frame
│   │   ├── Navbar.jsx            # Multi-device nav with profile drawer
│   │   ├── ProtectedRoute.jsx    # Auth guard → redirects to /login
│   │   ├── PreviewRenderer.jsx   # ⭐ Core canvas engine (JSON → HTML/CSS)
│   │   ├── FigmaExportModal.jsx  # Figma PAT input + file selector
│   │   ├── ExportProgressModal.jsx
│   │   └── ExportFormatCard.jsx
│   │
│   ├── 📁 context/
│   │   └── AuthContext.jsx       # Global auth state + refresh callbacks
│   │
│   ├── 📁 lib/
│   │   ├── api.js                # Fetch wrapper with credentials
│   │   ├── figmaExport.js        # Client-side Figma export mapper
│   │   ├── svgExport.js          # SVG string generator from design tokens
│   │   └── exporters/
│   │       ├── index.js          # Export format registry
│   │       ├── jsonExporter.js   # JSON schema download
│   │       ├── htmlCssExporter.js # HTML + CSS compiler
│   │       └── zipExporter.js    # JSZip multi-file packager
│   │
│   └── 📁 pages/
│       ├── PromptStudioPage.jsx  # ⭐ Main design workspace
│       ├── ExportCenterPage.jsx  # Export hub
│       ├── LandingPage.jsx
│       ├── ExplorePage.jsx       # Template gallery
│       ├── AnalyticsPage.jsx     # SVG charts dashboard
│       ├── ProjectsPage.jsx
│       ├── SettingsPage.jsx      # Figma PAT + integration storage
│       ├── ProfilePage.jsx
│       ├── LoginPage.jsx
│       ├── SignupPage.jsx
│       ├── ForgotPasswordPage.jsx
│       └── ResetPasswordPage.jsx
│
└── 📁 server/                    # Node.js + Express + Prisma Backend
    ├── .env.example              # Environment variable template
    ├── package.json
    │
    ├── 📁 prisma/
    │   ├── schema.prisma         # Data model definitions
    │   └── seed.js               # Roles + permissions seeder
    │
    └── 📁 src/
        ├── server.js             # HTTP server bootstrap
        ├── app.js                # Middleware pipeline (CORS, Helmet, rate limits)
        │
        ├── 📁 config/
        │   ├── env.js            # Environment variable validator
        │   ├── passport.js       # Google + GitHub OAuth strategies
        │   └── prisma.js         # Shared PrismaClient instance
        │
        ├── 📁 middleware/
        │   ├── auth.js           # JWT decode + requireRole + requirePermission
        │   ├── rateLimit.js      # Per-endpoint rate limit windows
        │   └── validate.js       # Zod schema request validator
        │
        ├── 📁 utils/
        │   ├── jsonSanitizer.js  # ⭐ 7-step LLM output recovery chain
        │   ├── asyncHandler.js   # Express async error interceptor
        │   ├── crypto.js         # SHA-256 token hashing
        │   ├── errors.js         # AppError custom wrapper
        │   └── mailer.js         # Nodemailer SMTP transport
        │
        ├── 📁 validators/
        │   └── design.validator.js # Zod: blocks injections + spam + gibberish
        │
        ├── 📁 prompts/
        │   └── design.prompts.js   # ⭐ Classification + generation system prompts
        │
        ├── 📁 services/
        │   ├── ai.service.js       # ⭐ Two-step LLM pipeline orchestrator
        │   ├── openrouter.service.js # OpenRouter REST client
        │   ├── figmaExport.service.js # JSON → Figma canvas hierarchy converter
        │   ├── history.service.js
        │   └── export.service.js
        │
        └── 📁 modules/auth/        # Decoupled auth domain
            ├── auth.controller.js
            ├── auth.service.js
            ├── auth.repository.js
            ├── auth.routes.js
            └── auth.validators.js
```

---

## ⚙️ Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | Declarative UI, fast component state updates |
| **Build Tool** | Vite | 5.4.10 | Native ESM, instant HMR, optimized bundles |
| **Routing** | React Router DOM | 6.28.1 | Nested layouts, ProtectedRoute support |
| **HTTP Client** | Axios | 1.16.1 | Auto JSON transform, custom interceptors |
| **ZIP Export** | JSZip | 3.10.1 | Client-side compression, zero server disk I/O |
| **Backend** | Express.js | 4.21.2 | Minimal, robust middleware ecosystem |
| **Database** | PostgreSQL | Latest | Relational integrity for users, sessions, history |
| **ORM** | Prisma | 5.19.1 | Type-safe client, auto migrations, no raw SQL injection |
| **Auth** | JWT + Passport.js | — | Dual-token rotation + Google/GitHub OAuth |
| **Validation** | Zod | 3.23.8 | Schema-first input validation with type extraction |
| **Password Hashing** | bcryptjs | 2.4.3 | Pure JS — no C++ build issues on Windows |
| **Security Headers** | Helmet | 8.0.0 | CSP, clickjacking protection, HSTS |
| **Rate Limiting** | express-rate-limit | 7.4.1 | Per-endpoint IP throttling |
| **Email** | Nodemailer | 6.10.0 | SMTP password reset emails |
| **AI Gateway** | OpenRouter | — | Unified LLM access (GPT-4o-mini) at low cost |
| **AI Images** | Pollinations AI | — | Free prompt-to-image for canvas previews |
| **Figma** | Figma REST API v1 | — | Frame + component publishing |

---

## 🛢️ Database Schema

```
┌─────────┐
│  roles  │  name, permissions (JSON)
└────┬────┘
     │ 1:N
┌────▼────────────────────────────────────────────────────────┐
│                          users                               │
│  id · name · email · passwordHash · authProvider · roleId   │
└──┬──────┬──────────┬──────────────┬──────────────────────────┘
   │      │          │              │
   │1:N   │1:N       │1:N           │1:N
┌──▼──┐ ┌─▼────────┐ ┌▼──────────┐ ┌▼────────────────────┐
│sessions│password_resets│ exports │ │generation_histories │
│       │          │            │ │ prompt · schema(JSON)│
└───────┘ └──────────┘ └──────────┘ └─────────────────────┘
```

**Key design decisions:**
- All child tables use `onDelete: Cascade` — deleting a user cleans up everything
- UUID primary keys prevent enumeration attacks
- Indexes on `email`, `userId`, `createdAt` keep queries fast at scale
- `generation_histories.schema` stores full JSON blobs for audit and replay
- Password reset tokens stored as SHA-256 hashes only — raw token never persisted

---

## 🔐 Security Model

### Dual-Token JWT Architecture

```
Access Token                    Refresh Token
─────────────                   ─────────────
• Contains: userId, role,       • Duration: 30 days
  permissions                   • Storage: PostgreSQL sessions table
• Duration: 15 minutes          • Rotation: Revoked + reissued on every
• Storage: HttpOnly cookie        use (prevents replay attacks)
• Blocks: XSS token theft       • Cascade: Deleted with user account
```

### OWASP Mitigation Matrix

| Risk | Mitigation |
|---|---|
| **A01 Broken Access Control** | `requireRole` + `requirePermission` middleware validates JWT claims on every protected route |
| **A03 Injection** | Prisma parameterised queries + Zod regex blocks SQL keywords and script tags in prompts |
| **A07 Auth Failures** | HttpOnly cookies + `SameSite: Lax` + token rotation on every refresh |
| **Brute Force** | Rate limits: login 10/15min · forgot-password 5/hr · general auth 20/15min |
| **XSS / Clickjacking** | Helmet.js enforces strict CSP, `X-Frame-Options: DENY`, and HSTS |
| **Payload DOS** | `express.json({ limit: '1mb' })` rejects oversized request bodies |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register + set JWT cookies | Public |
| `POST` | `/api/auth/login` | Login + set HttpOnly cookies | Public |
| `POST` | `/api/auth/refresh` | Rotate refresh token → new pair | Cookie |
| `POST` | `/api/auth/logout` | Revoke session, clear cookies | Cookie |
| `POST` | `/api/auth/forgot-password` | Send reset email (rate-limited) | Public |
| `POST` | `/api/auth/reset-password` | Validate token + update password | Public |
| `GET`  | `/api/auth/me` | Get current user profile | JWT |
| `GET`  | `/api/auth/google` | Initiate Google OAuth flow | Public |
| `GET`  | `/api/auth/github` | Initiate GitHub OAuth flow | Public |

### Design Generation

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/generate-design` | Run full 2-step AI pipeline → return JSON schema | JWT |
| `POST` | `/api/modify-design` | Refine existing schema with natural language edit | JWT |

**Example request:**
```json
POST /api/generate-design
{
  "prompt": "Dark mode fintech dashboard with transaction table, metric cards, and a line chart"
}
```

**Example response:**
```json
{
  "status": "success",
  "classification": { "platform": "web", "style": "dark-finance", "complexity": "medium" },
  "data": {
    "meta": { "projectName": "Fintech Dashboard", "theme": "dark" },
    "tokens": { "colors": { "primary": "#6366f1", "background": "#0b0f19" } },
    "pages": [
      {
        "id": "dashboard",
        "components": [
          { "id": "nav-1", "type": "navbar", "position": { "x": 0, "y": 0, "w": 12, "h": 1 } }
        ]
      }
    ]
  }
}
```

### Figma & Exports

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/figma/export` | Push schema to Figma REST API | JWT |
| `GET`  | `/api/figma/files` | List recent Figma files for user's token | JWT |
| `GET`  | `/api/export/download/:id` | Serve JSON schema as file attachment | JWT |
| `GET`  | `/api/history` | List user's generation history | JWT |
| `GET`  | `/api/images/pollinations` | Proxy Pollinations AI image generation | JWT |

---

## 🧠 AI Pipeline

The platform uses a **two-step LLM pipeline** via OpenRouter:

### Step 1 — Classification (Fast, Cheap)
Sends the user's prompt to GPT-4o-mini with a structured extraction schema. Returns:
```json
{
  "platform": "web",
  "style": "glassmorphism",
  "complexity": "high",
  "pageGoal": "conversion",
  "colorMood": "dark-purple",
  "components": ["hero", "features-grid", "pricing", "cta"]
}
```

### Step 2 — Schema Generation (Full Pipeline)
Injects the classification metadata + design system rules + grid constraints into a rich system prompt, then generates the complete JSON schema with all pages, components, tokens, and layout coordinates.

### Supported Component Types

```
navbar  ·  sidebar  ·  hero  ·  card  ·  metric-card  ·  chart
data-table  ·  form  ·  button  ·  footer  ·  image  ·  gallery
testimonials  ·  pricing-card  ·  timeline  ·  stats-row
```

### Responsive Grid Logic

| Viewport | Grid | Logic |
|---|---|---|
| Desktop | 12 columns | Components placed at exact `x`, `w` from schema |
| Tablet | 8 columns | `Math.round((w / 12) * 8)` — proportional scaling |
| Mobile | 4 columns | All components stack full-width (`w: 4, x: 0`) |

---

## 📦 Export Formats

| Format | Method | Description |
|---|---|---|
| **JSON Schema** | Client | Raw design schema — machine-readable, versionable |
| **HTML + CSS** | Client | Standalone responsive page with CSS custom properties |
| **ZIP Archive** | Client (JSZip) | All HTML pages + shared CSS + assets + README.md |
| **SVG** | Client | Vector graphics from design tokens — copy to clipboard |
| **Copy JSON** | Client | One-click clipboard copy for API integrations |
| **Figma Export** | Server → Figma API | Full canvas hierarchy: frames, components, auto-layouts |

> All exports except Figma are generated **entirely in the browser** — zero server disk writes.

### Figma Direct Export Integration

<div align="center">
  <img src="./screenshots/figma_integration_preview.png" alt="Figma Direct Publishing Integration" width="700" />
</div>

---

## 🚦 Getting Started

### Prerequisites

- Node.js `>=18.0.0`
- PostgreSQL `>=14`
- An [OpenRouter](https://openrouter.ai) API key
- A [Figma](https://figma.com) Personal Access Token *(optional, for Figma export)*

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-figma-uiux-design-generator.git
cd ai-figma-uiux-design-generator
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 3. Configure environment variables

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your values (see Environment Variables section below)

# Frontend
echo 'VITE_API_URL="http://localhost:4000/api"' > .env
```

### 4. Set up the database

```bash
cd server

# Run migrations
npx prisma migrate dev

# Seed roles and permissions
npm run prisma:seed

cd ..
```

### 5. Start development servers

**Windows (one-click):**
```bash
start-project.bat
```

**Manual:**
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm run dev
```

### 6. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 |

---

## 🌍 Environment Variables

### Backend (`server/.env`)

```env
# Server
PORT=4000

# Database
DATABASE_URL="postgresql://postgres:root@localhost:5432/ai_figma_platform?schema=public"

# JWT
JWT_ACCESS_SECRET="your_super_secret_access_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="30d"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/auth/google/callback"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"

# Frontend URL (for CORS + OAuth redirects)
FRONTEND_URL="http://localhost:5173"

# SMTP (for password reset emails)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your_smtp_username"
SMTP_PASS="your_smtp_password"
EMAIL_FROM="noreply@yourplatform.com"

# AI
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key"
OPENROUTER_MODEL="openai/gpt-4o-mini"
```

### Frontend (`.env`)

```env
VITE_API_URL="http://localhost:4000/api"
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo and create your branch
git checkout -b feature/your-amazing-feature

# Make your changes, then commit
git commit -m "feat: add your amazing feature"

# Push and open a PR
git push origin feature/your-amazing-feature
```

Please follow the existing code style — Controllers handle extraction, Services handle logic, Repositories handle database queries. Keep them separate.

---

## 🗺️ Roadmap

- [ ] **Redis Rate Limiting** — Replace memory-based limiter for production cluster support
- [ ] **Automated Testing** — Jest unit tests + Cypress E2E test suite
- [ ] **Interactive Node Editing** — Drag-and-drop component repositioning on canvas
- [ ] **Local LLM Support** — WebGPU-accelerated Llama-3-8B for offline, zero-cost generation
- [ ] **Team Collaboration** — Real-time multi-user canvas with CRDT state sync
- [ ] **Custom Design Systems** — Brand token enforcement and company style guides
- [ ] **Component Library Export** — Export as React/Vue component files, not just HTML
- [ ] **Version History** — Visual diff between design iterations

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by the engineering team.

*Star ⭐ the repo if this project helped you — it means a lot!*

</div>