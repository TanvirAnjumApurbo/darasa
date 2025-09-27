# API Reference

<cite>
**Referenced Files in This Document**   
- [src/app/api/ai/questions/generate-question/route.ts](file://src/app/api/ai/questions/generate-question/route.ts)
- [src/app/api/ai/questions/generate-feedback/route.ts](file://src/app/api/ai/questions/generate-feedback/route.ts)
- [src/app/api/ai/resumes/analyze/route.ts](file://src/app/api/ai/resumes/analyze/route.ts)
- [src/app/api/webhooks/clerk/route.ts](file://src/app/api/webhooks/clerk/route.ts)
- [src/app/api/arcjet/route.ts](file://src/app/api/arcjet/route.ts)
- [src/services/ai/questions.ts](file://src/services/ai/questions.ts)
- [src/services/ai/resumes/ai.ts](file://src/services/ai/resumes/ai.ts)
- [src/services/ai/resumes/schemas.ts](file://src/services/ai/resumes/schemas.ts)
- [src/features/questions/permissions.ts](file://src/features/questions/permissions.ts)
- [src/features/resumeAnalysis/permissions.ts](file://src/features/resumeAnalysis/permissions.ts)
- [src/services/clerk/lib/getCurrentUser.ts](file://src/services/clerk/lib/getCurrentUser.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [AI Endpoints](#ai-endpoints)
   - [/api/ai/questions/generate-question](#apiaiquestionsgenerate-question-post)
   - [/api/ai/questions/generate-feedback](#apiaiquestionsgenerate-feedback-post)
   - [/api/ai/resumes/analyze](#apiairesumesanalyze-post)
3. [Webhook Endpoints](#webhook-endpoints)
   - [/api/webhooks/clerk](#apiwebhooksclerk-post)
   - [/api/arcjet](#apiarcjet-get)
4. [Authentication and Security](#authentication-and-security)
5. [Rate Limiting and Usage Policies](#rate-limiting-and-usage-policies)
6. [Client Implementation Guidelines](#client-implementation-guidelines)
7. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction

This document provides comprehensive reference documentation for the public RESTful APIs exposed by the darasa application. The API surface is divided into two main categories: AI-powered endpoints that generate interview content and analyze resumes, and webhook endpoints that handle user synchronization and security events.

All AI endpoints require authenticated access and are subject to permission-based rate limiting based on user subscription plans. Webhook endpoints are designed to receive external event notifications from third-party services such as Clerk (user management) and Arcjet (security).

The API follows RESTful principles with predictable URL patterns, standard HTTP methods, and JSON request/response payloads. All responses use appropriate HTTP status codes to indicate success or failure conditions.

## AI Endpoints

### /api/ai/questions/generate-question (POST)

Generates a technical interview question tailored to a specific job description and difficulty level using AI.

**URL Pattern**: `POST /api/ai/questions/generate-question`

**Authentication Requirements**: Bearer token via Authorization header. User must be logged in.

**Required Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Request Schema**:
```json
{
  "jobInfoId": "string",
  "prompt": "easy" | "medium" | "hard"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `jobInfoId` | string | ID of the job information record to base the question on |
| `prompt` | enum | Difficulty level for the generated question |

**Response Schema**:
- **Success (200)**: Server-sent events stream containing generated question text and question ID
- **Error (400)**: Invalid request parameters
- **Error (401)**: User not logged in
- **Error (403)**: Plan limit exceeded or insufficient permissions

**Example Request**:
```http
POST /api/ai/questions/generate-question HTTP/1.1
Content-Type: application/json
Authorization: Bearer abc123

{
  "jobInfoId": "job_123",
  "prompt": "medium"
}
```

**Example Response Stream Event**:
```json
{"questionId": "q_456"}
```

**Permissions**: Users can generate questions only if they have either unlimited question permissions or fewer than 5 total questions created under their account.

**Section sources**
- [src/app/api/ai/questions/generate-question/route.ts](file://src/app/api/ai/questions/generate-question/route.ts#L1-L89)
- [src/services/ai/questions.ts](file://src/services/ai/questions.ts#L8-L63)
- [src/features/questions/permissions.ts](file://src/features/questions/permissions.ts#L6-L16)

### /api/ai/questions/generate-feedback (POST)

Generates structured feedback for a candidate's answer to a technical interview question using AI analysis.

**URL Pattern**: `POST /api/ai/questions/generate-feedback`

**Authentication Requirements**: Bearer token via Authorization header. User must be logged in.

**Required Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Request Schema**:
```json
{
  "questionId": "string",
  "prompt": "string"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `questionId` | string | ID of the original question being answered |
| `prompt` | string | The candidate's answer transcript |

**Response Schema**:
- **Success (200)**: Text stream containing formatted feedback with rating, evaluation, and correct answer
- **Error (400)**: Invalid request parameters
- **Error (401)**: User not logged in
- **Error (403)**: Insufficient permissions (user doesn't own the question)

**Example Request**:
```http
POST /api/ai/questions/generate-feedback HTTP/1.1
Content-Type: application/json
Authorization: Bearer abc123

{
  "questionId": "q_456",
  "prompt": "I would implement this using a hash map to store..."
}
```

**Example Response Format**:
```markdown
## Feedback (Rating: 7/10)
Your approach using a hash map is correct and demonstrates good understanding of data structures. However, you didn't address edge cases like null inputs...
---
## Correct Answer
The optimal solution uses a hash map with O(n) time complexity. Here's the implementation...
```

**Permissions**: Users can only generate feedback for questions associated with jobs they own.

**Section sources**
- [src/app/api/ai/questions/generate-feedback/route.ts](file://src/app/api/ai/questions/generate-feedback/route.ts#L1-L59)
- [src/services/ai/questions.ts](file://src/services/ai/questions.ts#L65-L107)

### /api/ai/resumes/analyze (POST)

Analyzes a resume file against a job description and provides structured improvement suggestions using AI.

**URL Pattern**: `POST /api/ai/resumes/analyze`

**Authentication Requirements**: Bearer token via Authorization header. User must be logged in.

**Required Headers**:
- `Authorization: Bearer <token>`
- Form submission (no explicit Content-Type required for multipart/form-data)

**Request Schema**:
Form data with fields:
- `resumeFile`: File object (PDF, DOC, DOCX, or TXT)
- `jobInfoId`: string

**File Constraints**:
- Maximum size: 10MB
- Allowed types: PDF, Word documents (.doc, .docx), plain text (.txt)

**Response Schema**:
- **Success (200)**: Text stream containing JSON object with structured analysis
- **Error (400)**: Invalid request, missing fields, file too large, or unsupported file type
- **Error (401)**: User not logged in
- **Error (403)**: Plan limit exceeded or insufficient permissions

**Structured Response Schema**:
```json
{
  "overallScore": number,
  "ats": {
    "score": number,
    "summary": string,
    "feedback": [
      {
        "type": "strength" | "minor-improvement" | "major-improvement",
        "name": string,
        "message": string
      }
    ]
  },
  "jobMatch": { /* same structure as ats */ },
  "writingAndFormatting": { /* same structure as ats */ },
  "keywordCoverage": { /* same structure as ats */ },
  "other": { /* same structure as ats */ }
}
```

**Example Request**:
```http
POST /api/ai/resumes/analyze HTTP/1.1
Authorization: Bearer abc123
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="resumeFile"; filename="resume.pdf"
Content-Type: application/pdf

<binary file data>
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="jobInfoId"

job_123
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Permissions**: Only users with unlimited resume analysis permissions can use this endpoint.

**Section sources**
- [src/app/api/ai/resumes/analyze/route.ts](file://src/app/api/ai/resumes/analyze/route.ts#L1-L68)
- [src/services/ai/resumes/ai.ts](file://src/services/ai/resumes/ai.ts#L5-L79)
- [src/services/ai/resumes/schemas.ts](file://src/services/ai/resumes/schemas.ts#L1-L37)
- [src/features/resumeAnalysis/permissions.ts](file://src/features/resumeAnalysis/permissions.ts#L2-L4)

## Webhook Endpoints

### /api/webhooks/clerk (POST)

Receives user synchronization events from Clerk authentication service and updates the local user database accordingly.

**URL Pattern**: `POST /api/webhooks/clerk`

**Authentication Requirements**: Svix signature verification using `CLERK_WEBHOOK_SIGNING_SECRET`. No bearer token required.

**Required Headers**:
- `svix-id`: Svix message ID
- `svix-timestamp`: Svix timestamp
- `svix-signature`: Svix signature for payload verification

**Supported Event Types**:
- `user.created`: Creates or updates a user record in the local database
- `user.updated`: Updates existing user record with new information
- `user.deleted`: Removes user record from the local database

**Request Payload Schema**:
```json
{
  "type": "user.created" | "user.updated" | "user.deleted",
  "data": {
    "id": "string",
    "email_addresses": [
      {
        "id": "string",
        "email_address": "string"
      }
    ],
    "primary_email_address_id": "string",
    "first_name": "string",
    "last_name": "string",
    "image_url": "string",
    "created_at": number,
    "updated_at": number
  }
}
```

**Response Schema**:
- **Success (200)**: "Webhook received"
- **Error (400)**: Missing svix headers, invalid signature, or processing error

**Security**: The endpoint verifies the webhook signature using Svix before processing any events to prevent unauthorized access.

**Section sources**
- [src/app/api/webhooks/clerk/route.ts](file://src/app/api/webhooks/clerk/route.ts#L1-L123)

### /api/arcjet (GET)

Security endpoint protected by Arcjet that implements bot detection, attack shielding, and rate limiting.

**URL Pattern**: `GET /api/arcjet`

**Authentication Requirements**: None for testing purposes, but protected by security rules.

**Rules Applied**:
1. **Shield**: Protects against common web attacks (e.g., SQL injection)
2. **Bot Detection**: Blocks automated bots except search engines
3. **Rate Limiting**: Token bucket algorithm (5 requests per 10 seconds, burst capacity 10)

**Response Schema**:
- **Success (200)**: `{"message": "Hello world"}`
- **Error (429)**: `{"error": "Too Many Requests", "reason": {...}}` - Rate limit exceeded
- **Error (403)**: `{"error": "No bots allowed", "reason": {...}}` - Bot detected or hosting IP detected

**Allowed Bots**: Search engine crawlers (Google, Bing, etc.) are permitted. Other bot categories can be uncommented in configuration.

**Section sources**
- [src/app/api/arcjet/route.ts](file://src/app/api/arcjet/route.ts#L1-L81)

## Authentication and Security

All AI endpoints require authentication using JWT tokens provided by Clerk. The authentication flow works as follows:

1. Users authenticate through Clerk's sign-in flow
2. Clerk issues a session token
3. The token is included in the `Authorization: Bearer <token>` header for API requests
4. The backend verifies the token and retrieves the user identity using `getCurrentUser()`

The `/api/webhooks/clerk` endpoint uses Svix signature verification instead of bearer tokens, as it receives events from Clerk's system rather than end users. The signing secret (`CLERK_WEBHOOK_SIGNING_SECRET`) ensures that only legitimate Clerk events are processed.

Sensitive operations are protected by permission checks that evaluate the user's subscription plan and usage limits. These checks are implemented in feature-specific permission modules and integrated into the relevant API routes.

## Rate Limiting and Usage Policies

The API implements multiple layers of rate limiting and usage controls:

### AI Endpoint Limits
- **Question Generation**: Free tier users limited to 5 total questions; Pro tier users have unlimited access
- **Resume Analysis**: Only available to Pro tier users with unlimited resume analysis permissions
- **Plan Enforcement**: Permission