import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { AccentButton } from "../../components/AccentButton";
import { ChoiceChip } from "../../components/ChoiceChip";
import { Screen } from "../../components/Screen";
import { SwipeDeck, SwipeDeckHandle } from "../../components/SwipeDeck";
import { GENRE_OPTIONS, getEmotionDrivenTitles } from "../../data/catalog";
import { HomeStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { EmotionalProfile } from "../../types/content";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeDiscover">;

const SLIDER_THUMB_SIZE = 22;
const initialProfile: EmotionalProfile = {
  energy: 50,
  tone: 50,
  complexity: 50,
  depth: 50,
};

function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5 8 12l7 7"
        stroke={colors.text}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d={open ? "m6 14 6-6 6 6" : "m6 10 6 6 6-6"}
        stroke={colors.text}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AxisSlider({
  labelLeft,
  labelRight,
  value,
  onChange,
}: {
  labelLeft: string;
  labelRight: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const usableTrackWidth = Math.max(trackWidth - SLIDER_THUMB_SIZE, 0);
  const thumbOffset = usableTrackWidth * (value / 100);
  const fillWidth = thumbOffset + SLIDER_THUMB_SIZE / 2;

  const setValueFromPosition = (positionX: number) => {
    if (trackWidth <= 0) {
      return;
    }

    const clamped = Math.min(Math.max(positionX - SLIDER_THUMB_SIZE / 2, 0), usableTrackWidth);
    const nextValue = Math.round((clamped / Math.max(usableTrackWidth, 1)) * 100);
    onChange(nextValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 2,
      onPanResponderGrant: (event) => {
        setValueFromPosition(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        setValueFromPosition(event.nativeEvent.locationX);
      },
    }),
  ).current;

  return (
    <View style={styles.axisCard}>
      <View style={styles.axisHeader}>
        <Text style={styles.axisLabel}>{labelLeft}</Text>
        <Text style={styles.axisPercent}>{100 - value}% / {value}%</Text>
        <Text style={styles.axisLabel}>{labelRight}</Text>
      </View>

      <Pressable
        style={styles.axisTrackShell}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        onPressIn={(event) => setValueFromPosition(event.nativeEvent.locationX)}
        {...panResponder.panHandlers}
      >
        <View style={styles.axisTrack} />
        <View style={[styles.axisTrackFill, { width: fillWidth }]} />
        <View style={[styles.axisThumb, { left: thumbOffset }]} />
      </Pressable>
    </View>
  );
}

export function HomeDiscoverScreen({ navigation }: Props) {
  const state = useAppStore((store) => store);
  const deckRef = useRef<SwipeDeckHandle>(null);
  const [profile, setProfile] = useState<EmotionalProfile>(initialProfile);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [focusGenres, setFocusGenres] = useState<string[]>([]);

  const recommendations = getEmotionDrivenTitles({
    selectedPlatforms: state.selectedPlatforms,
    selectedGenres: state.selectedGenres,
    selectedDirectors: state.selectedDirectors,
    selectedActors: state.selectedActors,
    hiddenIds: [...state.seenIds, ...state.dismissedIds, ...state.watchlistIds],
    focusGenres,
    emotionalProfile: profile,
  });

  const toggleFocusGenre = (genre: string) => {
    setFocusGenres((current) =>
      current.includes(genre)
        ? current.filter((entry) => entry !== genre)
        : [...current, genre],
    );
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.topArea}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <BackIcon />
          </Pressable>
          <View style={styles.topBarCopy}>
            <Text style={styles.topBarEyebrow}>Inicio</Text>
            <Text style={styles.topBarTitle}>Que ver hoy</Text>
          </View>
        </View>

        <View style={styles.filtersCard}>
          <AxisSlider
            labelLeft="Relajante"
            labelRight="Emocionante"
            value={profile.energy}
            onChange={(value) => setProfile((current) => ({ ...current, energy: value }))}
          />
          <AxisSlider
            labelLeft="Alegre"
            labelRight="Oscuro"
            value={profile.tone}
            onChange={(value) => setProfile((current) => ({ ...current, tone: value }))}
          />
          <AxisSlider
            labelLeft="Sencilla"
            labelRight="Compleja"
            value={profile.complexity}
            onChange={(value) => setProfile((current) => ({ ...current, complexity: value }))}
          />
          <AxisSlider
            labelLeft="Superficiales"
            labelRight="Conmovedoras"
            value={profile.depth}
            onChange={(value) => setProfile((current) => ({ ...current, depth: value }))}
          />

          <View style={styles.genreBlock}>
            <Pressable
              onPress={() => setGenreDropdownOpen((current) => !current)}
              style={({ pressed }) => [styles.genreDropdownTrigger, pressed && styles.pressed]}
            >
              <View>
                <Text style={styles.genreDropdownLabel}>Generos</Text>
                <Text style={styles.genreDropdownValue}>
                  {focusGenres.length > 0 ? `${focusGenres.length} seleccionados` : "Seleccion multiple"}
                </Text>
              </View>
              <ChevronIcon open={genreDropdownOpen} />
            </Pressable>

            {genreDropdownOpen ? (
              <View style={styles.genreDropdownPanel}>
                <View style={styles.genreWrap}>
                  {GENRE_OPTIONS.map((genre) => (
                    <ChoiceChip
                      key={genre}
                      label={genre}
                      selected={focusGenres.includes(genre)}
                      onPress={() => toggleFocusGenre(genre)}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{recommendations.length} opciones disponibles</Text>
            <Text style={styles.metaText}>{state.watchlistIds.length} guardados</Text>
          </View>
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
          fillAvailableHeight={false}
          preferScrollOnVertical
        />
      </View>

      <View style={styles.actions}>
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
    paddingBottom: spacing.lg,
  },
  topArea: {
    paddingBottom: spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarCopy: {
    flex: 1,
  },
  topBarEyebrow: {
    ...typography.sectionEyebrow,
    color: colors.accent,
    marginBottom: 2,
  },
  topBarTitle: {
    ...typography.titleMedium,
    color: colors.text,
  },
  filtersCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    gap: spacing.md,
  },
  axisCard: {
    gap: spacing.sm,
  },
  axisHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  axisLabel: {
    ...typography.captionBold,
    color: colors.text,
    flex: 1,
  },
  axisPercent: {
    ...typography.caption,
    color: colors.textMuted,
  },
  axisTrackShell: {
    height: SLIDER_THUMB_SIZE,
    justifyContent: "center",
  },
  axisTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  axisTrackFill: {
    position: "absolute",
    left: 0,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  axisThumb: {
    position: "absolute",
    width: SLIDER_THUMB_SIZE,
    height: SLIDER_THUMB_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  genreBlock: {
    gap: spacing.sm,
  },
  genreDropdownTrigger: {
    minHeight: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  genreDropdownLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: 2,
  },
  genreDropdownValue: {
    ...typography.bodySmall,
    color: colors.text,
  },
  genreDropdownPanel: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  genreWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  metaText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  deckArea: {
    minHeight: 520,
    marginTop: spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  pressed: {
    opacity: 0.88,
  },
});
