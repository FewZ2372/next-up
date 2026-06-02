import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { ChoiceChip } from "../../components/ChoiceChip";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { ACTOR_OPTIONS, DIRECTOR_OPTIONS, GENRE_OPTIONS, PLATFORM_OPTIONS } from "../../data/catalog";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Preferences">;

export function PreferencesScreen({ navigation }: Props) {
  const {
    selectedPlatforms,
    selectedGenres,
    selectedDirectors,
    selectedActors,
    togglePlatform,
    toggleGenre,
    toggleDirector,
    toggleActor,
    prepareRecap,
  } = useAppStore((state) => state);

  const readySummary = `${selectedPlatforms.length} plataformas / ${selectedGenres.length} géneros / ${selectedDirectors.length} directores / ${selectedActors.length} actores`;

  return (
    <Screen>
      <SectionHeading
        eyebrow="Perfil"
        title="Tu perfil inicial."
        body="Plataformas suscritas, géneros y referentes para ordenar mejor tus primeras recomendaciones."
      />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Plataformas suscritas</Text>
        <View style={styles.wrap}>
          {PLATFORM_OPTIONS.map((platform) => (
            <ChoiceChip
              key={platform}
              label={platform}
              selected={selectedPlatforms.includes(platform)}
              onPress={() => togglePlatform(platform)}
            />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Géneros</Text>
        <View style={styles.wrap}>
          {GENRE_OPTIONS.map((genre) => (
            <ChoiceChip
              key={genre}
              label={genre}
              selected={selectedGenres.includes(genre)}
              onPress={() => toggleGenre(genre)}
            />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Directores</Text>
        <View style={styles.wrap}>
          {DIRECTOR_OPTIONS.map((director) => (
            <ChoiceChip
              key={director}
              label={director}
              selected={selectedDirectors.includes(director)}
              onPress={() => toggleDirector(director)}
            />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Actores y actrices</Text>
        <View style={styles.wrap}>
          {ACTOR_OPTIONS.map((actor) => (
            <ChoiceChip
              key={actor}
              label={actor}
              selected={selectedActors.includes(actor)}
              onPress={() => toggleActor(actor)}
            />
          ))}
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Selección actual</Text>
        <Text style={styles.summaryValue}>{readySummary}</Text>
      </View>

      <AccentButton
        label="Continuar"
        fullWidth
        onPress={() => {
          prepareRecap();
          navigation.navigate("Recap");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.lg,
  },
  blockTitle: {
    ...typography.formLabel,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  summary: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.summaryValue,
    color: colors.text,
  },
});
