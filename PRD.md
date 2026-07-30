# Product Requirements Document (PRD)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  
**Status:** Approved for Engineering  
**Target Release:** MVP Phase 1  

---

## 1. Problem Statement

Blood reserves at regional healthcare facilities frequently suffer from severe supply shortages, localized imbalances, and communication bottlenecks. When emergency operations or acute trauma cases require specific blood types (such as O-Negative universal red blood cell donors or AB-Positive universal plasma donors), hospitals often resort to manual phone calls, unverified social media blasts, or slow physical dispatch.

### Key Pain Points Identified:
1. **High Fulfillment Latency:** Manual donor outreach takes between 2 to 6 hours, far exceeding the safety window for critical surgeries.
2. **Inaccurate Donor Eligibility:** Hospitals contact donors who are ineligible due to recent donations, medication, travel history, or health conditions.
3. **Geographic Inefficiency:** Outreach often alerts donors outside an achievable driving radius, causing high drop-off rates.
4. **Lack of Operational Visibility:** Regional health departments lack real-time visibility into inventory depletion rates across nearby blood banks.

---

## 2. Target Users & Personas

### Persona A: Dr. Sarah Lin (Hospital Emergency Administrator)
- **Role:** Chief Medical Coordinator at St. Jude Regional Hospital.
- **Needs:** Fast creation of verified emergency blood requests, real-time tracking of matched donors, direct status updates when a donor accepts and is en route.
- **Pain Point:** Frustrated by phone trees and unconfirmed commitments during life-threatening emergency cases.

### Persona B: Marcus Vance (Eligible Voluntary Donor)
- **Role:** Regular O-Negative blood donor (34 years old, active, urban resident).
- **Needs:** Instant push alerts for nearby critical needs matching his blood type, clear navigation to the hospital, automated record-keeping of his donation history and eligibility dates.
- **Pain Point:** Ignores broad, generic promotional emails; only wants actionable, local emergency requests.

### Persona C: Elena Rostova (Blood Bank Inventory Manager)
- **Role:** Logistics Officer at City Central Blood Bank.
- **Needs:** Live dashboard tracking unit counts across 8 blood component types (Whole Blood, PRBC, Platelets, FFP, Cryoprecipitate), expiry management, batch transfer dispatching.
- **Pain Point:** High waste due to expired units from poor stock rotation and lack of demand forecasting.

### Persona D: David K. (System Super-Admin)
- **Role:** Compliance Officer & Network Administrator.
- **Needs:** Verification of medical facility credentials, user access control, security audit logging, system uptime monitoring.
- **Pain Point:** Ensuring platform security, preventing spam requests, maintaining medical compliance standards.

---

## 3. Product Goals

1. **Reduce Emergency Request Fulfillment Time:** Cut average time from request creation to donor commitment from 4 hours to under 25 minutes for critical requests.
2. **Precision Proximity Matching:** Deliver alerts to eligible donors within a 15 km driving radius using PostGIS spatial indexing.
3. **Automate Donor Eligibility Guardrails:** Enforce strict clinical cooldown rules (56 days for whole blood, 112 days for double red cells, 14 days for platelets).
4. **Achieve High System Reliability & Integrity:** Guarantee 99.9% API uptime, audit log immutability, and zero unauthorized medical data disclosures.

---

## 4. Non-Goals (Out of Scope for MVP)

- **Direct In-App Financial Transactions:** No paid blood sales or monetary compensation workflows (maintains strict compliance with WHO voluntary unpaid donation standards).
- **In-House Logistics Tracking via GPS Transponders:** Physical courier transport vehicles will not have hardware IoT transponders; fulfillment relies on status-driven confirmation steps.
- **Full EHR / EMR EHR System Replacement:** BDN is a specialized coordination platform, not an Electronic Health Record system. Integration is limited to standardized REST API webhooks.
- **Direct Cross-Border International Dispatches:** Initial scope is restricted to single-country / regional health jurisdiction boundaries.

---

## 5. Scope Boundaries

### In Scope for MVP (Phase 1):
- User Registration, Verification, and Role Assignment (`DONOR`, `HOSPITAL_ADMIN`, `BLOOD_BANK_MANAGER`, `SYSTEM_ADMIN`).
- Donor Profile Management: ABO/Rh blood type, location coordinates, eligibility status toggle, contact preferences.
- Hospital Request Creation: Severity level selection (`ROUTINE`, `URGENT`, `CRITICAL`), required blood group, component type, unit quantity, expiration cutoff.
- Spatial Donor Matching Engine: Proximity query combined with blood compatibility logic.
- Notification Engine: Real-time WebSockets, Twilio SMS alerts, Email notifications.
- Hospital Dashboard: Live request monitoring, donor acceptance list, fulfillment status update buttons.
- Admin Panel: Hospital accreditation approval, audit log viewer, user ban/suspend features.

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

| Metric Category | Target KPI | Measurement Method |
| :--- | :--- | :--- |
| **Response Latency** | < 15 mins average to first donor acceptance on `CRITICAL` requests | Timestamp difference between `Request.created_at` and `Match.accepted_at` |
| **Match Precision** | > 85% donor eligibility accuracy | Zero notifications sent to donors under clinical cooldown |
| **Fulfillment Rate** | > 90% of hospital emergency requests fulfilled within target timeframe | Ratio of `FULFILLED` requests vs total requests |
| **System Uptime** | 99.9% uptime for core API and Socket services | Datadog / Prometheus synthetic monitoring probes |
| **Donor Retention** | 45% repeat donation acceptance rate over 6 months | Database query on historical user donation counts |

---

## 7. Key Assumptions & Technical Risks

### Assumptions:
1. Donors enable location permissions or maintain updated home/work postal addresses.
2. Participating hospitals possess valid state/national medical license credentials that can be verified during onboarding.
3. SMS deliverability rates via Twilio remain above 98% in targeted urban centers.

### Technical & Operational Risks:

| Risk Description | Severity | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Spam / False Emergency Requests** | High | Donor fatigue, operational chaos | Require manual Admin verification of hospital accounts before request creation permissions are granted. |
| **Donor Alert Notification Flooding** | Medium | User unsubscriptions / app deletes | Implement rate-limiting on donor notifications (max 2 alerts per 24h per donor unless marked `CRITICAL`). |
| **Pipelined Data Exposure (HIPAA/GDPR)** | Critical | Legal non-compliance, privacy breach | Obfuscate donor identities from hospitals until donor explicitly accepts a donation request. Encrypt PII at rest via AES-256. |
| **Stale Donor Cooldown Data** | Medium | Medical non-eligibility at hospital | Require donor self-attestation of recent donations upon request acceptance; cross-verify with central donation history records. |
