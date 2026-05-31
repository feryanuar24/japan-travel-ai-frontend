# Design Spec

## Purpose

A concise guide for visual consistency, accessibility, and rapid development. Focus: clean, usable, and scalable interfaces for a user travel portal and a separate admin console.

## Key Principles

- Minimal & content-focused
- Component and spacing consistency
- Accessibility (keyboard, contrast, focus)
- Performance: optimize assets and images
- Responsive: mobile-first
- Separate user portal and admin console concerns early, even if they share tokens and primitives. Use route groups such as `app/(portal)/workspace` and `app/(admin)` to keep surfaces obvious.

## Color Palette (Tailwind)

- `primary`: amber-500 / hover amber-600
- `success`: emerald-500
- `warning`: amber-400
- `danger`: red-500
- `bg`: gray-50 (dark: gray-900)
- `surface`: white (dark: gray-800)
- `border`: gray-200 (dark: gray-700)
- `text`: gray-900 / secondary gray-600 (dark variants)

Use theme variables/tokens in `tailwind.config` for dark mode.

## Typography

- Family: `Inter, sans-serif`
- Scale: H1 2xl, H2 xl, H3 lg, Body base
- Line-height and max-width for readability (max 70–80 characters)

## Spacing & Grid

- Base spacing: `4` (1rem) as the unit; use scale 2, 4, 8, 16
- Container: center, `max-width: 1200px`
- Layout: grid/flex, mobile-first breakpoints (sm, md, lg, xl)

## Core Components

- Buttons: primary / secondary / danger / ghost / disabled. Rounded `md`, padding ~`py-2 px-4`. Shadow only on hover.
- Inputs: label above, helper/error text below, `rounded-md`, visible focus ring.
- Cards: surface, subtle border, `rounded-lg`, consistent padding.
- Modals: centered, `rounded-lg`, focus trap, close on Esc.
- Tables: use semantic `<table>` for data; alternative grid/div for custom layouts. Row hover, compact spacing for dense views.

Status & Variants: provide disabled, loading, success, error states for each component.

## Motion

- Subtle, purposeful. Default duration `200ms`, easing `ease-in-out`.
- Prefer transform & opacity over layout-shifting animations.

## Accessibility

- WCAG AA contrast
- Keyboard operable & focus-visible indicators
- ARIA labels for interactive controls
- Semantic HTML and readable DOM order

## Assets & Icons

- Icons: Heroicons (outline) or FontAwesome consistently
- Images: responsive, optimized (WebP/AVIF), lazy-load

## Code Structure & Rules

- Reuse: `lib/` for shared utils/components, `components/` per feature/module
- Organize by surface: `components/portal/` for user workflows, `components/admin/` for admin operations, `components/auth/` for sign-in and recovery flows
- Tests: add unit/visual tests (Vitest) for critical components
- Keep simple: avoid unnecessary folders/files

## Product Surfaces

- User portal: itinerary builder, budget estimator, smart place recommendations, transport planning, and AI chat
- Admin console: manage system settings, content moderation, access control, and operational oversight
- Shared authentication: login, register, forgot password, reset password

## Do / Don't (Quick)

- Do: be consistent, document tokens, add tests for new pages
- Don't: glassmorphism, neumorphism, purple-gradient hero, animated blobs, excessive shadows, rounded 3xl everywhere

## Quick Review Checklist

- Text contrast meets WCAG AA
- Components have states (loading/error/disabled)
- Responsive across main breakpoints
- Dark mode tested
- Assets optimized
