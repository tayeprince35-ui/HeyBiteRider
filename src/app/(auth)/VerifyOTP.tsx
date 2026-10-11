import Logo from "@/components/Logo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const sc = (n: number) => Math.round(n * Math.min(Math.max(height / 844, 0.8), 1));

const C = {
  bg: "#04170D",
  green: "#1FD66B",
  greenBright: "#4ADE5A",
  iconBg: "#0F3D25",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.12)",
  inputBorderFocus: "rgba(74,222,90,0.85)",
  error: "#FF6B6B",
};

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

type Props = {
  /** Phone or email the code was sent to, for the subtitle */
  destination?: string;
  /** Called with the 6-digit code when user taps Verify */
  onVerify?: (code: string) => void | Promise<void>;
  /** Called when the "Resend" link is pressed */
  onResend?: () => void;
  /** Called to go back */
  onBack?: () => void;
  /** The correct code (mock mode). If provided, screen auto-validates locally. */
  expectedCode?: string;
};

export default function VerifyOtpScreen({
  destination = "+234 800 000 0000",
  onVerify,
  onResend,
  onBack,
  expectedCode,
}: Props) {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const inputs = useRef<(TextInput | null)[]>([]);
  const shake = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    inputs.current[0]?.focus();
  }, [fade]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const filledCode = code.join("");
  const isComplete = filledCode.length === CODE_LENGTH;

  const triggerError = () => {
    setError(true);
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => setError(false));
  };

  const handleChange = (text: string, index: number) => {
    // Handle paste (multiple digits)
    const digits = text.replace(/\D/g, "");
    if (digits.length > 1) {
      const next = [...code];
      for (let i = 0; i < digits.length && index + i < CODE_LENGTH; i++) {
        next[index + i] = digits[i];
      }
      setCode(next);
      const lastFilled = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputs.current[lastFilled]?.focus();
      setFocusedIndex(lastFilled);
      return;
    }

    const next = [...code];
    next[index] = digits;
    setCode(next);

    if (digits && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
      const next = [...code];
      next[index - 1] = "";
      setCode(next);
    }
  };

  const handleVerify = async () => {
    if (!isComplete || loading) return;

    // Local mock validation
    if (expectedCode && filledCode !== expectedCode) {
      triggerError();
      setCode(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
      setFocusedIndex(0);
      return;
    }

    setLoading(true);
    try {
      await onVerify?.(filledCode);
    } catch {
      triggerError();
      setCode(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
      setFocusedIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SECONDS);
    setCode(Array(CODE_LENGTH).fill(""));
    inputs.current[0]?.focus();
    setFocusedIndex(0);
    onResend?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={[
            styles.inner,
            {
              opacity: fade,
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 24,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Logo size={sc(30)} align="flex-start" />
            <Pressable onPress={onBack} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color={C.white} />
            </Pressable>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <View style={styles.badge}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={sc(38)}
                color={C.greenBright}
              />
            </View>

            <Text style={styles.titleWhite}>Verify your</Text>
            <Text style={[styles.titleWhite, { color: C.green }]}>number</Text>

            <Text style={styles.subtitle}>
              We sent a 6-digit code to{"\n"}
              <Text style={styles.subtitleStrong}>{destination}</Text>
            </Text>

            {/* OTP boxes */}
            <Animated.View
              style={[styles.otpRow, { transform: [{ translateX: shake }] }]}
            >
              {code.map((digit, i) => {
                const isFocused = focusedIndex === i;
                return (
                  <Pressable
                    key={i}
                    onPress={() => {
                      inputs.current[i]?.focus();
                      setFocusedIndex(i);
                    }}
                    style={[
                      styles.otpBox,
                      isFocused && styles.otpBoxFocused,
                      error && styles.otpBoxError,
                      digit && styles.otpBoxFilled,
                    ]}
                  >
                    <TextInput
                      ref={(r) => {
                        inputs.current[i] = r;
                      }}
                      value={digit}
                      onChangeText={(t) => handleChange(t, i)}
                      onKeyPress={(e) => handleKeyPress(e, i)}
                      onFocus={() => setFocusedIndex(i)}
                      keyboardType="number-pad"
                      maxLength={CODE_LENGTH}
                      style={styles.otpInput}
                      selectionColor={C.greenBright}
                      caretHidden
                    />
                    {!digit && isFocused && <View style={styles.caret} />}
                  </Pressable>
                );
              })}
            </Animated.View>

            {error && (
              <Text style={styles.errorText}>
                Invalid code. Please check and try again.
              </Text>
            )}

            {/* Resend */}
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn’t get the code? </Text>
              {seconds > 0 ? (
                <Text style={styles.resendDisabled}>
                  Resend in 0:{seconds.toString().padStart(2, "0")}
                </Text>
              ) : (
                <Pressable onPress={handleResend} hitSlop={8}>
                  <Text style={styles.resendLink}>Resend</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Footer */}
          <View>
            <Pressable
              onPress={handleVerify}
              disabled={!isComplete || loading}
              style={({ pressed }) => ({
                opacity: !isComplete || loading ? 0.5 : pressed ? 0.9 : 1,
              })}
            >
              <LinearGradient
                colors={["#34DB7F", "#12C860"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify"}
                </Text>
                {!loading && (
                  <MaterialCommunityIcons name="arrow-right" size={22} color={C.bg} />
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/login")}
              hitSlop={8}
              style={styles.changeRow}
            >
              <Text style={styles.changeText}>
                Wrong number?{" "}
                <Text style={styles.changeLink}>Change it</Text>
              </Text>
            </Pressable>
          </View>
        </Animated.View>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  body: { flex: 1, justifyContent: "center", alignItems: "center" },

  badge: {
    width: sc(76),
    height: sc(76),
    borderRadius: sc(38),
    backgroundColor: C.iconBg,
    borderWidth: 1,
    borderColor: "rgba(74,222,90,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: sc(22),
    shadowColor: C.greenBright,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  titleWhite: {
    color: C.white,
    fontSize: sc(28),
    lineHeight: sc(34),
    fontFamily: "PlusJakartaSans_800ExtraBold",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
  },
  subtitleStrong: {
    color: C.white,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: sc(28),
  },
  otpBox: {
    width: sc(48),
    height: sc(58),
    borderRadius: 14,
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxFocused: {
    borderColor: C.inputBorderFocus,
    backgroundColor: "rgba(74,222,90,0.06)",
  },
  otpBoxFilled: {
    borderColor: "rgba(74,222,90,0.45)",
  },
  otpBoxError: {
    borderColor: C.error,
  },
  otpInput: {
    color: C.white,
    fontSize: sc(22),
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
    width: "100%",
    height: "100%",
    paddingVertical: 0,
  },
  caret: {
    position: "absolute",
    width: 2,
    height: sc(22),
    backgroundColor: C.greenBright,
    borderRadius: 1,
  },

  errorText: {
    marginTop: 14,
    color: C.error,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "center",
  },

  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: sc(22),
  },
  resendText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  resendDisabled: {
    color: C.muted,
    fontSize: 13,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  resendLink: {
    color: C.greenBright,
    fontSize: 13,
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

  changeRow: { marginTop: 14, alignItems: "center" },
  changeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  changeLink: {
    color: C.greenBright,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  wave: { position: "absolute", bottom: 0, left: 0, zIndex: -1 },
});