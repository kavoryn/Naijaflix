"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else if (data.session) {
        window.location.assign("/account");
      } else {
        setMessage("Account created. Check your email inbox (and spam folder) to confirm your address, then sign in.");
      }
    } catch {
      setMessage("We could not connect to the registration service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">NAIJA<span>FLIX</span></Link>
        <Link href="/login">Sign in</Link>
      </nav>
      <form className="form card" onSubmit={submit}>
        <div className="eyebrow">Join the story</div>
        <h1>Create account</h1>
        <label htmlFor="signup-name">Full name</label>
        <input id="signup-name" className="field" autoComplete="name" required value={name} onChange={e => setName(e.target.value)} />
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" className="field" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" className="field" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn" type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
        {message && <p className="muted" role="status" aria-live="polite">{message}</p>}
      </form>
    </main>
  );
}
