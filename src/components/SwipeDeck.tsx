import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Title } from "../types/content";
import { colors, radii, spacing } from "../theme/colors";
import { AccentButton } from "./AccentButton";
import { TitleCard } from "./TitleCard";

type SwipeDirection = "left" | "right" | "down";

interface SwipeAction {
  label: string;
  overlayLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onSwipe: (title: Title) => void;
}

interface SwipeDeckProps {
  cards: Title[];
  leftAction: SwipeAction;
  rightAction: SwipeAction;
  downAction?: SwipeAction;
  emptyTitle?: string;
  emptyBody?: string;
  showActions?: boolean;
  fillAvailableHeight?: boolean;
  preferScrollOnVertical?: boolean;
}

export interface SwipeDeckHandle {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeDown: () => void;
}

const HORIZONTAL_SWIPE_THRESHOLD = 110;
const DOWN_SWIPE_THRESHOLD = 130;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const SwipeDeck = forwardRef<SwipeDeckHandle, SwipeDeckProps>(function SwipeDeck({
  cards,
  leftAction,
  rightAction,
  downAction,
  emptyTitle = "No hay más resultados con esta combinación.",
  emptyBody = "Ajustar el estado de ánimo o revisar los filtros puede ampliar la selección.",
  showActions = true,
  fillAvailableHeight = true,
  preferScrollOnVertical = false,
}: SwipeDeckProps, ref) {
  const position = useRef(new Animated.ValueXY()).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  const topCard = cards[0];
  const secondCard = cards[1];
  const actionMap: Record<SwipeDirection, SwipeAction | undefined> = {
    left: leftAction,
    right: rightAction,
    down: downAction,
  };

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    setIsAnimating(false);
  }, [position, topCard?.id]);

  useImperativeHandle(
    ref,
    () => ({
      swipeLeft: () => forceSwipe("left"),
      swipeRight: () => forceSwipe("right"),
      swipeDown: () => {
        if (downAction) {
          forceSwipe("down");
        }
      },
    }),
    [downAction, topCard, isAnimating],
  );

  const forceSwipe = (direction: SwipeDirection) => {
    if (!topCard || isAnimating || !actionMap[direction]) {
      return;
    }

    setIsAnimating(true);

    const toValue =
      direction === "right"
        ? { x: SCREEN_WIDTH * 1.2, y: 0 }
        : direction === "left"
          ? { x: -SCREEN_WIDTH * 1.2, y: 0 }
          : { x: 0, y: SCREEN_HEIGHT * 0.85 };

    Animated.timing(position, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setIsAnimating(false);
      actionMap[direction]?.onSwipe(topCard);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 6,
    }).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Boolean(topCard) &&
      !isAnimating &&
      (
        Math.abs(gestureState.dx) > 6 ||
        (!preferScrollOnVertical && Math.abs(gestureState.dy) > 6) ||
        (Boolean(downAction) &&
          gestureState.dy > 36 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.25)
      ),
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      const horizontalDistance = Math.abs(gestureState.dx);
      const verticalDistance = Math.abs(gestureState.dy);

      if (
        downAction &&
        gestureState.dy > DOWN_SWIPE_THRESHOLD &&
        verticalDistance > horizontalDistance
      ) {
        forceSwipe("down");
      } else if (gestureState.dx > HORIZONTAL_SWIPE_THRESHOLD) {
        forceSwipe("right");
      } else if (gestureState.dx < -HORIZONTAL_SWIPE_THRESHOLD) {
        forceSwipe("left");
      } else {
        resetPosition();
      }
    },
  });

  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ["-16deg", "0deg", "16deg"],
  });

  const saveOpacity = position.x.interpolate({
    inputRange: [0, 90, SCREEN_WIDTH / 2],
    outputRange: [0, 0.6, 1],
    extrapolate: "clamp",
  });

  const skipOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, -90, 0],
    outputRange: [1, 0.6, 0],
    extrapolate: "clamp",
  });

  const seenOpacity = position.y.interpolate({
    inputRange: [0, 90, SCREEN_HEIGHT / 3],
    outputRange: [0, 0.6, 1],
    extrapolate: "clamp",
  });

  if (!topCard) {
    return (
      <View style={[styles.root, !fillAvailableHeight && styles.rootAuto]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyBody}>{emptyBody}</Text>
        </View>
      </View>
    );
  }

  const actions = [
    { key: "left", direction: "left" as const, config: leftAction },
    ...(downAction ? [{ key: "down", direction: "down" as const, config: downAction }] : []),
    { key: "right", direction: "right" as const, config: rightAction },
  ];

  return (
    <View style={[styles.root, !fillAvailableHeight && styles.rootAuto]}>
      <View
        style={[
          styles.stack,
          fillAvailableHeight ? styles.stackFill : styles.stackAuto,
          cardHeight > 0 && { minHeight: cardHeight + 18 },
        ]}
      >
        {secondCard ? (
          <View style={styles.backCard}>
            <TitleCard title={secondCard} />
          </View>
        ) : null}

        <Animated.View
          {...panResponder.panHandlers}
          onLayout={(event) => {
            const measuredHeight = event.nativeEvent.layout.height;
            if (measuredHeight > 0 && Math.abs(measuredHeight - cardHeight) > 1) {
              setCardHeight(measuredHeight);
            }
          }}
          style={[
            styles.frontCard,
            {
              transform: [...position.getTranslateTransform(), { rotate: rotation }],
            },
          ]}
        >
          <Animated.View style={[styles.overlay, styles.overlayLeft, { opacity: skipOpacity }]}>
            <Text style={styles.overlayText}>{leftAction.overlayLabel ?? leftAction.label.toUpperCase()}</Text>
          </Animated.View>

          <Animated.View style={[styles.overlay, styles.overlayRight, { opacity: saveOpacity }]}>
            <Text style={styles.overlayText}>{rightAction.overlayLabel ?? rightAction.label.toUpperCase()}</Text>
          </Animated.View>

          {downAction ? (
            <Animated.View style={[styles.overlay, styles.overlayDown, { opacity: seenOpacity }]}>
              <Text style={styles.overlayText}>{downAction.overlayLabel ?? downAction.label.toUpperCase()}</Text>
            </Animated.View>
          ) : null}

          <TitleCard title={topCard} />
        </Animated.View>
      </View>

      {showActions ? (
        <View style={styles.actions}>
          {actions.map(({ key, direction, config }) => (
            <AccentButton
              key={key}
              label={config.label}
              variant={config.variant}
              style={styles.actionButton}
              onPress={() => forceSwipe(direction)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootAuto: {
    flex: 0,
  },
  stack: {
    minHeight: 0,
    justifyContent: "flex-start",
  },
  stackFill: {
    flex: 1,
  },
  stackAuto: {
    flex: 0,
  },
  frontCard: {
    position: "absolute",
    width: "100%",
  },
  backCard: {
    marginTop: 18,
    transform: [{ scale: 0.97 }],
    opacity: 0.55,
  },
  overlay: {
    position: "absolute",
    top: 18,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 2,
  },
  overlayLeft: {
    left: 18,
    borderColor: colors.danger,
    backgroundColor: "rgba(255, 103, 103, 0.12)",
  },
  overlayRight: {
    right: 18,
    borderColor: colors.accent,
    backgroundColor: "rgba(214, 255, 47, 0.14)",
  },
  overlayDown: {
    alignSelf: "center",
    bottom: 18,
    borderColor: colors.success,
    backgroundColor: "rgba(75, 229, 138, 0.14)",
  },
  overlayText: {
    color: colors.text,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
