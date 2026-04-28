import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { TitleCard } from "../../components/TitleCard";
import { getTitlesByIds } from "../../data/catalog";
import { MainTabParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";

type Props = BottomTabScreenProps<MainTabParamList, "Watchlist">;

export function WatchlistScreen({ navigation }: Props) {
  const watchlistIds = useAppStore((state) => state.watchlistIds);
  const removeFromWatchlist = useAppStore((state) => state.removeFromWatchlist);

  const watchlist = getTitlesByIds(watchlistIds);

  return (
    <Screen>
      <SectionHeading
        eyebrow="Mi lista"
        title="Tus títulos guardados."
        body="Películas y series listas para volver sobre ellas cuando quieras."
      />

      {watchlist.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Aún no hay títulos guardados.</Text>
          <Text style={styles.emptyBody}>Los títulos que guardes aparecerán en esta lista.</Text>
          <AccentButton label="Abrir recomendaciones" onPress={() => navigation.navigate("WatchNow")} />
        </View>
      ) : (
        watchlist.map((title) => (
          <View key={title.id} style={styles.entry}>
            <TitleCard title={title} />
            <AccentButton
              label="Quitar"
              variant="ghost"
              fullWidth
              style={styles.removeButton}
              onPress={() => removeFromWatchlist(title.id)}
            />
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  entry: {
    marginBottom: spacing.xl,
  },
  removeButton: {
    marginTop: spacing.md,
  },
});
