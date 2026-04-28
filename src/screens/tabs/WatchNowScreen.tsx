import { BottomTabScreenProps, useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ChoiceChip } from "../../components/ChoiceChip";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { AccentButton } from "../../components/AccentButton";
import { SwipeDeck, SwipeDeckHandle } from "../../components/SwipeDeck";
import { getRecommendedTitles } from "../../data/catalog";
import { moods } from "../../data/moods";
import { MainTabParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";

type Props = BottomTabScreenProps<MainTabParamList, "WatchNow">;
const ACTION_BAR_HEIGHT = 112;

export function WatchNowScreen(_: Props) {
  const state = useAppStore((store) => store);
  const tabBarHeight = useBottomTabBarHeight();
  const deckRef = useRef<SwipeDeckHandle>(null);

  const recommendations = getRecommendedTitles({
    selectedPlatforms: state.selectedPlatforms,
    selectedGenres: state.selectedGenres,
    selectedDirectors: state.selectedDirectors,
    selectedActors: state.selectedActors,
    hiddenIds: [...state.seenIds, ...state.dismissedIds, ...state.watchlistIds],
    mood: state.currentMood,
  });

  return (
    <Screen scroll={false} contentContainerStyle={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + ACTION_BAR_HEIGHT + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeading
          eyebrow="Qué ver"
          title="Una selección pensada para hoy."
          body="Películas y series ordenadas según el ánimo del momento, tus géneros y tus referentes."
        />

        <View style={styles.moodPanel}>
          <Text style={styles.moodLabel}>Estado de ánimo</Text>
          <View style={styles.wrap}>
            {moods.map((mood) => (
              <ChoiceChip
                key={mood.id}
                label={mood.label}
                selected={state.currentMood === mood.id}
                onPress={() => state.setMood(mood.id)}
              />
            ))}
          </View>
          <Text style={styles.moodPrompt}>
            {moods.find((mood) => mood.id === state.currentMood)?.prompt}
          </Text>
        </View>

        <View style={styles.countRow}>
          <Text style={styles.countLabel}>{recommendations.length} opciones disponibles</Text>
          <Text style={styles.countLabel}>{state.watchlistIds.length} guardados</Text>
        </View>

        <SwipeDeck
          ref={deckRef}
          cards={recommendations}
          leftAction={{
            label: "Pasar",
            overlayLabel: "PASAR",
            variant: "secondary",
            onSwipe: (title) => state.dismissTitle(title.id),
          }}
          downAction={{
            label: "Ya la vi",
            overlayLabel: "YA LA VI",
            variant: "ghost",
            onSwipe: (title) => state.markTitleSeen(title.id),
          }}
          rightAction={{
            label: "Guardar",
            overlayLabel: "GUARDAR",
            onSwipe: (title) => state.addToWatchlist(title.id),
          }}
          showActions={false}
          fillAvailableHeight={false}
          preferScrollOnVertical
        />
      </ScrollView>

      <View style={[styles.floatingActions, { bottom: tabBarHeight + spacing.md }]}>
        <AccentButton
          label="Pasar"
          variant="secondary"
          style={styles.actionButton}
          onPress={() => deckRef.current?.swipeLeft()}
        />
        <AccentButton
          label="Ya la vi"
          variant="ghost"
          style={styles.actionButton}
          onPress={() => deckRef.current?.swipeDown()}
        />
        <AccentButton
          label="Guardar"
          style={styles.actionButton}
          onPress={() => deckRef.current?.swipeRight()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  moodPanel: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  moodLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moodPrompt: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  countLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  floatingActions: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
