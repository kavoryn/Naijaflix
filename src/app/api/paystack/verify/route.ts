import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const reference = new URL(req.url).searchParams.get("reference");
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!reference || !secret) {
    return NextResponse.json({ error: "Missing payment reference or payment configuration" }, { status: 400 });
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference),
      { headers: { Authorization: "Bearer " + secret }, cache: "no-store" },
    );
    const result = await response.json();
    const transaction = result?.data;

    if (
      !response.ok ||
      result?.status !== true ||
      transaction?.status !== "success" ||
      transaction?.reference !== reference ||
      transaction?.amount !== 250000 ||
      transaction?.currency !== "NGN" ||
      transaction?.customer?.email?.toLowerCase() !== user.email?.toLowerCase() ||
      transaction?.metadata?.user_id !== user.id ||
      transaction?.metadata?.plan !== "monthly"
    ) {
      return NextResponse.json({ error: "Payment could not be verified for this account" }, { status: 400 });
    }

    const startsAt = new Date(transaction.paid_at || Date.now());
    const endsAt = new Date(startsAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const { error } = await supabase.from("subscriptions").upsert({
      user_id: user.id,
      plan_name: "monthly",
      status: "active",
      amount_kobo: 250000,
      currency: "NGN",
      provider: "paystack",
      provider_reference: reference,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    }, { onConflict: "provider_reference" });

    if (error) {
      return NextResponse.json({ error: "Payment verified, but membership update failed. Contact support with your payment reference." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Payment verification service is temporarily unavailable" }, { status: 502 });
  }
}
