import { StyleSheet, Text, View } from "react-native";

export default function ClipsScreen() {
  return <View style={styles.screen}>
    <Text style={styles.title}>NaijaFlix Clips</Text>
    <Text style={styles.copy}>Short previews and moments from the NaijaFlix library will appear here.</Text>
    <Text style={styles.note}>The vertical swipe player will be connected when licensed clip videos are added to the catalogue.</Text>
  </View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#09090d", justifyContent: "center", alignItems: "center", padding: 30 },
  title: { color: "white", fontSize: 25, fontWeight: "900", marginBottom: 12 },
  copy: { color: "#ddd", textAlign: "center", fontSize: 15, lineHeight: 23 },
  note: { color: "#92929d", textAlign: "center", fontSize: 12, marginTop: 15, lineHeight: 19 }
});