import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    if (!email.trim() || !password) return Alert.alert("Missing details", "Enter your email and password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return Alert.alert("Sign in failed", error.message);
    router.replace("/(tabs)/profile");
  }
  return <View style={s.screen}>
    <Text style={s.logo}>NAIJA<Text style={{color:"#f43f5e"}}>FLIX</Text></Text>
    <Text style={s.heading}>Welcome back</Text><Text style={s.copy}>Sign in with your NaijaFlix account.</Text>
    <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email address" placeholderTextColor="#777" style={s.input}/>
    <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#777" style={s.input}/>
    <Pressable disabled={busy} onPress={submit} style={s.button}><Text style={s.buttonText}>{busy ? "Signing in…" : "Sign in"}</Text></Pressable>
    <Link href="/signup" style={s.link}>New to NaijaFlix? Create an account</Link>
  </View>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#09090d",justifyContent:"center",padding:25},logo:{color:"white",fontSize:28,fontWeight:"900",textAlign:"center",marginBottom:45},heading:{color:"white",fontSize:28,fontWeight:"900"},copy:{color:"#aaa",marginTop:8,marginBottom:25},input:{backgroundColor:"#1b1b23",borderRadius:10,padding:15,color:"white",marginBottom:13},button:{backgroundColor:"#f43f5e",padding:15,borderRadius:10,alignItems:"center",marginTop:8},buttonText:{color:"white",fontWeight:"900"},link:{color:"#ff8297",textAlign:"center",marginTop:24}});