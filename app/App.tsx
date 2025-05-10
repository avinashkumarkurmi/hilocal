import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { useThemeColors } from "@/constants/ThemeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Home from "../Screens/Home";
import Profile from "../Screens/Profile";
import Messages from "../Screens/Messages";
import Login from "../UnAuthencticationScreens/Login";
import SignUp from "../UnAuthencticationScreens/SignUp";
import { config } from "../config";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const dispatch = useDispatch();
  const [isAppReady, setIsAppReady] = useState(false);

  const color = useThemeColors();
  useEffect(() => {
    async function checkForToken() {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        dispatch(loginStart());
        try {
          const response = await axios.get(
            `${config.API_URL}/auth/checkToken`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          dispatch(loginSuccess(response.data));
          console.log("Login successful using token");
        } catch (error) {
          dispatch(
            loginFailure(
              error instanceof Error ? error.message : "Something went wrong"
            )
          );
        }
      } else {
        dispatch(loginFailure("No token found"));
      }
      setIsAppReady(true);
    }

    checkForToken();
  }, []);

  const isAuth = useSelector((state: any) => state.auth.isAuthenticated);

  if (!isAppReady) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

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

  return isAuth ? <AuthenticatedTabs /> : <NonAuthenticatedTabs />;
}
