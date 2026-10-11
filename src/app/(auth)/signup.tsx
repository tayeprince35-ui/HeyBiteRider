import Logo from "@/components/Logo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const sc = (n: number) =>
  Math.round(n * Math.min(Math.max(height / 844, 0.8), 1));
const HERO_H = height * 0.42;

const FILL = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

const C = {
  bg: "#04170D",
  green: "#1FD66B",
  greenBright: "#4ADE5A",
  iconBg: "#0F3D25",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.10)",
  inputBorderFocus: "rgba(74,222,90,0.75)",
};

type Props = {
  onBack?: () => void;
  onLogin?: () => void;
  onSubmit?: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
};

export default function SignupScreen({ onBack, onLogin, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [focus, setFocus] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(1.12)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
    Animated.timing(heroScale, {
      toValue: 1,
      duration: 6000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade, heroScale]);

  const canSubmit =
    fullName.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length >= 7 &&
    password.length >= 6 &&
    agreed;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({ fullName, email, phone, password });
    router.push("/(auth)/VerifyOTP");
  };

  const borderFor = (key: string): ViewStyle => ({
    borderColor: focus === key ? C.inputBorderFocus : C.inputBorder,
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background hero */}
      <Animated.View
        style={[styles.heroArea, { opacity: fade }]}
        pointerEvents="none"
      >
        <Animated.Image
          source={require("@/assets/signup.png")}
          style={[styles.hero, { transform: [{ scale: heroScale }] }]}
          resizeMode="cover"
        />
        <View style={styles.tint} />
        <LinearGradient
          colors={[C.bg, "rgba(4,23,13,0.4)", "rgba(4,23,13,0)"]}
          locations={[0, 0.5, 1]}
          style={[styles.fadeTop, { height: insets.top + 110 }]}
        />
        <LinearGradient
          colors={["rgba(4,23,13,0)", "rgba(4,23,13,0.85)", C.bg]}
          locations={[0, 0.55, 1]}
          style={styles.fadeBottom}
        />
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Logo size={sc(30)} align="flex-start" />
            <Pressable onPress={onBack} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color={C.white} />
            </Pressable>
          </View>

          {/* Spacer so hero breathes */}
          <View style={{ height: sc(70) }} />

          <Animated.View style={{ opacity: fade, flex: 1 }}>
            {/* Titles */}
            <View style={styles.titleBlock}>
              <Text style={styles.titleWhite}>Create your</Text>
              <Text style={[styles.titleWhite, { color: C.green }]}>
                Rider account
              </Text>
              <Text style={styles.subtitle}>
                Sign up in a minute and start earning on your own schedule.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Field
                label="Full name"
                icon="account-outline"
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Daniel Okafor"
                autoCapitalize="words"
                focused={focus === "name"}
                onFocus={() => setFocus("name")}
                onBlur={() => setFocus(null)}
                style={borderFor("name")}
              />

              <Field
                label="Email"
                icon="email-outline"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                focused={focus === "email"}
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus(null)}
                style={borderFor("email")}
              />

              <Field
                label="Phone number"
                icon="phone-outline"
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/[^0-9+ ]/g, ""))}
                placeholder="+234 800 000 0000"
                keyboardType="phone-pad"
                focused={focus === "phone"}
                onFocus={() => setFocus("phone")}
                onBlur={() => setFocus(null)}
                style={borderFor("phone")}
              />

              <Field
                label="Password"
                icon="lock-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                secureTextEntry={!showPass}
                focused={focus === "password"}
                onFocus={() => setFocus("password")}
                onBlur={() => setFocus(null)}
                style={borderFor("password")}
                right={
                  <Pressable
                    onPress={() => setShowPass((s) => !s)}
                    hitSlop={10}
                  >
                    <MaterialCommunityIcons
                      name={showPass ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={C.muted}
                    />
                  </Pressable>
                }
              />
            </View>

            {/* Terms */}
            <Pressable
              style={styles.termsRow}
              onPress={() => setAgreed((v) => !v)}
              hitSlop={6}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                {agreed && (
                  <MaterialCommunityIcons name="check" size={14} color={C.bg} />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.link}>Terms of Service</Text>{" "}
                and <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
            </Pressable>

            {/* CTA */}
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => ({
                opacity: !canSubmit ? 0.5 : pressed ? 0.9 : 1,
                marginTop: sc(22),
              })}
            >
              <LinearGradient
                colors={["#34DB7F", "#12C860"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Create account</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={22}
                  color={C.bg}
                />
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Socials */}
            <View style={styles.socialsRow}>
              <SocialButton icon="google" label="Google" />
              <SocialButton icon="apple" label="Apple" />
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
              Already have an account?{" "}
              <Text style={styles.footerLink} onPress={onLogin}>
                Log in
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

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

/* ---------- Small components ---------- */

type FieldProps = Omit<React.ComponentProps<typeof TextInput>, "style"> & {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  focused?: boolean;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Field({ label, icon, focused, right, style, ...rest }: FieldProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, style]}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={focused ? C.greenBright : C.muted}
        />
        <TextInput
          {...rest}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          selectionColor={C.greenBright}
        />
        {right}
      </View>
    </View>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialBtn,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={C.white} />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  heroArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HERO_H,
    overflow: "hidden",
  },
  hero: { ...FILL, width: "100%", height: "100%" },
  tint: { ...FILL, backgroundColor: "rgba(4,23,13,0.35)" },
  fadeTop: { position: "absolute", top: 0, left: 0, right: 0 },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: HERO_H * 0.8,
  },

  scroll: { paddingHorizontal: 24, flexGrow: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sc(8),
  },

  titleBlock: { marginBottom: sc(22) },
  titleWhite: {
    color: C.white,
    fontSize: sc(28),
    lineHeight: sc(34),
    fontFamily: "PlusJakartaSans_800ExtraBold",
    letterSpacing: -0.4,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  form: { marginTop: sc(6) },

  fieldLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 6,
    fontFamily: "PlusJakartaSans_500Medium",
    letterSpacing: 0.2,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: sc(52),
  },
  input: {
    flex: 1,
    color: C.white,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_500Medium",
    paddingVertical: 0,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: sc(6),
    paddingRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: C.greenBright,
    borderColor: C.greenBright,
  },
  termsText: {
    flex: 1,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  link: {
    color: C.greenBright,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  button: {
    height: sc(52),
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: C.bg,
    fontSize: 17,
    fontFamily: "PlusJakartaSans_700Bold",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: sc(22),
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  dividerText: {
    color: C.muted,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  socialsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: sc(14),
  },
  socialBtn: {
    flex: 1,
    height: sc(48),
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialText: {
    color: C.white,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  footer: {
    marginTop: sc(22),
    textAlign: "center",
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  footerLink: {
    color: C.greenBright,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  wave: { position: "absolute", bottom: 0, left: 0, zIndex: -1 },
});
