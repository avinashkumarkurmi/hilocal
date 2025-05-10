import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { config } from "./../config";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  const colors = useThemeColors();
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const naviagtion = useNavigation();
  const dispatch = useDispatch();
  const maxWords = 100;

  const validateUserInput = ({ userName, email, password }) => {
    const errors = {};

    // Username: 3–20 characters, no spaces, alphanumeric + underscore
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(userName)) {
      errors.username =
        "Username must be 3-20 characters and contain only letters, numbers, or underscores";
    }

    // Email: basic format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    // Password: at least 6 characters, 1 letter, 1 number
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
      errors.password =
        "Password must be at least 6 characters and include at least one letter and one number";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleChangeText = (text) => {
    const wordCount = text.length;
    if (wordCount <= maxWords) {
      setBio(text); // Update bio if word count is within limit
    }
  };

  async function loginRequestToBackend(data) {
    try {
      const response = await axios.post(`${config.API_URL}/auth/signup`, data);
      console.log("Signup Success:", response.data);
      dispatch(loginSuccess(response.data));
      await AsyncStorage.setItem("token", response.data.token);
      // return response.data;
    } catch (error) {
      console.log("Signup Failed:", error.response?.data || error.message);
      dispatch(loginFailure(error.message));
      Alert.alert("Signup Failed", error.response.data.message);
      // return { error: true, message: error.response?.data || error.message };
    }
  }

  const handleSignup = async () => {
    const isValid = validateUserInput({ userName, email, password });
    
    if (isValid.isValid) {
      dispatch(loginStart());
      console.log("Signup", { email, password });
      loginRequestToBackend({ userName, email, password, bio });
    } else {
      const erorrToDisplay = Object.entries(isValid.errors)[0];
      Alert.alert(erorrToDisplay[0], erorrToDisplay[1]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={[styles.title, { color: colors.text }]}>Sign Up</Text>

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
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.primary },
        ]}
        placeholder="User name"
        placeholderTextColor={colors.text + "99"}
        value={userName}
        onChangeText={setUserName}
        keyboardType="default"
        autoCapitalize="none"
        textContentType="name"
      />
      <View>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.primary,
              textAlignVertical: "top",
              height: 100,
              marginBottom: 0,
            },
          ]}
          placeholder="Your bio..."
          placeholderTextColor={colors.text + "99"}
          value={bio}
          multiline={true}
          onChangeText={handleChangeText}
          keyboardType="default"
          autoCapitalize="none"
          // onContentSizeChange={handleContentSizeChange}
        />
        <Text
          style={{
            color: colors.text,
            alignSelf: "flex-end",
            marginBottom: 16,
          }}
        >
          {bio.length} / {maxWords} words
        </Text>
      </View>

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
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => naviagtion.goBack()}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Already have an account? Login
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
