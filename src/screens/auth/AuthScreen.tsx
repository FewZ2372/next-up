import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function AuthScreen() {
  const login = useAppStore((state) => state.login);
  const [name, setName] = useState("");

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.brand}>NEXT UP</Text>
        <SectionHeading
          eyebrow="Bienvenido"
          title="Películas y series mejor ordenadas para cada momento."
          body="Una selección más precisa según tus gustos, tus plataformas y el tipo de historia que te interesa ver hoy."
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          selectionColor={colors.accent}
        />

        <AccentButton label="Ingresar" fullWidth onPress={() => login(name)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  hero: {
    marginBottom: spacing.xl,
  },
  brand: {
    ...typography.brand,
    color: colors.accent,
    marginBottom: spacing.lg,
  },
  panel: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  label: {
    ...typography.formLabel,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radii.md,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
});
