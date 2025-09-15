# Darasa Project - AI Coding Assistant Guidelines

## Architecture Overview

This is a Next.js 15 (Canary) application with React 19.1.0, using Clerk for authentication and TailwindCSS v4 for styling. The project uses Turbopack for enhanced build performance and follows Next.js App Router patterns.

## Key Technologies & Patterns

### Authentication (Clerk Integration)

- **Clerk Provider**: Custom wrapper at `src/app/services/clerk/components/ClerkProvider.tsx` wraps the original Clerk provider
- **Middleware**: Route protection implemented in `src/app/middleware.ts` with public routes defined via `createRouteMatcher`
- **Auth Components**: Use `SignInButton`, `UserButton`, and `SignIn` components from `@clerk/nextjs`
- **Route Structure**: Sign-in uses catch-all routes at `sign-in/[[...sign-in]]/page.tsx` for Clerk's routing (note: three dots for optional catch-all)

### Styling & UI

- **TailwindCSS v4**: Uses new `@tailwindcss/postcss` plugin in `postcss.config.mjs`
- **CSS Variables**: Theme system with CSS custom properties in `globals.css` using `@theme inline` directive
- **Fonts**: Geist Sans and Geist Mono from `next/font/google` with CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- **Dark Mode**: Automatic dark mode support via `prefers-color-scheme` media query

### Build & Development

- **Turbopack**: Enabled for both dev and build scripts (`--turbopack` flag)
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to `./src/*`)
- **ESLint**: Flat config format using `@eslint/eslintrc` compatibility layer

## Project Structure Conventions

```
src/app/
├── services/           # External service integrations (Clerk, etc.)
│   └── clerk/
│       └── components/ # Service-specific UI components
├── sign-in/           # Auth-related pages
│   └── [[...sign-in]]/ # Optional catch-all for Clerk routing (three dots)
└── middleware.ts      # Route protection logic
```

## Development Commands

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Production build with Turbopack
- `npm run lint`: Run ESLint with Next.js TypeScript config

## Critical Implementation Notes

1. **Middleware Configuration**: The matcher pattern excludes Next.js internals and static files but always runs for API/TRPC routes
2. **Clerk Route Protection**: Use `isPublicRoute` matcher and `auth.protect()` for protected routes
3. **Service Organization**: External integrations should be organized under `src/app/services/` with their own component directories
4. **CSS Architecture**: Leverage the new TailwindCSS v4 syntax with inline theme definitions and CSS variables
5. **Font Loading**: Use the established Geist font variables for consistency across components

## Code Examples

### Protected Route Setup

```typescript
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/",
  "/api/webhooks(.*)",
]);
await auth.protect(); // in middleware for non-public routes
```

### Service Component Pattern

```tsx
// Wrap external providers in custom components under services/
export function ClerkProvider({ children }: { children: ReactNode }) {
  return <OriginalClerkProvider>{children}</OriginalClerkProvider>;
}
```

### Auth UI Integration

```tsx
import { SignInButton, UserButton } from "@clerk/nextjs";
// Use Clerk components directly in pages/components
```

When implementing new features, follow the established patterns for service organization, authentication flow, and styling conventions.
