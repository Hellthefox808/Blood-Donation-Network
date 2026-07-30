# Security Architecture & OWASP ASVS Specification (docs/security-blueprint)

## Project Name: Blood Donation Network (BDN)
**Compliance Baseline:** OWASP ASVS v4.0 Level 2 Alignment  
**Document Version:** 2.0.0  

---

## 1. Authentication & Token Security (ASVS V2 & V3)

- **RS256 JWT Token Signing:** Access tokens (15-min expiration) signed with RS256 private keys. Verification relies on public key distribution.
- **Refresh Token Storage:** Refresh tokens (7-day expiration) stored in `HttpOnly, Secure, SameSite=Strict` browser cookies.
- **Instant Revocation:** Redis maintains a revoked token ID blacklist (`jti`). Logout or role elevation immediately blacklists active token IDs.

---

## 2. Access Control (RBAC) & Least Privilege (ASVS V4)

| Endpoint Path | Allowed Roles | Enforcement Mechanism |
| :--- | :--- | :--- |
| `POST /api/v1/auth/*` | Public | Open access with rate-limiting. |
| `GET /api/v1/donors/me` | `DONOR` | `requireRole(['DONOR'])` middleware. |
| `POST /api/v1/hospitals/requests` | `HOSPITAL_ADMIN` | `requireRole(['HOSPITAL_ADMIN'])` + `isApproved == true` check. |
| `GET /api/v1/admin/*` | `SYSTEM_ADMIN` | `requireRole(['SYSTEM_ADMIN'])` middleware. |

---

## 3. Data Protection & PII Confidentiality (ASVS V8)

- **Field-Level Encryption:** Sensitive donor PII (phone number, home address) encrypted at rest using AES-256-GCM.
- **Identity Obfuscation:** Hospital admins viewing matched candidate donors see only distance metrics and masked identifiers (`Donor #8812`). Full identity is revealed only upon explicit donor match acceptance.

---

## 4. Defense-in-Depth Security Headers

Production NGINX & Express Helmet.js headers configured:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```
