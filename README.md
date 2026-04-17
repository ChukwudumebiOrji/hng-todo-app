## HNG TODO APP

This project was built for the HNG Stage 0 task. The original requirement was to create a simple card component, but I expanded it into a full todo application to challenge myself and deepen my understanding of DOM manipulation with vanilla JavaScript. There was no provided design or design reference, so the UI/UX is entirely my own.

---

## AI Usage Declaration

While AI tools were used during development, all code and implementation decisions are my own. AI was used strictly as a **learning aid** in the following areas:

- **Color palette generation** — AI assisted in selecting a cohesive color scheme for the application.
- **Icon integration** — AI helped me understand how to use CDN-based icons (Font Awesome) within dynamically created JavaScript elements.
- **Custom checkbox styling** — AI guided me on how to override default browser checkbox styles using CSS.

All DOM manipulation, application logic, and styling were written by me.

## HNG TODO APP (Stage 1A)

This repository now includes an advanced, interactive single Todo Card implementation for Stage 1A.

### What changed from Stage 0

- Added in-card **edit mode** with Save/Cancel and required edit `data-testid` fields
- Added **status control** (Pending, In Progress, Done) and synced it with checkbox behavior
- Added **priority indicator** visuals for Low/Medium/High
- Added **expand/collapse** behavior for long descriptions
- Added granular, live-updating **time management** with overdue indicator and completed state
- Added visual states for **Done**, **In Progress**, **High Priority**, and **Overdue**

### Design decisions

- Kept all existing Stage 0 `data-testid` elements while introducing Stage 1A test hooks
- Used a re-render pattern for simple state synchronization in vanilla JavaScript
- Used a 30-second interval to refresh time displays without rebuilding the full list each tick
