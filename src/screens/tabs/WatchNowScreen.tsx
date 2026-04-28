import { BottomTabScreenProps, useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { ChoiceChip } from "../../components/ChoiceChip";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
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
  const [showMoodModal, setShowMoodModal] = useState(true);

  const recommendations = getRecommendedTitles({
    selectedPlatforms: state.selectedPlatforms,
    selectedGenres: state.selectedGenres,
    selectedDirectors: state.selectedDirectors,
    selectedActors: state.selectedActors,
    hiddenIds: [...state.seenIds, ...state.dismissedIds, ...state.watchlistIds],
    mood: state.currentMood,
  });

  const currentMoodLabel = moods.find((mood) => mood.id === state.currentMood)?.label ?? "Sin filtro";

  return (
    <Screen scroll={false} contentContainerStyle={styles.screen}>
      <View style={styles.topArea}>
        <SectionHeading
          eyebrow="Qué ver"
          title="Una selección pensada para hoy."
          body="Películas y series ordenadas según tus géneros, tus referentes y el tono que quieras priorizar."
        />

        <View style={styles.infoRow}>
          <View style={styles.countGroup}>
            <Text style={styles.countLabel}>{recommendations.length} opciones disponibles</Text>
            <Text style={styles.countLabel}>{state.watchlistIds.length} guardados</Text>
          </View>
          <Pressable
            onPress={() => setShowMoodModal(true)}
            style={({ pressed }) => [styles.moodTrigger, pressed && styles.moodTriggerPressed]}
          >
            <Text style={styles.moodTriggerLabel}>Estado de ánimo</Text>
            <Text style={styles.moodTriggerValue}>{currentMoodLabel}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.deckArea}>
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
          fillAvailableHeight
        />
      </View>

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

      {showMoodModal ? (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEyebrow}>Estado de ánimo</Text>
            <Text style={styles.modalTitle}>¿Qué tono querés priorizar hoy?</Text>
            <Text style={styles.modalBody}>
              Elegí una opción para reordenar la selección. También podés continuar sin filtro.
            </Text>

            <View style={styles.wrap}>
              {moods.map((mood) => (
                <ChoiceChip
                  key={mood.id}
                  label={mood.label}
                  selected={state.currentMood === mood.id}
                  onPress={() => {
                    state.setMood(mood.id);
                    setShowMoodModal(false);
                  }}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <AccentButton
                label="Cancelar"
                variant="secondary"
                style={styles.modalActionButton}
                onPress={() => {
                  state.setMood(null);
                  setShowMoodModal(false);
                }}
              />
            </View>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topArea: {
    paddingBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  countGroup: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  moodTrigger: {
    minWidth: 144,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  moodTriggerPressed: {
    opacity: 0.92,
  },
  moodTriggerLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  moodTriggerValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  countLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  deckArea: {
    flex: 1,
    minHeight: 0,
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 5, 5, 0.72)",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: ACTION_BAR_HEIGHT + spacing.xl,
  },
  modalCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
  },
  modalEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  modalBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalActions: {
    marginTop: spacing.md,
  },
  modalActionButton: {
    width: "100%",
  },
});
