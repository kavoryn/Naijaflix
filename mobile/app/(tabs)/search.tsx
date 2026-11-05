import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  async function search(value: string) {
    setQuery(value);
    if (value.trim().length < 2) { setResults([]); return; }
    setBusy(true);
    const { data } = await supabase.from("movies_catalogue").select("id,title,genre,release_year,poster_url,plan")
      .eq("published", true).ilike("title", `%${value.trim()}%`).limit(30);
    setResults(data || []);
    setBusy(false);
  }

  return <View style={styles.screen}>
    <Text style={styles.heading}>Search</Text>
    <TextInput value={query} onChangeText={search} placeholder="Movies, series, games and podcasts" placeholderTextColor="#777783" style={styles.input} />
    {busy ? <Text style={styles.muted}>Searching…</Text> : null}
    <FlatList data={results} keyExtractor={(item) => item.id} ListEmptyComponent={<Text style={styles.muted}>Search the NaijaFlix catalogue by title.</Text>}
      renderItem={({ item }) => <Link href={{ pathname: "/title/[id]", params: { id: item.id } }} asChild><Pressable style={styles.row}>
        {item.poster_url ? <Image source={{ uri: item.poster_url }} style={styles.poster} /> : <View style={styles.poster} />}
        <View style={{ flex: 1 }}><Text style={styles.title}>{item.title}</Text><Text style={styles.muted}>{item.genre || "Entertainment"} · {item.release_year || "New"}</Text></View>
        <Text style={styles.muted}>{item.plan === "premium" ? "PREMIUM" : "FREE"}</Text>
      </Pressable></Link>} />
  </View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#09090d", padding: 18, paddingTop: 25 }, heading: { color: "white", fontSize: 28, fontWeight: "900", marginBottom: 18 },
  input: { backgroundColor: "#1b1b23", color: "white", padding: 15, borderRadius: 12, marginBottom: 18, borderWidth: 1, borderColor: "#30303a" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }, poster: { width: 58, height: 76, borderRadius: 7, backgroundColor: "#292932" },
  title: { color: "white", fontSize: 15, fontWeight: "700", marginBottom: 5 }, muted: { color: "#9999a5", fontSize: 12 }
});