import { useEffect,useState } from "react";
import { ActivityIndicator,Pressable,StyleSheet,Text,View } from "react-native";
import { useLocalSearchParams,router } from "expo-router";
import { VideoView,useVideoPlayer } from "expo-video";
import { supabase } from "@/lib/supabase";

export default function WatchScreen(){
 const {id}=useLocalSearchParams<{id:string}>();const [source,setSource]=useState<string|null>(null);const [resumeAt,setResumeAt]=useState(0);const [loading,setLoading]=useState(true);const [message,setMessage]=useState("");
 const player=useVideoPlayer(null,p=>{p.timeUpdateEventInterval=10;});
 useEffect(()=>{let alive=true;(async()=>{
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){if(alive){setMessage("Sign in to watch this title.");setLoading(false);}return;}
  const {data:movie,error}=await supabase.from("movies").select("id,video_url,plan,duration_minutes").eq("id",id).eq("published",true).single();
  if(error||!movie){if(alive){setMessage("This title is unavailable or your account cannot access it.");setLoading(false);}return;}
  if(movie.plan==="premium"){
   const {data:sub}=await supabase.from("subscriptions").select("id").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).limit(1).maybeSingle();
   if(!sub){if(alive){setMessage("A Premium subscription is required to watch this title.");setLoading(false);}return;}
  }
  if(!movie.video_url){if(alive){setMessage("Video is not available yet.");setLoading(false);}return;}
  const {data:progress}=await supabase.from("watch_progress").select("progress_seconds").eq("user_id",user.id).eq("movie_id",id).maybeSingle();
  if(alive){setResumeAt(progress?.progress_seconds||0);setSource(movie.video_url);setLoading(false);}
 })();return()=>{alive=false}},[id]);
 useEffect(()=>{if(!source)return;let alive=true;(async()=>{try{await player.replaceAsync({uri:source});if(alive&&resumeAt>0)player.currentTime=resumeAt;}catch(e){if(alive)setMessage("The video could not be loaded. Please try again.");}})();return()=>{alive=false}},[source,player]);
 useEffect(()=>{const sub=player.addListener("timeUpdate",async({currentTime})=>{
  if(!source||!Number.isFinite(currentTime))return;
  const {data:{user}}=await supabase.auth.getUser();if(!user)return;
  await supabase.from("watch_progress").upsert({user_id:user.id,movie_id:id,progress_seconds:Math.floor(currentTime),completed:false,updated_at:new Date().toISOString()},{onConflict:"user_id,movie_id"});
 });return()=>sub.remove()},[id,player,source]);
 if(loading)return <View style={s.center}><ActivityIndicator color="#f43f5e"/><Text style={s.copy}>Preparing your video…</Text></View>;
 if(message)return <View style={s.center}><Text style={s.message}>{message}</Text><Pressable style={s.button} onPress={()=>message.includes("Premium")?router.push("/subscribe"):router.back()}><Text style={s.buttonText}>{message.includes("Premium")?"Get Premium":"Go back"}</Text></Pressable></View>;
 return <View style={s.screen}><VideoView player={player} style={s.video} nativeControls contentFit="contain" allowsFullscreen allowsPictureInPicture/><Pressable style={s.back} onPress={()=>router.back()}><Text style={s.backText}>‹  Back to title</Text></Pressable></View>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#000",justifyContent:"center"},video:{width:"100%",aspectRatio:16/9,backgroundColor:"#000"},center:{flex:1,backgroundColor:"#09090d",justifyContent:"center",alignItems:"center",padding:30},copy:{color:"#aaa",marginTop:12},message:{color:"white",fontSize:18,textAlign:"center",lineHeight:26},button:{backgroundColor:"#f43f5e",paddingHorizontal:24,paddingVertical:13,borderRadius:9,marginTop:20},buttonText:{color:"white",fontWeight:"900"},back:{padding:20},backText:{color:"white",fontSize:16}});