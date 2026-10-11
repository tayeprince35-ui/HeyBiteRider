import Logo from "@/components/Logo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageSourcePropType,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Scales sizes down on short screens, never up on tall ones
const sc = (n: number) =>
  Math.round(n * Math.min(Math.max(height / 844, 0.8), 1));

const C = {
  bg: "#04170D",
  green: "#1FD66B",
  greenBright: "#4ADE5A",
  iconBg: "#0F3D25",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
};

type Icon = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

type Slide = {
  image: ImageSourcePropType;
  titleWhite: string; // {name} is replaced with driverName
  titleGreen: string;
  subtitle: string;
  headerAction: "Skip" | "Done";
  cta: { label: string; flag?: boolean };
  footer: { text: string; link: string; action: "login" | "dashboard" };
  features?: { icon: Icon; title: string; desc: string; naira?: boolean }[];
  checklist?: string[];
};

export const SLIDES: Slide[] = [
  {
    image: require("./../../assets/images/onboarding-1.png"),
    titleWhite: "Be a part of",
    titleGreen: "something bigger",
    subtitle:
      "Deliver great food, earn well and make a difference — one order at a time.",
    headerAction: "Skip",
    cta: { label: "Next" },
    footer: {
      text: "Already have an account? ",
      link: "Log in",
      action: "login",
    },
    features: [
      {
        icon: "lightning-bolt-outline",
        title: "Flexible Work",
        desc: "Choose when you want to ride.",
      },
      {
        icon: "sack-outline",
        title: "Good Earnings",
        desc: "Get paid for every delivery.",
        naira: true,
      },
      {
        icon: "shield-check-outline",
        title: "Safe & Supported",
        desc: "We've got your back, always.",
      },
    ],
  },
  {
    image: require("./../../assets/images/onboarding-2.png"),
    titleWhite: "Stay Connected,",
    titleGreen: "Ride Smart",
    subtitle: "Track orders, map your routes, and manage your day with ease.",
    headerAction: "Skip",
    cta: { label: "Next" },
    footer: {
      text: "Already have an account? ",
      link: "Log in",
      action: "login",
    },
    features: [
      {
        icon: "cellphone-wireless",
        title: "Real-time Tracking",
        desc: "View active orders in-app.",
      },
      {
        icon: "account-group-outline",
        title: "Supportive Community",
        desc: "Connect with a powerful team.",
      },
      {
        icon: "map-marker-path",
        title: "Efficient Routing",
        desc: "Optimized paths to save time.",
      },
    ],
  },
  {
    image: require("./../../assets/images/onboarding-3.png"),
    titleWhite: "You’re all set, {name}!",
    titleGreen: "Welcome to the Team!",
    subtitle:
      "Your documents are reviewed and approved. Get ready to receive your first delivery request.",
    headerAction: "Done",
    cta: { label: "Get Started", flag: true },
    footer: { text: "Open ", link: "Rider Dashboard", action: "dashboard" },
    checklist: [
      "Account Verified",
      "Documents Approved",
      "Rider Bag & Gear Collected",
    ],
  },
];

type Props = {
  driverName?: string;
  initialStep?: number;
  onFinish?: () => void; // Next on the last slide ("Get Started")
  onSkip?: () => void; // "Skip" and "Done"
  onLogin?: () => void;
  onDashboard?: () => void;
};

