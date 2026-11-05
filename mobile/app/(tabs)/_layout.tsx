import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RED = "#f43f5e";
const MUTED = "#888894";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: RED,
      tabBarInactiveTintColor: MUTED,
      tabBarStyle: { backgroundColor: "#111116", borderTopColor: "#262630", height: 62, paddingTop: 7, paddingBottom: 8 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }
    }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="clips" options={{ title: "Clips", tabBarIcon: ({ color, size }) => <Ionicons name="play-circle" color={color} size={size} /> }} />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "My Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color} size={size} /> }} />
    </Tabs>
  );
}