# AI Coding Prompts & Guidelines (docs/prompts)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

---

## 1. System Prompt Template for Feature Extensions

When prompting AI assistants to generate new features for BDN, prepend this context block:

```text
You are an expert principal software engineer working on the Blood Donation Network (BDN).
BDN is a TypeScript web application built with Next.js 14, Node.js Express, PostgreSQL 16 (PostGIS), and Redis.

Strict Requirements:
1. Enforce the 4-layer architecture: Controllers -> Domain Services -> Repositories/Prisma -> Database.
2. Ensure strict TypeScript types using Zod schemas. Do not use 'any'.
3. Any distance matching must use PostGIS SQL functions (ST_DWithin).
4. All emergency requests must verify clinical blood compatibility (ABO/Rh matrix) and 56-day donor cooldowns.
5. All sensitive health data must be protected under HIPAA/GDPR standards.
```

---

## 2. Recommended Prompt Patterns

### Pattern A: Generating a New API Controller & Service
```text
"Create a new Express route and Domain Service for updating donor availability settings.
Ensure input validation via Zod, verify JWT role is 'DONOR', update the 'is_available' flag in Prisma, and log an audit entry using AuditService. Follow the exact patterns defined in AGENTS.md."
```

### Pattern B: Adding a Database Migration & Model
```text
"Write the Prisma schema update for adding a BloodBankInventory model. Include foreign keys to BloodBank, bloodGroup enum, componentType enum, unitsAvailable integer, and expiryDate. Generate the corresponding TypeScript interface in shared types."
```
