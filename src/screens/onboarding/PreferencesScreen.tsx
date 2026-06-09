import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { ChoiceChip } from "../../components/ChoiceChip";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { GENRE_OPTIONS, PLATFORM_OPTIONS } from "../../data/catalog";
import { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "Preferences">;

export function PreferencesScreen({ navigation }: Props) {
  const { selectedPlatforms, selectedGenres, togglePlatform, toggleGenre } = useAppStore(
    (state) => state,
  );

  const readySummary = `${selectedPlatforms.length} plataformas / ${selectedGenres.length} generos`;

  return (
    <Screen>
      <SectionHeading
        eyebrow="Perfil"
        title="Tus plataformas y tus generos."
        body="Elegi primero donde podes mirar y que tipos de historias te interesan. Despues afinamos con directores y actores."
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
        <Text style={styles.blockTitle}>Generos</Text>
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

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Seleccion actual</Text>
        <Text style={styles.summaryValue}>{readySummary}</Text>
      </View>

      <AccentButton
        label="Continuar"
        fullWidth
        onPress={() => navigation.navigate("PreferencesPeople")}
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
