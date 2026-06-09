import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, radii, spacing } from "../theme/colors";
import { typography } from "../theme/typography";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";

interface AccentButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AccentButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  style,
}: AccentButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" || variant === "success"
            ? styles.labelPrimary
            : styles.labelSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: "transparent",
    borderColor: colors.danger,
  },
  success: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  label: {
    ...typography.buttonLabel,
  },
  labelPrimary: {
    color: "#111111",
  },
  labelSecondary: {
    color: colors.text,
  },
});
