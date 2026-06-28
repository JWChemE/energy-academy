import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Self-service account deletion (GDPR right to erasure).
 *
 * A signed-in user POSTs here with their access token. We verify it, then use
 * the Supabase service-role key to delete their auth user — which cascades
 * through the foreign keys (public.users → progress, quiz_results, bookmarks,
 * consent_events), removing all their personal data.
 *
 * Requires the env var SUPABASE_SERVICE_ROLE_KEY (server-only — never exposed
 * to the browser, never prefixed NEXT_PUBLIC).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!serviceKey) {
    return NextResponse.json(
      { error: "Account deletion is not configured (missing service role key)." },
      { status: 500 }
    );
  }

  // Verify who is asking, from their own token.
  const asUser = createClient(url, anonKey);
  const { data, error } = await asUser.auth.getUser(token);
  if (error || !data?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Delete with admin privileges — cascades to all their data.
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { error: delError } = await admin.auth.admin.deleteUser(data.user.id);
  if (delError) {
    return NextResponse.json({ error: "Could not delete account" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
