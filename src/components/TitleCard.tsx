import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { posterUrls } from "../data/mediaAssets";
import { Title } from "../types/content";
import { colors, radii, spacing } from "../theme/colors";
import { PlatformBadge } from "./PlatformBadge";

interface TitleCardProps {
  title: Title;
  style?: StyleProp<ViewStyle>;
}

export function TitleCard({ title, style }: TitleCardProps) {
  const posterUrl = posterUrls[title.id];

  return (
    <View style={[styles.card, style]}>
      {posterUrl ? (
        <ImageBackground
          source={{ uri: posterUrl }}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(5, 5, 5, 0.08)", "rgba(5, 5, 5, 0.48)", "rgba(5, 5, 5, 0.94)"]}
            style={styles.heroOverlay}
          >
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{title.format}</Text>
            </View>
            <Text style={styles.name}>{title.name}</Text>
            <Text style={styles.meta}>
              {title.year} / {title.duration}
            </Text>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient colors={title.gradient} style={styles.hero}>
          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>{title.format}</Text>
          </View>
          <Text style={styles.name}>{title.name}</Text>
          <Text style={styles.meta}>
            {title.year} / {title.duration}
          </Text>
        </LinearGradient>
      )}

      <View style={styles.body}>
        <Text style={styles.blurb}>{title.blurb}</Text>

        <View style={styles.rowWrap}>
          {title.genres.map((genre) => (
            <View key={genre} style={styles.pill}>
              <Text style={styles.pillText}>{genre}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.detail}>Dir. {title.director}</Text>
        <Text style={styles.detail}>Con {title.cast.join(", ")}</Text>

        <Text style={styles.platformLabel}>Disponible en</Text>
        <View style={styles.platformRow}>
          {title.platforms.map((platform) => (
            <PlatformBadge key={platform} platform={platform} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    minHeight: 220,
    justifyContent: "flex-end",
  },
  heroImage: {
    opacity: 0.96,
  },
  heroOverlay: {
    minHeight: 220,
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  heroTag: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    marginBottom: spacing.md,
  },
  heroTagText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  name: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "800",
  },
  meta: {
    color: "rgba(246, 247, 242, 0.86)",
    fontSize: 14,
    marginTop: spacing.xs,
  },
  body: {
    padding: spacing.lg,
  },
  blurb: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  detail: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  platformLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
