import { useEffect,useState } from "react";
import { ActivityIndicator,FlatList,Pressable,Share,StyleSheet,Text,View,Dimensions } from "react-native";
import { VideoView,useVideoPlayer } from "expo-video";
import { supabase } from "@/lib/supabase";

type Clip={id:string;title:string;description:string|null;category:string|null;video_url:string;poster_url:string|null};
const HEIGHT=Dimensions.get("window").height-150;
function ClipCard({clip,active}:{clip:Clip;active:boolean}){
 const [muted,setMuted]=useState(true);
 const player=useVideoPlayer({uri:clip.video_url},p=>{p.loop=true;p.muted=true;});
 useEffect(()=>{if(active)player.play();else player.pause();},[active,player]);
 useEffect(()=>{player.muted=muted;},[muted,player]);
 return <View style={s.card}>
  <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false}/>
  <View style={s.overlay}>
   <View style={s.top}><Text style={s.brand}>NAIJA<Text style={{color:"#f43f5e"}}>FLIX</Text> CLIPS</Text><Pressable onPress={()=>setMuted(v=>!v)} style={s.action}><Text style={s.actionText}>{muted?"🔇":"🔊"}</Text></Pressable></View>
   <View style={s.bottom}><Text style={s.category}>{clip.category||"NAIJAFLIX ORIGINAL"}</Text><Text style={s.title}>{clip.title}</Text><Text style={s.description}>{clip.description||"Discover your next favourite on NaijaFlix."}</Text>
    <View style={s.actions}><Pressable style={s.action} onPress={()=>Share.share({message:clip.title+" — Watch on NaijaFlix"})}><Text style={s.actionText}>↗ Share</Text></Pressable></View>
   </View>
  </View>
 </View>;
}
export default function ClipsScreen(){
 const [clips,setClips]=useState<Clip[]>([]);const [loading,setLoading]=useState(true);const [active,setActive]=useState(0);
 useEffect(()=>{let alive=true;(async()=>{const {data,error}=await supabase.from("clips").select("id,title,description,category,video_url,poster_url").eq("published",true).order("created_at",{ascending:false}).limit(50);if(alive){if(error)console.warn("Clips:",error.message);setClips((data||[]) as Clip[]);setLoading(false);}})();return()=>{alive=false}},[]);
 if(loading)return <View style={s.center}><ActivityIndicator color="#f43f5e"/></View>;
 if(!clips.length)return <View style={s.center}><Text style={s.heading}>NaijaFlix Clips</Text><Text style={s.empty}>Short videos and previews will appear here when published from the content catalogue.</Text></View>;
 return <FlatList data={clips} keyExtractor={x=>x.id} renderItem={({item,index})=><ClipCard clip={item} active={index===active}/>} pagingEnabled snapToInterval={HEIGHT} decelerationRate="fast" showsVerticalScrollIndicator={false} onMomentumScrollEnd={e=>setActive(Math.round(e.nativeEvent.contentOffset.y/HEIGHT))}/>;
}
const s=StyleSheet.create({center:{flex:1,backgroundColor:"#09090d",justifyContent:"center",alignItems:"center",padding:30},heading:{color:"white",fontSize:24,fontWeight:"900",marginBottom:12},empty:{color:"#aaa",textAlign:"center",lineHeight:23},card:{height:HEIGHT,backgroundColor:"#09090d",overflow:"hidden"},overlay:{...StyleSheet.absoluteFillObject,justifyContent:"space-between",padding:20,backgroundColor:"rgba(0,0,0,0.15)"},top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:15},brand:{color:"white",fontWeight:"900",fontSize:16},bottom:{paddingBottom:20},category:{color:"#ff8297",fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:"white",fontSize:27,fontWeight:"900",marginTop:8},description:{color:"white",fontSize:14,lineHeight:21,marginTop:7,maxWidth:"85%"},actions:{flexDirection:"row",marginTop:16},action:{backgroundColor:"rgba(25,25,30,0.75)",paddingHorizontal:14,paddingVertical:10,borderRadius:22},actionText:{color:"white",fontWeight:"800"}});
