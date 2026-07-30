# ADR 0003: Adoption of Dual-Token RS256 JWT & Redis Revocation for RBAC

## Status
Accepted

## Context
BDN requires a stateless, scalable authentication strategy supporting 4 distinct user roles (`DONOR`, `HOSPITAL_ADMIN`, `BLOOD_BANK_MANAGER`, `SYSTEM_ADMIN`) across web and mobile progressive web apps, while maintaining instant session revocation capabilities for security compliance.

## Decision
We adopt a **Dual-Token JWT Architecture (RS256 signed)** combined with an **HttpOnly Refresh Token cookie** and a **Redis-backed token blacklist**.

## Key Specifications
- **Access Tokens**: Short-lived (15 minutes), RS256 asymmetric signature. Contains user ID and role claims.
- **Refresh Tokens**: Long-lived (7 days), stored in `HttpOnly, Secure, SameSite=Strict` cookies.
- **Revocation**: Logging out or modifying role permissions writes the token ID (`jti`) to a Redis key with a 15-minute TTL.

## Consequences
- **Positive**: Stateless access token verification across API cluster nodes without hitting database on every request; rapid revocation enforcement via Redis check middleware.
- **Negative**: Requires managing public/private key pairs and maintaining a Redis cluster in production.
