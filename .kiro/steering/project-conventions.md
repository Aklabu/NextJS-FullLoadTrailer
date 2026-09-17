---
inclusion: always
---

# FullLoadTrailer — Project Conventions

## Folder structure

- `app/` — pages, routes, layouts, Next.js routing only
- `features/` — business features (components, hooks, API services, types scoped to that feature)
- `components/` — shared/reusable UI used across multiple features (Navbar, Footer, badges, cards, pills)
- `lib/` — shared utilities and technical logic (API client, auth helpers, constants, navConfig, common types)

## Comments

Use single-line comments only. No JSDoc blocks, no decorative separators.

```ts
// This is a comment
```

## Colors

- Background: #FFFFFF
- Yellow accent (sparingly): #FFCB56
- Peach accent (sparingly): #FFA259
- Slate/teal (selective contrast): #224248
- Text: neutral-900 on white, white on dark backgrounds

## Stack

- Next.js 16.3.5, React 19, TypeScript
- Tailwind CSS v4 (configured via CSS `@theme inline` in globals.css — no tailwind.config.js)
- App Router — Server Components by default, add `'use client'` only when state/events/browser APIs are needed
