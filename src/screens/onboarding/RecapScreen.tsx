import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

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
      <Screen scroll={false} contentContainerStyle={styles.doneContainer}>
        <View style={styles.doneCard}>
          <SectionHeading
            eyebrow="Puesta al día"
            title="Todo listo para empezar."
            body="Tu perfil inicial ya quedó actualizado."
          />
          <AccentButton label="Volver" fullWidth onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentContainerStyle={styles.screen}>
      <SectionHeading
        eyebrow="Puesta al día"
        title="Historial reciente"
        body={`${recapCursor + 1} de ${total}. Indicá si ya viste este título para ajustar mejor la selección inicial.`}
      />

      <View style={styles.deckArea}>
        <SwipeDeck
          cards={recapCards}
          leftAction={{
            label: "Aún no",
            overlayLabel: "AÚN NO",
            variant: "secondary",
            onSwipe: () => classifyRecapTitle(false),
          }}
          rightAction={{
            label: "Ya lo vi",
            overlayLabel: "YA LO VI",
            onSwipe: () => classifyRecapTitle(true),
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  deckArea: {
    flex: 1,
    minHeight: 0,
  },
  doneContainer: {
    flex: 1,
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
