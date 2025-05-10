import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "./../config";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BlurView } from "expo-blur";

export default function Login() {
  const colors = useThemeColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const naviagtion = useNavigation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.loading);

  const validateUserInput = ({ email }) => {
    const errors = {};

    // Email: basic format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  async function loginRequestToBackend(data) {
    try {
      const response = await axios.post(`${config.API_URL}/auth/login`, data);
      console.log("login Success:", response.data);
      dispatch(loginSuccess(response.data));
      await AsyncStorage.setItem("token", response.data.token);
      // return response.data;
    } catch (error) {
      console.log("login Failed:", error.response?.data || error.message);
      dispatch(loginFailure(error.message));
      Alert.alert("login Failed", error.response.data.message);
      // return { error: true, message: error.response?.data || error.message };
    }
  }

  const handleLogin = async () => {
    const isValid = validateUserInput({ email });

    if (isValid.isValid) {
      dispatch(loginStart());
      console.log("Log in", { email, password });
      loginRequestToBackend({ email, password });
    } else {
      const erorrToDisplay = Object.entries(isValid.errors)[0];
      Alert.alert(erorrToDisplay[0], erorrToDisplay[1]);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 12, fontSize: 16, color: "#333" }}>
          Logging in...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>

      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.primary },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.text + "99"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.passwordInput,
            { color: colors.text, borderColor: colors.primary },
          ]}
          placeholder="Password"
          placeholderTextColor={colors.text + "99"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
          textContentType="password"
        />
        <TouchableOpacity
          onPress={() => setSecure(!secure)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={[styles.link, { color: colors.primary }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => naviagtion.navigate("SignUp")}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", marginTop: 4, fontSize: 14 },
});
