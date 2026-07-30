# Claude Assistant Quick Reference & Rules (CLAUDE.md)

## Project Context: Blood Donation Network (BDN)
Full-stack Next.js (TypeScript) + Node.js/Express (TypeScript) + PostgreSQL 16 (PostGIS) platform connecting local blood donors with hospitals in real time.

---

## 1. Frequently Used Development Commands

```bash
# === BACKEND COMMANDS (cd backend) ===
npm run dev               # Start backend API dev server (http://localhost:5000)
npm run build             # Compile TypeScript to dist/
npm run test:unit         # Run Jest unit tests
npm run test:integration  # Run Supertest integration tests
npx prisma migrate dev    # Apply Prisma schema migrations
npx prisma db seed        # Populate seed data (Admin, Hospitals, Donors)
npx prisma studio         # Launch Prisma visual database GUI

# === FRONTEND COMMANDS (cd frontend) ===
npm run dev               # Start Next.js frontend dev server (http://localhost:3000)
npm run build             # Build production Next.js bundle
npm run lint              # Run ESLint check
npx playwright test       # Run Playwright E2E browser tests
```

---

## 2. Codebase Architecture Guardrails

- **Strict 4-Layer Boundaries:** `Controllers -> Services -> Repositories/Prisma -> Database`. Controllers must never execute Prisma queries directly.
- **PostGIS Geospatial Queries:** Spatial matching MUST use PostGIS SQL functions (`ST_DWithin`, `ST_Distance`). Do not perform spatial distance loops in JavaScript.
- **Type Safety:** Shared DTOs and API interfaces must be typed using Zod schemas and TypeScript types. Do not use `any`.
- **Error Response Standard:** APIs must return standard RFC 7807 JSON error responses.

---

## 3. Mandatory Documentation Sync

When editing endpoints, models, or roles, update these files:
- Schema changes -> `DATABASE.md`
- Endpoint changes -> `API_SPEC.md`
- Role / Auth changes -> `SECURITY.md`
- Version / Dependency changes -> `TECH_STACK.md`
