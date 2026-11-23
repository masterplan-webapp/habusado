import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const payload = body as Record<string, unknown>;
  const testimonialId =
    typeof payload.testimonialId === "string"
      ? payload.testimonialId.trim()
      : "";

  if (!testimonialId) {
    return NextResponse.json(
      { error: "Relato inválido." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseClient();
  if (supabase && UUID_REGEX.test(testimonialId)) {
    try {
      await supabase.rpc("increment_testimonial_support", {
        target_id: testimonialId,
      });
    } catch {
      // Keep optimistic support resilient even if RPC is unavailable.
    }
  }

  return NextResponse.json({ ok: true });
}
