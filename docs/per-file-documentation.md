# Per-File Technical Documentation (docs/per-file-documentation)

## Project Name: Blood Donation Network (BDN)
**Author & Lead Architect:** Ravi Ranjan Singh  
**Document Version:** 1.0.0  

---

## 1. Backend Application Layer (`backend/src/`)

### 1.1 `backend/src/server.ts`
- **Purpose:** HTTP & WebSocket Server Entry Point.
- **Responsibilities:** Bootstraps Express app, initializes Socket.io WebSockets, connects to database via Prisma client, listens on PORT 5000.
- **Inputs:** `process.env.PORT`, Express application instance.
- **Outputs:** Running HTTP/WS server instance listening on `http://localhost:5000`.
- **Dependencies:** `http`, `socket.io`, `./app`, `./config/db`.
- **Architecture Layer:** Transport & Infrastructure Bootstrap.
- **Business Logic:** Logs WebSocket client connection and room subscription (`join_room`).
- **Security Notes:** CORS configured for origin checking.
- **Performance Notes:** Asynchronous non-blocking I/O event loop execution.

---

### 1.2 `backend/src/app.ts`
- **Purpose:** Express Application Configuration.
- **Responsibilities:** Configures CORS middleware, JSON body parsing, API router mounting under `/api/v1`, `/health` check endpoint, and centralized error handler middleware.
- **Inputs:** HTTP Requests.
- **Outputs:** Configured Express RequestListener.
- **Dependencies:** `express`, `cors`, `./routes`, `./middleware/error.middleware`.
- **Architecture Layer:** Transport Layer Setup.

---

### 1.3 `backend/src/services/auth.service.ts`
- **Purpose:** User Authentication & Registration Domain Service.
- **Responsibilities:** Handles voluntary donor and hospital registration, password hashing (bcryptjs/Argon2id), credential verification, JWT token issuance, and security audit log triggers.
- **Inputs:** User registration/login DTOs (`email`, `password`, `bloodGroup`, `licenseNumber`).
- **Outputs:** Authenticated user record and signed Bearer JWT token string.
- **Dependencies:** `../config/db`, `../utils/password`, `../utils/jwt`, `./audit.service`.
- **Architecture Layer:** Domain / Service Layer.
- **Business Logic:** Checks email uniqueness; verifies hospital accreditation status; sets initial donor eligibility.
- **Security Notes:** Passwords hashed with salt rounds; failed authentication throws RFC 7807 problem details.

---

### 1.4 `backend/src/services/request.service.ts`
- **Purpose:** Emergency Request Creation & Spatial Matching Engine.
- **Responsibilities:** Creates blood requests, executes PostGIS spatial radius queries (10km / 25km / 50km), filters candidate donors via clinical ABO/Rh compatibility rules, creates `Match` records, accepts matches, and updates donor 56-day cooldown dates upon hospital fulfillment confirmation.
- **Inputs:** Request DTO (`bloodGroup`, `unitsRequested`, `urgency`, `requiredBy`).
- **Outputs:** Created `BloodRequest` and candidate `Match` array.
- **Dependencies:** `../config/db`, `../utils/blood-compatibility`, `../utils/eligibility-calculator`, `./audit.service`.
- **Architecture Layer:** Domain Service Layer.
- **Business Logic:** Proximity Haversine/PostGIS matching; 56-day Whole Blood cooldown lock (`nextEligibleDate = now + 56 days`).

---

### 1.5 `backend/src/services/admin.service.ts`
- **Purpose:** System Administration & Compliance Service.
- **Responsibilities:** Queries pending hospital accreditation applications, updates verification status (`isApproved`), and queries paginated security audit logs.
- **Inputs:** Hospital ID, `isApproved` boolean, admin user ID, pagination parameters.
- **Outputs:** Updated `Hospital` record, paginated audit log list.
- **Dependencies:** `../config/db`, `./audit.service`.
- **Architecture Layer:** Domain Service Layer.

---

## 2. Frontend Application Layer (`frontend/src/`)

### 2.1 `frontend/src/app/page.tsx`
- **Purpose:** Public Landing Page.
- **Responsibilities:** Renders brand hero section, key feature cards, and pre-seeded sandbox demo credentials table.
- **Dependencies:** `next/link`, `lucide-react`, `@/components/ui/Button`.
- **Architecture Layer:** Presentation Page Layer.
- **Accessibility Notes:** WCAG 2.2 AA compliant high-contrast typography and semantic HTML.

---

### 2.2 `frontend/src/app/donor/page.tsx`
- **Purpose:** Voluntary Donor Console Page.
- **Responsibilities:** Fetches donor profile and eligibility countdown, renders availability toggle button, displays real-time emergency match alert cards.
- **Dependencies:** `@/lib/api`, `@/lib/auth-store`, `@/components/MatchAlertCard`, `@/components/ui/Button`.
- **Architecture Layer:** Client Dashboard Presentation.
- **UI States:** Implements Loading, Success, Empty (No requests nearby), and Error states.

---

### 2.3 `frontend/src/app/hospital/page.tsx`
- **Purpose:** Hospital Emergency Command Center Page.
- **Responsibilities:** Displays active blood requests, candidate donor response table, emergency request creation modal, and unit receipt confirmation buttons.
- **Dependencies:** `@/lib/api`, `@/lib/auth-store`, `@/components/ui/Card`, `@/components/ui/Button`.
- **Architecture Layer:** Client Dashboard Presentation.

---

### 2.4 `frontend/src/app/admin/page.tsx`
- **Purpose:** System Super-Admin Panel Page.
- **Responsibilities:** Renders pending hospital accreditation verification table and paginated security audit log table.
- **Dependencies:** `@/lib/api`, `@/lib/auth-store`, `@/components/ui/Card`, `@/components/ui/Badge`.
- **Architecture Layer:** Client Dashboard Presentation.

---

### 2.5 `frontend/src/components/MatchAlertCard.tsx`
- **Purpose:** Interactive Emergency Match Alert Card Component.
- **Responsibilities:** Renders alert urgency badge, distance in km, hospital notes, and "ACCEPT EMERGENCY DONATION" action button with Google Maps GPS routing upon acceptance.
- **Inputs:** `match` object (`id`, `distanceMeters`, `request` details).
- **Outputs:** Interactive React card component with optimistic state updates.
- **Dependencies:** `@/lib/api`, `lucide-react`, `@/components/ui/Button`.
- **Architecture Layer:** Component Presentation Layer.
