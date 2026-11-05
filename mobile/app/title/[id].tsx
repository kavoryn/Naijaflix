import { useEffect,useState } from "react";
import { ActivityIndicator,Image,Pressable,ScrollView,StyleSheet,Text,View,Alert } from "react-native";
import { useLocalSearchParams,Link } from "expo-router";
import { supabase } from "@/lib/supabase";

type Movie={id:string;title:string;synopsis:string|null;genre:string|null;release_year:number|null;duration_minutes:number|null;poster_url:string|null;plan:string};
export default function TitleScreen(){
  const {id}=useLocalSearchParams<{id:string}>(); const [movie,setMovie]=useState<Movie|null>(null); const [busy,setBusy]=useState(true); const [saved,setSaved]=useState(false);
  useEffect(()=>{let alive=true;(async()=>{
    const {data,error}=await supabase.from("movies_catalogue").select("id,title,synopsis,genre,release_year,duration_minutes,poster_url,plan").eq("id",id).single();
    if(alive){if(error) console.warn(error.message);setMovie(data as Movie|null);setBusy(false);}
    const {data:{user}}=await supabase.auth.getUser();
    if(user){const {data:entry}=await supabase.from("watchlist").select("id").eq("user_id",user.id).eq("movie_id",id).maybeSingle();if(alive)setSaved(!!entry);}
  })();return()=>{alive=false}},[id]);
  async function toggleList(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return Alert.alert("Sign in required","Sign in to save titles to your watchlist.");
    if(saved){const {error}=await supabase.from("watchlist").delete().eq("user_id",user.id).eq("movie_id",id);if(error)return Alert.alert("Could not update list",error.message);setSaved(false);}
    else{const {error}=await supabase.from("watchlist").insert({user_id:user.id,movie_id:id});if(error)return Alert.alert("Could not update list",error.message);setSaved(true);}
  }
  if(busy)return <View style={s.center}><ActivityIndicator color="#f43f5e"/></View>;
  if(!movie)return <View style={s.center}><Text style={s.title}>Title not found</Text></View>;
  return <ScrollView style={s.screen}>
    {movie.poster_url?<Image source={{uri:movie.poster_url}} style={s.poster}/>:<View style={[s.poster,{backgroundColor:"#29202a"}]}/>}
    <View style={s.body}><Text style={s.title}>{movie.title}</Text><Text style={s.meta}>{movie.release_year||"New"} · {movie.genre||"Film"} · {movie.duration_minutes?movie.duration_minutes+" min":"Feature"} · {movie.plan.toUpperCase()}</Text>
      <Text style={s.synopsis}>{movie.synopsis||"Discover this title on NaijaFlix."}</Text>
      <View style={s.actions}><Pressable style={s.play} onPress={()=>Alert.alert("Player coming next","The secure video player is the next development step.")}><Text style={s.playText}>▶  Play</Text></Pressable><Pressable style={s.list} onPress={toggleList}><Text style={s.listText}>{saved?"✓ Added to My List":"＋ My List"}</Text></Pressable></View>
      {movie.plan==="premium"?<Link href="/subscribe" style={s.premium}>Unlock with NaijaFlix Premium</Link>:null}
    </View>
  </ScrollView>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#09090d"},center:{flex:1,backgroundColor:"#09090d",justifyContent:"center",alignItems:"center"},poster:{width:"100%",height:440,backgroundColor:"#222"},body:{padding:20},title:{color:"white",fontSize:29,fontWeight:"900"},meta:{color:"#ff8297",fontSize:12,marginTop:10},synopsis:{color:"#d0d0d6",fontSize:15,lineHeight:24,marginTop:20},actions:{flexDirection:"row",gap:10,marginTop:24},play:{backgroundColor:"white",borderRadius:9,padding:14,paddingHorizontal:28},playText:{color:"#111",fontWeight:"900"},list:{backgroundColor:"#303039",borderRadius:9,padding:14,paddingHorizontal:20},listText:{color:"white",fontWeight:"800"},premium:{color:"#ff8297",marginTop:22,fontWeight:"800"}});