import { createContext, useContext, useEffect } from "react";
import { lightColors, darkColors } from "./Colors";
import { StatusBar, useColorScheme } from "react-native";
import React from "react";

const ThemeContext = createContext(lightColors);

export default function ThemeProvider({ children }: any) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={colors}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeColors = () => useContext(ThemeContext);
