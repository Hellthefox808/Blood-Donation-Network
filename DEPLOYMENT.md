# Deployment & Infrastructure Specification (DEPLOYMENT)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  
**Containerization:** Docker Compose / Kubernetes (Helm)  
**CI/CD Pipeline:** GitHub Actions  

---

## 1. Environment Variable Reference

### Backend `.env` Specification
```env
# Application Runtime Configuration
NODE_ENV=production
PORT=5000
API_BASE_URL=https://api.bdn.org

# Database Configuration (PostgreSQL 16 + PostGIS)
DATABASE_URL="postgresql://bdn_admin:SecurePassword123!@postgres-master.internal:5432/bdn_prod?schema=public&sslmode=require"

# Redis Cache & Queue Configuration
REDIS_HOST="redis-cluster.internal"
REDIS_PORT=6379
REDIS_PASSWORD="RedisSecurePassword123!"

# Authentication & Cryptography (RS256 JWT)
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz..."
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAz..."
JWT_ACCESS_EXPIRATION="900"       # 15 minutes in seconds
JWT_REFRESH_EXPIRATION="604800"   # 7 days in seconds

# Communications Integration (Twilio & SendGrid)
TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+18005550199"
SENDGRID_API_KEY="SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
SENDGRID_FROM_EMAIL="notifications@bdn.org"

# Mapping & Spatial Services
GOOGLE_MAPS_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Monitoring & APM
DATADOG_API_KEY="your_datadog_api_key"
```

---

## 2. Docker Containerization Setup

### 2.1 Multi-Stage Production `Dockerfile` (Backend)
```dockerfile
# Stage 1: Build & Prune
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000
USER node
CMD ["node", "dist/server.js"]
```

---

### 2.2 `docker-compose.yml` (Local & Staging Setup)
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    container_name: bdn-postgres
    environment:
      POSTGRES_USER: bdn_admin
      POSTGRES_PASSWORD: SecurePassword123!
      POSTGRES_DB: bdn_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bdn_admin -d bdn_dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7.2-alpine
    container_name: bdn-redis
    command: redis-server --requirepass RedisSecurePassword123!
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: bdn-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://bdn_admin:SecurePassword123!@postgres:5432/bdn_dev?schema=public
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=RedisSecurePassword123!
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: bdn-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## 3. GitHub Actions CI/CD Pipeline Summary

Pipeline configured in `.github/workflows/ci-cd.yml`:
1. **Lint & Typecheck:** Runs `tsc --noEmit` and `eslint` across frontend and backend codebases.
2. **Database Migration Check:** Verifies Prisma schema compatibility with `npx prisma migrate status`.
3. **Automated Testing:** Executes unit and Supertest integration tests against an ephemeral PostgreSQL service container.
4. **Docker Image Build & Push:** Tags images with git SHA and pushes to Docker Hub / GitHub Container Registry upon release tag push (`v*.*.*`).
5. **Production Deployment Trigger:** Triggers rolling restart deployment on Kubernetes cluster via Helm upgrade.

---

## 4. Production Rollback Strategy

1. **Zero-Downtime Rolling Updates:** Kubernetes Deployment configured with `maxSurge: 25%` and `maxUnavailable: 0`.
2. **Database Migration Safety:** All DB schema changes must be strictly backwards-compatible (Add column -> Deploy Code -> Drop old column in next release).
3. **Instant Rollback Command:**
   ```bash
   helm rollback bdn-production-release <previous_revision_number>
   ```
