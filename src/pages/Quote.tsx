import React, { useMemo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

import QuoteCard from '../components/QuoteCard';
import QuoteActions from '../components/QuoteActions';
import useQuoteExport from '../hooks/useQuoteExport';

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
  subcategory: string;
};

export default function QuotePage({
  color,
  float,
  mood,
  quote,
  background,
  refreshQuote,
}: Props) {
  const cardRef = useRef<View>(null);

  const {
    downloadQuote,
    shareQuote,
    copyQuote,
    favoriteQuote,
  } = useQuoteExport({
    cardRef,
    quote,
  });

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
});