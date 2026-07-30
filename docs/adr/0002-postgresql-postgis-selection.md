# ADR 0002: Selection of PostgreSQL 16 with PostGIS Extension

## Status
Accepted

## Context
BDN requires a database engine capable of storing relational blood inventory models, enforcing ACID compliance on emergency request dispatches, and executing low-latency proximity queries (within dynamic kilometer radii) across thousands of active donor locations.

## Decision
We select **PostgreSQL 16** with the **PostGIS 3.4** spatial extension as our primary database engine.

## Rationale
1. **Relational Integrity & ACID Compliance**: Blood request fulfillments and inventory deductions require strict transactional safety to prevent double allocations.
2. **Native Spatial Indexing (GIST)**: PostGIS provides native geometry types (`GEOMETRY(Point, 4326)`) and optimized spatial functions (`ST_DWithin`, `ST_Distance`). Sub-second proximity searches are achieved across 100,000+ records.
3. **Ecosystem & Prisma Support**: Prisma natively supports PostgreSQL extensions and parameterized raw SQL queries (`prisma.$queryRaw`).

## Consequences
- **Positive**: High query performance, spatial capability, zero data corruption risk during transactional updates.
- **Negative**: Requires spatial extension installation in PostgreSQL container environments and custom SQL migration scripts for GIST indexes.
