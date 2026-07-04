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
    console.log('Rendering QuoteCard with accentColor:', accentColor, 'and quote:', quote);
  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
      style={styles.container}
    >
      {/* Dark Overlay */}

      <View style={styles.overlay} />

      {/* Blur Glass */}

      <BlurView
        intensity={45}
        tint="dark"
        style={styles.blurCard}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0.02)",
          ]}
          style={styles.gradient}
        >
          {/* Decorative Top */}

          <View style={styles.topDecoration}>
            <View
              style={[
                styles.line,
                {
                  backgroundColor: accentColor,
                },
              ]}
            />

            <Text style={styles.logo}>
              MoodQuote
            </Text>

            <View
              style={[
                styles.line,
                {
                  backgroundColor: accentColor,
                },
              ]}
            />
          </View>

          {/* Quote */}

          <View style={styles.quoteSection}>
            <Text
              style={[
                styles.quoteMark,
                {
                  color: accentColor,
                },
              ]}
            >
              ❝
            </Text>

            <Text style={styles.quote}>
              {quote.text}
            </Text>

            <Text
              style={[
                styles.quoteMarkBottom,
                {
                  color: accentColor,
                },
              ]}
            >
              ❞
            </Text>
          </View>

          {/* Divider */}

          <View style={styles.divider} />

          {/* Author */}

          <View style={styles.authorContainer}>
            <Text style={styles.author}>
              {quote.author}
            </Text>

            <Text style={styles.source}>
              {quote.source}
            </Text>
          </View>

          {/* Footer */}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>
              Created with MoodQuote
            </Text>

            <Text style={styles.footerSubtitle}>
              Daily inspiration • Share kindness
            </Text>
          </View>
        </LinearGradient>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  backgroundImage: {
    borderRadius: 32,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

blurCard: {
  flex: 1,
  margin: 20,
  borderRadius: 28,
  overflow: "hidden",
},

  gradient: {
    flex: 1,
    minHeight: 580,
    paddingHorizontal: 26,
    paddingVertical: 30,
    justifyContent: "space-between",
  },

  topDecoration: {
    flexDirection: "row",
    alignItems: "center",
  },

  line: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    opacity: 0.7,
  },

  logo: {
    marginHorizontal: 14,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 14,
  },

  quoteSection: {
    flex: 1,
    justifyContent: "center",
  },

  quoteMark: {
    fontSize: 76,
    opacity: 0.85,
    marginBottom: -18,
  },

  quote: {
    fontSize: 31,
    lineHeight: 46,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,.35)",
    textShadowRadius: 8,
  },

  quoteMarkBottom: {
    fontSize: 76,
    opacity: 0.85,
    alignSelf: "flex-end",
    marginTop: -8,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,.22)",
    marginVertical: 20,
  },

  authorContainer: {
    alignItems: "center",
  },

  author: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },

  source: {
    marginTop: 8,
    color: "rgba(255,255,255,.78)",
    fontSize: 15,
    textAlign: "center",
    fontStyle: "italic",
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
  },

  footerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  footerSubtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,.72)",
    fontSize: 12,
  },
});