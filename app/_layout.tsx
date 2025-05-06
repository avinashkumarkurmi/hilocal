import React, { useState, useEffect } from "react";
import ThemeProvider from "@/constants/ThemeContext";
import App from "./App";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "../store/index";

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider style={{ marginTop: insets.top }}>
      <ThemeProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
