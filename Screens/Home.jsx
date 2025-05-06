import { useThemeColors } from "@/constants/ThemeContext";
import react from "react";
import { View, Text } from "react-native";

export default function Home() {
  const color = useThemeColors();
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <View style={{ width: 100, height: 100, backgroundColor: color.secondary }}>
        <Text>Home SCreen</Text>
      </View>
    </View>
  );
}
