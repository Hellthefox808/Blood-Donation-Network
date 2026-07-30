# Technology Stack Specification (TECH_STACK)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

---

## 1. Selected Technology Matrix

```
+-------------------------------------------------------------------------------+
|                             FRONTEND & PRESENTATION                           |
| Next.js 14.2+ | React 18.3 | TypeScript 5.4 | Tailwind CSS 3.4 | TanStack Query|
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                              BACKEND & API LAYER                              |
| Node.js 20 LTS | Express 4.19 | TypeScript 5.4 | Prisma 5.14 | Zod Validation |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                            PERSISTENCE & INFRASTRUCTURE                       |
| PostgreSQL 16 (PostGIS) | Redis 7.2 | Socket.io 4.7 | BullMQ 5.7 | Docker  |
+-------------------------------------------------------------------------------+
```

---

## 2. Core Stack Component Justification & Tradeoff Analysis

### 2.1 Frontend Framework: Next.js 14+ (App Router)
- **Version:** `^14.2.0`
- **Why Selected:** Next.js provides hybrid rendering capabilities. Public pages (landing, donor FAQ, hospital registration info) use Server-Side Rendering (SSR) for optimal SEO and fast initial page load times. Interactive dashboards (Hospital Request Manager, Donor Console) leverage React Client Components with client-side state hydration.
- **Alternatives Considered:**
  - *Vite + React SPA:* Lacks native SSR capabilities, requiring separate server configuration for SEO and open-graph emergency share tags.
  - *Remix / React Router v6:* Excellent data loading semantics, but smaller community ecosystem for pre-built accessible UI primitives compared to Next.js.
- **Tradeoffs:** Next.js App Router has a steep learning curve regarding server/client component boundary separation, but provides unmatched developer velocity and deployment integration.

### 2.2 Backend Framework: Node.js 20 LTS + Express.js
- **Version:** Node.js `v20.12.0 LTS`, Express `^4.19.2`, TypeScript `^5.4.5`
- **Why Selected:** Node.js offers an asynchronous, event-driven I/O model ideal for real-time WebSocket communication and concurrent API requests. Express provides a lightweight, transparent HTTP pipeline with minimal abstraction layer overhead.
- **Alternatives Considered:**
  - *NestJS:* Highly structured dependency injection framework, but introduces excessive boilerplate for a targeted, clean 4-layer domain architecture.
  - *Go (Gin/Echo):* Superior CPU bound performance and memory footprint, but slower feature iteration speed compared to full-stack TypeScript (shared types between frontend and backend).
- **Tradeoffs:** Express requires explicit architecture discipline (enforced via our strict 4-layer guidelines) to prevent messy route handlers.

### 2.3 Database Engine: PostgreSQL 16 + PostGIS
- **Version:** PostgreSQL `16.2`, PostGIS extension `3.4`
- **Why Selected:** Blood donation coordination requires strict ACID compliance for inventory deduction and request status transitions. PostGIS provides industry-standard spatial functions (`ST_DWithin`, `ST_Distance`) for high-performance proximity matching of donors within dynamic kilometer radii.
- **Alternatives Considered:**
  - *MongoDB:* Dynamic schema flexibility is attractive, but lack of native spatial indexing with complex relational joins (such as donor eligibility matrix + hospital verification + request status) leads to application-level join performance bottlenecks.
  - *MySQL 8.0:* Spatial support exists but lacks the mature spatial function ecosystem of PostGIS.
- **Tradeoffs:** PostgreSQL requires explicit schema migrations and connection pool management (handled via Prisma and PgBouncer).

### 2.4 Data Access Layer: Prisma ORM
- **Version:** `^5.14.0`
- **Why Selected:** Prisma automatically generates end-to-end TypeScript types based on database schema definitions, eliminating runtime type mismatch bugs between backend code and SQL queries.
- **Alternatives Considered:**
  - *TypeORM:* Flexible active record pattern, but plagued by complex migration bugs and weaker type inference.
  - *Kysely / Drizzle ORM:* Lightweight SQL query builders with great performance, but Prisma's schema declarative syntax and migration CLI were preferred for rapid domain modeling.
- **Tradeoffs:** Raw SQL queries are required for advanced PostGIS spatial distance joins, which Prisma handles cleanly via `prisma.$queryRaw`.

### 2.5 In-Memory Store & Queue: Redis 7 + BullMQ
- **Version:** Redis `7.2`, BullMQ `^5.7.0`
- **Why Selected:** Redis provides sub-millisecond key-value storage for JWT revoking blacklists, rate limiting counters, and spatial geocode lookup caching. BullMQ uses Redis streams to guarantee reliable, persistent background job execution for SMS dispatches and email broadcasts.
- **Alternatives Considered:**
  - *RabbitMQ / AWS SQS:* Dedicated message brokers, but introduce extra infrastructure operational overhead for local and small-scale deployments.
- **Tradeoffs:** Redis requires persistent disk snapshotting (`AOF/RDB`) to prevent queue job loss during container restarts.

---

## 3. Supporting Tools & Utility Libraries

| Utility Category | Package / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Schema Validation** | Zod | `^3.23.0` | Runtime validation of API inputs and environment variables. |
| **Password Hashing** | Argon2 | `^0.40.0` | OWASP-recommended password hashing standard (Argon2id variant). |
| **Real-Time WS** | Socket.io | `^4.7.5` | WebSockets server with fallback polling and room broadcasting. |
| **SMS Communications** | Twilio Node SDK | `^5.0.0` | Outbound SMS dispatch for critical donor emergency alerts. |
| **Email Dispatch** | SendGrid Mail | `^8.1.0` | Outbound transactional email delivery for verification & reports. |
| **Testing Suite** | Jest + Supertest | `^29.7.0` | Unit, service layer, and integration HTTP endpoint testing. |
| **E2E Testing** | Playwright | `^1.44.0` | Browser automation testing for donor and hospital portal user flows. |
| **HTTP Logging** | Morgan + Winston | `^3.13.0` | Structured JSON logging with severity levels (INFO, WARN, ERROR). |

---

## 4. Version Lock & Dependency Governance Policy

1. **LTS Commitment:** Node.js major versions must track Active LTS releases (even-numbered releases: v20, v22).
2. **Exact Pinning:** Dependencies in `package.json` must pin minor versions (e.g., `"express": "4.19.2"`) to ensure reproducible Docker production builds.
3. **Security Audits:** Automated `npm audit` scanning integrated into GitHub Actions CI pipeline; builds fail on any `HIGH` or `CRITICAL` severity vulnerability disclosures.
