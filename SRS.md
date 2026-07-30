# Software Requirements Specification (SRS)

## Project Name: Blood Donation Network (BDN)
**Document Standard:** IEEE Std 830-1998 Format  
**Version:** 1.0.0  

---

## 1. Functional Requirements

### 1.1 Authentication & User Management
- **FR-1.1:** The system shall support user registration with distinct roles: `DONOR`, `HOSPITAL_ADMIN`, `BLOOD_BANK_MANAGER`, and `SYSTEM_ADMIN`.
- **FR-1.2:** The system shall authenticate users using email/password pairs hashed with Argon2id, issuing signed JSON Web Tokens (JWT) upon successful authentication.
- **FR-1.3:** The system shall support OAuth 2.0 single sign-on (Google Auth) specifically for donor onboarding.
- **FR-1.4:** The system shall require `HOSPITAL_ADMIN` accounts to undergo manual manual verification by a `SYSTEM_ADMIN` before issuing request creation credentials.
- **FR-1.5:** The system shall support secure password reset via time-limited (15-minute validity) cryptographically secure tokens sent to the registered email address.

### 1.2 Donor Profile & Health Engine
- **FR-2.1:** Donors shall maintain profile details including ABO/Rh blood type, phone number, physical address, and geo-location coordinates (latitude/longitude).
- **FR-2.2:** The system shall calculate donation eligibility based on last donation date:
  - Whole Blood: Minimum 56 days between donations.
  - Double Red Cells (Apheresis): Minimum 112 days.
  - Platelets: Minimum 14 days.
- **FR-2.3:** The system shall allow donors to toggle an `IsAvailable` status switch to temporarily pause notifications.
- **FR-2.4:** The system shall store donor medical pre-screening answers (e.g., travel history, current medications, weight > 50kg) and flag potential disqualifications prior to dispatch.

### 1.3 Hospital Request & Matching Workflow
- **FR-3.1:** Accredited hospital admins shall create blood requests specifying:
  - Required Blood Type (A+, A-, B+, B-, AB+, AB-, O+, O-).
  - Component Type (Whole Blood, PRBC, Platelets, FFP, Cryoprecipitate).
  - Quantity (in units / 450ml bags).
  - Urgency Level (`ROUTINE`, `URGENT`, `CRITICAL`).
  - Required By Timestamp.
  - Delivery / Collection Location coordinates.
- **FR-3.2:** The matching engine shall compute compatible blood groups using clinical rules:
  - *O- Negative PRBC* can be dispatched to all recipients.
  - *AB+ Positive PRBC* can only be dispatched to AB+ recipients.
  - *AB+ Plasma* can be dispatched to all plasma recipients.
- **FR-3.3:** The matching engine shall query donors located within a defined radius from the hospital (Default radii: `ROUTINE` = 10km, `URGENT` = 25km, `CRITICAL` = 50km) using PostGIS spatial indexing.
- **FR-3.4:** The system shall create `Match` records linking eligible, available donors to the active request and issue real-time notification dispatches.

### 1.4 Real-Time Alerts & Communications
- **FR-4.1:** The system shall deliver real-time push alerts via Socket.io to connected online donors.
- **FR-4.2:** The system shall trigger automated SMS messages via Twilio to matched donors for `URGENT` and `CRITICAL` requests.
- **FR-4.3:** The system shall allow matched donors to respond with `ACCEPT` or `DECLINE` within a 15-minute window.
- **FR-4.4:** If a donor accepts, the system shall display hospital contact details and navigation guidance while notifying the hospital admin of the acceptance.

