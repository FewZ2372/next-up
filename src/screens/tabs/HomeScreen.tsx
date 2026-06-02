import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { newsFeed } from "../../data/news";
import { MainTabParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const userName = useAppStore((state) => state.userName);
  const watchlistCount = useAppStore((state) => state.watchlistIds.length);

  return (
    <Screen>
      <SectionHeading
        eyebrow="Inicio"
        title={`Resumen de hoy, ${userName}.`}
        body="Películas, series y novedades de catálogo reunidas en un solo lugar."
      />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Tu próxima elección</Text>
        <Text style={styles.heroBody}>Una selección afinada para ver ahora, guardar o retomar después.</Text>
        <View style={styles.heroFooter}>
          <AccentButton label="¿Qué vemos hoy?" onPress={() => navigation.navigate("WatchNow")} />
          <Text style={styles.heroMeta}>{watchlistCount} títulos guardados</Text>
        </View>
      </View>

      <SectionHeading
        eyebrow="Novedades"
        title="Lo más relevante del día"
        body="Estrenos, movimientos de catálogo y actualizaciones recientes en tus plataformas."
      />

      {newsFeed.map((item) => (
        <View key={item.id} style={styles.feedCard}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedCategory}>{item.category}</Text>
            <Text style={styles.feedTimestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.feedTitle}>{item.title}</Text>
          <Text style={styles.feedBody}>{item.summary}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  heroTitle: {
    ...typography.titleMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  heroBody: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  heroFooter: {
    gap: spacing.sm,
  },
  heroMeta: {
    ...typography.captionBold,
    color: colors.accent,
  },
  feedCard: {
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  feedCategory: {
    ...typography.eyebrow,
    color: colors.accent,
  },
  feedTimestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  feedTitle: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  feedBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
