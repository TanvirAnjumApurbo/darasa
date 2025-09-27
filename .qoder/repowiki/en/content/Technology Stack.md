# Technology Stack

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)
- [tailwind.config.ts](file://tailwind.config.ts)
- [db.ts](file://src/drizzle/db.ts)
- [getCurrentUser.ts](file://src/services/clerk/lib/getCurrentUser.ts)
- [api.ts](file://src/services/hume/lib/api.ts)
- [google.ts](file://src/services/ai/models/google.ts)
- [schemas.ts](file://src/features/jobInfos/schemas.ts)
- [form.tsx](file://src/components/ui/form.tsx)
</cite>

## Table of Contents
1. [Next.js 15 (Canary) with App Router and React Server Components](#nextjs-15-canary-with-app-router-and-react-server-components)
2. [Drizzle ORM for Type-Safe Database Access](#drizzle-orm-for-type-safe-database-access)
3. [Clerk for Authentication and User Management](#clerk-for-authentication-and-user-management)
4. [Hume AI for Voice Interviews](#hume-ai-for-voice-interviews)
5. [AI SDKs from Google and OpenAI for Generative Features](#ai-sdks-from-google-and-openai-for-generative-features)
6. [Tailwind CSS with PostCSS and Typography Plugin](#tailwind-css-with-postcss-and-typography-plugin)
7. [Zod for Schema Validation](#zod-for-schema-validation)
8. [React Hook Form for Form State Management](#react-hook-form-for-form-state-management)
9. [Integration Patterns: SSR, SSG, Edge Runtime, and Streaming](#integration-patterns-ssr-ssg-edge-runtime-and-streaming)
10. [Version Compatibility and Rationale](#version-compatibility-and-rationale)
11. [Custom Configurations in next.config.ts and tailwind.config.ts](#custom-configurations-in-nextconfigts-and-tailwindconfigts)

## Next.js 15 (Canary) with App Router and React Server Components

The darasa application leverages **Next.js 15 (canary)** as its foundational framework, utilizing the modern **App Router** architecture and **React Server Components (RSC)** to enable server-side rendering (SSR), static site generation (SSG), and efficient data fetching patterns. This version provides experimental support for advanced caching mechanisms via `useCache`, which is enabled in the project's configuration to optimize performance across repeated invocations.

The App Router enables file-based routing under `/src/app`, supporting both client and server components seamlessly. Key features such as layout nesting, parallel routes, and streaming server-rendered content are fully utilized, particularly in dynamic pages like job interviews and resume analysis workflows.

**Section sources**
- [next.config.ts](file://next.config.ts#L1-L10)
- [package.json](file://package.json#L30-L31)

## Drizzle ORM for Type-Safe Database Access

**Drizzle ORM** is used as the primary database interaction layer, providing full TypeScript integration and type safety across all queries. It operates over **Neon Serverless Driver** (`@neondatabase/serverless`) to connect to a PostgreSQL backend, enabling efficient edge-compatible database access.

The schema is defined in `/src/drizzle/schema` and includes tables for users, job information, interviews, and questions. The central database instance is initialized in `db.ts` using Neon’s connection caching (`neonConfig.fetchConnectionCache = true`) to improve performance in serverless environments by reusing connections between function invocations.

Migration management is handled through Drizzle Kit, with SQL migration files stored in `/migrations`. Developers can generate, push, and manage schema changes using scripts defined in `package.json`.

**Section sources**
- [db.ts](file://src/drizzle/db.ts#L1-L11)
- [package.json](file://package.json#L20-L21)

## Clerk for Authentication and User Management

**Clerk** serves as the complete authentication solution, handling user sign-in, session management, and role-based permissions. Integrated via `@clerk/nextjs`, it supports server-side authentication checks using the `auth()` function, which securely retrieves the authenticated user ID or redirects unauthenticated requests.

User data is synchronized with the application’s internal database through `getCurrentUser.ts`, where Clerk’s user ID is used to fetch extended profile details from the local `UserTable`. This hybrid approach allows secure identity management while maintaining custom user attributes and subscription plans within the app.

Caching is applied to user lookups using Next.js’ `"use cache"` directive and explicit cache tagging via `cacheTag(getUserIdTag(id))`, ensuring optimal performance without stale data.

**Section sources**
- [getCurrentUser.ts](file://src/services/clerk/lib/getCurrentUser.ts#L1-L25)
- [package.json](file://package.json#L15-L16)

## Hume AI for Voice Interviews

**Hume AI** powers real-time voice interview capabilities through its Empathic Voice API, enabling emotional tone analysis and conversational intelligence during simulated job interviews. The service is accessed via the official `hume` SDK, with API interactions abstracted into `fetchChatMessages` in `api.ts`.

This function retrieves chat event streams from Hume’s backend using pagination, processes them asynchronously, and returns structured conversation logs for display and feedback generation. Integration occurs on-demand within interview-specific routes, leveraging server components to securely handle sensitive API keys from environment variables.

Voice sessions are initiated client-side using `@humeai/voice-react`, allowing seamless audio input/output handling directly in the browser.

**Section sources**
- [api.ts](file://src/services/hume/lib/api.ts#L1-L20)
- [package.json](file://package.json#L25-L26)

## AI SDKs from Google and OpenAI for Generative Features

Generative AI functionality is powered by **AI SDKs** from **Google** and **OpenAI**, accessed through the unified `ai` framework (`ai` package). These models drive key features such as question generation, resume analysis, and personalized feedback.

The Google integration uses `@ai-sdk/google` and `createGoogleGenerativeAI` to interface with Gemini models. Configuration is centralized in `google.ts`, where the API key is securely injected from environment variables (`env.GEMINI_API_KEY`). Similarly, OpenAI models are accessible via `@ai-sdk/openai`.

These SDKs support streaming responses directly from AI models to the frontend using React Server Components, enabling real-time text generation with low latency. Streaming is implemented in API routes such as `/api/ai/questions/generate-question/route.ts` and `/api/ai/resumes/analyze/route.ts`.

**Section sources**
- [google.ts](file://src/services/ai/models/google.ts#L1-L6)
- [package.json](file://package.json#L10-L14)

## Tailwind CSS with PostCSS and Typography Plugin

Styling is managed using **Tailwind CSS v4 (canary)**, integrated with **PostCSS** and enhanced with the **Typography plugin** (`@tailwindcss/typography`). The design system emphasizes utility-first principles, responsive layouts, and dark mode support via `next-themes`.

In `tailwind.config.ts`, content paths are configured to scan all `.tsx`, `.ts`, and `.mdx` files under `/src` and `/app`. The Typography plugin is scoped specifically to elements with the class `.markdown` to ensure rich text formatting only applies where needed, preventing global style pollution.

Animation utilities are further extended using `tw-animate-css`, enabling expressive UI transitions consistent with the application’s futuristic aesthetic.

**Section sources**
- [tailwind.config.ts](file://tailwind.config.ts#L1-L12)
- [package.json](file://package.json#L45-L47)

## Zod for Schema Validation

**Zod** is employed throughout the codebase for runtime-safe schema validation, particularly in form handling and API input validation. Defined schemas ensure data integrity before processing or persistence.

For example, `jobInfoSchema` in `schemas.ts` validates required fields such as job title, experience level, and description, using enums mapped directly from the database schema. These Zod schemas are tightly integrated with React Hook Form via `@hookform/resolvers`, enabling seamless error propagation and type inference across the stack.

This combination ensures that both client and server inputs are validated against a single source of truth, reducing bugs and improving developer experience.

**Section sources**
- [schemas.ts](file://src/features/jobInfos/schemas.ts#L1-L9)
- [package.json](file://package.json#L44-L45)

## React Hook Form for Form State Management

Form state is managed using **React Hook Form**, providing high-performance, uncontrolled component handling with minimal re-renders. It is combined with Zod through resolver middleware to deliver robust validation logic.

UI components such as `FormField`, `FormItem`, and `FormLabel` are abstracted in `form.tsx` to standardize presentation and accessibility attributes across the application. These wrappers integrate with Radix UI primitives and apply conditional styling based on validation errors retrieved via `useFormField()`.

This modular approach enables consistent, accessible forms across features like job creation, onboarding, and question editing, while maintaining excellent performance even with complex nested inputs.

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L168)
- [package.json](file://package.json#L22-L23)

## Integration Patterns: SSR, SSG, Edge Runtime, and Streaming

The technology stack is designed around modern full-stack patterns:
- **Server-Side Rendering (SSR)** is used extensively via React Server Components to render personalized content (e.g., user dashboards, interview results) with immediate data hydration.
- **Static Site Generation (SSG)** is applied selectively for public-facing pages where possible, though most content is dynamic and user-specific.
- **Edge Runtime** compatibility is ensured through lightweight dependencies and use of serverless-friendly drivers like Neon, enabling fast cold starts and global deployment.
- **Streaming Responses** from AI models are implemented using the `ai` SDK’s streamable functions, allowing partial content delivery during long-running generative tasks (e.g., feedback generation).

API routes under `/src/app/api` leverage these patterns to serve JSON, SSE, or direct React streams depending on the use case.

## Version Compatibility and Rationale

All major dependencies are aligned with **Next.js 15 canary** requirements:
- React 19 ensures compatibility with upcoming RSC improvements and concurrent features.
- Drizzle ORM and Neon driver support edge environments and type safety.
- Clerk and Hume SDKs are pinned to versions known to work with Next.js App Router and server actions.
- Tailwind v4 (canary) aligns with PostCSS v8+ and offers improved tree-shaking and plugin scoping.

The use of canary releases reflects a forward-looking strategy focused on early adoption of performance enhancements and new React features, balanced with careful testing and abstraction layers to mitigate instability risks.

**Section sources**
- [package.json](file://package.json#L28-L44)

## Custom Configurations in next.config.ts and tailwind.config.ts

Two core configuration files define critical behavior:

### next.config.ts
Enables experimental `useCache` to allow fine-grained caching control in server components. This improves response times for frequently accessed data like user profiles and cached AI outputs.

```typescript
const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
};
```

### tailwind.config.ts
Scopes typography styles exclusively to `.markdown` classes to prevent unintended formatting leakage. Uses PostCSS to process styles and integrates the Typography plugin with custom options.

```typescript
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}", "./app/**/*.{ts,tsx,mdx}"],
  plugins: [typography({ className: "markdown" })],
};
```

These configurations ensure maintainable, performant, and scoped styling and caching strategies across the application.

**Section sources**
- [next.config.ts](file://next.config.ts#L1-L10)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L12)