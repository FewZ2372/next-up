import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { notifications } from "../../data/notifications";
import { colors, radii, spacing } from "../../theme/colors";

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
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
});
