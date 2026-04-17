## HNG TODO APP (Stage 1A)

This repository now includes an advanced, interactive single Todo Card implementation for Stage 1A.

## What changed from Stage 0

- Added in-card **edit mode** with Save/Cancel and required edit `data-testid` fields
- Added **status control** (Pending, In Progress, Done) and synced it with checkbox behavior
- Added **priority indicator** visuals for Low/Medium/High
- Added **expand/collapse** behavior for long descriptions
- Added granular, live-updating **time management** with overdue indicator and completed state
- Added visual states for **Done**, **In Progress**, **High Priority**, and **Overdue**

## Design decisions

- Kept all existing Stage 0 `data-testid` elements while introducing Stage 1A test hooks
- Used a re-render pattern for simple state synchronization in vanilla JavaScript
- Used a 30-second interval to refresh time displays without rebuilding the full list each tick

## Known limitations

- This is intentionally a single-card-style component rendered from a local array (not a full persisted app)
- Focus trapping in edit mode is not implemented (focus return to Edit button is implemented)

## Accessibility notes

- Expand/collapse and status controls use native form/button elements for keyboard support
- Edit mode returns focus to the originating Edit button after Save/Cancel
