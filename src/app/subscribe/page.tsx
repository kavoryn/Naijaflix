"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Subscribe() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function pay() {
    setError("");
    setBusy(true);
    try {
      const { data: { session } } = await createClient().auth.getSession();
      if (!session) {
        window.location.assign("/login");
        return;
      }

      const response = await fetch("/api/paystack/initialize", { method: "POST" });
      const result = await response.json();
      if (!response.ok || !result.authorization_url) {
        setError(result.error || "Unable to start payment. Please try again.");
        return;
      }
      window.location.assign(result.authorization_url);
    } catch {
      setError("Payment service is unavailable. Please try again shortly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">NAIJA<span>FLIX</span></Link>
      </nav>
      <section className="form card">
        <div className="eyebrow">Premium</div>
        <h1>₦2,500 / month</h1>
        <p className="muted">Unlimited access to the NaijaFlix catalogue.</p>
        <button className="btn" type="button" onClick={pay} disabled={busy}>
          {busy ? "Please wait…" : "Pay with Paystack"}
        </button>
        {error && <p role="alert">{error}</p>}
      </section>
    </main>
  );
}
