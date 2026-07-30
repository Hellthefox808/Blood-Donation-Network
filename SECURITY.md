# Security Architecture & Controls (SECURITY)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  
**Compliance Standard Alignment:** HIPAA Security Rule & GDPR Guidelines  

---

## 1. Authentication & Session Strategy

### 1.1 Dual Token JWT Strategy
- **Access Token:** Short-lived JWT (15 minutes expiration) signed using **RS256** private key. Transmitted via `Authorization: Bearer <token>` header.
- **Refresh Token:** Long-lived token (7 days expiration) stored in an **HttpOnly, Secure, SameSite=Strict** browser cookie.
- **Revocation Mechanism:** Active access token IDs (jti) and refresh tokens are tracked in Redis. Logging out or elevating security roles immediately adds token IDs to the Redis revocation blacklist.

### 1.2 OAuth 2.0 Integration
- Google OAuth 2.0 used strictly for voluntary donor authentication.
- Server validates OAuth ID tokens against Google public keys before generating internal BDN JWT tokens.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Resource / Action | `DONOR` | `HOSPITAL_ADMIN` | `BLOOD_BANK_MANAGER` | `SYSTEM_ADMIN` |
| :--- | :---: | :---: | :---: | :---: |
| **View Own Donor Profile** | READ / WRITE | - | - | READ |
| **View Nearby Matches** | READ | - | - | READ |
| **Accept / Decline Match** | EXECUTE | - | - | - |
| **Create Blood Request** | - | CREATE / READ / CANCEL | - | READ |
| **Confirm Donation Receipt** | - | EXECUTE | - | - |
| **Update Blood Bank Inventory** | - | - | CREATE / READ / UPDATE | READ |
| **Approve Hospital Accreditation** | - | - | - | EXECUTE |
| **Query Security Audit Logs** | - | - | - | READ |
| **Suspend / Ban Accounts** | - | - | - | EXECUTE |

---

## 3. Defense-in-Depth Security Controls

### 3.1 Input Validation & Sanitization
- **Zod Validation Interceptors:** All HTTP requests pass through strict Zod schema parsers prior to hitting controller endpoints. Unrecognized fields are stripped (`strip` mode).
- **SQL Injection Prevention:** All database operations utilize Prisma ORM parameterized queries or PostGIS `$queryRaw` parameterized bindings.

### 3.2 Rate Limiting & Abuse Prevention
- **Per-IP Rate Limiting:** Managed via Redis token buckets (Max 100 requests per minute per IP address).
- **Auth Endpoint Rate Limiting:** Stricter limits applied to `/api/v1/auth/login` (Max 5 failed attempts per 15 minutes per IP before temporal IP lockout).
- **Request Creation Safeguards:** Unverified hospital accounts cannot invoke emergency dispatches.

### 3.3 Audit Logging & Compliance
- **Immutable Log Table:** All high-privilege operations (`AUTH_LOGIN`, `REQUEST_CREATED`, `MATCH_ACCEPTED`, `HOSPITAL_VERIFIED`, `ACCOUNT_SUSPENDED`) asynchronously write immutable entries to `audit_logs`.
- **Log Entry Structure:** Records `userId`, `action`, `entity`, `entityId`, `ipAddress`, and payload diffs (with sensitive passwords and PII stripped).

### 3.4 PII Data Encryption & Anonymity
- **Field Encryption:** Sensitive donor health data encrypted at rest using AES-256-GCM.
- **Identity Obfuscation:** Hospital admins viewing matched donors prior to acceptance see only randomized identifiers (`Donor #8812`) and distance metrics. Full contact details are revealed only after explicit donor acceptance.

---

## 4. OWASP Top 10 Mitigation Summary

| OWASP Vulnerability | BDN Security Mitigation |
| :--- | :--- |
| **A01: Broken Access Control** | Enforced via declarative Express RBAC middleware checking signed JWT role claims on every route. |
| **A02: Cryptographic Failures** | TLS 1.3 in transit; Argon2id password hashing; AES-256-GCM for PII data at rest. |
| **A03: Injection** | Strict parameterization via Prisma ORM; Zod input validation filtering. |
| **A04: Insecure Design** | Rate limiting, automatic hospital accreditation checks, and audit logging built into core architecture. |
| **A05: Security Misconfiguration** | Production Helmet.js headers (HSTS, CSP, X-Frame-Options); environment variables validated on server boot. |
| **A07: Identification & Auth Failures** | RS256 JWT tokens, Redis refresh token revoking, 5-attempt login locks. |
| **A08: Software Data Integrity** | Exact dependency version pinning in `package.json`; automated npm vulnerability scanning in CI. |
