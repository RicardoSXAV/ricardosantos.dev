# ricardosantos.dev

A portfolio website built as a **desktop OS simulation** — draggable/resizable windows, app navigator, settings, trash. Everything is client-rendered.

## Commands

- `npm run dev` — dev server with Turbopack
- `npm run build` — production build
- `npm run lint` — ESLint (Next.js + TypeScript rules)

No test suite configured.

## Stack

- Next.js 15, React 19, TypeScript 5 (strict)
- SCSS (no Tailwind) — co-located per component
- Zustand 5 — global state, persisted to localStorage
- Framer Motion 11 — all animations
- IndexedDB — background image blob storage

## Project Structure

```
src/
├── app/(main)/          # Home page + page-level components (AppNavigator, WindowManager, SettingsBar)
├── components/
│   ├── interface/       # Reusable UI primitives (Button, Select, Input, Box, PanelNavigator…)
│   └── Window/          # Window system — drag, resize (8 dirs), minimize, content slots
├── stores/              # Zustand stores (desktop, backgroundImage, locale)
├── hooks/               # Custom hooks
├── lib/                 # indexeddb.ts — background image persistence
├── theme/               # accentColors.ts — runtime accent color math (hex↔RGB, luminance)
├── styles/globals.scss  # CSS variables / design tokens
├── ts/interfaces/       # Shared TypeScript types
└── assets/              # SVG backgrounds, icons
messages/                # i18n JSON (en.json, pt.json)
```

## Conventions

**Components**
- One component per directory: `ComponentName/index.tsx` + `ComponentName/index.styles.scss`
- Sub-components go in `ComponentName/components/`, hooks in `ComponentName/hooks/`
- Default exports for components
- All imports use `@/` alias — no relative imports

**Styling**
- SCSS co-located with component, never in `globals.scss` unless it's a token
- Class names: BEM-like kebab-case → `.btn`, `.btn-primary`, `.btn-size-md`, `.btn-active`
- Use existing CSS variables: `--space-{sm|md|lg|xl|2xl}`, `--radius-{sm…2xl|full}`, `--shadow-{sm|md|lg}`, `--transition-{fast|normal}`
- Theme: `data-theme` on `<html>`, 7 accent colors, glass-morphism with backdrop-filter

**State**
- Zustand stores in `src/stores/*.store.ts`
- Persist preferences to localStorage, blobs to IndexedDB
- `useDesktopStore` — windows, theme, accent, layout preferences
- `useBackgroundImageStore` — background image (IndexedDB-backed)
- `useLocaleStore` — `en | pt`

**TypeScript**
- Strict mode on — no `any`, no `// @ts-ignore`
- Component-specific types co-located; shared types in `src/ts/interfaces/`
- Union types for variants: `type ButtonVariant = "primary" | "secondary" | "ghost"`

**React**
- Everything is `"use client"` — no server components
- Use `dynamic()` with `ssr: false` for components that touch the DOM on mount
- `forwardRef` when a component needs to expose a DOM ref
- Use `useId()` for stable unique IDs

## Non-obvious Details

- **Window system**: 8-direction resize, drag constraints to viewport, 3D perspective minimize animation — touch `useWindowBehavior.ts` carefully
- **Accent color math**: `src/theme/accentColors.ts` computes WCAG-compliant contrast colors at runtime — don't hardcode color values
- **SVG glass filter**: The fluid glass effect uses `feTurbulence` + `feDisplacementMap` — avoid duplicating it
- **i18n type safety**: Translation keys are inferred at compile time from `messages/en.json` — add new strings to both locale files
- **No server state**: All data is local (localStorage / IndexedDB) — no API calls, no database
