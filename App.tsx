import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { WebFullscreenButton } from "./src/components/WebFullscreenButton";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/colors";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
        <WebFullscreenButton />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
