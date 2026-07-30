# System Operation Context (SOC)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

---

## 1. System Context Diagram (C4 Context View)

The Blood Donation Network acts as a real-time mediation engine connecting voluntary blood donors, hospital emergency units, blood bank warehouses, and external delivery/communication infrastructure.

```
                  +-----------------------+
                  |     System Admin      |
                  +-----------+-----------+
                              |
                              v
   +--------------------+     |     +--------------------+
   |   Hospital Admin   |     |     | Blood Bank Manager |
   +---------+----------+     |     +---------+----------+
             |                |               |
             +--------+       |       +-------+
                      |       |       |
                      v       v       v
           +-------------------------------------+
           |                                     |
           |     Blood Donation Network (BDN)    |
           |        Core Cloud Platform          |
           |                                     |
           +---+-----------------------------+---+
               |                             |
               v                             v
   +-----------+-----------+     +-----------+-----------+
   |   Twilio SMS / Email  |     |  Google Maps Geocoding|
   |   Notification Gateway|     |  & Distance Matrix API|
   +-----------------------+     +-----------------------+
               |
               v
   +-----------+-----------+
   |    Voluntary Donor    |
   |   (Web/Mobile App)    |
   +-----------------------+
```

---

## 2. External Actors & System Roles

| Actor Name | Description | Key Responsibilities | Primary Interface |
| :--- | :--- | :--- | :--- |
| **Voluntary Donor** | Individual registered to donate blood. | Maintains location/health profile, responds to emergency alerts, attests health eligibility. | Next.js PWA / Responsive Web App |
| **Hospital Admin** | Accredited medical staff member. | Submits urgent blood requests, tracks matched donors, confirms unit receipt/fulfillment. | Hospital Portal Dashboard |
| **Blood Bank Manager** | Blood repository logistics officer. | Manages component inventory stocks, logs incoming/outgoing units, manages transfers. | Inventory Management Dashboard |
| **System Admin** | Platform security and operations officer. | Audits system activity, verifies hospital credentials, manages system parameters. | Admin Control Panel |
| **Twilio API** | External SMS messaging service. | Outbound dispatch of urgent SMS alerts to matched donors. | HTTPS REST API |
| **SendGrid API** | External email notification service. | Outbound transactional emails (Account verification, password resets, reports). | HTTPS REST API |
| **Google Maps API** | Mapping and spatial distance engine. | Converts address text to GPS coordinates, computes driving distance and estimated ETA. | HTTPS REST API |

---

## 3. Trust Boundaries & Security Enclaves

```
[ UNTRUSTED ZONE: Public Internet ]
      |
      | HTTP(S) / WSS (TLS 1.3)
      v
[ PERIMETER ZONE: Cloudflare WAF & Rate Limiter ]
      |
      | Reverse Proxy / SSL Termination
      v
[ DMZ ZONE: NGINX Ingress Controller ]
      |
      | JWT Authenticated Traffic
      v
[ APPLICATION TRUST ZONE: Express.js API Cluster & Socket Server ]
      |
      +---> [ Isolated VPC ] ---> PostgreSQL 16 (DB Master / Replica)
      |
      +---> [ Isolated VPC ] ---> Redis 7 (Cache / Session Store)
      |
      +---> [ Egress Proxy ] ---> External Services (Twilio / SendGrid / Google Maps)
```

### Trust Boundary Rules:
1. **Un-authenticated Boundary:** Public access restricted strictly to `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/health`, and public landing pages.
2. **Authenticated Boundary:** Requires valid, unexpired Bearer JWT in the `Authorization` HTTP header.
3. **Role-Scoped Boundary:** Endpoints under `/api/v1/hospitals/*` require `HOSPITAL_ADMIN` role claim in the JWT. Endpoints under `/api/v1/admin/*` require `SYSTEM_ADMIN` role claim.
4. **Data Isolation Boundary:** Donor health data and PII stored in isolated schemas, obfuscated from hospital view until explicit donor consent (`Match.accepted = true`).

---

## 4. Main Integrations & Interfaces

| Service Name | Protocol / Format | Purpose | Resilience Mechanism |
| :--- | :--- | :--- | :--- |
| **Twilio Programmable SMS** | HTTPS REST / JSON | High-urgency donor alert dispatches | BullMQ retry queue (3 retries, exponential backoff) |
| **SendGrid API v3** | HTTPS REST / JSON | Transactional emails and PDF report dispatches | Async background worker queue |
| **Google Maps Geocoding API** | HTTPS REST / JSON | Convert hospital/donor addresses to PostGIS spatial points | Redis caching (24-hour TTL on geocoded locations) |
| **Google Maps Distance Matrix API** | HTTPS REST / JSON | Compute realistic driving ETAs between hospital and donor | Cached spatial distance lookup matrix |

---

## 5. End-to-End Data Flow Summary

### Scenario: Emergency Request to Donor Fulfillment

1. **Request Creation:** Hospital Admin logs into the portal and posts an emergency `CRITICAL` request for 2 units of A-Negative blood.
2. **Validation & Storage:** Express API validates input against Zod schema, verifies hospital accreditation status in DB, and commits the `BloodRequest` record.
3. **Geospatial & Compatibility Query:** The backend invokes a PostGIS spatial query:
   ```sql
   SELECT donor_id, ST_Distance(location, hospital_location) AS distance_meters
   FROM donor_profiles
   WHERE blood_type IN ('A-', 'O-')
     AND is_available = TRUE
     AND next_eligible_date <= CURRENT_DATE
     AND ST_DWithin(location, hospital_location, 50000) -- 50 km radius
   ORDER BY distance_meters ASC;
   ```
4. **Match Creation & Queueing:** The service layer creates `Match` records for the top candidate donors and pushes job payloads to the Redis/BullMQ notification queue.
5. **Real-Time Notification Dispatch:**
   - Socket.io server broadcasts a WebSocket alert to active donor sessions.
   - BullMQ worker calls Twilio API to dispatch SMS alerts to offline donors.
6. **Donor Acceptance:** Donor receives alert, clicks "ACCEPT", and posts response to `/api/v1/matches/{id}/accept`.
7. **Hospital Alert & Directions:** Hospital dashboard receives immediate WebSocket update displaying donor ETA. Donor receives hospital location, emergency desk contact, and navigation directions.
8. **Fulfillment Confirmation:** Hospital verifies donor arrival and blood collection, updating request status to `FULFILLED`. System automatically updates donor `last_donation_date` and sets next eligibility date to +56 days.
9. **Audit Trail Logging:** System writes an immutable audit record logging request ID, donor ID, hospital ID, timestamps, and fulfilled units.
