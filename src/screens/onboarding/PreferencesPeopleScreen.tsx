import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { AccentButton } from "../../components/AccentButton";
import { ChoiceChip } from "../../components/ChoiceChip";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import {
  ACTOR_OPTIONS,
  DIRECTOR_OPTIONS,
  FEATURED_ACTOR_OPTIONS,
  FEATURED_DIRECTOR_OPTIONS,
} from "../../data/catalog";
import { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<RootStackParamList, "PreferencesPeople">;

function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="6.5" stroke={colors.textMuted} strokeWidth={1.8} />
      <Path
        d="M16 16 20 20"
        stroke={colors.textMuted}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const normalizeQuery = (value: string) => value.trim().toLowerCase();

export function PreferencesPeopleScreen({ navigation }: Props) {
  const {
    selectedDirectors,
    selectedActors,
    toggleDirector,
    toggleActor,
    prepareRecap,
  } = useAppStore((state) => state);
  const [directorQuery, setDirectorQuery] = useState("");
  const [actorQuery, setActorQuery] = useState("");

  const filteredDirectors = DIRECTOR_OPTIONS.filter((director) =>
    normalizeQuery(director).includes(normalizeQuery(directorQuery)),
  ).slice(0, 8);
  const filteredActors = ACTOR_OPTIONS.filter((actor) =>
    normalizeQuery(actor).includes(normalizeQuery(actorQuery)),
  ).slice(0, 8);

  const selectionSummary = `${selectedDirectors.length} directores / ${selectedActors.length} actores`;

  return (
    <Screen>
      <SectionHeading
        eyebrow="Referentes"
        title="Directores y actores."
        body="Marca algunos nombres clave y usa la busqueda si queres sumar referentes que no aparecen entre los tags iniciales."
      />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Directores</Text>
        <View style={styles.wrap}>
          {FEATURED_DIRECTOR_OPTIONS.map((director) => (
            <ChoiceChip
              key={director}
              label={director}
              selected={selectedDirectors.includes(director)}
              onPress={() => toggleDirector(director)}
            />
          ))}
        </View>

        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            value={directorQuery}
            onChangeText={setDirectorQuery}
            placeholder="Buscar director"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {directorQuery ? (
          <View style={styles.resultsBlock}>
            <Text style={styles.resultsLabel}>Resultados</Text>
            <View style={styles.wrap}>
              {filteredDirectors.length > 0 ? (
                filteredDirectors.map((director) => (
                  <ChoiceChip
                    key={director}
                    label={director}
                    selected={selectedDirectors.includes(director)}
                    onPress={() => toggleDirector(director)}
                  />
                ))
              ) : (
                <Text style={styles.emptySearchText}>No encontramos directores con esa busqueda.</Text>
              )}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Actores</Text>
        <View style={styles.wrap}>
          {FEATURED_ACTOR_OPTIONS.map((actor) => (
            <ChoiceChip
              key={actor}
              label={actor}
              selected={selectedActors.includes(actor)}
              onPress={() => toggleActor(actor)}
            />
          ))}
        </View>

        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            value={actorQuery}
            onChangeText={setActorQuery}
            placeholder="Buscar actor o actriz"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {actorQuery ? (
          <View style={styles.resultsBlock}>
            <Text style={styles.resultsLabel}>Resultados</Text>
            <View style={styles.wrap}>
              {filteredActors.length > 0 ? (
                filteredActors.map((actor) => (
                  <ChoiceChip
                    key={actor}
                    label={actor}
                    selected={selectedActors.includes(actor)}
                    onPress={() => toggleActor(actor)}
                  />
                ))
              ) : (
                <Text style={styles.emptySearchText}>No encontramos actores con esa busqueda.</Text>
              )}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Seleccion actual</Text>
        <Text style={styles.summaryValue}>{selectionSummary}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backButtonLabel}>Volver</Text>
        </Pressable>
        <AccentButton
          label="Continuar"
          fullWidth
          style={styles.primaryAction}
          onPress={() => {
            prepareRecap();
            navigation.navigate("Recap");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.xl,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 0,
  },
  resultsBlock: {
    marginTop: spacing.md,
  },
  resultsLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  emptySearchText: {
    ...typography.bodySmall,
    color: colors.textMuted,
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
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  backButtonLabel: {
    ...typography.buttonLabel,
    color: colors.text,
  },
  primaryAction: {
    width: "100%",
  },
  pressed: {
    opacity: 0.88,
  },
});
