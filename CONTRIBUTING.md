# Developer Contribution Guidelines (CONTRIBUTING)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

Thank you for contributing to the **Blood Donation Network**! This repository follows strict engineering, testing, and security standards to maintain clinical-grade software quality.

---

## 1. Code of Conduct & Principles

- **Patient-First Priority:** Systems directly impact emergency healthcare coordination. Safety, uptime, and data integrity supersede fast releases.
- **Strict Data Privacy:** Never log personally identifiable health information (PII) to console or public log aggregators.

---

## 2. Git Branching Model

We utilize a simplified **GitFlow** branching strategy:

- `main`: Production-ready release code. All commits are tagged with semver versions.
- `develop`: Primary integration branch for active feature development.
- `feature/<feature-name>`: Topic branches branched off `develop` (e.g., `feature/donor-cooldown-engine`).
- `fix/<bug-name>`: Bug fix branches branched off `develop` (e.g., `fix/jwt-expiration-handling`).
- `hotfix/<critical-fix>`: Emergency production fixes branched off `main`.

---

## 3. Conventional Commit Specification

All commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]

[optional issue reference]
```

### Allowed Commit Types:
- `feat`: A new feature added to the application.
- `fix`: A bug fix in existing code.
- `docs`: Documentation updates only.
- `style`: Formatting, missing semi-colons, white-space changes (no logic change).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Maintenance tasks, dependency updates, build configurations.

### Examples:
```bash
git commit -m "feat(matching): add PostGIS spatial query for 50km critical radius"
git commit -m "fix(auth): correct Argon2id password hashing salt round configuration"
git commit -m "docs(api): update OpenAPI spec for donor acceptance endpoint"
```

---

## 4. Pull Request (PR) Workflow & Checklist

1. **Branch Creation:** Ensure your branch is cut from up-to-date `develop`.
2. **Local Verification:** Before submitting a PR, ensure all local checks pass:
   ```bash
   npm run lint
   npm run typecheck
   npm run test:unit
   ```
3. **PR Submission:** Open a Pull Request targeting `develop`. Fill out the PR template completely:
   - Provide a clear summary of changes.
   - Reference linked issue numbers (`Closes #42`).
   - Attach screenshot or terminal log proof of testing.
4. **Code Review Expectations:**
   - Every PR requires at least **1 approving review** from a core maintainer.
   - All GitHub Actions CI checks must pass (Lint, Typecheck, Prisma status, Unit tests).
   - PR author must address all review comments before merging.
