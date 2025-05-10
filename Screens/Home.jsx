import { useThemeColors } from "@/constants/ThemeContext";
import react from "react";
import { View, Text, Button } from "react-native";
import { logout } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

export default function Home() {
  const color = useThemeColors();
  const dispatch = useDispatch();
  function logoutHandler() {
    dispatch(logout());
  }
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <View
        style={{
          width: 300,
          height: 100,
          backgroundColor: color.secondary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Home SCreen</Text>
        <Button title="Log OUt" onPress={logoutHandler} />
      </View>
    </View>
  );
}
