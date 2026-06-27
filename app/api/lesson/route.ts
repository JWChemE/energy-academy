import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { getLessonContext, getLessonSource } from "@/lib/content";

/**
 * Authenticated lesson content endpoint.
 *
 * Level 1 lessons render statically in the page itself (public). Level 2 & 3
 * lesson bodies are NOT baked into the HTML — they're served from here only to
 * a request carrying a valid Supabase access token, so the text never reaches a
 * signed-out browser. This is the "hard gate".
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const course = searchParams.get("course");
  const lesson = searchParams.get("lesson");
  if (!course || !lesson) {
    return NextResponse.json({ error: "Missing course or lesson" }, { status: 400 });
  }

  const ctx = getLessonContext(course, lesson);
  if (!ctx) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Level 1 is free; only Levels 2 & 3 are gated. (The page serves L1 directly,
  // but guard here too so this endpoint can't be used to bypass anything.)
  const gated = ctx.level.number > 1;

  if (gated) {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return NextResponse.json({ error: "Sign in to read this lesson" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return NextResponse.json({ error: "Your session has expired — sign in again" }, { status: 401 });
    }
  }

  const source = await getLessonSource(course, lesson);
  const mdxSource = await serialize(source, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  });

  return NextResponse.json({ mdxSource });
}
