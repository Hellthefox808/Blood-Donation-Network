# Project Overview & Executive Brief (PROJECT_OVERVIEW)

## Project Name: Blood Donation Network (BDN)
**Author & Lead Architect:** Ravi Ranjan Singh (Software Engineer, Software Architect, Full Stack Developer, Repository Owner)  
**Document Version:** 1.0.0  
**Status:** Production-Ready & Portfolio-Grade  

---

## 1. Project Vision

To eliminate emergency blood supply shortages and time-to-transfusion bottlenecks by establishing a real-time, database-driven healthcare coordination platform that bridges local voluntary donors with accredited medical facilities and blood repositories.

---

## 2. Business Problem & Market Need

Regional healthcare systems frequently suffer from severe blood inventory imbalances and communication delays during acute trauma cases and emergency surgeries. 

### Key Critical Pain Points:
1. **High Fulfillment Latency:** Manual donor phone trees take 2 to 6 hours, far exceeding the safety window for critical surgical operations.
2. **Donor Eligibility Inaccuracies:** Hospitals contact donors who are ineligible due to recent donations, travel, or health conditions.
3. **Geographic Inefficiency:** Broad broadcasts alert donors outside a realistic driving radius, leading to high drop-off rates.
4. **Lack of Inventory Visibility:** Blood banks lack real-time demand forecasting and visibility into hospital depletion rates.

---

## 3. The BDN Solution

The **Blood Donation Network (BDN)** replaces manual outreach with an automated, real-time ecosystem:
- **Sub-15 Minute Dispatch:** Matches emergency blood requests with nearby eligible voluntary donors within a 10km to 50km driving radius using PostGIS spatial indexing.
- **Clinical ABO/Rh Matrix:** Automatically filters candidates using clinical red cell and plasma compatibility rules.
- **Automated Health Cooldowns:** Enforces 56-day whole blood and 14-day platelet recovery windows between donations.
- **Multi-Channel Alert Dispatch:** Low-latency Socket.io WebSocket push alerts paired with automated Twilio SMS notifications.
- **HIPAA/GDPR Security Controls:** AES-256 field encryption, identity obfuscation before match acceptance, and immutable security audit logs.

---

## 4. Target Users & Personas

- **Voluntary Blood Donors:** Active donors who receive targeted, radius-based emergency push alerts matching their blood group.
- **Hospital Emergency Staff:** Medical administrators who broadcast urgent requests, track matched donor arrival ETAs, and confirm unit receipts.
- **Blood Bank Managers:** Logistics officers who manage component stocks and track stock expiration dates.
- **System Super-Admins:** Compliance officers who verify hospital medical credentials and audit system security events.

---

## 5. Core Features & Capabilities

- **Multi-Role Access Control (RBAC):** Distinct permission boundaries for `DONOR`, `HOSPITAL_ADMIN`, `BLOOD_BANK_MANAGER`, and `SYSTEM_ADMIN`.
- **Geospatial Proximity Matcher:** PostGIS GIST spatial indexing for sub-second location queries.
- **Hospital Command Center:** Real-time request dashboard with matched donor arrival ETA tracking.
- **Donor Mobile Console:** One-click emergency match acceptance and GPS navigation routing.
- **System Admin Verification Panel:** Manual hospital accreditation approval and security audit log viewer.

---

## 6. Technology Stack Overview

- **Frontend:** Next.js 14 App Router, React 18, TypeScript 5.4, Tailwind CSS, Lucide Icons, TanStack Query.
- **Backend API:** Node.js v20 LTS, Express.js 4.19, TypeScript 5.4, Prisma ORM 5.14, Zod Validation.
- **Database:** PostgreSQL 16 + PostGIS 3.4 Spatial Extension (Development fallback: SQLite `dev.db`).
- **Real-Time & Caching:** Redis 7.2, Socket.io 4.7, BullMQ 5.7, Twilio SMS, SendGrid Email.
- **Testing & DevOps:** Jest, Supertest, Playwright, Docker, Docker Compose, GitHub Actions CI/CD.

---

## 7. Core Engineering Principles

1. **Clean Architecture:** Strict 4-layer separation (`Presentation -> Service -> Data -> Integration`).
2. **SOLID & DRY Design:** Single-responsibility services, reusable component primitives, and modular middleware.
3. **Type Safety:** 100% strict TypeScript typing across frontend and backend; zero usage of `any`.
4. **Security by Design:** OWASP ASVS v4.0 Level 2 compliance, Argon2id/bcrypt password hashing, RS256 JWT tokens, and field-level encryption.

---

## 8. Authorship & Maintainer Attribution

This repository and its underlying architecture, database design, API specification, and full-stack codebase are authored and maintained by:

**Ravi Ranjan Singh**  
- **Role:** Software Engineer | Software Architect | Full Stack Developer | AI SaaS Developer | Repository Owner & Principal Maintainer  
- **GitHub Profile:** [github.com/Hellthefox808](https://github.com/Hellthefox808)  
- **Repository:** [github.com/Hellthefox808/Blood-Donation-Network](https://github.com/Hellthefox808/Blood-Donation-Network)  

