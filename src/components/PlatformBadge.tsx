import { StyleSheet, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

import { platformBranding } from "../data/mediaAssets";
import { PlatformName } from "../types/content";
import { colors, radii, spacing } from "../theme/colors";

interface PlatformBadgeProps {
  platform: PlatformName;
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const branding = platformBranding[platform];

  return (
    <View style={styles.badge}>
      <View style={styles.logoSlot}>
        <SvgUri uri={branding.logoUri} width={branding.logoWidth} height={16} />
      </View>
      <Text style={styles.label}>{platform}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  logoSlot: {
    minWidth: 78,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
});