### 1.5 Inventory & Reporting
- **FR-5.1:** Blood banks and hospitals shall record current inventory stock by blood component and expiry date.
- **FR-5.2:** The system shall generate automated notifications 7 days prior to component expiration.
- **FR-5.3:** The system shall generate exportable CSV/PDF summary reports detailing monthly request volume, fulfillment rates, average response times, and donor retention numbers.

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Performance Requirements
- **NFR-1.1 (API Latency):** 95% of non-search HTTP requests shall respond within < 200 milliseconds under a nominal load of 500 requests/second.
- **NFR-1.2 (Search Speed):** Geospatial PostGIS donor search queries across 100,000 active records shall complete within < 350 milliseconds.
- **NFR-1.3 (Alert Dispatch):** Websocket and SMS notification dispatches for `CRITICAL` requests shall initiate within < 5 seconds of request creation.

### 2.2 Security & Compliance Requirements
- **NFR-2.1 (Data Encryption):** All network communication must be encrypted using TLS 1.3. Personally Identifiable Information (PII) and health records must be encrypted at rest using AES-256-GCM.
- **NFR-2.2 (Donor Anonymity):** Hospital admins shall not view donor full names or direct phone numbers until the donor explicitly accepts a specific blood request.
- **NFR-2.3 (Audit Logging):** All authentication events, role elevation attempts, patient request modifications, and medical data reads must write an immutable entry to `audit_logs`.

### 2.3 Reliability & Availability Requirements
- **NFR-3.1 (Availability):** Core system APIs and database services shall maintain 99.9% monthly operational uptime.
- **NFR-3.2 (Fault Tolerance):** Database setup shall use primary-standby replication with automated failover handling. Notification dispatch background jobs must utilize BullMQ persistent queues with automatic retry logic (3 retries with exponential backoff).

---

## 3. Business Rules (BR)

- **BR-101 (Age Limitation):** Donors must be between 18 and 65 years of age to register for voluntary blood donation dispatches.
- **BR-102 (Weight Limitation):** Donors must weigh at least 50 kg (110 lbs) to qualify for whole blood donation dispatches.
- **BR-103 (Cooldown Strictness):** A donor marked as `FULFILLED` in a blood request is automatically set to `INELIGIBLE` for whole blood for 56 calendar days.
- **BR-104 (Hospital Accreditation):** Unverified hospitals may log in to the dashboard but cannot initiate blood request dispatches until verified by a System Admin.
- **BR-105 (Request Expiration):** Requests whose `RequiredBy` timestamp is reached without full fulfillment automatically transition to `EXPIRED` status, triggering a summary report to the requesting admin.

---

## 4. Validation Rules (VR)

- **VR-201 (Email Structure):** Must conform to standard RFC 5322 syntax.
- **VR-202 (Password Complexity):** Minimum 8 characters, containing at least one uppercase letter, one lowercase letter, one numeric digit, and one special character (`@#$%^&*!`).
- **VR-203 (Geospatial Coordinates):** Latitude must range between `-90.0` and `90.0`; Longitude must range between `-180.0` and `180.0`.
- **VR-204 (Units Requested):** Integer value between 1 and 20 units per individual request.

---

## 5. Error Handling Expectations

- All API errors must return structured JSON conforming to standard RFC 7807 problem details:
```json
{
  "type": "https://api.bdn.org/errors/invalid-eligibility",
  "title": "Donor Ineligible for Dispatch",
  "status": 422,
  "detail": "Donor John Doe is in clinical cooldown until 2026-09-15.",
  "instance": "/api/v1/requests/req_9812/match"
}
```
- Network timeouts, DB connection drops, and third-party service failures (Twilio/SendGrid) must fail gracefully, emitting metric alerts to Grafana without crashing the Node.js API process.

---

## 6. Acceptance Criteria

```gherkin
Feature: Emergency Blood Request Matching

  Scenario: Hospital creates CRITICAL blood request for O-Negative blood
    Given an accredited Hospital Admin "Dr. Sarah" is logged in
    When she submits a request for 2 units of "O-" Whole Blood with urgency "CRITICAL" at coordinates (37.7749, -122.4194)
    Then the system creates a new request entry with status "SEARCHING"
    And queries all eligible "O-" donors within 50 km who are available
    And dispatches WebSocket push alerts and SMS messages to matched donors within 5 seconds
    And records an immutable audit log entry for request creation.
```
