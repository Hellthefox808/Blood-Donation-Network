# DevOps & CI/CD Deployment Architecture (docs/devops-blueprint)

## Project Name: Blood Donation Network (BDN)
**Containerization:** Docker Compose / Kubernetes Helm  
**CI/CD Pipeline:** GitHub Actions  
**Document Version:** 2.0.0  

---

## 1. Environments Strategy

| Environment | Purpose | Database | Deployment Host |
| :--- | :--- | :--- | :--- |
| **Development** | Local engineering iteration | SQLite / Local PostgreSQL | Docker Compose on local dev host |
| **Staging** | QA, E2E testing, PR preview | AWS RDS PostgreSQL Staging | K8s Staging Cluster |
| **Production** | Live clinical coordination | AWS RDS PostgreSQL Multi-AZ | K8s Production Cluster |

---

## 2. GitHub Actions CI/CD Pipeline Flow

```mermaid
graph TD
    Push[Git Push to 'develop' or 'main'] --> Step1[Job 1: Lint & Typecheck]
    Step1 --> Step2[Job 2: Unit & Integration Tests]
    Step2 --> Step3[Job 3: E2E Playwright Tests]
    Step3 --> Step4[Job 4: Docker Image Build & Push to Registry]
    Step4 --> Step5[Job 5: Helm Upgrade Rolling Deployment to K8s]
    Step5 --> Step6[Job 6: Automated Smoke Tests]
    Step6 -->|Smoke Fail| Step7[Automated Rollback to Previous Helm Revision]
```

---

## 3. Production Rollback Strategy

1. **Kubernetes Rolling Restart:** Deployment configured with `maxSurge: 25%` and `maxUnavailable: 0` for zero-downtime releases.
2. **Instant Automated Rollback:** If automated smoke tests fail post-deploy, GitHub Actions executes:
   ```bash
   helm rollback bdn-production <previous_revision>
   ```
