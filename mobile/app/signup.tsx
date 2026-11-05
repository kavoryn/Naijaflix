import { useState } from "react";
import { Link, router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";

export default function SignupScreen() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false);
  async function submit() {
    if (!name.trim() || !email.trim() || password.length < 8) return Alert.alert("Check details","Enter your name, email and a password of at least 8 characters.");
    setBusy(true);
    const { data,error }=await supabase.auth.signUp({email:email.trim(),password,options:{data:{full_name:name.trim()}}});
    setBusy(false);
    if(error) return Alert.alert("Registration failed",error.message);
    if(!data.session) return Alert.alert("Check your email","Confirm your email address, then sign in.",[{text:"OK",onPress:()=>router.replace("/login")}]);
    router.replace("/(tabs)/profile");
  }
  return <View style={s.screen}>
    <Text style={s.logo}>NAIJA<Text style={{color:"#f43f5e"}}>FLIX</Text></Text>
    <Text style={s.heading}>Create your account</Text><Text style={s.copy}>One account for NaijaFlix on web and mobile.</Text>
    <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#777" style={s.input}/>
    <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor="#777" style={s.input}/>
    <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password (8+ characters)" placeholderTextColor="#777" style={s.input}/>
    <Pressable disabled={busy} onPress={submit} style={s.button}><Text style={s.buttonText}>{busy?"Creating account…":"Create account"}</Text></Pressable>
    <Link href="/login" style={s.link}>Already have an account? Sign in</Link>
  </View>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#09090d",justifyContent:"center",padding:25},logo:{color:"white",fontSize:28,fontWeight:"900",textAlign:"center",marginBottom:45},heading:{color:"white",fontSize:28,fontWeight:"900"},copy:{color:"#aaa",marginTop:8,marginBottom:25},input:{backgroundColor:"#1b1b23",borderRadius:10,padding:15,color:"white",marginBottom:13},button:{backgroundColor:"#f43f5e",padding:15,borderRadius:10,alignItems:"center",marginTop:8},buttonText:{color:"white",fontWeight:"900"},link:{color:"#ff8297",textAlign:"center",marginTop:24}});