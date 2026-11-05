import { useEffect,useState } from "react";
import { ActivityIndicator,FlatList,Image,Pressable,StyleSheet,Text,View } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
export default function WatchlistScreen(){
 const [rows,setRows]=useState<any[]>([]);const [loading,setLoading]=useState(true);
 useEffect(()=>{let alive=true;(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){if(alive)setLoading(false);return;}const {data}=await supabase.from("watchlist").select("movie_id,movies(id,title,poster_url,plan,release_year)").eq("user_id",user.id).order("created_at",{ascending:false});if(alive){setRows(data||[]);setLoading(false);}})();return()=>{alive=false}},[]);
 if(loading)return <View style={s.center}><ActivityIndicator color="#f43f5e"/></View>;
 return <View style={s.screen}><Text style={s.heading}>My Watchlist</Text><FlatList data={rows} keyExtractor={r=>r.movie_id} ListEmptyComponent={<Text style={s.empty}>Your watchlist is empty. Save a film to see it here.</Text>} renderItem={({item})=>{const m=Array.isArray(item.movies)?item.movies[0]:item.movies;if(!m)return null;return <Link href={{pathname:"/title/[id]",params:{id:m.id}}} asChild><Pressable style={s.row}>{m.poster_url?<Image source={{uri:m.poster_url}} style={s.poster}/>:<View style={s.poster}/>}<View style={{flex:1}}><Text style={s.name}>{m.title}</Text><Text style={s.meta}>{m.release_year||"NaijaFlix"} · {(m.plan||"free").toUpperCase()}</Text></View></Pressable></Link>}}/></View>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#09090d",padding:20,paddingTop:30},center:{flex:1,backgroundColor:"#09090d",justifyContent:"center",alignItems:"center"},heading:{color:"white",fontSize:27,fontWeight:"900",marginBottom:20},empty:{color:"#999",marginTop:20},row:{flexDirection:"row",gap:13,alignItems:"center",marginBottom:14},poster:{width:64,height:88,borderRadius:8,backgroundColor:"#292932"},name:{color:"white",fontWeight:"800",fontSize:15},meta:{color:"#aaa",fontSize:11,marginTop:5}});
