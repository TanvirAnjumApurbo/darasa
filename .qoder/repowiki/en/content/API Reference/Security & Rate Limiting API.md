
# Security & Rate Limiting API

<cite>
**Referenced Files in This Document **   
- [src/app/api/arcjet/route.ts](file://src/app/api/arcjet/route.ts)
- [src/middleware.ts](file://src/middleware.ts)
- [src/data/env/server.ts](file://src/data/env/server.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Protection Mechanisms](#core-protection-mechanisms)
3. [Integration Pattern](#integration-pattern)
4. [Response Handling and Status Codes](#response-handling-and-status-codes)
5. [Middleware Integration](#middleware-integration)
6. [Configuration and Environment Setup](#configuration-and-environment-setup)
7. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)

## Introduction
The `/api/arcjet` endpoint provides comprehensive security and rate limiting protection across the darasa application. It leverages Arcjet's Next.js integration to enforce rate limits, detect and block malicious bots, prevent common web attacks, and verify suspicious traffic patterns. This service acts as a critical defense layer for API routes, ensuring system stability, data integrity, and protection against abuse.

Arcjet is configured with multiple rules that work in concert to analyze incoming requests based on IP reputation, behavior patterns, and request frequency. The implementation follows a zero-trust approach, where all requests are evaluated before being allowed to proceed to business logic.

**Section sources**
- [src/app/api/arcjet/route.ts](file://src/app/api/arcjet/route.ts#L1-L81)

## Core Protection Mechanisms

### Shield Protection
The Arcjet shield rule protects the application from common web-based attacks such as SQL injection, cross-site scripting (XSS), and other OWASP Top 10 vulnerabilities. Operating in "LIVE" mode, it actively blocks malicious payloads and suspicious request patterns before they can reach the application backend.

### Bot Detection
Bot detection is implemented using Arcjet's `detectBot` rule, which identifies automated traffic and distinguishes between legitimate crawlers and potentially harmful bots. By default, only search engine bots (e.g., Google, Bing) are allowed through. Other bot categories like uptime monitors or link preview services are currently commented out but can be enabled as needed.

The system also includes advanced verification for spoofed bots using the `isSpoofedBot` function from `@arcjet/inspect`, providing additional protection against sophisticated bot networks that attempt to masquerade as legitimate traffic.

### Token Bucket Rate Limiting
Rate limiting is enforced using a token bucket algorithm with the following configuration:
- **Refill Rate**: 5 tokens every 10 seconds
- **Bucket Capacity**: 10 tokens maximum
- **Tracking Basis**: IP address by default
- **Tokens Deducted per Request**: 5 tokens

This configuration allows bursts of activity while preventing sustained high-volume requests that could indicate scraping or denial-of-service attempts.

### Hosting IP Blocking
Requests originating from known hosting provider IP ranges are automatically blocked, as these are typically associated with bot infrastructure. This check is performed via `decision.ip.isHosting()` and adds an additional layer of protection against cloud-based attack sources.

**Section sources**
- [src/app/api/arcjet/route.ts](file://src/app/api/arcjet/route.ts#L5-L34)

## Integration Pattern

### Initialization
Arcjet is initialized with the site key from environment variables (`ARCJET_KEY`). This key authenticates the application with the Arcjet service and enables access to its protection features. The initialization occurs at the module level,