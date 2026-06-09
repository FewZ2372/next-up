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
  const [email, setEmail] = useState("");

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>NEXT UP</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.hero}>
          <SectionHeading
            eyebrow="Bienvenido"
            title="Peliculas y series mejor ordenadas para cada momento."
            body="Una seleccion mas precisa segun tus gustos, tus plataformas y el tipo de historia que te interesa ver hoy."
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
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
            returnKeyType="next"
          />

          <Text style={styles.label}>Mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            selectionColor={colors.accent}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <AccentButton label="Ingresar" fullWidth onPress={() => login(name, email)} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  hero: {
    marginBottom: spacing.lg,
  },
  brand: {
    ...typography.brand,
    color: colors.accent,
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
