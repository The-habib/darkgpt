# DarkGPT Model Adapter Layer

The Model Adapter (`src/lib/model-adapter.ts`) isolates the user interface and database from the underlying machine intelligence runtime.

---

## 1. Abstraction Contract

The adapter defines three core primitives:

```typescript
// Core Request Contract
interface ChatRequestPayload {
  conversationId?: string;
  messages: Array<{ role: MessageRole; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// Health Probe Contract
interface ModelHealth {
  status: "online" | "initializing" | "degraded" | "offline";
  message: string;
  timestamp: number;
  latencyMs?: number;
}
```

---

## 2. Decoupled Provider Integration

The adapter communicates via an abstracted standard interface. To replace or add a new reasoning provider:

1. Update `MODEL_API_URL` and `MODEL_API_KEY` in environment variables.
2. The adapter normalizes incoming prompts into the standard chat completion format.
3. Upstream stream chunks are parsed and forwarded to the client as standard Server-Sent Events (SSE).
4. Public errors are filtered to generic messages ("DarkGPT is temporarily unavailable") to prevent leaking upstream infrastructure details.

---

## 3. Resilience & Circuit Breaking

The adapter wraps upstream requests with:
- Configurable timeout limits (`MODEL_REQUEST_TIMEOUT_MS`)
- AbortController signal propagation for user cancellation
- Public status abstraction that prevents internal network stack traces from reaching client browsers
