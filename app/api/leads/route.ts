import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rateLimit";

/**
 * Lead-magnet email capture. Records a newsletter subscription (with the
 * exact consent wording, for the audit trail) in public.leads. The table is
 * insert-only for the anon key — nothing can be read back through this route
 * or the client.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "leads", 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string; source?: string; consentText?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const source = (body.source ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  if (!source || source.length > 100) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from("leads").insert({
    email,
    source,
    consented: true,
    consent_text: (body.consentText ?? "").slice(0, 500) || null,
  });

  // A duplicate email means they're already subscribed — that's a success
  // from the visitor's point of view, so don't leak that the address exists.
  if (error && error.code !== "23505") {
    console.error("Lead insert failed:", error.message);
    return NextResponse.json(
      { error: "Something went wrong — please try again" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
