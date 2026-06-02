import type { TextStyle } from "react-native";

export const fontFamilies = {
  regular: "Inter_400Regular",
  medium: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extraBold: "Inter_800ExtraBold",
} as const;

export const typography = {
  brand: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 13,
    letterSpacing: 3,
  },
  sectionEyebrow: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  titleLarge: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 30,
    lineHeight: 34,
  },
  titleMedium: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 24,
    lineHeight: 28,
  },
  titleSmall: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 17,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  buttonLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  chipLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  formLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  captionBold: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
  },
  badgeLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
  },
  smallEyebrow: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  value: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 23,
  },
  summaryValue: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 18,
  },
  overlayLabel: {
    fontFamily: fontFamilies.extraBold,
    letterSpacing: 1.2,
  },
} satisfies Record<string, TextStyle>;
