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
        <SvgUri uri={branding.logoUri} width={branding.logoWidth * 0.82} height={13} />
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
    paddingVertical: 4,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  logoSlot: {
    minWidth: 62,
    height: 24,
    borderRadius: radii.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    paddingHorizontal: 8,
  },
  label: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
});
