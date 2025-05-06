import React, {useEffect} from "react";
import { SafeAreaView } from "react-native";
import { useThemeColors } from "@/constants/ThemeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useSelector } from "react-redux";

import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import Messages from "../Screens/Messages";
import Login from "../UnAuthencticationScreens/Login";
import SignUp from "../UnAuthencticationScreens/SignUp";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
export default function App() {

  const color = useThemeColors();

  const isAuth = useSelector((state: any) => state.auth.isAuthenticated);
  
  function AuthenticatedTabs() {
    return (
      <SafeAreaView style={{ backgroundColor: color.background, flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Message") {
                iconName = focused ? "chatbubble" : "chatbubble-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              }
  
              return (
                <Ionicons name={iconName as any} size={size} color={color} />
              );
            },
            tabBarActiveTintColor: color.tabBarActiveTint,
            tabBarInactiveTintColor: color.tabBarInactiveTint,
            tabBarStyle: {
              backgroundColor: color.tabBarBackground,
              borderTopColor: "transparent",
              borderTopWidth: 0,
              borderRadius: 10,
            },
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Message" component={Messages} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </SafeAreaView>
    );
  }

  function NonAuthenticatedTabs() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
      // <Login />
    );
  }
 
  return isAuth? <AuthenticatedTabs/> : <NonAuthenticatedTabs/>;
}
