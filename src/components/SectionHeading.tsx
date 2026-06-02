import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme/colors";
import { typography } from "../theme/typography";

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
    ...typography.sectionEyebrow,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.titleLarge,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