export default function OnboardingScreen({
  driverName = "Rider",
  initialStep = 0,
  onFinish,
  onSkip,
  onLogin,
  onDashboard,
}: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(initialStep);
  const fade = useRef(new Animated.Value(1)).current;

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;
  const onFooter = slide.footer.action === "login" ? onLogin : onDashboard;

  const goTo = (next: number) => {
    if (next === step) return;
    Animated.timing(fade, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setStep(next);
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (isLast) router.push("/(auth)/signup");
    else goTo(step + 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HERO: takes whatever space the content below doesn't need */}
      <View style={styles.heroArea}>
        <Animated.Image
          source={slide.image}
          style={[styles.hero, { opacity: fade }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[C.bg, "rgba(4,23,13,0)"]}
          style={[styles.fadeTop, { height: insets.top + 90 }]}
        />
        <LinearGradient
          colors={["rgba(4,23,13,0)", "rgba(4,23,13,0.9)", C.bg]}
          locations={[0, 0.65, 1]}
          style={styles.fadeBottom}
        />

        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Logo size={sc(34)} align="flex-start" />
          <View style={styles.headerRight}>
            {slide.headerAction === "Done" && (
              <View style={styles.miniTrack}>
                <View style={styles.miniFill} />
              </View>
            )}
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={styles.skip}>{slide.headerAction}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* CONTENT */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fade, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <Text
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {slide.titleWhite.replace("{name}", driverName)}
        </Text>
        <Text
          style={[styles.title, { color: C.green }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {slide.titleGreen}
        </Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        {slide.features && (
          <View style={styles.features}>
            {slide.features.map((f, i) => (
              <React.Fragment key={f.title}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.feature}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons
                      name={f.icon}
                      size={sc(26)}
                      color={
                        f.icon === "lightning-bolt-outline"
                          ? C.greenBright
                          : C.white
                      }
                    />
                    {f.naira && <Text style={styles.naira}>₦</Text>}
                  </View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}

        {slide.checklist && (
          <View style={styles.checklistRow}>
            <View style={styles.clipboard}>
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={sc(64)}
                color={C.greenBright}
              />
            </View>
            <View style={styles.checkItems}>
              {slide.checklist.map((item) => (
                <View key={item} style={styles.checkItem}>
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={C.greenBright}
                  />
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>

      {/* FOOTER: stays put while content fades */}
      <View style={[styles.footerWrap, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              hitSlop={10}
              style={styles.dotHit}
            >
              <View style={[styles.dot, i === step && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <LinearGradient
            colors={["#34DB7F", "#12C860"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{slide.cta.label}</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color={C.bg} />
            {slide.cta.flag && (
              <MaterialCommunityIcons
                name="flag-checkered"
                size={30}
                color={C.bg}
                style={styles.flag}
              />
            )}
          </LinearGradient>
        </Pressable>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Svg
        width={width}
        height={80}
        viewBox="0 0 650 90"
        preserveAspectRatio="none"
        style={styles.wave}
        pointerEvents="none"
      >
        <Path
          d="M0 50 C150 0 300 20 450 60 S600 70 650 30 L650 90 L0 90 Z"
          fill="rgba(31,157,74,0.10)"
        />
        <Path
          d="M0 70 C200 30 400 90 650 20"
          stroke="rgba(31,157,74,0.35)"
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Hero
  heroArea: { flex: 1, minHeight: height * 0.3 },
  hero: { ...StyleSheet.absoluteFill, width: "100%", height: "100%" },
  fadeTop: { position: "absolute", top: 0, left: 0, right: 0 },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  footerLink: {
    color: C.greenBright,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  skip: {
    color: C.white,
    fontSize: 15,
    opacity: 0.9,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  miniTrack: {
    width: 70,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  miniFill: {
    width: "45%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.6)",
  },

  // Content
  content: { paddingHorizontal: 24, marginTop: -sc(36) },
  title: {
    color: C.white,
    fontSize: sc(30),
    lineHeight: sc(36),
    fontFamily: "PlusJakartaSans_800ExtraBold",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  features: { flexDirection: "row", marginTop: sc(22), gap: 8 },
  feature: { flex: 1, alignItems: "center" },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 10,
  },
  iconCircle: {
    width: sc(52),
    height: sc(52),
    borderRadius: sc(26),
    backgroundColor: C.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  naira: {
    position: "absolute",
    top: sc(21),
    color: C.greenBright,
    fontSize: 11,
    fontFamily: "PlusJakartaSans_800ExtraBold",
  },
  featureTitle: {
    marginTop: 10,
    color: C.white,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
  },
  featureDesc: {
    marginTop: 4,
    color: C.muted,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
  },

  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: sc(22),
    gap: 16,
  },
  clipboard: {
    width: sc(84),
    height: sc(92),
    borderRadius: 18,
    backgroundColor: C.iconBg,
    borderWidth: 1,
    borderColor: "rgba(74,222,90,0.45)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.greenBright,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  checkItems: { flex: 1, gap: 12 },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },

  // Footer
  footerWrap: { paddingHorizontal: 24, paddingTop: sc(18), paddingBottom: 12 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dotHit: { paddingVertical: 6, paddingHorizontal: 2 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  dotActive: { width: 22, backgroundColor: C.green },

  button: {
    marginTop: sc(18),
    height: sc(52),
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  flag: { position: "absolute", right: 20 },
  buttonText: {
    color: C.bg,
    fontSize: 17,
    fontFamily: "PlusJakartaSans_700Bold",
  },


  wave: { position: "absolute", bottom: 0, left: 0, zIndex: -1 },
});
