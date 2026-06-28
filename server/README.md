# Phase 5 Authentication System (Node.js + PostgreSQL)

## Overview

This backend implements production-ready authentication and authorization for the AI Figma UI/UX Design Generator Platform:

- Local signup/login with bcrypt hashing
- JWT access + refresh tokens
- Persistent DB-backed multi-device sessions
- Token rotation + session revocation
- Role/permission authorization
- Google and GitHub OAuth
- Forgot/reset password with hashed reset tokens

## Stack

- Node.js + Express
- PostgreSQL + Prisma
- Passport OAuth (`google`, `github`)
- Zod input validation
- Helmet, CORS, cookie-parser, express-rate-limit

## Project Structure

```
server/
  prisma/
    schema.prisma
    seed.js
    migrations/...
  src/
    app.js
    server.js
    config/
      env.js
      passport.js
      prisma.js
    middleware/
      auth.js
      rateLimit.js
      validate.js
    modules/
      auth/
        auth.utils.js
        controllers/auth.controller.js
        repositories/auth.repository.js
        routes/auth.routes.js
        services/auth.service.js
        validators/auth.validators.js
    routes/index.js
    utils/
      asyncHandler.js
      crypto.js
      errors.js
      mailer.js
```

## Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Install deps:

```bash
npm install
```

3. Run migrations:

```bash
npx prisma migrate dev
```

4. Seed roles:

```bash
npm run prisma:seed
```

5. Start API:

```bash
npm run dev
```

Server runs at `http://localhost:4000`.

## Auth API

Base: `/api/auth`

- `POST /signup`
- `POST /login`
- `POST /refresh`
- `POST /logout`
- `POST /logout-all` (auth required)
- `GET /me` (auth required)
- `POST /forgot-password`
- `POST /reset-password`
- `GET /google`
- `GET /google/callback`
- `GET /github`
- `GET /github/callback`

## Security Notes

- Passwords are hashed via `bcryptjs` (`saltRounds=12`)
- Refresh tokens are DB-tracked, revocable, and rotated
- Password reset tokens are hashed (`SHA-256`) before storage
- Brute-force controls on auth and forgot-password routes
- Error responses are sanitized
- Auth cookies are `httpOnly`, `sameSite=lax`, and `secure` in production

## OAuth Setup

### Google
- Authorized redirect URI: `${GOOGLE_CALLBACK_URL}`
- Enable profile + email scopes

### GitHub
- Callback URL: `${GITHUB_CALLBACK_URL}`
- Enable user email access

## Frontend Integration

Frontend expects:

- API URL in `VITE_API_URL` (default `http://localhost:4000/api`)
- Cookie-based auth (`credentials: include`)
- OAuth entry points:
  - `${VITE_API_URL}/auth/google`
  - `${VITE_API_URL}/auth/github`
