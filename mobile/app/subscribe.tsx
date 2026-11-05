import { Pressable,StyleSheet,Text,View,Alert } from "react-native";
import { Link } from "expo-router";
export default function SubscribeScreen(){
 return <View style={s.screen}>
  <Text style={s.brand}>NAIJA<Text style={{color:"#f43f5e"}}>FLIX</Text></Text>
  <Text style={s.title}>Go Premium</Text>
  <Text style={s.price}>₦2,500<Text style={s.period}> / month</Text></Text>
  <Text style={s.copy}>Unlock Premium movies and enjoy more of NaijaFlix with the same membership you use on the website.</Text>
  <View style={s.features}><Text style={s.feature}>✓  Premium movie collection</Text><Text style={s.feature}>✓  One account across web and mobile</Text><Text style={s.feature}>✓  Watchlist and progress sync</Text></View>
  <Pressable style={s.button} onPress={()=>Alert.alert("Payment setup","Mobile Paystack checkout will be connected after the shared subscription flow is tested.")}><Text style={s.buttonText}>Continue to payment</Text></Pressable>
  <Link href="/(tabs)/profile" style={s.back}>Back to profile</Link>
 </View>;
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#09090d",padding:25,justifyContent:"center"},brand:{color:"white",fontSize:24,fontWeight:"900",textAlign:"center",marginBottom:45},title:{color:"white",fontSize:32,fontWeight:"900"},price:{color:"#ff8297",fontSize:31,fontWeight:"900",marginTop:12},period:{color:"#aaa",fontSize:14,fontWeight:"500"},copy:{color:"#c5c5ce",fontSize:15,lineHeight:24,marginTop:18},features:{marginTop:25,gap:15},feature:{color:"white",fontSize:15},button:{backgroundColor:"#f43f5e",padding:16,borderRadius:10,alignItems:"center",marginTop:32},buttonText:{color:"white",fontWeight:"900"},back:{color:"#ff8297",textAlign:"center",marginTop:22}});