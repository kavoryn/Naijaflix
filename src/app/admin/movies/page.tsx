"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Movie = { id: string; title: string; genre: string | null; published: boolean; plan: "free" | "premium" };

export default function ManageMoviesPage() {
  const [rows, setRows] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState("");
  const [video, setVideo] = useState("");
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") { window.location.href = "/"; return; }
    const { data, error } = await supabase.from("movies").select("id,title,genre,published,plan").order("created_at", { ascending: false });
    if (error) setMessage(error.message);
    else setRows((data ?? []) as Movie[]);
  }

  useEffect(() => { void load(); }, []);

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("Please sign in again."); setBusy(false); return; }
    const { error } = await supabase.from("movies").insert({
      title: title.trim(), genre: genre.trim() || null, poster_url: poster.trim() || null,
      video_url: video.trim() || null, created_by: user.id, published: false, plan,
    });
    setMessage(error?.message ?? "Movie saved as draft.");
    if (!error) { setTitle(""); setGenre(""); setPoster(""); setVideo(""); setPlan("free"); await load(); }
    setBusy(false);
  }

  async function updateMovie(movie: Movie, values: Partial<Movie>) {
    setMessage("");
    const { error } = await createClient().from("movies").update(values).eq("id", movie.id);
    setMessage(error?.message ?? "Movie updated successfully.");
    if (!error) await load();
  }

  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">NAIJA<span>FLIX</span></Link><Link href="/admin">Dashboard</Link></nav>
    <h1>Manage movies</h1>
    <div className="admin-layout">
      <form className="card" onSubmit={add}>
        <h2>Add movie</h2>
        <label htmlFor="movie-title">Title</label><input id="movie-title" className="field" required value={title} onChange={e => setTitle(e.target.value)} />
        <label htmlFor="movie-genre">Genre</label><input id="movie-genre" className="field" value={genre} onChange={e => setGenre(e.target.value)} />
        <label htmlFor="movie-poster">Poster URL</label><input id="movie-poster" className="field" type="url" value={poster} onChange={e => setPoster(e.target.value)} />
        <label htmlFor="movie-video">Licensed video URL</label><input id="movie-video" className="field" type="url" value={video} onChange={e => setVideo(e.target.value)} />
        <label htmlFor="movie-plan">Access plan</label>
        <select id="movie-plan" className="field" value={plan} onChange={e => setPlan(e.target.value as "free" | "premium")}>
          <option value="free">Free — everyone can watch</option><option value="premium">Premium — paid members only</option>
        </select>
        <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save draft"}</button>
        {message && <p role="status">{message}</p>}
      </form>
      <section className="card"><h2>Catalogue</h2>
        {rows.length === 0 ? <p>No movies yet. Add your first movie as a draft.</p> : rows.map(movie => <div key={movie.id} className="row" style={{ justifyContent: "space-between", gap: "1rem", marginBottom: 12 }}>
          <span>{movie.title} · {movie.plan === "premium" ? "Premium" : "Free"} · {movie.published ? "Published" : "Draft"}</span>
          <div className="row">
            <button className="btn secondary" type="button" onClick={() => void updateMovie(movie, { plan: movie.plan === "premium" ? "free" : "premium" })}>Make {movie.plan === "premium" ? "Free" : "Premium"}</button>
            <button className="btn secondary" type="button" onClick={() => void updateMovie(movie, { published: !movie.published })}>{movie.published ? "Unpublish" : "Publish"}</button>
          </div>
        </div>)}
      </section>
    </div>
  </main>;
}