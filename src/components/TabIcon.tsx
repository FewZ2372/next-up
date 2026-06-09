import Svg, { Circle, Path } from "react-native-svg";

type TabIconName = "home" | "watchlist" | "profile";

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

      {name === "watchlist" ? (
        <Path
          d="M8 4.5h8a1.5 1.5 0 0 1 1.5 1.5v13l-5.5-3-5.5 3V6A1.5 1.5 0 0 1 8 4.5Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {name === "profile" ? (
        <>
          <Circle cx="12" cy="8" r="3.2" stroke={color} strokeWidth={strokeWidth} />
          <Path
            d="M6.5 19c1.2-3 3.1-4.5 5.5-4.5s4.3 1.5 5.5 4.5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : null}
    </Svg>
  );
}
