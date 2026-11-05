"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Subscribe() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function pay() {
    setError(""); setBusy(true);
    try {
      const { data: { session } } = await createClient().auth.getSession();
      if (!session) { window.location.assign("/login"); return; }
      const response = await fetch("/api/paystack/initialize", { method: "POST" });
      const result = await response.json();
      if (!response.ok || !result.authorization_url) { setError(result.error || "Unable to start payment. Please try again."); return; }
      window.location.assign(result.authorization_url);
    } catch { setError("Payment service is unavailable. Please try again shortly."); }
    finally { setBusy(false); }
  }

  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">NAIJA<span>FLIX</span></Link><Link href="/account">My account</Link></nav>
    <section className="section">
      <div className="eyebrow">CHOOSE YOUR PLAN</div><h1>Watch your way</h1>
      <div className="grid">
        <div className="card"><div className="eyebrow">FREE PLAN</div><h2>₦0</h2><p className="muted">Forever free</p>
          <ul><li>Watch all movies marked Free</li><li>Create your own account</li><li>Save your watch progress</li></ul>
          <Link className="btn secondary" href="/signup">Create free account</Link>
        </div>
        <div className="card"><div className="eyebrow">PREMIUM PLAN</div><h2>₦2,500 <span className="muted">/ month</span></h2><p className="muted">Unlock all Premium movies</p>
          <ul><li>Everything in Free</li><li>Access to Premium movies</li><li>30 days of Premium membership</li></ul>
          <button className="btn" type="button" onClick={pay} disabled={busy}>{busy ? "Please wait…" : "Upgrade with Paystack"}</button>
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
      <p className="muted">Premium membership lasts 30 days from successful payment. You can continue using Free titles after it expires.</p>
    </section>
  </main>;
}
