import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Admin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const [{ count: movieCount }, { count: memberCount }, { count: activeSubscriptions }] =
    await Promise.all([
      supabase.from("movies").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="brand" href="/">
          NAIJA<span>FLIX</span> ADMIN
        </Link>
        <Link href="/">View site</Link>
      </nav>
      <h1>Admin dashboard</h1>
      <div className="grid">
        <div className="card">
          Movies
          <h2>{movieCount ?? 0}</h2>
        </div>
        <div className="card">
          Members
          <h2>{memberCount ?? 0}</h2>
        </div>
        <div className="card">
          Premium
          <h2>{activeSubscriptions ?? 0}</h2>
        </div>
      </div>
      <p>
        <Link className="btn" href="/admin/movies">
          Manage movies
        </Link>
      </p>
    </main>
  );
}
