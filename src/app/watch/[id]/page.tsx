"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Movie = { id: string; title: string; synopsis: string | null; video_url: string | null; plan: "free" | "premium" };

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [message, setMessage] = useState("Loading title…");
  const [locked, setLocked] = useState(false);
  const lastSaved = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("movies").select("id,title,synopsis,video_url,plan").eq("id", id).eq("published", true).single();
      if (!active) return;
      if (error || !data) { setMessage("This title is unavailable or has not been published."); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (data.plan === "premium") {
        if (!user) { setLocked(true); setMessage("Sign in and subscribe to watch this Premium movie."); return; }
        const { data: subscriptions } = await supabase.from("subscriptions").select("id").eq("user_id", user.id).eq("status", "active").gt("ends_at", new Date().toISOString()).limit(1);
        if (!subscriptions?.length) { setLocked(true); setMessage("This movie is for Premium members. Upgrade your account to continue."); return; }
      }
      setMovie(data as Movie); setMessage("");
      if (user) {
        const { data: progress } = await supabase.from("watch_progress").select("progress_seconds").eq("user_id", user.id).eq("movie_id", id).maybeSingle();
        if (active && progress?.progress_seconds && videoRef.current) { videoRef.current.currentTime = progress.progress_seconds; lastSaved.current = progress.progress_seconds; }
      }
    }
    void load();
    return () => { active = false; };
  }, [id]);

  const saveProgress = useCallback(async (completed = false) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.currentTime)) return;
    const seconds = Math.floor(video.currentTime);
    if (!completed && seconds - lastSaved.current < 15) return;
    lastSaved.current = seconds;
    try { await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ movie_id: id, progress_seconds: seconds, completed }) }); } catch {}
  }, [id]);

  return <main className="shell">
    <nav className="nav"><Link className="brand" href="/">NAIJA<span>FLIX</span></Link><Link href="/account">My account</Link></nav>
    {locked ? <section className="form card"><div className="eyebrow">PREMIUM MOVIE</div><h1>Premium access required</h1><p className="muted">{message}</p><Link className="btn" href="/subscribe">Unlock Premium · ₦2,500/month</Link><p><Link href="/signup">Create a free account</Link></p></section> : movie ? <section className="section">
      <div className="eyebrow">{movie.plan === "premium" ? "PREMIUM" : "FREE"} MOVIE</div><h1>{movie.title}</h1>
      {movie.synopsis && <p className="muted">{movie.synopsis}</p>}
      {movie.video_url ? <video ref={videoRef} controls playsInline onTimeUpdate={() => void saveProgress()} onPause={() => void saveProgress()} onEnded={() => void saveProgress(true)} style={{ width: "100%", maxHeight: 650 }} src={movie.video_url} /> : <div className="card">Video not yet added. The admin will add a licensed source.</div>}
    </section> : <p role="status">{message}</p>}
  </main>;
}
