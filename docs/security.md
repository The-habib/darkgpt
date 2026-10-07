# DarkGPT Security Specifications

DarkGPT is designed with strict boundaries to ensure user confidentiality and operational defense.

---

## 1. Zero Infrastructure Leak Policy

- No upstream hostnames, internal ports, private IP ranges, cloud hardware models, or vendor identifiers are ever transmitted to the browser.
- Stack traces from upstream timeouts or failures are caught server-side and sanitized into high-level status messages.
- The `powered-by` header is disabled via Next.js configuration.

---

## 2. Access Control & Authorization

- Firestore security rules mandate authentication: `request.auth != null`.
- Document operations strictly verify `request.auth.uid == userId`.
- Public read or write access is completely disallowed on all database paths (`match /{document=**} { allow read, write: if false; }`).

---

## 3. Rate Limiting & Abuse Protection

- An in-memory sliding window rate limiter protects `/api/chat` against denial-of-service attempts.
- Requests exceeding thresholds receive standard HTTP `429 Too Many Requests` responses with `Retry-After` headers.
