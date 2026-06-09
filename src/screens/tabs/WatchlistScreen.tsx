import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { TitleCard } from "../../components/TitleCard";
import { getTitlesByIds } from "../../data/catalog";
import { WatchlistStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<WatchlistStackParamList, "WatchlistFeed">;

export function WatchlistScreen({ navigation }: Props) {
  const watchlistIds = useAppStore((state) => state.watchlistIds);
  const seenCount = useAppStore((state) => state.seenIds.length);
  const removeFromWatchlist = useAppStore((state) => state.removeFromWatchlist);
  const markTitleSeen = useAppStore((state) => state.markTitleSeen);

  const watchlist = getTitlesByIds(watchlistIds);

  return (
    <Screen>
      <SectionHeading
        eyebrow="Mi lista"
        title="Tus titulos guardados."
        body="Peliculas y series listas para volver sobre ellas cuando quieras."
      />

      <View style={styles.headerActions}>
        <AccentButton
          label="Ya vistas"
          variant="secondary"
          fullWidth
          onPress={() => navigation.navigate("WatchlistSeen")}
        />
        <Text style={styles.headerMeta}>{seenCount} titulos vistos</Text>
      </View>

      {watchlist.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Aun no hay titulos guardados.</Text>
          <Text style={styles.emptyBody}>Los titulos que guardes apareceran en esta lista.</Text>
          <AccentButton
            label="Abrir recomendaciones"
            onPress={() => navigation.getParent()?.navigate("Home", { screen: "HomeDiscover" })}
          />
        </View>
      ) : (
        watchlist.map((title) => (
          <View key={title.id} style={styles.entry}>
            <TitleCard title={title} />
            <View style={styles.entryActions}>
              <AccentButton
                label="Quitar"
                variant="secondary"
                style={styles.entryAction}
                onPress={() => removeFromWatchlist(title.id)}
              />
              <AccentButton
                label="Ya la vi"
                variant="success"
                style={styles.entryAction}
                onPress={() => markTitleSeen(title.id)}
              />
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  headerMeta: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  emptyCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.titleMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  entry: {
    marginBottom: spacing.xl,
  },
  entryActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  entryAction: {
    flex: 1,
  },
});
