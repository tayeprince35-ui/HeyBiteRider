import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const COLORS = {
  bg: "#04170D",
  white: "#FFFFFF",
  green: "#4ADE5A",
  greenDark: "#1F9D4A",
  track: "rgba(74, 222, 90, 0.18)",
};

const riderImage = require("./../../assets/rider.png");

function Leaf({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 21C3 11 9 4 21 3C20 15 14 21 5 21C4.3 21 3.6 21 3 21Z"
        fill="#2FBF4A"
      />
      <Path
        d="M4 20C8 14 12 10 17 7"
        stroke="#04170D"
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function Logo() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoRow}>
        <Text style={[styles.logoText, { color: COLORS.white }]}>Hey</Text>
        <Text style={[styles.logoText, { color: COLORS.green }]}>B</Text>

        <View>
          <View style={styles.leaf}>
            <Leaf />
          </View>
          <Text style={[styles.logoText, { color: COLORS.green }]}>
            {"\u0131"}
          </Text>
        </View>

        <Text style={[styles.logoText, { color: COLORS.green }]}>te</Text>
      </View>

      <Text style={styles.riderLabel}>RIDER</Text>
    </View>
  );
}

function Waves() {
  const waveHeight = height * 0.2;

  return (
    <Svg
      width={width}
      height={waveHeight}
      viewBox="0 0 650 280"
      preserveAspectRatio="none"
      style={styles.waves}
    >
      <Path
        d="M0 25 C90 -15 190 -5 290 55 C400 120 520 150 650 95 L650 280 L0 280 Z"
        fill="#0D4425"
      />

      <Path
        d="M0 130 C90 100 200 110 300 165 C400 220 480 270 560 280 L0 280 Z"
        fill="#155C30"
      />

      <Path
        d="M650 105 C560 150 470 200 380 175 C470 230 560 280 650 280 Z"
        fill="#06200F"
      />

      <Path
        d="M340 125 C450 135 580 100 650 0"
        stroke={COLORS.greenDark}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 2500,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) {
        router.replace("/onboarding");
      }
    });

    return () => {
      animation.stop();
    };
  }, [progress]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />

      <View style={styles.content}>
        <Logo />

        <Image
          source={riderImage}
          style={styles.rider}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>
          Good food. Faster.{"\n"}Delivering happiness.
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: fillWidth },
            ]}
          />
        </View>
      </View>

      <Waves />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.2,
  },

  logoWrap: {
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  logoText: {
    fontSize: 58,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 66,
  },

  leaf: {
    position: "absolute",
    top: -4,
    right: -8,
    zIndex: 2,
    transform: [{ rotate: "8deg" }],
  },

  riderLabel: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 14,
    paddingLeft: 14,
    color: COLORS.greenDark,
  },

  rider: {
    width: width * 0.62,
    height: width * 0.46,
    marginTop: height * 0.07,
  },

  tagline: {
    marginTop: height * 0.04,
    fontSize: 21,
    lineHeight: 30,
    textAlign: "center",
    color: COLORS.white,
    fontWeight: "300",
    letterSpacing: 0.3,
  },

  progressTrack: {
    marginTop: height * 0.05,
    width: 84,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.track,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },

  waves: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});