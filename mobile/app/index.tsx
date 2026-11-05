import { useEffect } from "react";
import { ActivityIndicator,View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Index(){
 useEffect(()=>{let alive=true;(async()=>{const done=await AsyncStorage.getItem("naijaflix_onboarding_done");if(!alive)return;router.replace(done?"/(tabs)":"/onboarding");})();return()=>{alive=false}},[]);
 return <View style={{flex:1,backgroundColor:"#09090d",alignItems:"center",justifyContent:"center"}}><ActivityIndicator color="#f43f5e"/></View>;
}