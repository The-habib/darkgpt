export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  pinned?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: number;
  tier: "free" | "pro" | "developer";
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  maxOutputTokens: number;
  isDefault?: boolean;
}

export interface ModelHealth {
  status: "online" | "initializing" | "degraded" | "offline";
  message: string;
  timestamp: number;
  latencyMs?: number;
}

export interface ChatStreamChunk {
  id: string;
  text: string;
  finishReason?: string | null;
}

export interface ChatRequestPayload {
  conversationId?: string;
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}
