import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme/colors";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  body?: string;
}

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <View style={styles.wrapper}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
