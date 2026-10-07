# DarkGPT Architecture

This document describes the high-level architecture of DarkGPT, detailing component boundaries, data flow, and isolation principles.

---

## 1. System Topology

DarkGPT is built on a four-tier architecture designed for separation of concerns and maximum security:

```
[ Tier 1: Client ]
Next.js App Router (React 19, Tailwind CSS)
- Streaming Markdown & Syntax Renderer
- Local Resilience Cache (LocalStorage / IndexedDB)

        ↕ HTTPS / SSE

[ Tier 2: Application API ]
Next.js Server Runtime
- Route Handlers (/api/chat, /api/health, /api/models)
- Request Validation & Rate Limiter (Sliding Window)
- Header Sanitization & Error Abstraction

        ↕ Server-to-Server

[ Tier 3: Identity & Persistence ]
Firebase Services
- Firebase Authentication (Email/Password, Anonymous Guest)
- Cloud Firestore (Users, Conversations, Messages)
- Strict Security Rules Scoped to request.auth.uid

        ↕ Private Internal VPC

[ Tier 4: Model Adapter & Compute ]
Decoupled Model Adapter Layer
- Upstream OpenAI-compatible or Custom Protocols
- SSE Stream Unwrapping & Buffer Normalization
- Server-Side Timeout & Circuit Breaking
```

---

## 2. Security Boundaries

1. **Client Isolation**: The browser client is never permitted to connect directly to the upstream model backend. All prompts pass through `/api/chat`, ensuring upstream credentials, endpoints, and topology are never leaked.
2. **Deterministic Ownership**: Firestore security rules enforce document-level ownership. A user authenticated as `UID_A` cannot query or write to `users/UID_B/conversations`.
3. **Fail-Safe Persistence**: Every message sent is optimistically replicated to the client's local cache before reaching remote storage, guaranteeing zero dropped thoughts.
