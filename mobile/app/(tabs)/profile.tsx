import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
 const [user,setUser]=useState<any>(null);const [loading,setLoading]=useState(true);const [premium,setPremium]=useState(false);
 useEffect(()=>{
  let alive=true;
  async function load(){const {data:{user}}=await supabase.auth.getUser();if(alive)setUser(user);if(user){const {data}=await supabase.from("subscriptions").select("id").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).limit(1).maybeSingle();if(alive)setPremium(!!data);}if(alive)setLoading(false);}
  load();const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user||null);if(!session)setPremium(false);});
  return()=>{alive=false;listener.subscription.unsubscribe();};
 },[]);
 async function signOut(){await supabase.auth.signOut();setUser(null);setPremium(false);}
 if(loading)return <View style={styles.screen}><ActivityIndicator color="#f43f5e"/></View>;
 return <View style={styles.screen}>
  <Text style={styles.heading}>My Profile</Text><View style={styles.avatar}><Text style={styles.avatarText}>{user?.email?.[0]?.toUpperCase()||"N"}</Text></View>
  <Text style={styles.name}>{user?.email||"Welcome to NaijaFlix"}</Text><Text style={styles.plan}>{premium?"PREMIUM MEMBER":"FREE PLAN"}</Text>
  {user?<Pressable onPress={signOut} style={styles.primary}><Text style={styles.primaryText}>Sign out</Text></Pressable>:<><Link href="/login" asChild><Pressable style={styles.primary}><Text style={styles.primaryText}>Sign in</Text></Pressable></Link><Link href="/signup" asChild><Pressable style={styles.secondary}><Text style={styles.secondaryText}>Create account</Text></Pressable></Link></>}
  <View style={styles.links}><Link href="/watchlist" style={styles.link}>My Watchlist</Link><Link href="/subscribe" style={styles.link}>Subscription & Billing</Link><Text style={styles.link}>Saved Moments · Coming soon</Text><Text style={styles.link}>Liked Films & Series · Coming soon</Text></View>
 </View>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:"#09090d",alignItems:"center",padding:24,paddingTop:35},heading:{alignSelf:"flex-start",color:"white",fontSize:28,fontWeight:"900"},avatar:{width:82,height:82,borderRadius:41,backgroundColor:"#3a1824",justifyContent:"center",alignItems:"center",marginTop:35},avatarText:{color:"#ff8297",fontSize:32,fontWeight:"900"},name:{color:"white",fontSize:16,fontWeight:"700",marginTop:14},plan:{color:"#ff8297",fontSize:11,fontWeight:"900",marginTop:7,letterSpacing:2},primary:{backgroundColor:"#f43f5e",borderRadius:10,padding:14,width:"100%",alignItems:"center",marginTop:26},primaryText:{color:"white",fontWeight:"800"},secondary:{borderColor:"#44444f",borderWidth:1,borderRadius:10,padding:14,width:"100%",alignItems:"center",marginTop:10},secondaryText:{color:"white",fontWeight:"700"},links:{width:"100%",marginTop:30,borderTopWidth:1,borderTopColor:"#282832"},link:{color:"#e6e6eb",paddingVertical:16,borderBottomWidth:1,borderBottomColor:"#282832",fontSize:14}});
