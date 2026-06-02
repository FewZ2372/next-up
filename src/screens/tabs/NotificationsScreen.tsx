import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { notifications } from "../../data/notifications";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

export function NotificationsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(notifications[0]?.id ?? null);

  return (
    <Screen>
      <SectionHeading
        eyebrow="Alertas"
        title="Actividad reciente"
        body="Cambios de catálogo, estrenos y movimientos relevantes dentro de tus plataformas."
      />

      {notifications.map((notification) => {
        const expanded = expandedId === notification.id;

        return (
          <Pressable
            key={notification.id}
            onPress={() => setExpandedId(expanded ? null : notification.id)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View style={styles.header}>
              <Text style={styles.label}>{notification.label}</Text>
              <Text style={styles.timestamp}>{notification.timestamp}</Text>
            </View>
            <Text style={styles.title}>{notification.title}</Text>
            {expanded ? <Text style={styles.body}>{notification.body}</Text> : null}
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.eyebrow,
    color: colors.accent,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.titleSmall,
    color: colors.text,
  },
  body: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
