# Backend Architecture Specification (docs/backend-architecture)

## Project Name: Blood Donation Network (BDN)
**Runtime:** Node.js v20 LTS / Express.js / TypeScript 5.4  
**Data Access:** Prisma ORM v5 / PostgreSQL 16 + PostGIS  
**Document Version:** 2.0.0  

---

## 1. Modular Layer Separation & Responsibilities

```
src/
├── controllers/    # Transport Layer: Extracts HTTP inputs, calls Service, formats RFC 7807 response
├── services/       # Application & Domain Layer: Pure business logic, cooldown math, spatial queries
├── repositories/   # Persistence Layer: Prisma client queries and PostGIS $queryRaw SQL bindings
├── middleware/     # Interceptor Layer: JWT verification, RBAC checks, Zod validation, Rate limiting
├── utils/          # Pure Helper Utilities: Blood compatibility matrix, password hashing, JWT tools
└── config/         # Environment & Database Singleton connections
```

---

## 2. Centralized Error Handling & Response Contracts

All backend exceptions are intercepted by `error.middleware.ts` and formatted according to RFC 7807 problem details:

```json
{
  "type": "https://api.bdn.org/errors/donor-cooldown-active",
  "title": "Donor Ineligible for Dispatch",
  "status": 422,
  "detail": "Donor John Doe is under active clinical cooldown until 2026-09-15.",
  "instance": "/api/v1/matches/m_8812/accept",
  "invalidParams": []
}
```

---

## 3. Rate Limiting & Abuse Prevention Strategy

- **Global Tier:** 100 requests per minute per IP address managed via Redis token buckets.
- **Auth Endpoint Tier:** 5 failed attempts per 15 minutes per IP on `/api/v1/auth/login`.
- **Request Creation Tier:** Maximum 10 emergency dispatches per hour per verified hospital.

---

## 4. Structured Logging & Audit Trail Engine

- **HTTP Logging:** Morgan middleware formatting logs in structured JSON containing `timestamp`, `method`, `path`, `status`, `durationMs`, and `correlationId`.
- **Security Audit Logger (`AuditService`):** High-privilege state changes (`USER_REGISTERED`, `HOSPITAL_VERIFIED`, `BLOOD_REQUEST_CREATED`, `MATCH_ACCEPTED`, `DONATION_FULFILLED`) write immutable records to the `audit_logs` table.
