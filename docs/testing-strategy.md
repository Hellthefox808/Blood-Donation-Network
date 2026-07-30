# Testing Strategy & Quality Assurance Blueprint (docs/testing-strategy)

## Project Name: Blood Donation Network (BDN)
**Testing Tools:** Jest, Supertest, Playwright, React Testing Library, Axe-Core Accessibility  
**Target Coverage:** 85% Code Coverage  
**Document Version:** 2.0.0  

---

## 1. Testing Pyramid & Tools Matrix

| Testing Tier | Technology Choice | Scope & Target |
| :--- | :--- | :--- |
| **Unit Tests** | Jest | Pure functions (eligibility calculators, compatibility matrix, Zod schemas). |
| **Integration Tests** | Supertest + Test DB | Express routes, Prisma queries, Redis session revocation, RBAC middleware. |
| **UI Component Tests**| React Testing Library | User-centric component rendering, dialog focus traps, form validations. |
| **E2E Browser Tests** | Playwright | Full multi-user browser flows (Hospital request creation -> Donor push alert -> Acceptance). |
| **Accessibility Tests**| `@axe-core/playwright` | Automated WCAG 2.2 Level AA accessibility scans on all routes. |

---

## 2. Automated Accessibility Audit Code Example

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Scans (WCAG 2.2 AA)', () => {
  test('Landing Page should pass accessibility checks', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```
