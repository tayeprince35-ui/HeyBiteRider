import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; align?: "center" | "flex-start" };

export default function Logo({ size = 58, align = "center" }: Props) {
  const leaf = size * 0.45;
  const t = {
    fontSize: size,
    lineHeight: size * 1.14,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    letterSpacing: -size * 0.026,
  };

  return (
    <View style={{ alignItems: align }}>
      <View style={styles.row}>
        <Text style={[t, { color: "#FFFFFF" }]}>Hey</Text>
        <Text style={[t, { color: "#4ADE5A" }]}>B</Text>
        <View>
          <View
            style={{
              position: "absolute",
              top: -size * 0.07,
              right: -size * 0.14,
              zIndex: 2,
              transform: [{ rotate: "8deg" }],
            }}
          >
            <Svg width={leaf} height={leaf} viewBox="0 0 24 24">
              <Path d="M3 21C3 11 9 4 21 3C20 15 14 21 5 21Z" fill="#2FBF4A" />
              <Path
                d="M4 20C8 14 12 10 17 7"
                stroke="#04170D"
                strokeWidth={1.2}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </View>
          <Text style={[t, { color: "#4ADE5A" }]}>{"\u0131"}</Text>
        </View>
        <Text style={[t, { color: "#4ADE5A" }]}>te</Text>
      </View>
      <Text
        style={{
          marginTop: size * 0.1,
          fontSize: size * 0.41,
          fontFamily: "PlusJakartaSans_600SemiBold",
          letterSpacing: size * 0.24,
          paddingLeft: size * 0.24,
          color: "#1F9D4A",
        }}
      >
        RIDER
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end" },
});
