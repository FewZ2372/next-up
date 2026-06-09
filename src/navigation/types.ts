import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: undefined;
  Preferences: undefined;
  PreferencesPeople: undefined;
  Recap: undefined;
  MainTabs: undefined;
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  HomeDiscover: undefined;
};

export type WatchlistStackParamList = {
  WatchlistFeed: undefined;
  WatchlistSeen: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Watchlist: NavigatorScreenParams<WatchlistStackParamList> | undefined;
  Settings: undefined;
};
