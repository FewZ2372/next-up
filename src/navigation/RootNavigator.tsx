import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthScreen } from "../screens/auth/AuthScreen";
import { TabIcon } from "../components/TabIcon";
import { PreferencesScreen } from "../screens/onboarding/PreferencesScreen";
import { RecapScreen } from "../screens/onboarding/RecapScreen";
import { HomeScreen } from "../screens/tabs/HomeScreen";
import { NotificationsScreen } from "../screens/tabs/NotificationsScreen";
import { SettingsScreen } from "../screens/tabs/SettingsScreen";
import { WatchNowScreen } from "../screens/tabs/WatchNowScreen";
import { WatchlistScreen } from "../screens/tabs/WatchlistScreen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { navigationTheme } from "../theme/navigationTheme";
import { fontFamilies } from "../theme/typography";
import { MainTabParamList, RootStackParamList } from "./types";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, "home" | "watch" | "watchlist" | "alerts" | "settings"> = {
  Home: "home",
  WatchNow: "watch",
  Watchlist: "watchlist",
  Alerts: "alerts",
  Settings: "settings",
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 76,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.medium,
        },
        tabBarIcon: ({ color, size }) => (
          <TabIcon name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="WatchNow" component={WatchNowScreen} options={{ title: "Qué ver" }} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} options={{ title: "Mi lista" }} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} options={{ title: "Alertas" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Ajustes" }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
        }}
      >
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthScreen} />
        ) : !onboardingCompleted ? (
          <>
            <RootStack.Screen name="Preferences" component={PreferencesScreen} />
            <RootStack.Screen name="Recap" component={RecapScreen} />
          </>
        ) : (
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
