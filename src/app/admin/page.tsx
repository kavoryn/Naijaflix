import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Admin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const [{ count: movieCount }, { count: freeCount }, { count: premiumCount }, { count: memberCount }, { count: activeSubscriptions }, { data: recentMovies }] = await Promise.all([
    supabase.from("movies").select("*", { count: "exact", head: true }),
    supabase.from("movies").select("*", { count: "exact", head: true }).eq("plan", "free"),
    supabase.from("movies").select("*", { count: "exact", head: true }).eq("plan", "premium"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active").gt("ends_at", new Date().toISOString()),
    supabase.from("movies").select("id,title,plan,published,created_at").order("created_at", { ascending: false }).limit(6),
  ]);

  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">NAIJA<span>FLIX</span> ADMIN</Link><div className="row"><Link href="/">View streaming site</Link><Link href="/admin/movies" className="btn">Manage movies</Link></div></nav>
    <section className="section">
      <div className="eyebrow">CONTROL CENTER</div><h1>NaijaFlix Dashboard</h1>
      <p className="muted">Manage your streaming catalogue, Free and Premium content, and members.</p>
      <div className="grid" style={{ marginTop: 24 }}>
        <div className="card"><span className="muted">Total movies</span><h2>{movieCount ?? 0}</h2><small>{freeCount ?? 0} Free · {premiumCount ?? 0} Premium</small></div>
        <div className="card"><span className="muted">Registered members</span><h2>{memberCount ?? 0}</h2><small>All member accounts</small></div>
        <div className="card"><span className="muted">Active Premium</span><h2>{activeSubscriptions ?? 0}</h2><small>Currently paid and valid</small></div>
      </div>
    </section>
    <section className="section">
      <h2>Quick actions</h2>
      <div className="grid">
        <Link className="card" href="/admin/movies"><h3>🎬 Manage movies</h3><p className="muted">Add movies, upload poster/video links, set Free or Premium, publish or unpublish.</p><b>Open catalogue →</b></Link>
        <Link className="card" href="/"><h3>▶ Watch site preview</h3><p className="muted">Check the homepage, movie rows, search, watchlist and video player.</p><b>Open website →</b></Link>
        <Link className="card" href="/subscribe"><h3>♛ Membership plans</h3><p className="muted">Review what Free and Premium members see.</p><b>View plans →</b></Link>
      </div>
    </section>
    <section className="section">
      <div className="row" style={{justifyContent:"space-between"}}><h2>Recently added movies</h2><Link href="/admin/movies">Manage all →</Link></div>
      <div className="card">
        {recentMovies?.length ? recentMovies.map(movie => <div key={movie.id} className="row" style={{justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #292c36"}}>
          <span>{movie.title}</span><span className="muted">{movie.plan === "premium" ? "Premium" : "Free"} · {movie.published ? "Published" : "Draft"}</span>
        </div>) : <p className="muted">No movies have been added yet.</p>}
      </div>
    </section>
  </main>;
}
