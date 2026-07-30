# Frontend Architecture & UX Specification (docs/frontend-architecture)

## Project Name: Blood Donation Network (BDN)
**Framework:** Next.js 14+ (App Router) / React 18 / TypeScript  
**Design Tokens:** Tailwind CSS + Radix UI Primitives  
**Accessibility Target:** WCAG 2.2 Level AA / AAA Compliant  
**Document Version:** 2.0.0  

---

## 1. Information Architecture & Route Map

```
/                             -> Public Landing Page (Hero, Features, Sandbox Accounts)
├── /login                    -> Public Authentication Page
├── /register                 -> Public Dual Registration (Donor / Hospital)
├── /donor                    -> Protected Donor Console (Role: DONOR)
│   ├── /donor/profile        -> Profile & Health Settings
│   └── /donor/history        -> Donation History Timeline
├── /hospital                 -> Protected Hospital Command Center (Role: HOSPITAL_ADMIN)
│   ├── /hospital/requests    -> Request List & Live Tracker
│   └── /hospital/inventory   -> Blood Bank Component Stock
└── /admin                    -> Protected Control Panel (Role: SYSTEM_ADMIN)
    ├── /admin/verifications  -> Hospital Accreditation Applications
    └── /admin/audit-logs     -> Security Audit Log Viewer
```

---

## 2. 4-State UI Design Standard

Every interactive UI container explicitly implements 4 fundamental visual states:

```
+-------------------------------------------------------------------------------+
| 1. LOADING STATE    | Animated skeletal wireframes (animate-pulse bg-slate-200)|
|                     | Screen reader announcement: aria-live="polite"         |
+---------------------+---------------------------------------------------------+
| 2. SUCCESS STATE    | Fully hydrated data cards / interactive tables          |
|                     | Optimistic feedback on user actions (e.g. Accept Match) |
+---------------------+---------------------------------------------------------+
| 3. EMPTY STATE      | Vector illustration, friendly explanation, clear CTA    |
|                     | e.g. "No emergency requests nearby. Thank you!"        |
+---------------------+---------------------------------------------------------+
| 4. ERROR STATE      | Red callout banner (border-l-4 border-crimson-600)      |
|                     | Actionable retry trigger button                         |
+-------------------------------------------------------------------------------+
```

---

## 3. WCAG 2.2 Accessibility Guidelines

1. **Focus Traps & Modals:** Accessible dialog modals utilize Radix UI Dialog primitives ensuring keyboard focus is trapped inside the active modal and returned to the trigger button upon closure.
2. **Keyboard Navigation:** All interactive elements (`<button>`, `<a href>`, `<input>`) have visible focus rings (`focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2`).
3. **Contrast Ratios:** Primary body text (`text-slate-900` on `#f8fafc`) achieves a 15:1 contrast ratio exceeding the WCAG 2.2 AAA standard (7:1). Emergency badges achieve a minimum 4.5:1 ratio.
4. **Accessible Forms:** All form inputs feature explicit `<label htmlFor="...">` associations and descriptive `aria-describedby` error strings.

---

## 4. Mobile-First Responsive Breakpoint Matrix

| Screen Size | Breakpoint | Grid / Navigation Rules |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | Single column vertical stack. Sticky bottom action bar for donor match acceptance. Touch targets minimum 48px x 48px. |
| **Tablet** | `640px - 1024px` | 2-column grid cards. Collapsible sidebar icon navigation menu. |
| **Desktop** | `> 1024px` | 3-column dashboard layout. Fixed left navigation sidebar. Split-screen live tracker and map integration. |
