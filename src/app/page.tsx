import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Movie } from "@/lib/types";

export default async function Home() {
  let movies: (Movie & { plan?: string })[] = [];
  let featured: (Movie & { plan?: string }) | null = null;
  let user = null;
  try {
    const s = await createClient();
    const [{ data }, { data: hero }, { data: u }] = await Promise.all([
      s.from("movies").select("*").eq("published", true).order("created_at", { ascending: false }),
      s.from("movies").select("*").eq("published", true).eq("featured", true).limit(1).maybeSingle(),
      s.auth.getUser(),
    ]);
    movies = (data || []) as (Movie & { plan?: string })[];
    featured = hero as (Movie & { plan?: string }) | null;
    user = u.user;
  } catch {}
  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">NAIJA<span>FLIX</span></Link>
        <div className="row">
          <Link href="/#catalogue">Explore</Link>
          {user ? <Link className="btn secondary" href="/account">My account</Link> : <><Link className="btn secondary" href="/login">Sign in</Link><Link href="/signup">Register</Link></>}
          <Link className="btn" href="/subscribe">Get Premium</Link>
        </div>
      </nav>
      <section className="hero">
        <div>
          <div className="eyebrow">The home of African stories</div>
          <h1>{featured?.title || "Stories that feel like home."}</h1>
          <p className="muted" style={{ maxWidth: 520 }}>{featured?.synopsis || "Discover Nollywood hits, African originals and unforgettable stories — all in one place."}</p>
          <div className="row" style={{ marginTop: 24 }}>
            {featured ? <Link className="btn" href={"/watch/" + featured.id}>▶ Watch now</Link> : <Link className="btn" href="/signup">Start watching free</Link>}
            <Link className="btn secondary" href="/#catalogue">Browse movies</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="row" style={{ justifyContent: "space-between" }}><h2>Choose your experience</h2></div>
        <div className="grid">
          <div className="card"><h3>Free</h3><p className="muted">Watch movies marked Free at no cost. Create an account to keep your watch history.</p><Link className="btn secondary" href="/signup">Join free</Link></div>
          <div className="card"><h3>Premium</h3><p className="muted">Unlock every Premium title for ₦2,500 per month.</p><Link className="btn" href="/subscribe">Get Premium</Link></div>
        </div>
      </section>
      <section id="catalogue" className="section">
        <div className="row" style={{ justifyContent: "space-between" }}><h2>Now showing</h2><span className="muted">{movies.length} titles</span></div>
        {movies.length ? <div className="grid">{movies.map(m => <Link href={"/watch/" + m.id} key={m.id}>
          <div className="poster">{m.poster_url ? <img src={m.poster_url} alt={m.title} /> : null}</div>
          <div className="row" style={{ justifyContent: "space-between" }}><span className="poster-title">{m.title}</span><span className="eyebrow">{m.plan === "premium" ? "PREMIUM" : "FREE"}</span></div>
          <div className="muted">{m.genre || "African cinema"} {m.release_year ? "· " + m.release_year : ""}</div>
        </Link>)}</div> : <div className="card"><h3>Our catalogue is getting ready</h3><p className="muted">New movies will appear here as soon as the admin publishes them.</p></div>}
      </section>
      <footer className="footer">© {new Date().getFullYear()} NaijaFlix · Made for African stories.</footer>
    </main>
  );
}