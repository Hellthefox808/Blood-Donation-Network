# QA & Testing Strategy (TEST_PLAN)

## Project Name: Blood Donation Network (BDN)
**Testing Tools:** Jest, Supertest, Playwright, K6 Performance Suite  
**Target Code Coverage:** 85% Statements / 80% Branches  
**Document Version:** 1.0.0  

---

## 1. Multi-Tier Testing Pyramid

```
                       / \
                      /   \     E2E Playwright Tests (Critical User Flows)
                     /-----\
                    /       \   API Integration Tests (Supertest + Test Container DB)
                   /---------\
                  /           \ Unit & Domain Logic Tests (Jest pure functions)
                 +-------------+
```

---

## 2. Test Suites & Categorization

### 2.1 Unit Tests (Jest)
- **Scope:** Pure domain functions, validation logic, eligibility calculators, and utility transformers.
- **Key Test Files:**
  - `DonorEligibilityCalculator.test.ts`: Verifies 56-day whole blood cooldown and 14-day platelet cooldown math.
  - `BloodCompatibilityMatrix.test.ts`: Verifies clinical ABO/Rh compatibility rules (e.g., O- can donate to all).
  - `ZodValidator.test.ts`: Verifies input validation bounds (weight > 50kg, latitude/longitude boundaries).

---

### 2.2 Integration & API Tests (Supertest)
- **Scope:** Express HTTP controllers, middleware stack, Prisma database transactions, and Redis session handling.
- **Environment:** Test PostgreSQL database running inside Docker container; automatically wiped and seeded between suites.
- **Key API Test Suites:**
  - `AuthFlow.test.ts`: Registration, login, token refresh, password reset, rate-limit locks.
  - `HospitalRequestWorkflow.test.ts`: Request creation, PostGIS spatial query matching, status transition from `SEARCHING` to `FULFILLED`.
  - `RBACEnforcement.test.ts`: Validates that Donors receive `403 Forbidden` when attempting to access `/admin/*` or `/hospitals/*` routes.

---

### 2.3 End-to-End (E2E) Browser Tests (Playwright)
- **Scope:** Complete multi-user workflows simulating real browser interactions across Hospital Admin, Donor, and System Admin roles.
- **Scenario E2E-1:**
  1. Hospital Admin logs into portal and broadcasts CRITICAL O-Negative request.
  2. Donor logs into PWA, receives real-time Socket.io push alert card.
  3. Donor clicks "Accept", map directions display.
  4. Hospital dashboard updates automatically with donor ETA.

---

## 3. Negative & Security Test Cases

| Case ID | Test Scenario Description | Expected Outcome |
| :--- | :--- | :--- |
| **NEG-01** | Donor attempts to accept match while under active 56-day cooldown. | API returns `422 Unprocessable Entity` with `DONOR_INELIGIBLE` code. |
| **NEG-02** | Unverified hospital attempts to create a blood request. | API returns `403 Forbidden` with detail message requiring admin approval. |
| **NEG-03** | Attacker submits SQL injection string in address field. | Prisma parameterization neutralizes input; string stored safely without execution. |
| **NEG-04** | User attempts 6 failed login attempts in 2 minutes. | Redis rate limiter returns `429 Too Many Requests` locking IP for 15 minutes. |
| **NEG-05** | Attacker tampers with JWT role claim from `DONOR` to `SYSTEM_ADMIN`. | RS256 signature verification fails; API returns `401 Unauthorized`. |

---

## 4. Automated Test Command Execution Reference

```bash
# Run unit tests
npm run test:unit

# Run integration tests against Dockerized test database
npm run test:integration

# Run Playwright E2E browser tests
npx playwright test

# Generate HTML coverage report
npm run test:coverage
```
