import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";

import { AccentButton } from "../../components/AccentButton";
import { Screen } from "../../components/Screen";
import { SectionHeading } from "../../components/SectionHeading";
import { SwipeDeck } from "../../components/SwipeDeck";
import { getTitlesByIds } from "../../data/catalog";
import { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { colors, radii, spacing } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Recap">;

export function RecapScreen({ navigation }: Props) {
  const recapQueueIds = useAppStore((state) => state.recapQueueIds);
  const recapCursor = useAppStore((state) => state.recapCursor);
  const classifyRecapTitle = useAppStore((state) => state.classifyRecapTitle);

  const recapTitles = getTitlesByIds(recapQueueIds);
  const currentTitle = recapTitles[recapCursor];
  const recapCards = recapTitles.slice(recapCursor);
  const total = recapTitles.length;

  if (!currentTitle) {
    return (
      <Screen contentContainerStyle={styles.doneContainer}>
        <View style={styles.doneCard}>
          <SectionHeading
            eyebrow="Puesta al dia"
            title="Todo listo para empezar."
            body="Tu perfil inicial ya quedo actualizado."
          />
          <AccentButton label="Volver" fullWidth onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen contentContainerStyle={styles.screen}>
      <SectionHeading
        eyebrow="Puesta al dia"
        title="Historial reciente"
        body={`${recapCursor + 1} de ${total}. Indica si ya viste este titulo para ajustar mejor la seleccion inicial.`}
      />

      <View style={styles.deckArea}>
        <SwipeDeck
          cards={recapCards}
          leftAction={{
            label: "Aun no",
            overlayLabel: "AUN NO",
            variant: "secondary",
            onSwipe: () => classifyRecapTitle(false),
          }}
          rightAction={{
            label: "Ya lo vi",
            overlayLabel: "YA LO VI",
            onSwipe: () => classifyRecapTitle(true),
          }}
          fillAvailableHeight={false}
          preferScrollOnVertical
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: spacing.lg,
  },
  deckArea: {
    minHeight: 520,
    marginTop: spacing.md,
  },
  doneContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  doneCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.xl,
  },
});
