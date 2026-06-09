import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

function formatPreferenceList(items: string[]) {
  return items.length > 0 ? items.join(" / ") : "Sin definir";
}

export function SettingsScreen() {
  const state = useAppStore((store) => store);
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(state.userName);
  const [draftEmail, setDraftEmail] = useState(state.userEmail);

  useEffect(() => {
    if (!isEditing) {
      setDraftName(state.userName);
      setDraftEmail(state.userEmail);
    }
  }, [isEditing, state.userEmail, state.userName]);

  const cancelEditing = () => {
    setDraftName(state.userName);
    setDraftEmail(state.userEmail);
    setIsEditing(false);
  };

  const saveProfile = () => {
    state.updateProfile({
      name: draftName,
      email: draftEmail,
    });
    setIsEditing(false);
  };

  return (
    <Screen>
      <SectionHeading
        eyebrow="Perfil"
        title="Tu cuenta y tus preferencias."
        body="Edita tus datos, revisa tu actividad y ajusta tus gustos desde un solo lugar."
      />

      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{(state.userName.trim()[0] ?? "N").toUpperCase()}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{state.userName || "Invitado"}</Text>
            <Text style={styles.profileEmail}>{state.userEmail || "Sin mail cargado"}</Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <View>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Tu nombre"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                selectionColor={colors.accent}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Mail</Text>
              <TextInput
                value={draftEmail}
                onChangeText={setDraftEmail}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                selectionColor={colors.accent}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inlineActions}>
              <AccentButton
                label="Cancelar"
                variant="secondary"
                style={styles.inlineAction}
                onPress={cancelEditing}
              />
              <AccentButton
                label="Guardar"
                variant="success"
                style={styles.inlineAction}
                onPress={saveProfile}
              />
            </View>
          </View>
        ) : (
          <AccentButton
            label="Editar perfil"
            variant="secondary"
            fullWidth
            onPress={() => setIsEditing(true)}
          />
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{state.watchlistIds.length}</Text>
          <Text style={styles.statLabel}>Guardados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{state.seenIds.length}</Text>
          <Text style={styles.statLabel}>Vistos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{state.dismissedIds.length}</Text>
          <Text style={styles.statLabel}>Descartados</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferencias activas</Text>

        <Text style={styles.label}>Plataformas</Text>
        <Text style={styles.value}>{formatPreferenceList(state.selectedPlatforms)}</Text>

        <Text style={styles.label}>Generos</Text>
        <Text style={styles.value}>{formatPreferenceList(state.selectedGenres)}</Text>

        <Text style={styles.label}>Directores</Text>
        <Text style={styles.value}>{formatPreferenceList(state.selectedDirectors)}</Text>

        <Text style={styles.label}>Actores</Text>
        <Text style={styles.value}>{formatPreferenceList(state.selectedActors)}</Text>
      </View>

      <View style={styles.buttonStack}>
        <AccentButton
          label="Restablecer descartes"
          variant="secondary"
          fullWidth
          onPress={state.clearDismissed}
        />
        <AccentButton
          label="Vaciar mi lista"
          variant="secondary"
          fullWidth
          onPress={state.clearWatchlist}
        />
        <AccentButton
          label="Reconfigurar onboarding"
          variant="ghost"
          fullWidth
          onPress={state.restartOnboarding}
        />
        <AccentButton label="Cerrar sesion" variant="danger" fullWidth onPress={state.logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    ...typography.titleSmall,
    color: colors.background,
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...typography.titleSmall,
    color: colors.text,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  editForm: {
    gap: spacing.md,
  },
  inputLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  inlineActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  inlineAction: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  statValue: {
    ...typography.titleMedium,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    ...typography.titleSmall,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.eyebrow,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.value,
    color: colors.text,
  },
  buttonStack: {
    gap: spacing.sm,
  },
});
