import { ChatRequestPayload, ModelHealth, ModelOption } from "./types";

const UPSTREAM_URL = process.env.MODEL_API_URL || "http://localhost:8000/v1";
const UPSTREAM_KEY = process.env.MODEL_API_KEY || "";
const TIMEOUT_MS = parseInt(process.env.MODEL_REQUEST_TIMEOUT_MS || "60000", 10);

export const SUPPORTED_MODELS: ModelOption[] = [
  {
    id: "darkgpt-core",
    name: "DarkGPT Direct",
    description: "High-parameter unrestricted core reasoning engine with direct model access.",
    contextWindow: 131072,
    maxOutputTokens: 4096,
    isDefault: true,
  },
  {
    id: "darkgpt-coder",
    name: "DarkGPT Code & Logic",
    description: "Specialized for multi-language software architecture, debugging, and systems.",
    contextWindow: 131072,
    maxOutputTokens: 4096,
  },
];

export async function checkModelHealth(): Promise<ModelHealth> {
  const startTime = Date.now();
  try {
    const healthUrl = UPSTREAM_URL.replace(/\/v1\/?$/, "/health");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(healthUrl, {
      signal: controller.signal,
      headers: UPSTREAM_KEY ? { Authorization: `Bearer ${UPSTREAM_KEY}` } : {},
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const isHealthy = data.status === "healthy" || res.status === 200;
      return {
        status: isHealthy ? "online" : "initializing",
        message: isHealthy ? "DarkGPT Engine is ready." : "DarkGPT is initializing compute memory.",
        timestamp: Date.now(),
        latencyMs,
      };
    }

    return {
      status: "degraded",
      message: "DarkGPT is operating with degraded latency.",
      timestamp: Date.now(),
      latencyMs,
    };
  } catch (err) {
    return {
      status: "offline",
      message: "DarkGPT compute node is currently offline.",
      timestamp: Date.now(),
      latencyMs: Date.now() - startTime,
    };
  }
}

export async function sendChatCompletion(payload: ChatRequestPayload): Promise<Response> {
  const endpoint = `${UPSTREAM_URL.replace(/\/+$/, "")}/chat/completions`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Normalize request for upstream OpenAI-compatible contract
  const requestBody = {
    model: "gemma-3-27b-it-abliterated",
    messages: payload.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    temperature: payload.temperature ?? 0.7,
    max_tokens: payload.maxTokens ?? 2048,
    stream: payload.stream ?? true,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: payload.stream ? "text/event-stream" : "application/json",
    };
    if (UPSTREAM_KEY) {
      headers["Authorization"] = `Bearer ${UPSTREAM_KEY}`;
    }

    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text().catch(() => "Upstream error");
      console.error("[ModelAdapter] Upstream returned non-200:", upstreamResponse.status, errorText.slice(0, 100));
      throw new Error(`Upstream status: ${upstreamResponse.status}`);
    }

    return upstreamResponse;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[ModelAdapter] Request failed:", errorMessage);
    throw new Error("DarkGPT is temporarily unavailable. Please try again shortly.");
  }
}
