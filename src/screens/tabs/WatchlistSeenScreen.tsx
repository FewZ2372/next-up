import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Screen } from "../../components/Screen";
import { TitleCard } from "../../components/TitleCard";
import { getTitlesByIds } from "../../data/catalog";
import { WatchlistStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = NativeStackScreenProps<WatchlistStackParamList, "WatchlistSeen">;

function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5 8 12l7 7"
        stroke={colors.text}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WatchlistSeenScreen({ navigation }: Props) {
  const seenIds = useAppStore((state) => state.seenIds);
  const seenTitles = getTitlesByIds(seenIds);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <BackIcon />
        </Pressable>
        <View style={styles.topBarCopy}>
          <Text style={styles.topBarEyebrow}>Mi lista</Text>
          <Text style={styles.topBarTitle}>Ya vistas</Text>
        </View>
      </View>

      {seenTitles.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Todavia no marcaste titulos como vistos.</Text>
          <Text style={styles.emptyBody}>
            Cuando uses el boton "Ya la vi", esos titulos apareceran aca.
          </Text>
        </View>
      ) : (
        seenTitles.map((title) => (
          <View key={title.id} style={styles.entry}>
            <TitleCard title={title} />
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarCopy: {
    flex: 1,
  },
  topBarEyebrow: {
    ...typography.sectionEyebrow,
    color: colors.accent,
    marginBottom: 2,
  },
  topBarTitle: {
    ...typography.titleMedium,
    color: colors.text,
  },
  emptyCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.titleMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...typography.body,
    color: colors.textMuted,
  },
  entry: {
    marginBottom: spacing.xl,
  },
  pressed: {
    opacity: 0.88,
  },
});
