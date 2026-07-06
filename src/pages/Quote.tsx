import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Pressable,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import QuoteCard from '../components/QuoteCard';
import QuoteActions from '../components/QuoteActions';
import useQuoteExport from '../hooks/useQuoteExport';
import { useAppTheme } from '../context/ThemeContext';
import { logMood, Mood } from '../api/history';

type Quote = {
  text: string;
  author: string;
  source: string;
};

type Props = {
  color: string;
  compact: boolean;
  float: Animated.Value;
  mood: string;
  quote: Quote;
  background: any;
  refreshQuote: () => void;
  restart: () => void;
  category: string;
  subcategory: string;
};

export default function QuotePage({
  color,
  float,
  mood,
  quote,
  background,
  refreshQuote,
  category,
  subcategory,
}: Props) {
  const { colors, isDark } = useAppTheme();
  const cardRef = useRef<View>(null);
  const [isLogged, setIsLogged] = useState(false);

  const {
    downloadQuote,
    shareQuote,
    copyQuote,
    favoriteQuote,
  } = useQuoteExport({
    cardRef,
    quote,
  });

  const handleSaveMood = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await logMood(mood as Mood, category, subcategory);
      setIsLogged(true);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const floatingStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: float.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
          }),
        },
        {
          scale: float.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.015, 1],
          }),
        },
      ],
    }),
    [float]
  );

  return (
    <View style={styles.container}>
      <Animated.View
        ref={cardRef}
        collapsable={false}
        style={[styles.cardContainer, floatingStyle]}
      >
        <QuoteCard
          quote={quote}
          background={background}
          accentColor={color}
          mood={mood}
        />
      </Animated.View>

      {/* Manual Save Mood Button */}
      <View style={styles.logButtonContainer}>
        {isLogged ? (
          <View style={[styles.logBtn, styles.loggedBtn, { borderColor: `${colors.border}` }]}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={[styles.logBtnText, { color: colors.textSub }]}>Mood Saved to History</Text>
          </View>
        ) : (
          <Pressable
            onPress={handleSaveMood}
            style={({ pressed }) => [
              styles.logBtn,
              {
                backgroundColor: colors.surface,
                borderColor: color,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="bookmark-outline" size={17} color={color} />
            <Text style={[styles.logBtnText, { color: colors.text }]}>Record Mood for Today</Text>
          </Pressable>
        )}
      </View>

      <QuoteActions
        accentColor={color}
        onShare={shareQuote}
        onDownload={downloadQuote}
        onCopy={copyQuote}
        onFavorite={favoriteQuote}
        onRefresh={refreshQuote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    justifyContent: 'space-between',
  },

  cardContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 430,
  },

  logButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    alignItems: 'center',
  },

  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  loggedBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
  },

  logBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});