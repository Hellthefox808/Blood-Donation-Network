# System Feature Matrix & Scope (FEATURES)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  
**Prioritization Framework:** MoSCoW (Must Have, Should Have, Could Have, Won't Have)  

---

## 1. Feature Prioritization Overview

```
+-------------------------------------------------------------------------------+
|                       MUST HAVE (MVP - Phase 1)                               |
| • User Auth & RBAC (Donor, Hospital, Admin)                                   |
| • Donor Profile & Health Cooldown Engine (56-day rule)                        |
| • PostGIS Proximity Matching Engine (Spatial Radius Query)                    |
| • Emergency Request Dispatch (ROUTINE, URGENT, CRITICAL)                      |
| • Real-Time Alerting (Socket.io WebSockets + Twilio SMS)                      |
| • Hospital Request Tracker Dashboard                                          |
| • System Admin Accreditation & Verification Panel                             |
| • Immutable Security Audit Logging                                            |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                      SHOULD HAVE (Phase 2 Expansion)                          |
| • Blood Bank Inventory Management & Expiry Alerts                             |
| • Multi-Language Localized Alert Templates (English, Spanish)                |
| • Automated Driving Distance & Traffic ETA Calculation (Google Distance API)  |
| • CSV/PDF Operational Summary Reports                                         |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                     COULD HAVE (Phase 3 Scale & AI)                           |
| • Predictive AI Demand Forecasting for Regional Blood Shortages              |
| • Automated Emergency Medical Courier Drone Dispatch Integration              |
| • Gamified Donor Loyalty Badges & Milestones                                  |
+-------------------------------------------------------------------------------+
```

---

## 2. Comprehensive Module Feature Breakdown

### 2.1 Authentication & Security Module

| Feature ID | Feature Description | Priority | Target Release |
| :--- | :--- | :--- | :--- |
| **FEAT-1.1** | Email/Password Registration & Login with Argon2id Hashing | `Must Have` | Phase 1 (MVP) |
| **FEAT-1.2** | Google OAuth 2.0 Single Sign-On for Donors | `Must Have` | Phase 1 (MVP) |
| **FEAT-1.3** | Role-Based Access Control (RBAC) Enforcement | `Must Have` | Phase 1 (MVP) |
| **FEAT-1.4** | JWT Access & Refresh Token Revocation via Redis | `Must Have` | Phase 1 (MVP) |
| **FEAT-1.5** | Time-Limited Password Reset Flow | `Must Have` | Phase 1 (MVP) |

### 2.2 Donor Management & Health Module

| Feature ID | Feature Description | Priority | Target Release |
| :--- | :--- | :--- | :--- |
| **FEAT-2.1** | Donor Health Profile (ABO/Rh, DOB, Weight, Address) | `Must Have` | Phase 1 (MVP) |
| **FEAT-2.2** | Automated Clinical Cooldown Calculator (56/112/14 Days) | `Must Have` | Phase 1 (MVP) |
| **FEAT-2.3** | Availability Toggle Switch (`IsAvailable`) | `Must Have` | Phase 1 (MVP) |
| **FEAT-2.4** | Pre-Screening Questionnaire Flagging | `Must Have` | Phase 1 (MVP) |
| **FEAT-2.5** | Donation Logbook & Historical Records | `Should Have` | Phase 2 |

### 2.3 Request & Matching Engine Module

| Feature ID | Feature Description | Priority | Target Release |
| :--- | :--- | :--- | :--- |
| **FEAT-3.1** | Emergency Blood Request Creation (`ROUTINE`, `URGENT`, `CRITICAL`)| `Must Have` | Phase 1 (MVP) |
| **FEAT-3.2** | Clinical Blood Compatibility Matrix Filtering | `Must Have` | Phase 1 (MVP) |
| **FEAT-3.3** | PostGIS Radius Proximity Query Engine (10km / 25km / 50km) | `Must Have` | Phase 1 (MVP) |
| **FEAT-3.4** | Donor Match Queue & Acceptance Timeout Window (15 mins) | `Must Have` | Phase 1 (MVP) |
| **FEAT-3.5** | Live Driving Distance & Traffic ETA Lookup | `Should Have` | Phase 2 |

### 2.4 Real-Time Alerts & Communications Module

| Feature ID | Feature Description | Priority | Target Release |
| :--- | :--- | :--- | :--- |
| **FEAT-4.1** | Socket.io WebSocket Push Notification Dispatch | `Must Have` | Phase 1 (MVP) |
| **FEAT-4.2** | Twilio Automated SMS Alert Dispatch for Critical Need | `Must Have` | Phase 1 (MVP) |
| **FEAT-4.3** | Transactional Email Dispatch (SendGrid) | `Must Have` | Phase 1 (MVP) |
| **FEAT-4.4** | In-App Notification Center with Read/Unread States | `Should Have` | Phase 2 |

### 2.5 Hospital & Inventory Dashboard Module

| Feature ID | Feature Description | Priority | Target Release |
| :--- | :--- | :--- | :--- |
| **FEAT-5.1** | Hospital Request Live Status Center | `Must Have` | Phase 1 (MVP) |
| **FEAT-5.2** | Donor Acceptance Real-Time List & ETA Display | `Must Have` | Phase 1 (MVP) |
| **FEAT-5.3** | Confirmation Button for Completed Unit Receipts | `Must Have` | Phase 1 (MVP) |
| **FEAT-5.4** | Blood Component Inventory Tracking & Expiry Alerts | `Should Have` | Phase 2 |

### 2.6 Administration & Compliance Module

| Feature ID | Feature Description | Priority | Target Release |
| :--- | :--- | :--- | :--- |
| **FEAT-6.1** | Hospital Accreditation Document Verification Flow | `Must Have` | Phase 1 (MVP) |
| **FEAT-6.2** | Immutable Audit Log Viewer | `Must Have` | Phase 1 (MVP) |
| **FEAT-6.3** | User Account Suspension / Flagging | `Must Have` | Phase 1 (MVP) |
| **FEAT-6.4** | System Performance & Metric Health Monitoring | `Should Have` | Phase 2 |
