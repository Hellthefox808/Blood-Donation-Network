# Component Architecture & Design Catalog (COMPONENTS)

## Project Name: Blood Donation Network (BDN)
**Framework:** Next.js 14+ / React 18 / TypeScript  
**Styling Engine:** Tailwind CSS + Radix UI Primitives  
**Document Version:** 1.0.0  

---

## 1. Component Hierarchy Overview

```
src/
├── components/
│   ├── ui/                    # Atomic Accessible UI Primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Modal.tsx
│   ├── shared/                # Cross-Domain Shared Layout Components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── DataTable.tsx
│   │   └── StatusIndicator.tsx
│   └── domain/                # Business Domain Specific Components
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── RegisterDonorForm.tsx
│       ├── donor/
│       │   ├── CooldownCard.tsx
│       │   ├── MatchAlertCard.tsx
│       │   └── AvailabilityToggle.tsx
│       ├── hospital/
│       │   ├── CreateRequestModal.tsx
│       │   ├── RequestStatusTable.tsx
│       │   └── MatchedDonorsList.tsx
│       └── admin/
│           ├── HospitalVerifyTable.tsx
│           └── AuditLogViewer.tsx
```

---

## 2. Shared Primitive Specs & Interfaces

### 2.1 `Button.tsx` Component
- **Description:** Accessible, polymorphic button component supporting brand variants and loading states.
- **Props Interface:**
```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

---

### 2.2 `Badge.tsx` Component
- **Description:** Accessible status pill component with strict color mapping for emergency severity levels.
- **Props Interface:**
```typescript
export interface BadgeProps {
  variant: 'routine' | 'urgent' | 'critical' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}
```
- **Variant Mapping:**
  - `critical`: `bg-red-100 text-red-800 border-red-300 font-bold`
  - `urgent`: `bg-amber-100 text-amber-800 border-amber-300`
  - `routine`: `bg-sky-100 text-sky-800 border-sky-300`

---

### 2.3 `MatchAlertCard.tsx` Component (Donor View)
- **Description:** Card displayed to matched donors upon receiving an emergency notification.
- **Props Interface:**
```typescript
export interface MatchAlertCardProps {
  matchId: string;
  hospitalName: string;
  bloodGroup: string;
  urgency: 'ROUTINE' | 'URGENT' | 'CRITICAL';
  distanceKm: number;
  estimatedEtaMins: number;
  onAccept: (matchId: string) => Promise<void>;
  onDecline: (matchId: string) => Promise<void>;
}
```

---

## 3. State & Data-Fetching Boundaries

```
                       +---------------------------------------+
                       |           Next.js Page (RSC)          |
                       +-------------------+-------------------+
                                           |
                                           v
                       +---------------------------------------+
                       |    Client Dashboard Component ("use client")
                       +-------------------+-------------------+
                                           |
                +--------------------------+--------------------------+
                |                                                     |
                v                                                     v
   +--------------------------+                         +--------------------------+
   |  TanStack Query Hook     |                         | Zustand Client Store     |
   | (Server Data Fetching)   |                         | (Auth Tokens, WS state)  |
   | e.g. useHospitalRequests |                         | e.g. useAuthStore        |
   +--------------------------+                         +--------------------------+
```

### Data Boundary Principles:
1. **Server Components (RSC):** Used for initial server data fetching and layout frames (Navbar, Page Header).
2. **TanStack Query Hooks:** Encapsulate all REST API calls with explicit `queryKey` caching strategies (e.g., `['requests', hospitalId]`).
3. **Optimistic Updates:** Match acceptance and inventory unit updates utilize optimistic UI updates for instant interface responsiveness before API completion.
