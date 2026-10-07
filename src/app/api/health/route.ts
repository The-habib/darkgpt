import { NextResponse } from "next/server";
import { checkModelHealth } from "@/lib/model-adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkModelHealth();
  const statusCode = health.status === "online" ? 200 : health.status === "initializing" ? 503 : 200;

  return NextResponse.json(
    {
      status: health.status,
      message: health.message,
      timestamp: health.timestamp,
    },
    { status: statusCode }
  );
}
