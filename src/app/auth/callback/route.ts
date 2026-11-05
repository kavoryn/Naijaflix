import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=confirmation", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=confirmation", url.origin));
  }

  return NextResponse.redirect(new URL(destination, url.origin));
}
