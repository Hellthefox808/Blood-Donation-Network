# Role-Based User Stories (USER_STORIES)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

---

## Epic 1: Authentication & Onboarding

### US-1.1: Voluntary Donor Account Creation
- **As a:** Voluntary Blood Donor  
- **I want to:** Register an account using my email or Google OAuth and enter my blood type, phone number, and physical location  
- **So that:** I can be indexed for local blood emergency dispatch alerts.  
- **Priority:** High (MVP)  

```gherkin
Scenario: Successful Donor Registration via Web Form
  Given I am on the BDN registration page
  When I fill in valid profile details including blood type "O-Negative" and phone "+14155550199"
  And I submit the registration form
  Then my user account and donor profile are created in PostgreSQL
  And I receive a confirmation email with a verification link
  And I am redirected to the Donor Onboarding Dashboard.
```

---

### US-1.2: Hospital Accreditation & Onboarding
- **As a:** Hospital Administrator  
- **I want to:** Register my medical facility with medical license documentation  
- **So that:** System admins can verify my credentials before I issue critical blood requests.  
- **Priority:** High (MVP)  

```gherkin
Scenario: Hospital Registration Pending Verification
  Given I am a Hospital Administrator registering St. Jude Emergency Center
  When I upload medical license "CA-MED-88912" and address details
  Then my hospital account status is set to "PENDING_VERIFICATION"
  And I am restricted from posting blood requests until a System Admin approves my application.
```

---

## Epic 2: Emergency Request & Matching Engine

### US-2.1: Hospital Emergency Request Dispatch
- **As an:** Accredited Hospital Administrator  
- **I want to:** Create a CRITICAL request for 3 units of O-Negative Whole Blood  
- **So that:** Nearby compatible donors are automatically matched and notified within seconds.  
- **Priority:** Critical (MVP)  

```gherkin
Scenario: Automatic Proximity & Compatibility Dispatch
  Given an accredited Hospital Admin is logged in
  When she posts a CRITICAL request for 3 units of "O-Negative" blood at location (37.7749, -122.4194)
  Then the system executes a spatial PostGIS query for eligible O-Negative donors within a 50 km radius
  And dispatches real-time WebSocket push notifications to online matched donors
  And queues automated SMS dispatches via Twilio for offline matched donors.
```

---

### US-2.2: Donor Notification & Match Acceptance
- **As an:** Eligible Matched Donor  
- **I want to:** Receive an urgent push/SMS alert displaying distance to the hospital and click "Accept"  
- **So that:** I can confirm my commitment and receive navigation instructions to the emergency desk.  
- **Priority:** Critical (MVP)  

```gherkin
Scenario: Donor Accepts Emergency Request
  Given a donor receives a notification for an urgent O-Negative request 4.2 km away
  When the donor clicks "ACCEPT" in the BDN mobile app interface
  Then the match status is updated to "ACCEPTED"
  And the requesting hospital dashboard receives a real-time notification with donor ETA
  And the donor interface displays direct Google Maps directions to the hospital emergency desk.
```

---

## Epic 3: Donor Health & Cooldown Tracking

### US-3.1: Automated Cooldown Calculation
- **As a:** Voluntary Donor  
- **I want to:** Have my eligibility date automatically updated after completing a donation  
- **So that:** I am not contacted for new donations before my body has fully recovered.  
- **Priority:** High (MVP)  

```gherkin
Scenario: Donation Completed Whole Blood Cooldown Update
  Given a donor completes a 1-unit Whole Blood donation at St. Jude Hospital
  When the Hospital Admin clicks "Confirm Donation Fulfilled"
  Then the system records the donation event
  And sets the donor's "last_donation_date" to today
  And sets "next_eligible_date" to today + 56 calendar days
  And suppresses emergency alerts to this donor for the next 56 days.
```

---

## Epic 4: Inventory & Operational Analytics

### US-4.1: Blood Bank Inventory Stock Management
- **As a:** Blood Bank Manager  
- **I want to:** Log incoming blood component batches and view real-time unit counts  
- **So that:** I can prevent component stockouts and identify units nearing expiration.  
- **Priority:** Medium (Phase 2)  

```gherkin
Scenario: Component Stock Update and Expiry Warning
  Given a Blood Bank Manager logs 10 units of Platelets expiring in 5 days
  When the inventory table updates
  Then the system displays a visual yellow warning tag on the Platelet batch
  And includes these units in regional emergency availability queries.
```

---

## Epic 5: System Governance & Compliance

### US-5.1: Admin Verification of Hospital Credentials
- **As a:** System Super-Admin  
- **I want to:** Review pending hospital accreditation applications and inspect medical license documents  
- **So that:** Only legitimate medical facilities can broadcast alerts to local donors.  
- **Priority:** High (MVP)  

```gherkin
Scenario: System Admin Approves Hospital Application
  Given a System Admin is reviewing the pending list in the Admin Panel
  When he verifies license "CA-MED-88912" against state registry records and clicks "Approve"
  Then the hospital status changes to "APPROVED"
  And the hospital admin receives an email notification unlocking request dispatch features.
```
