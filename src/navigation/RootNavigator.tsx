import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TabIcon } from "../components/TabIcon";
import { AuthScreen } from "../screens/auth/AuthScreen";
import { PreferencesPeopleScreen } from "../screens/onboarding/PreferencesPeopleScreen";
import { PreferencesScreen } from "../screens/onboarding/PreferencesScreen";
import { RecapScreen } from "../screens/onboarding/RecapScreen";
import { HomeDiscoverScreen } from "../screens/tabs/HomeDiscoverScreen";
import { HomeScreen } from "../screens/tabs/HomeScreen";
import { SettingsScreen } from "../screens/tabs/SettingsScreen";
import { WatchlistSeenScreen } from "../screens/tabs/WatchlistSeenScreen";
import { WatchlistScreen } from "../screens/tabs/WatchlistScreen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { navigationTheme } from "../theme/navigationTheme";
import { fontFamilies } from "../theme/typography";
import {
  HomeStackParamList,
  MainTabParamList,
  RootStackParamList,
  WatchlistStackParamList,
} from "./types";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const WatchlistStack = createNativeStackNavigator<WatchlistStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, "home" | "watchlist" | "profile"> = {
  Home: "home",
  Watchlist: "watchlist",
  Settings: "profile",
};

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <HomeStack.Screen name="HomeFeed" component={HomeScreen} />
      <HomeStack.Screen name="HomeDiscover" component={HomeDiscoverScreen} />
    </HomeStack.Navigator>
  );
}

function WatchlistNavigator() {
  return (
    <WatchlistStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <WatchlistStack.Screen name="WatchlistFeed" component={WatchlistScreen} />
      <WatchlistStack.Screen name="WatchlistSeen" component={WatchlistSeenScreen} />
    </WatchlistStack.Navigator>
  );
}

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
      <Tab.Screen name="Home" component={HomeNavigator} options={{ title: "Inicio" }} />
      <Tab.Screen name="Watchlist" component={WatchlistNavigator} options={{ title: "Mi lista" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Perfil" }} />
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
            <RootStack.Screen name="PreferencesPeople" component={PreferencesPeopleScreen} />
            <RootStack.Screen name="Recap" component={RecapScreen} />
          </>
        ) : (
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
