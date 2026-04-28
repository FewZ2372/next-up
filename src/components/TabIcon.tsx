import Svg, { Circle, Path } from "react-native-svg";

type TabIconName = "home" | "watch" | "watchlist" | "alerts" | "settings";

interface TabIconProps {
  name: TabIconName;
  color: string;
  size?: number;
}

export function TabIcon({ name, color, size = 22 }: TabIconProps) {
  const strokeWidth = 1.9;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === "home" ? (
        <Path
          d="M12 3.5 13.9 8.1 18.5 10 13.9 11.9 12 16.5 10.1 11.9 5.5 10 10.1 8.1 12 3.5Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {name === "watch" ? (
        <>
          <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
          <Path
            d="M10 8.8 15.2 12 10 15.2V8.8Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}

      {name === "watchlist" ? (
        <Path
          d="M8 4.5h8a1.5 1.5 0 0 1 1.5 1.5v13l-5.5-3-5.5 3V6A1.5 1.5 0 0 1 8 4.5Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {name === "alerts" ? (
        <>
          <Path
            d="M8.2 16.3h7.6l-1-1.2a4.3 4.3 0 0 1-1-2.7v-1.1a3.8 3.8 0 1 0-7.6 0v1.1c0 1-.3 1.9-1 2.7l-1 1.2h4Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M10 18.2a2.2 2.2 0 0 0 4 0"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}

      {name === "settings" ? (
        <>
          <Path d="M5 7h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path d="M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path d="M5 17h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Circle cx="9" cy="7" r="1.6" fill={color} />
          <Circle cx="15" cy="12" r="1.6" fill={color} />
          <Circle cx="11" cy="17" r="1.6" fill={color} />
        </>
      ) : null}
    </Svg>
  );
}
