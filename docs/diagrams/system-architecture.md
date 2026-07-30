# System Architecture & Sequence Diagrams (docs/diagrams)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

---

## 1. System Sequence Diagram: Emergency Blood Request & Donor Matching

```mermaid
sequenceDiagram
    autonumber
    actor Hospital as Hospital Admin
    participant API as Express API Server
    participant DB as PostgreSQL (PostGIS)
    participant Redis as Redis Queue / Bus
    participant WS as Socket.io Server
    participant Twilio as Twilio SMS API
    actor Donor as Voluntary Donor

    Hospital->>API: POST /api/v1/hospitals/requests (CRITICAL, 2 Units O-)
    API->>API: Validate Hospital Authorization & Zod Payload
    API->>DB: INSERT into blood_requests & BEGIN Transaction
    
    API->>DB: Execute PostGIS Spatial Match Query (50km Radius, ABO/Rh filter)
    DB-->>API: Return Matched Eligible Donors [Donor#1, Donor#2]
    
    API->>DB: INSERT into matches (status = 'NOTIFIED') & COMMIT
    
    API->>Redis: Publish Event 'REQUEST_CREATED' with Match Payload
    API-->>Hospital: 201 Created (status: 'SEARCHING', matchedCount: 2)

    par Real-Time WebSockets Push
        Redis->>WS: Broadcast Event to Online Donors
        WS-->>Donor: Push Alert: "Critical O- Blood Needed 4.2km Away"
    and Asynchronous SMS Dispatch
        Redis->>Twilio: Enqueue SMS Job
        Twilio-->>Donor: SMS Alert: "Urgent: St Jude needs O- blood. Reply YES to accept."
    end

    Donor->>API: POST /api/v1/matches/{id}/accept
    API->>DB: UPDATE match status = 'ACCEPTED'
    API->>WS: Broadcast Event 'match:accepted' to Hospital Dashboard
    WS-->>Hospital: Live Update: "Donor #1 Accepted (ETA ~12 mins)"
    API-->>Donor: 200 OK (Hospital Address & Navigation Link)
```

---

## 2. Component Class Diagram

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String passwordHash
        +Role role
        +Boolean isVerified
        +authenticate()
    }
    
    class DonorProfile {
        +UUID id
        +BloodGroup bloodGroup
        +Date dateOfBirth
        +Decimal weightKg
        +Boolean isAvailable
        +Date lastDonationDate
        +Date nextEligibleDate
        +Point location
        +calculateEligibility() Boolean
    }
    
    class Hospital {
        +UUID id
        +String name
        +String licenseNumber
        +Boolean isApproved
        +Point location
    }
    
    class BloodRequest {
        +UUID id
        +BloodGroup bloodGroup
        +ComponentType componentType
        +Int unitsRequested
        +Int unitsFulfilled
        +Urgency urgency
        +Status status
        +DateTime requiredBy
    }

    User "1" -- "1" DonorProfile
    User "1" -- "1" Hospital
    Hospital "1" -- "*" BloodRequest
```
