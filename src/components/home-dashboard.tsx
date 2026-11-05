"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type DashboardMovie = {
  id: string; title: string; synopsis: string | null; genre: string | null;
  release_year: number | null; duration_minutes: number | null; poster_url: string | null;
  video_url?: string | null; featured: boolean; plan: "free" | "premium";
};
export type ContinueItem = { movie_id: string; progress_seconds: number; movie: DashboardMovie | null };

export default function HomeDashboard({ movies, featured, user, role, progress, watchlistIds, premium }: {
  movies: DashboardMovie[]; featured: DashboardMovie | null; user: { id: string; email?: string } | null;
  role: string | null; progress: ContinueItem[]; watchlistIds: string[]; premium: boolean;
}) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [saved, setSaved] = useState(watchlistIds);
  const [busyId, setBusyId] = useState("");
  const genres = useMemo(() => ["All", ...Array.from(new Set(movies.map(m => m.genre).filter(Boolean) as string[])).sort()], [movies]);
  const filtered = useMemo(() => movies.filter(m =>
    (genre === "All" || m.genre === genre) &&
    (m.title.toLowerCase().includes(query.toLowerCase()) || (m.genre || "").toLowerCase().includes(query.toLowerCase()) || (m.synopsis || "").toLowerCase().includes(query.toLowerCase()))
  ), [movies, genre, query]);
  const free = filtered.filter(m => m.plan !== "premium");
  const premiumTitles = filtered.filter(m => m.plan === "premium");
  const watchlist = movies.filter(m => saved.includes(m.id));

  async function toggleSaved(movieId: string) {
    if (!user) { window.location.assign("/login"); return; }
    setBusyId(movieId);
    const supabase = createClient();
    const exists = saved.includes(movieId);
    const result = exists
      ? await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movieId)
      : await supabase.from("watchlist").insert({ user_id: user.id, movie_id: movieId });
    if (!result.error) setSaved(current => exists ? current.filter(id => id !== movieId) : [...current, movieId]);
    setBusyId("");
  }

  function card(m: DashboardMovie) {
    const isPremium = m.plan === "premium";
    return <article className="nf-movie-card" key={m.id}>
      <Link href={"/watch/" + m.id} className="nf-poster-link" aria-label={"Watch " + m.title}>
        <div className="nf-poster">{m.poster_url ? <img src={m.poster_url} alt={m.title} loading="lazy" /> : <span>🎬</span>}
          <span className={isPremium ? "nf-access premium" : "nf-access"}>{isPremium ? "♛ PREMIUM" : "FREE"}</span>
          <span className="nf-play">▶</span>
        </div>
      </Link>
      <div className="nf-card-info">
        <div><Link href={"/watch/" + m.id} className="nf-card-title">{m.title}</Link><p>{m.genre || "African cinema"}{m.release_year ? " · " + m.release_year : ""}</p></div>
        <button className="nf-save" type="button" disabled={busyId === m.id} onClick={() => void toggleSaved(m.id)} aria-label={saved.includes(m.id) ? "Remove from watchlist" : "Add to watchlist"}>{saved.includes(m.id) ? "✓" : "+"}</button>
      </div>
    </article>;
  }

  return <main className="nf-shell">
    <header className="nf-nav">
      <Link className="nf-brand" href="/">NAIJA<span>FLIX</span></Link>
      <nav><a href="#catalogue">Explore</a><a href="#continue">Continue Watching</a><a href="#my-list">My List ({saved.length})</a>{role === "admin" && <Link href="/admin">Admin</Link>}</nav>
      <div className="nf-nav-actions">
        {user ? <><span className={premium ? "nf-member premium" : "nf-member"}>{premium ? "PREMIUM" : "FREE PLAN"}</span><Link href="/account">Account</Link></> : <><Link href="/login">Sign in</Link><Link className="nf-small-btn" href="/signup">Join Free</Link></>}
        <Link className="nf-premium-btn" href="/subscribe">Get Premium</Link>
      </div>
    </header>

    <section className="nf-hero" style={featured?.poster_url ? { backgroundImage: "linear-gradient(90deg,#08090d 0%,rgba(8,9,13,.88) 42%,rgba(8,9,13,.15) 100%),linear-gradient(0deg,#08090d,transparent 65%),url(" + JSON.stringify(featured.poster_url) + ")" } : undefined}>
      <div className="nf-hero-copy">
        <div className="nf-kicker">THE HOME OF AFRICAN STORIES</div>
        <div className="nf-hero-badges"><span>{featured?.plan === "premium" ? "♛ PREMIUM" : "FREE TO WATCH"}</span><span>{featured?.genre || "NOLLYWOOD · KANNYWOOD"}</span><span>{featured?.release_year || "NEW RELEASES"}</span></div>
        <h1>{featured?.title || "Stories that feel like home."}</h1>
        <p>{featured?.synopsis || "Discover Nollywood hits, Kannywood favourites and unforgettable African stories."}</p>
        <div className="nf-hero-actions">{featured && <Link className="nf-watch-btn" href={"/watch/" + featured.id}>▶ &nbsp; WATCH NOW</Link>}<a className="nf-browse-btn" href="#catalogue">Browse Movies</a></div>
      </div>
      <div className="nf-hero-side"><span>NAIJAFLIX ORIGINALS</span><strong>STREAM<br/>YOUR STORY.</strong></div>
    </section>

    <section className="nf-plan-strip">
      <div><span className="nf-plan-icon">▶</span><div><b>Free Plan</b><small>Watch every title marked Free</small></div><Link href="/signup">Join free</Link></div>
      <div><span className="nf-plan-icon crown">♛</span><div><b>Premium · ₦2,500/month</b><small>Unlock all Premium movies for 30 days</small></div><Link href="/subscribe">Upgrade</Link></div>
    </section>

    {user && <section id="continue" className="nf-section">
      <div className="nf-section-head"><div><span className="nf-kicker">PICK UP WHERE YOU LEFT OFF</span><h2>Continue Watching</h2></div><span>{progress.length} titles</span></div>
      {progress.length ? <div className="nf-continue-grid">{progress.map(item => item.movie && <Link href={"/watch/" + item.movie_id} className="nf-continue-card" key={item.movie_id}>
        <div className="nf-continue-poster">{item.movie.poster_url && <img src={item.movie.poster_url} alt="" />}<span>▶</span></div>
        <div className="nf-progress-track"><i style={{ width: Math.min(100, Math.max(3, item.movie.duration_minutes ? item.progress_seconds / (item.movie.duration_minutes * 60) * 100 : 8)) + "%" }} /></div>
        <b>{item.movie.title}</b><small>Resume at {Math.floor(item.progress_seconds / 60)} min</small>
      </Link>)}</div> : <div className="nf-empty">You haven't started a movie yet. Pick a title below and start watching.</div>}
    </section>}

    <section id="catalogue" className="nf-section">
      <div className="nf-section-head"><div><span className="nf-kicker">FIND YOUR NEXT FAVOURITE</span><h2>Explore Movies</h2></div><span>{filtered.length} titles</span></div>
      <div className="nf-filters"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies, genres..." aria-label="Search movies" /><select value={genre} onChange={e => setGenre(e.target.value)} aria-label="Filter by genre">{genres.map(g => <option key={g} value={g}>{g === "All" ? "All genres" : g}</option>)}</select></div>
      <div className="nf-category-pills">{genres.map(g => <button type="button" key={g} className={genre === g ? "active" : ""} onClick={() => setGenre(g)}>{g}</button>)}</div>
      <div className="nf-section-head compact"><h2>🔥 Trending Now</h2><span>{filtered.length} titles</span></div>
      {filtered.length ? <div className="nf-movie-grid">{filtered.map(card)}</div> : <div className="nf-empty">No movies match this search yet.</div>}
    </section>

    <section className="nf-section">
      <div className="nf-section-head"><div><span className="nf-kicker">WATCH WITHOUT A SUBSCRIPTION</span><h2>Free to Watch</h2></div><span>{free.length} titles</span></div>
      {free.length ? <div className="nf-movie-grid">{free.map(card)}</div> : <div className="nf-empty">Free movies will appear here when published by the admin.</div>}
    </section>
    <section className="nf-section">
      <div className="nf-section-head"><div><span className="nf-kicker">UNLOCK THE FULL EXPERIENCE</span><h2>Premium Collection</h2></div><Link href="/subscribe">View plans →</Link></div>
      {premiumTitles.length ? <div className="nf-movie-grid">{premiumTitles.map(card)}</div> : <div className="nf-empty">Premium titles are coming soon.</div>}
    </section>

    {user && <section id="my-list" className="nf-section">
      <div className="nf-section-head"><div><span className="nf-kicker">SAVED FOR LATER</span><h2>My Watchlist</h2></div><span>{watchlist.length} saved</span></div>
      {watchlist.length ? <div className="nf-movie-grid">{watchlist.map(card)}</div> : <div className="nf-empty">Your watchlist is empty. Tap + on any movie to save it here.</div>}
    </section>}
    <footer className="nf-footer"><Link className="nf-brand" href="/">NAIJA<span>FLIX</span></Link><span>© {new Date().getFullYear()} NaijaFlix · African stories, streaming everywhere.</span><Link href="/subscribe">Free & Premium Plans</Link></footer>
  </main>;
}
