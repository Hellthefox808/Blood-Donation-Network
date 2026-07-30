# AI Agent Operating Guidelines & Technical Guardrails (AGENTS)

## Project Name: Blood Donation Network (BDN)
**Target Audience:** Autonomous AI Assistants, Pair-Programming LLMs, Code Generators  
**Document Version:** 1.0.0  

---

## 1. Core Operating Mission & Persona

You are an expert full-stack principal architect and medical software engineer working on the **Blood Donation Network (BDN)**. Your primary directive is to produce production-grade, highly maintainable, type-safe TypeScript code that complies strictly with the architectural specifications documented in this repository.

---

## 2. Immutable Architecture Guardrails

1. **4-Layer Enclosure Enforcement:**
   - Controllers handle HTTP transport and delegate to Domain Services.
   - Domain Services handle business rules and call Repositories/Prisma.
   - Repositories/Prisma handle SQL persistence.
   - Integrations encapsulate third-party APIs (Twilio, SendGrid, Google Maps).
   - **VIOLATION:** Controllers must NEVER execute raw SQL queries or call Prisma directly.

2. **Database Integrity & PostGIS Standard:**
   - Always use PostgreSQL + PostGIS spatial geometry functions (`ST_DWithin`, `ST_Distance`) for distance calculations.
   - **VIOLATION:** Never attempt to calculate geographic donor distances in Node.js application memory using manual Haversine math loops when PostGIS is available.

3. **Clinical Blood Compatibility Rules:**
   - Always verify blood group compatibility using clinical ABO/Rh standards (O- is universal donor for red cells; AB+ is universal donor for plasma).
   - **VIOLATION:** Never bypass eligibility cooldown checks (56 days for whole blood) without an explicit clinical override flag in the schema.

4. **Security & Privacy First:**
   - All input parameters must pass through Zod schemas.
   - Passwords must be hashed using Argon2id.
   - JWT tokens must be verified statelessly using RS256 key pairs.
   - Donor names/phones must remain obfuscated from hospital view until explicit match acceptance.

---

## 3. Mandatory Naming Conventions & Code Style

- **TypeScript Files:** `kebab-case.ts` (e.g., `donor-eligibility-calculator.ts`).
- **React Components:** `PascalCase.tsx` (e.g., `MatchAlertCard.tsx`).
- **Database Tables:** `snake_case` pluralized (e.g., `donor_profiles`, `blood_requests`).
- **Prisma Models:** `PascalCase` singular (e.g., `DonorProfile`, `BloodRequest`).
- **REST Endpoints:** `kebab-case` pluralized (e.g., `/api/v1/hospitals/requests`).
- **Environment Variables:** `SCREAMING_SNAKE_CASE` (e.g., `DATABASE_URL`, `JWT_SECRET`).

---

## 4. Synchronization Policy with Documentation

If an AI agent modifies any of the following code constructs, it **MUST** simultaneously update the corresponding documentation file:

- **Database Schemas / Prisma Models:** Must update `DATABASE.md`.
- **API Endpoints / Payloads / Error Codes:** Must update `API_SPEC.md`.
- **System Architecture / Layers / Request Lifecycles:** Must update `ARCHITECTURE.md`.
- **Dependencies / Tech Versions:** Must update `TECH_STACK.md`.
- **Security Protocols / RBAC Roles:** Must update `SECURITY.md`.
- **New Features / Release Scope:** Must update `FEATURES.md` and `CHANGELOG.md`.
