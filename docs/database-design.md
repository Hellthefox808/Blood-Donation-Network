# Database Architecture & Data Modeling (docs/database-design)

## Project Name: Blood Donation Network (BDN)
**Database Engine:** PostgreSQL 16 + PostGIS 3.4 Extension  
**ORM:** Prisma ORM v5  
**Document Version:** 2.0.0  

---

## 1. Schema & Relational Integrity Rules

1. **Foreign Key Cascade Policies:** `User` deletion cascades to `DonorProfile`, `Hospital`, and `BloodBank`. Deleting a `BloodRequest` cascades to associated `Match` records.
2. **Soft Delete Strategy:** High-value domain records (`BloodRequest`, `Hospital`) implement a `deleted_at DATETIME` column. Soft-deleted records are filtered out from query results via Prisma middleware.
3. **Audit History Logbook:** High-privilege actions write immutable entries to `audit_logs`. Audit logs are retained for 7 years to meet HIPAA/GDPR medical compliance rules.

---

## 2. PostGIS Spatial Indexing Performance Strategy

```sql
-- GIST Spatial Indexes for Sub-Second Proximity Querying
CREATE INDEX IF NOT EXISTS donor_location_gist ON donor_profiles USING GIST (location);
CREATE INDEX IF NOT EXISTS hospital_location_gist ON hospitals USING GIST (location);

-- PostGIS Proximity Query Executed during Emergency Matching
SELECT id, full_name, ST_Distance(location, ST_SetSRID(ST_MakePoint($lng, $lat), 4326)) AS distance_meters
FROM donor_profiles
WHERE blood_group IN ('O_NEGATIVE', 'A_NEGATIVE')
  AND is_available = TRUE
  AND next_eligible_date <= CURRENT_DATE
  AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($lng, $lat), 4326), $radiusMeters)
ORDER BY distance_meters ASC
LIMIT 20;
```

---

## 3. Indexing Strategy Summary

| Table Name | Indexed Columns | Index Type | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `email` | UNIQUE B-Tree | Fast authentication lookup. |
| `donor_profiles` | `[bloodGroup, isAvailable, nextEligibleDate]` | Compound B-Tree | Filtering eligible donors. |
| `donor_profiles` | `location` | GIST Spatial | Sub-second radius proximity matching. |
| `blood_requests` | `[status, urgency, bloodGroup]` | Compound B-Tree | Active request dashboard filtering. |
| `audit_logs` | `[action, entity]` | B-Tree | Security audit log querying. |
