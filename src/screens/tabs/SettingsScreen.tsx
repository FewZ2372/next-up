import { StyleSheet, Text, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";

export function SettingsScreen() {
  const state = useAppStore((store) => store);

  return (
    <Screen>
      <SectionHeading
        eyebrow="Configuración"
        title="Tu perfil y tus preferencias."
        body="Plataformas, géneros y referentes en un solo lugar."
      />

      <View style={styles.card}>
        <Text style={styles.label}>Usuario</Text>
        <Text style={styles.value}>{state.userName}</Text>

        <Text style={styles.label}>Plataformas</Text>
        <Text style={styles.value}>
          {state.selectedPlatforms.length > 0 ? state.selectedPlatforms.join(" / ") : "Sin definir"}
        </Text>

        <Text style={styles.label}>Géneros</Text>
        <Text style={styles.value}>
          {state.selectedGenres.length > 0 ? state.selectedGenres.join(" / ") : "Sin definir"}
        </Text>

        <Text style={styles.label}>Directores</Text>
        <Text style={styles.value}>
          {state.selectedDirectors.length > 0 ? state.selectedDirectors.join(" / ") : "Sin definir"}
        </Text>

        <Text style={styles.label}>Actores y actrices</Text>
        <Text style={styles.value}>
          {state.selectedActors.length > 0 ? state.selectedActors.join(" / ") : "Sin definir"}
        </Text>
      </View>

      <View style={styles.buttonStack}>
        <AccentButton label="Restablecer descartes" variant="secondary" fullWidth onPress={state.clearDismissed} />
        <AccentButton label="Vaciar mi lista" variant="ghost" fullWidth onPress={state.clearWatchlist} />
        <AccentButton
          label="Reconfigurar perfil"
          variant="secondary"
          fullWidth
          onPress={state.restartOnboarding}
        />
        <AccentButton label="Cerrar sesión" variant="danger" fullWidth onPress={state.logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
  },
  buttonStack: {
    gap: spacing.sm,
  },
});
