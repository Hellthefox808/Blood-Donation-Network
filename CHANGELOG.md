# Changelog

All notable changes to the **Blood Donation Network (BDN)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned for v1.1.0
- Blood Bank inventory tracking module with expiry warning alerts.
- Google Maps Distance Matrix integration for real-time driving ETAs.

---

## [1.0.0] - 2026-07-30

### Added
- **Authentication & RBAC:** Implemented JWT dual-token strategy with Argon2id password hashing and Google OAuth 2.0. Added role claims for `DONOR`, `HOSPITAL_ADMIN`, `BLOOD_BANK_MANAGER`, and `SYSTEM_ADMIN`.
- **Database Schema:** Created PostgreSQL database schema utilizing Prisma ORM with PostGIS spatial extension support for donor and hospital geographic locations.
- **Donor Health Engine:** Implemented automated 56-day whole blood and 14-day platelet cooldown calculation logic.
- **Emergency Matching Engine:** Created PostGIS spatial proximity query engine matching eligible donors within dynamic radii (10km, 25km, 50km) filtered by clinical ABO/Rh blood compatibility matrices.
- **Real-Time Alert System:** Integrated Socket.io for low-latency WebSocket push alerts and Twilio SDK for automated emergency SMS dispatches.
- **Hospital Dashboard:** Developed interactive Next.js dashboard for hospital admins to broadcast requests and track donor acceptance ETAs in real-time.
- **System Admin Panel:** Built hospital accreditation verification interface and security audit log viewer.
- **Audit Logging Engine:** Integrated immutable security audit logging writing high-privilege operations to `audit_logs`.
- **Documentation Suite:** Produced comprehensive 23-file repository documentation package.

---

## [0.1.0] - 2026-07-15

### Added
- Initial project scaffolding with Next.js 14, Express TypeScript backend, Prisma ORM, and Docker configuration files.
