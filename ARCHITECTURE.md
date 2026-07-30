# Technical Architecture (ARCHITECTURE)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  
**Pattern:** Clean Layered Architecture with Event-Driven Real-Time Extensions  

---

## 1. Architectural Layers Overview

BDN uses a strict 4-layer architecture to ensure separation of concerns, testability, and long-term maintainability.

```
+-----------------------------------------------------------------------+
|                       1. PRESENTATION LAYER                           |
|   Next.js 14+ (App Router) | React Components | Tailwind CSS | PWA   |
+-----------------------------------++----------------------------------+
                                    || HTTP REST / WebSockets (TLS 1.3)
                                    v
+-----------------------------------------------------------------------+
|                         2. SERVICE LAYER                              |
|   Express Controllers | Middleware | Domain Services | Validator (Zod) |
+-----------------------------------++----------------------------------+
                                    || Direct Invocation / Events
                                    v
+-----------------------------------------------------------------------+
|                          3. DATA LAYER                                |
|   Prisma ORM | PostgreSQL 16 (PostGIS) | Redis 7 (Cache & Sessions)   |
+-----------------------------------++----------------------------------+
                                    || Egress Adapters
                                    v
+-----------------------------------------------------------------------+
|                       4. INTEGRATION LAYER                            |
|    Twilio SMS | SendGrid Email | Google Maps API | BullMQ Workers    |
+-----------------------------------------------------------------------+
```

---

## 2. Layer Specifications

### 2.1 Presentation Layer
- **Framework:** Next.js 14+ utilizing React Server Components (RSC) for landing pages and Client Components (`"use client"`) for interactive dashboards.
- **State Management:** TanStack Query (React Query) for server state caching and optimistic UI updates; Zustand for lightweight global application state (user auth sessions, active socket connection state).
- **Styling & Components:** Tailwind CSS framework styled with custom accessible design tokens (WCAG 2.1 AA compliant), combined with Lucide React iconography and Radix UI headless primitives.
- **Real-Time Client:** Socket.io client listening for events (`request:new_match`, `match:accepted`, `inventory:threshold_alert`).

### 2.2 Service Layer
- **Runtime:** Node.js 20 LTS executing a TypeScript Express application.
- **Controller Layer:** Parses HTTP payloads, extracts JWT authentication context from middleware, delegates business logic to specialized Domain Services, and formats standard RFC 7807 responses.
- **Domain Services:**
  - `AuthService`: Password hashing (Argon2id), JWT generation/verification, OAuth token validation.
  - `DonorService`: Health pre-screening evaluation, cooldown calculation, spatial availability toggles.
  - `RequestService`: Blood compatibility calculation, radius-based donor matching, status transitions.
  - `InventoryService`: Stock logging, expiry threshold warnings, batch transfers.
  - `AuditService`: Asynchronous writing of system events to `audit_logs`.
- **Validation Middleware:** Zod schema validation interceptors ensuring all incoming body, query, and path parameters meet strict type specifications prior to reaching controllers.

### 2.3 Data Layer
- **Primary Database:** PostgreSQL 16 relational database with the `postgis` extension enabled for spatial querying.
- **Object-Relational Mapping (ORM):** Prisma ORM handling schema migrations, connection pooling, typed query building, and relational joins.
- **Cache & Key-Value Store:** Redis 7 cluster used for:
  - Session token blacklist (revoked JWTs).
  - API rate-limiting token buckets.
  - Geocoded address spatial coordinate caching (24h TTL).
  - Socket.io connection state and pub/sub message broker.

### 2.4 Integration Layer
- **Notification Services:** Outbound HTTP client wrapper for Twilio SMS and SendGrid Transactional Email APIs.
- **Geospatial Mapping:** Google Maps Geocoding and Distance Matrix API integration.
- **Background Worker Engine:** BullMQ framework running on Node.js worker processes reading jobs from Redis queues (`notifications-queue`, `reports-queue`, `cleanup-queue`).

---

## 3. End-to-End Request Lifecycle

