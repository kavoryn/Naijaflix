import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Account() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: p }, { data: subs }, { data: progress }] = await Promise.all([
    s.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    s.from("subscriptions").select("*").eq("user_id", user.id).eq("status", "active").gt("ends_at", new Date().toISOString()).order("ends_at", { ascending: false }).limit(1),
    s.from("watch_progress").select("*,movies(title,poster_url)").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(8),
  ]);
  const premium = !!subs?.length;
  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">NAIJA<span>FLIX</span></Link><form action="/auth/signout" method="post"><button className="btn secondary">Sign out</button></form></nav>
    <section className="section">
      <h1>Welcome, {p?.full_name || user.email}</h1>
      <div className="card"><div className="eyebrow">YOUR MEMBERSHIP</div><h2>{premium ? "Premium" : "Free"}</h2>
        <p className="muted">{premium ? "You have access to all Free and Premium movies." : "You can watch all titles marked Free. Upgrade to unlock Premium movies."}</p>
        {premium ? <p className="muted">Premium valid until {new Date(subs![0].ends_at).toLocaleDateString()}</p> : <Link className="btn" href="/subscribe">Upgrade to Premium · ₦2,500/month</Link>}
      </div>
      <h2>Continue watching</h2>
      {progress?.length ? progress.map((x: any) => <p key={x.id}><Link href={"/watch/" + x.movie_id}>{x.movies?.title || "Continue movie"} · {Math.floor(x.progress_seconds / 60)} min watched</Link></p>) : <p className="muted">Your watch history will appear here.</p>}
    </section>
  </main>;
}