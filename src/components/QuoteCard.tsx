import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../context/ThemeContext";

export type QuoteData = {
  text: string;
  author: string;
  source: string;
};

type Props = {
  quote: QuoteData;
  background: ImageSourcePropType;
  accentColor: string;
  mood: string;
};

export default function QuoteCard({
  quote,
  background,
  accentColor,
}: Props) {
  const { colors, isDark } = useAppTheme();
  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
      style={styles.container}
    >
      {/* Dark scrim overlay (slightly lighter on light mode for visibility) */}
      <LinearGradient
        colors={[
          isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
          isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.40)"
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Frosted glass card */}
      <BlurView
        intensity={colors.blurIntensity}
        tint={colors.blurTint}
        style={[
          styles.blurCard,
          { borderColor: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)" }
        ]}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]
              : ["rgba(255,255,255,0.60)", "rgba(255,255,255,0.30)"]
          }
          style={styles.gradient}
        >

          {/* Top decoration */}
          <View style={styles.topDecoration}>
            <View style={[styles.line, { backgroundColor: accentColor }]} />
            <Text style={[styles.logo, { color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }]}>
              MoodQuote
            </Text>
            <View style={[styles.line, { backgroundColor: accentColor }]} />
          </View>

          {/* Quote body */}
          <View style={styles.quoteSection}>
            <Text style={[styles.quoteMark, { color: accentColor }]}>❝</Text>

            <Text style={[styles.quote, { color: isDark ? "#FFFFFF" : "#0D0F1A" }]} numberOfLines={8}>
              {quote.text}
            </Text>

            <Text style={[styles.quoteMarkBottom, { color: accentColor }]}>❞</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)" }]} />

          {/* Author chip */}
          <View style={styles.authorContainer}>
            <View
              style={[
                styles.authorChip,
                {
                  borderColor: `${accentColor}55`,
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.50)",
                }
              ]}
            >
              <Text style={[styles.author, { color: isDark ? "#FFFFFF" : "#0D0F1A" }]}>
                {quote.author}
              </Text>
            </View>
            {!!quote.source && (
              <Text style={[styles.source, { color: isDark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.50)" }]}>
                {quote.source}
              </Text>
            )}
          </View>

        </LinearGradient>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 4 / 5,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },

  backgroundImage: {
    borderRadius: 28,
  },

  blurCard: {
    flex: 1,
    margin: 16,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
  },

  gradient: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 24,
    justifyContent: "space-between",
  },

  topDecoration: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  line: {
    flex: 1,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.65,
  },

  logo: {
    marginHorizontal: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    letterSpacing: 1.2,
    fontSize: 11,
    textTransform: "uppercase",
  },

  quoteSection: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },

  quoteMark: {
    fontSize: 54,
    opacity: 0.9,
    marginBottom: -12,
    lineHeight: 60,
  },

  quote: {
    fontSize: 22,
    lineHeight: 33,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },

  quoteMarkBottom: {
    fontSize: 54,
    opacity: 0.9,
    alignSelf: "flex-end",
    marginTop: -6,
    lineHeight: 60,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 16,
  },

  authorContainer: {
    alignItems: "center",
    gap: 8,
  },

  authorChip: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  author: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  source: {
    color: "rgba(255,255,255,0.60)",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
});