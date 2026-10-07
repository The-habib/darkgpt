import { NextRequest, NextResponse } from "next/server";
import { sendChatCompletion } from "@/lib/model-adapter";
import { checkRateLimit } from "@/lib/rate-limiter";
import { ChatRequestPayload } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const authHeader = req.headers.get("authorization");
    const rateLimitKey = authHeader ? `auth:${authHeader.slice(-16)}` : `ip:${ip}`;

    const limitResult = checkRateLimit(rateLimitKey, 60, 60);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before sending another prompt." },
        {
          status: 429,
          headers: {
            "Retry-After": String(limitResult.resetSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body: ChatRequestPayload = await req.json();

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required." },
        { status: 400 }
      );
    }

    const lastMessage = body.messages[body.messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== "string" || !lastMessage.content.trim()) {
      return NextResponse.json(
        { error: "Invalid request: Prompt content cannot be empty." },
        { status: 400 }
      );
    }

    // Call server-side model adapter
    const upstreamResponse = await sendChatCompletion({
      messages: body.messages,
      temperature: body.temperature ?? 0.7,
      maxTokens: body.maxTokens ?? 2048,
      stream: body.stream ?? true,
    });

    if (body.stream && upstreamResponse.body) {
      return new Response(upstreamResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[API/Chat] Handler error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "DarkGPT is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }
}
