import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { posterUrls } from "../data/mediaAssets";
import { Title } from "../types/content";
import { colors, radii, spacing } from "../theme/colors";
import { fontFamilies, typography } from "../theme/typography";
import { PlatformBadge } from "./PlatformBadge";

interface TitleCardProps {
  title: Title;
  style?: StyleProp<ViewStyle>;
}

export function TitleCard({ title, style }: TitleCardProps) {
  const posterUrl = posterUrls[title.id];
  const { height } = useWindowDimensions();
  const compact = height < 760;
  const small = height < 680;
  const heroHeight = small ? 122 : compact ? 136 : 150;
  const bodyPadding = small ? 12 : compact ? 14 : 16;
  const titleSize = small ? 17 : compact ? 18 : 20;
  const titleLineHeight = small ? 20 : compact ? 21 : 23;
  const metaFontSize = small ? 11 : 12;
  const blurbFontSize = small ? 12 : 13;
  const blurbLineHeight = small ? 17 : 18;
  const detailFontSize = small ? 11 : 12;
  const detailLineHeight = small ? 15 : 16;
  const tagFontSize = small ? 10 : 11;
  const pillFontSize = small ? 10 : 11;
  const platformLabelSize = small ? 11 : 12;

  return (
    <View style={[styles.card, style]}>
      {posterUrl ? (
        <ImageBackground
          source={{ uri: posterUrl }}
          style={[styles.hero, { minHeight: heroHeight }]}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(5, 5, 5, 0.08)", "rgba(5, 5, 5, 0.48)", "rgba(5, 5, 5, 0.94)"]}
            style={[styles.heroOverlay, { minHeight: heroHeight, padding: bodyPadding }]}
          >
            <View style={styles.heroTag}>
              <Text style={[styles.heroTagText, { fontSize: tagFontSize }]}>{title.format}</Text>
            </View>
            <Text style={[styles.name, { fontSize: titleSize, lineHeight: titleLineHeight }]}>
              {title.name}
            </Text>
            <Text style={[styles.meta, { fontSize: metaFontSize }]}>
              {title.year} / {title.duration}
            </Text>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient colors={title.gradient} style={[styles.hero, { minHeight: heroHeight, padding: bodyPadding }]}>
          <View style={styles.heroTag}>
            <Text style={[styles.heroTagText, { fontSize: tagFontSize }]}>{title.format}</Text>
          </View>
          <Text style={[styles.name, { fontSize: titleSize, lineHeight: titleLineHeight }]}>
            {title.name}
          </Text>
          <Text style={[styles.meta, { fontSize: metaFontSize }]}>
            {title.year} / {title.duration}
          </Text>
        </LinearGradient>
      )}

      <View style={[styles.body, { padding: bodyPadding }]}>
        <Text style={[styles.blurb, { fontSize: blurbFontSize, lineHeight: blurbLineHeight }]}>
          {title.blurb}
        </Text>

        <View style={styles.rowWrap}>
          {title.genres.map((genre) => (
            <View key={genre} style={styles.pill}>
              <Text style={[styles.pillText, { fontSize: pillFontSize }]}>{genre}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.detail, { fontSize: detailFontSize, lineHeight: detailLineHeight }]}>
          Dir. {title.director}
        </Text>
        <Text style={[styles.detail, { fontSize: detailFontSize, lineHeight: detailLineHeight }]}>
          Con {title.cast.join(", ")}
        </Text>

        <Text style={[styles.platformLabel, { fontSize: platformLabelSize }]}>Disponible en</Text>
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
    justifyContent: "flex-end",
  },
  heroImage: {
    opacity: 0.96,
  },
  heroOverlay: {
    justifyContent: "flex-end",
  },
  heroTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    marginBottom: spacing.sm,
  },
  heroTagText: {
    ...typography.badgeLabel,
    color: colors.text,
  },
  name: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 31,
    fontFamily: fontFamilies.extraBold,
  },
  meta: {
    color: "rgba(246, 247, 242, 0.86)",
    marginTop: 6,
  },
  body: {
  },
  blurb: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.sm,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    ...typography.badgeLabel,
    color: colors.textMuted,
  },
  detail: {
    color: colors.text,
    marginBottom: 4,
  },
  platformLabel: {
    ...typography.badgeLabel,
    color: colors.accent,
    marginTop: 8,
    marginBottom: 8,
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
