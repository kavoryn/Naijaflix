"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const params = useSearchParams();
  const [message, setMessage] = useState("Verifying payment…");

  useEffect(() => {
    const reference = params.get("reference");
    if (!reference) {
      setMessage("Payment reference missing.");
      return;
    }

    fetch("/api/paystack/verify?reference=" + encodeURIComponent(reference))
      .then((response) => response.json())
      .then((result) =>
        setMessage(
          result.ok
            ? "Payment successful. Premium is active."
            : result.error || "Could not verify payment.",
        ),
      )
      .catch(() => setMessage("Could not verify payment."));
  }, [params]);

  return (
    <main className="shell">
      <section className="form card">
        <h1>Payment status</h1>
        <p>{message}</p>
        <Link className="btn" href="/account">
          My account
        </Link>
      </section>
    </main>
  );
}

export default function Verify() {
  return (
    <Suspense fallback={<main className="shell"><section className="form card"><p>Loading payment status…</p></section></main>}>
      <VerifyContent />
    </Suspense>
  );
}
