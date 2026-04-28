import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../theme/colors";

function getStandaloneMode() {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return false;
  }

  const iosStandalone = "standalone" in window.navigator && Boolean((window.navigator).standalone);
  const mediaStandalone = window.matchMedia?.("(display-mode: standalone)").matches ?? false;

  return iosStandalone || mediaStandalone;
}

export function WebFullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return;
    }

    const sync = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setIsStandalone(getStandaloneMode());
    };

    sync();
    document.addEventListener("fullscreenchange", sync);

    return () => {
      document.removeEventListener("fullscreenchange", sync);
    };
  }, []);

  if (Platform.OS !== "web" || isStandalone) {
    return null;
  }

  const handlePress = async () => {
    if (typeof document === "undefined") {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      return;
    }

    await document.documentElement.requestFullscreen?.();
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: spacing.md,
    right: spacing.lg,
    zIndex: 50,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(17, 17, 17, 0.92)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
