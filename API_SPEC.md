# REST API Specification (API_SPEC)

## Project Name: Blood Donation Network (BDN)
**Protocol:** HTTPS REST / JSON API  
**Base URL:** `https://api.bdn.org/api/v1`  
**Authentication:** JWT Bearer Token (`Authorization: Bearer <token>`)  
**Document Version:** 1.0.0  

---

## 1. Global API Standards

### 1.1 Standard Response Envelope
All successful API responses return a structured JSON object:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 142,
    "totalPages": 8
  }
}
```

### 1.2 Standard Error Response (RFC 7807)
All error responses return HTTP status codes >= 400 with standard problem detail payloads:
```json
{
  "type": "https://api.bdn.org/errors/validation-error",
  "title": "Invalid Input Data",
  "status": 400,
  "detail": "The field 'weightKg' must be at least 50.0.",
  "instance": "/api/v1/donors/profile",
  "invalidParams": [
    {
      "name": "weightKg",
      "reason": "Value 44.5 is below minimum requirement of 50.0 kg."
    }
  ]
}
```

---

## 2. API Endpoint Matrix & RBAC Map

| Method | Endpoint Path | Description | Allowed Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new Donor or Hospital account | Public |
| `POST` | `/auth/login` | Authenticate & receive JWT pair | Public |
| `POST` | `/auth/refresh` | Refresh expired access token | Public (valid refresh token) |
| `GET` | `/donors/me` | Fetch active donor profile & eligibility | `DONOR` |
| `PUT` | `/donors/me` | Update donor location & availability | `DONOR` |
| `GET` | `/donors/matches` | List blood requests matched to current donor | `DONOR` |
| `POST` | `/matches/:id/accept` | Accept an emergency blood donation match | `DONOR` |
| `POST` | `/matches/:id/decline` | Decline a match notification | `DONOR` |
| `POST` | `/hospitals/requests` | Create emergency blood request | `HOSPITAL_ADMIN` |
| `GET` | `/hospitals/requests` | List active hospital requests & statuses | `HOSPITAL_ADMIN` |
| `GET` | `/hospitals/requests/:id` | Fetch request details & accepted donors | `HOSPITAL_ADMIN` |
| `POST` | `/hospitals/donations/confirm` | Confirm blood collection & mark fulfilled | `HOSPITAL_ADMIN` |
| `GET` | `/inventories` | List blood bank component stocks | `BLOOD_BANK_MANAGER`, `HOSPITAL_ADMIN` |
| `POST` | `/inventories` | Update or add inventory stock batch | `BLOOD_BANK_MANAGER` |
| `GET` | `/admin/hospitals/pending` | List unverified hospital registrations | `SYSTEM_ADMIN` |
| `POST` | `/admin/hospitals/:id/verify` | Approve or reject hospital accreditation | `SYSTEM_ADMIN` |
| `GET` | `/admin/audit-logs` | Query system security audit logs | `SYSTEM_ADMIN` |

---

## 3. Core API Endpoint Details

### 3.1 Authentication: Login Endpoint
- **URL:** `POST /api/v1/auth/login`
- **Auth Required:** None
- **Request Body:**
```json
{
  "email": "stjude@hospital.org",
  "password": "Hospital123!@#"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "stjude@hospital.org",
      "role": "HOSPITAL_ADMIN",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

---

### 3.2 Hospital: Create Emergency Blood Request
- **URL:** `POST /api/v1/hospitals/requests`
- **Auth Required:** Bearer Token (Role: `HOSPITAL_ADMIN`)
- **Request Body:**
```json
{
  "bloodGroup": "O_NEGATIVE",
  "componentType": "WHOLE_BLOOD",
  "unitsRequested": 3,
  "urgency": "CRITICAL",
  "requiredBy": "2026-07-30T18:00:00.000Z",
  "notes": "Emergency trauma patient in OR 3 requiring immediate transfusions."
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "e4a3b8d1-1234-4567-89ab-cdef01234567",
    "hospitalId": "hosp_5501",
    "bloodGroup": "O_NEGATIVE",
    "componentType": "WHOLE_BLOOD",
    "unitsRequested": 3,
    "unitsFulfilled": 0,
    "urgency": "CRITICAL",
    "status": "SEARCHING",
    "matchedDonorsCount": 14,
    "createdAt": "2026-07-30T13:30:00.000Z"
  }
}
```

---

### 3.3 Donor: Accept Donation Match
- **URL:** `POST /api/v1/matches/m_8812/accept`
- **Auth Required:** Bearer Token (Role: `DONOR`)
- **Request Body:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "matchId": "m_8812",
    "status": "ACCEPTED",
    "hospital": {
      "name": "St. Jude Regional Emergency Center",
      "address": "750 Mission St, San Francisco, CA 94103",
      "contactPhone": "+1-415-555-0199",
      "emergencyDeskNotes": "Report directly to 2nd floor Blood Bank Desk upon arrival."
    },
    "navigationUrl": "https://www.google.com/maps/dir/?api=1&destination=37.7749,-122.4194"
  }
}
```

---

### 3.4 Admin: Query Security Audit Logs
- **URL:** `GET /api/v1/admin/audit-logs?action=HOSPITAL_VERIFIED&page=1&limit=10`
- **Auth Required:** Bearer Token (Role: `SYSTEM_ADMIN`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_9901",
      "userId": "usr_admin_01",
      "action": "HOSPITAL_VERIFIED",
      "entity": "Hospital",
      "entityId": "hosp_5501",
      "details": {
        "hospitalName": "St. Jude Regional Emergency Center",
        "licenseVerified": "CA-MED-88912"
      },
      "ipAddress": "192.168.1.50",
      "createdAt": "2026-07-30T10:15:22.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

## 4. HTTP Error Code Reference

| Status Code | Error Code String | Trigger Scenario |
| :--- | :--- | :--- |
| `400 Bad Request` | `INVALID_INPUT` | Zod validation failure, malformed JSON body. |
| `401 Unauthorized` | `TOKEN_EXPIRED` / `UNAUTHENTICATED` | Missing or invalid Bearer JWT signature. |
| `403 Forbidden` | `INSUFFICIENT_PERMISSIONS` | Role mismatch (e.g. Donor accessing admin routes) or unverified hospital creating requests. |
| `404 Not Found` | `RESOURCE_NOT_FOUND` | Invalid request ID or user ID path parameter. |
| `409 Conflict` | `EMAIL_ALREADY_EXISTS` | Registration attempt with an registered email. |
| `422 Unprocessable` | `DONOR_INELIGIBLE` | Donor attempting to accept a match while under 56-day cooldown. |
| `429 Too Many Req` | `RATE_LIMIT_EXCEEDED` | Exceeded 100 requests / minute quota per IP address. |
| `500 Server Error` | `INTERNAL_SERVER_ERROR` | Unhandled exception or database connection loss. |
