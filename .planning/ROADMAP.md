# Mallaram Village Website — Roadmap

> "Mana Ooru" — Smart Village rooted in nature

## Project Vision
Create a modern digital identity for Mallaram village that showcases development, reflects Telangana cultural roots, builds trust among villagers and officials, and provides a simple complaint submission system.

---

## Technical Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (optional)
- **i18n:** JSON-based (Telugu + English)
- **Integrations:** Google Forms (complaints), Google Maps (location)
- **Type:** Single-page static web application

---

## Design System

| Element | Value |
|---------|-------|
| Primary | Deep Green |
| Background | Light Cream |
| Accent | Earth tones |
| Style | Clean + Minimal with Telangana cultural touches |
| UI Principles | Consistent spacing, clear hierarchy, limited animations, mobile-first |

---

## Constraints

- Static content only (no backend)
- No sensitive data stored
- External form handling (Google Forms)
- Updates require code deployment
- HTTPS required

---

## Phases

### Phase 01: Foundation
**Goal:** Scaffolding — project setup, routing, layout, design system, i18n core

**Requirements:** `[TECH-01, TECH-02, TECH-03, I18N-01]`

**Plans:**
- [ ] 01-foundation/01-foundation-PLAN.md — Setup, layout, design tokens, fonts, i18n

---

### Phase 02: Static Sections
**Goal:** Hero + About + Facilities — core page sections with content

**Requirements:** `[UI-01, UI-02, UI-03, UI-04]`

**Plans:**
- [ ] 02-sections/01-sections-PLAN.md — Hero, About, Facilities components

---

### Phase 03: Content Sections
**Goal:** Gallery + Events + Footer — visual storytelling and navigation

**Requirements:** `[UI-05, UI-06, UI-07]`

**Plans:**
- [ ] 03-content/01-content-PLAN.md — Gallery, Events, Footer

---

### Phase 04: Integrations
**Goal:** Complaint CTA + Contact + Maps — Google Forms, Google Maps, responsive polish

**Requirements:** `[INT-01, INT-02, INT-03]`

**Plans:**
- [ ] 04-integrations/01-integrations-PLAN.md — CTA, Contact, Maps, polish

---

### Phase 05: Feature Integration
**Goal:** Integrate 9 demo features from temp_source_repo, adapting to existing UI and i18n system

**Requirements:** `[FEAT-01, FEAT-02]`

**Plans:**
- [ ] 05-features/05-features-PLAN.md — Integrate: CommandCenter, Analytics, TransparencyPortal, WaterGovernance, GrievanceSystem, EmergencyAlerts, (adapted to match existing UI)

---

## Requirement Index

| ID | Requirement | Phase |
|----|-------------|-------|
| TECH-01 | Next.js App Router setup with Tailwind CSS | 01 |
| TECH-02 | Mobile-first responsive layout | 01 |
| TECH-03 | Framer Motion integration (minimal animations) | 01 |
| I18N-01 | Telugu + English toggle with JSON translations | 01 |
| UI-01 | Hero section with image slider + tagline | 02 |
| UI-02 | About Village section | 02 |
| UI-03 | Facilities section (schools, healthcare, roads, water, electricity) | 02 |
| UI-04 | Language toggle UI component | 02 |
| UI-05 | Gallery section (grid/masonry layout) | 03 |
| UI-06 | Events section (festivals + local events) | 03 |
| UI-07 | Footer with quick links | 03 |
| INT-01 | Complaint CTA with Google Forms link | 04 |
| INT-02 | Contact section (Panchayat details, phone, address) | 04 |
| INT-03 | Google Maps embed | 04 |
| FEAT-01 | Integrate demo features from temp_source_repo | 05 |
| FEAT-02 | Adapt features to match existing design system | 05 |

---

## Success Criteria

- [ ] Visitors understand village identity within 5 seconds
- [ ] Complaint CTA is clearly visible and usable
- [ ] Website works smoothly on mobile
- [ ] Clean, professional visual experience
- [ ] Fast loading (< 3 seconds)
- [ ] Optimized images with lazy loading
- [ ] All content available in Telugu and English

---

## User Decisions (from PRD)

| Decision | Value |
|----------|-------|
| Stack | Next.js App Router, Tailwind CSS |
| Animations | Minimal (Framer Motion optional) |
| i18n | JSON-based, Telugu + English |
| Complaint | Google Forms (external) |
| Maps | Google Maps embed |
| Color | Deep Green primary, Light Cream background, Earth accent |

---

## Deferred (not in MVP)

- Admin panel
- Dynamic event updates
- Complaint tracking system
- Announcement system
- Dark mode

---

*Last updated: 2026-04-23*