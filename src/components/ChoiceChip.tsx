import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../theme/colors";
import { typography } from "../theme/typography";

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function ChoiceChip({ label, selected, onPress }: ChoiceChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selectedChip : styles.idleChip,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : styles.idleLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  idleChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selectedChip: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  label: {
    ...typography.chipLabel,
  },
  idleLabel: {
    color: colors.textMuted,
  },
  selectedLabel: {
    color: colors.accent,
  },
  pressed: {
    opacity: 0.88,
  },
});
