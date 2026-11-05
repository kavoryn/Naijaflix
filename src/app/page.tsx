import HomeDashboard, { type DashboardMovie, type ContinueItem } from "@/components/home-dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: movieRows } = await supabase
    .from("movies")
    .select("id,title,synopsis,genre,release_year,duration_minutes,poster_url,video_url,featured,plan")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const movies = (movieRows ?? []) as DashboardMovie[];
  const featured = movies.find(movie => movie.featured) ?? movies[0] ?? null;

  let role: string | null = null;
  let premium = false;
  let progress: ContinueItem[] = [];
  let watchlistIds: string[] = [];

  if (user) {
    const [{ data: profile }, { data: subscriptions }, { data: history }, { data: saved }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
      supabase.from("subscriptions").select("id").eq("user_id", user.id).eq("status", "active").gt("ends_at", new Date().toISOString()).limit(1),
      supabase.from("watch_progress").select("movie_id,progress_seconds").eq("user_id", user.id).eq("completed", false).order("updated_at", { ascending: false }).limit(8),
      supabase.from("watchlist").select("movie_id").eq("user_id", user.id),
    ]);
    role = profile?.role ?? null;
    premium = !!subscriptions?.length;
    watchlistIds = (saved ?? []).map(row => row.movie_id);
    const byId = new Map(movies.map(movie => [movie.id, movie]));
    progress = (history ?? []).map(row => ({
      movie_id: row.movie_id,
      progress_seconds: row.progress_seconds,
      movie: byId.get(row.movie_id) ?? null,
    })).filter(item => item.movie !== null) as ContinueItem[];
  }

  return <HomeDashboard
    movies={movies}
    featured={featured}
    user={user ? { id: user.id, email: user.email } : null}
    role={role}
    premium={premium}
    progress={progress}
    watchlistIds={watchlistIds}
  />;
}
