# UI/UX Design System Specification (UI_UX)

## Project Name: Blood Donation Network (BDN)
**Design Philosophy:** Modern, Emergency-Optimized, Accessible, High-Contrast  
**Target Standard:** WCAG 2.1 Level AA Compliance  
**Document Version:** 1.0.0  

---

## 1. Design System Principles

1. **Urgent Visual Hierarchy:** In emergency clinical software, information density must never obscure actionable data. Critical blood requests utilize high-contrast red alerts (`#DC2626`) paired with clear icon identifiers to command immediate attention.
2. **Sub-3-Tap Action Trails:** Donors responding to an emergency notification must be able to complete acceptance in at most 2 taps (Tap 1: Open Push Alert, Tap 2: Confirm Acceptance).
3. **Accessibility First (WCAG 2.1 AA):** High-contrast ratios (minimum 4.5:1 for standard body text, 3:1 for large headings), full keyboard navigability with visible focus indicators, and screen-reader `aria-live` regions for dynamic alerts.
4. **State Clarity:** Every UI view explicitly handles 4 fundamental states: **Loading**, **Success Data**, **Empty Data**, and **Error Recovery**.

---

## 2. Color Palette & Typography Tokens

### 2.1 Color Tokens (Tailwind CSS Mapping)

| Token Name | Hex Value | Usage Context |
| :--- | :--- | :--- |
| `--color-crimson-600` | `#DC2626` | Primary Action Brand Color, Emergency Critical Badges |
| `--color-crimson-700` | `#B91C1C` | Hover / Active states for critical buttons |
| `--color-emerald-600` | `#059669` | Success States, Donor Acceptance Buttons, Eligible Tags |
| `--color-amber-500` | `#F59E0B` | Urgent Severity Alerts, Impending Expiry Warnings |
| `--color-slate-900` | `#0F172A` | Primary Dark Text (Ensures 15:1 contrast against white background) |
| `--color-slate-100` | `#F1F5F9` | Neutral Card Background fill |
| `--color-sky-600` | `#0284C7` | Informational links, Routine Request Badges |

### 2.2 Typography Hierarchy (Inter Font Family)
- **H1 (Page Title):** `text-3xl font-bold tracking-tight text-slate-900` (Mobile: `text-2xl`)
- **H2 (Section Header):** `text-xl font-semibold text-slate-800`
- **Body Regular:** `text-base font-normal leading-relaxed text-slate-700`
- **Caption / Tag:** `text-xs font-medium uppercase tracking-wider text-slate-500`

---

## 3. Information Architecture & Navigation Structure

```
+-----------------------------------------------------------------------------------+
|                                  GLOBAL NAVBAR                                    |
| [ Logo: BDN ]  [ Active Role Context ]   [ Notifications (3) ]  [ User Profile ] |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
[ DONOR DASHBOARD ]             [ HOSPITAL DASHBOARD ]          [ ADMIN CONTROL PANEL ]
├── Quick Eligibility Card      ├── + Create New Request        ├── Hospital Accreditation List
├── Active Match Alerts         ├── Active Requests Table       ├── User Account Audit Log
├── Donation History Timeline   ├── Matched Donors Tracker      ├── System Metrics Overview
└── Profile & Location Settings └── Inventory Manager           └── Security Alert Log
```

---

## 4. Component UI State Definitions

### 4.1 Loading State Standard
- Skeletal placeholders (`animate-pulse bg-slate-200 rounded`) matching exact layout geometry of incoming cards/tables.
- Accessible announcements via aria-live: `<div role="status" class="sr-only">Loading emergency requests...</div>`.

### 4.2 Empty State Standard
- Clean vector visual illustration paired with actionable secondary buttons:
  - *Donor Empty Requests:* "No active blood requests in your area right now. Thank you for keeping your status available!"
  - *Hospital Empty Requests:* "No active requests. Click [Create Blood Request] to broadcast an emergency dispatch."

### 4.3 Error State Standard
- Red border accent callout (`border-l-4 border-crimson-600 bg-red-50 p-4`) containing:
  - Concise error explanation in plain language.
  - Distinct "Try Again" retry trigger button.

---

## 5. Responsive Layout Behavior Rules

| Screen Size | Breakpoint | Layout Behavior Rules |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | Single-column stack. Bottom-anchored sticky action bar for donor match acceptance. Slide-over drawer navigation menu. |
| **Tablet** | `640px - 1024px` | 2-column grid cards. Sidebar collapsible navigation icon bar. |
| **Desktop** | `> 1024px` | Multi-column dashboard grid. Fixed left navigation sidebar. Split-screen hospital request monitoring & matched donor map. |