```
[ Client ] 
    |
    | 1. HTTP POST /api/v1/requests (Bearer JWT)
    v
[ Perimeter WAF / NGINX ]
    |
    | 2. Rate Limiting Check & SSL Termination
    v
[ Express Application ]
    |
    | 3. AuthMiddleware (Verify JWT signature & RBAC claims)
    | 4. ValidateMiddleware (Zod Schema parsing)
    v
[ RequestController ]
    |
    | 5. Invoke RequestService.createBloodRequest(payload)
    v
[ RequestService ]
    |
    | 6. Compute compatibility matrix (e.g., O- can donate to all)
    | 7. Call SpatialQueryRepository (PostGIS spatial query for donors within radius)
    v
[ PostgreSQL 16 DB ]
    |
    | 8. Save BloodRequest & Match records inside ACID transaction
    v
[ RequestService ]
    |
    | 9. Publish event 'REQUEST_CREATED' to Redis Event Bus
    v
+-----------------------+-----------------------+
|                       |                       |
v                       v                       v
[ Socket.io Server ]    [ BullMQ Notification Queue ] [ AuditService ]
|                       |                             |
| 10a. Send WS event    | 10b. Worker calls           | 10c. Write entry
| to online donors      | Twilio SMS API              | to audit_logs
v                       v                             v
[ Donor Device ]        [ Donor Mobile SMS ]          [ Database ]
```

---

## 4. Module Boundaries & Encapsulation

To maintain clean separation, dependencies flow unidirectionally inwards towards domain models:

```
[ Controllers ] ---> [ Services ] ---> [ Repositories / Prisma ] ---> [ Database ]
      |                   |
      v                   v
[ Middlewares ]     [ Integrations / Workers ]
```

### Strict Rules:
1. Controllers must **never** call database models or Prisma client directly; all database interaction must pass through domain services or repository modules.
2. Integration wrappers (Twilio/SendGrid) must implement clean TypeScript interfaces (`INotificationProvider`), allowing mock implementations to be swapped seamlessly during unit testing.
3. Domain entities (e.g., `DonorEligibilityCalculator`) must remain pure TypeScript logic without external HTTP or DB dependencies.

---

## 5. Scalability & Resilience Strategy

### 5.1 Horizontal Scaling
- **Stateless API Layer:** The Express backend contains no in-memory session state. JWTs are verified statelessly using public RS256 key pairs. Multiple Express nodes can be deployed behind a Round-Robin NGINX load balancer.
- **WebSocket Scaling:** Socket.io utilizes the `socket.io-redis` adapter, allowing client connections to be distributed across multiple WebSocket nodes while maintaining instant broadcast capabilities.

### 5.2 Database Performance & High Availability
- **Read/Write Splitting:** Prisma configured with primary PostgreSQL node for writes (ACID transactions) and read-replicas for heavy query operations (analytics, dashboard tables).
- **Spatial Indexing:** GIST indexes created on `donor_profiles.location` and `hospitals.location` geometry columns for sub-second spatial queries.

### 5.3 Asynchronous Queue Resilience
- **Decoupled Job Execution:** Time-consuming operations (SMS dispatches, report generation) are offloaded to BullMQ workers backed by Redis persistence.
- **Dead-Letter Queue (DLQ):** Failed notification jobs are routed to a DLQ after 3 retries for operator review and manual re-execution.

---

## 6. Architectural Rationale Summary

| Architectural Decision | Chosen Solution | Alternative Considered | Justification |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Express.js (TypeScript) | NestJS / Fastify | Express offers a battle-tested, flexible middleware ecosystem with zero framework lock-in, making code clear and maintainable. |
| **Primary Database** | PostgreSQL 16 + PostGIS | MongoDB | Relational integrity and ACID transactions are critical for inventory and request fulfillment. PostGIS provides native spatial queries far superior to MongoDB `$near` indexing. |
| **Data Access Layer** | Prisma ORM | TypeORM / Raw SQL | Prisma offers compile-time type safety, automated database migrations, and clean query syntax. |
| **Background Processing** | Redis + BullMQ | AWS SQS / RabbitMQ | Redis is already required for caching and WebSocket state; BullMQ provides rich delayed queue features without additional infrastructure overhead. |
