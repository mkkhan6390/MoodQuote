import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import quoteData from './src/data/quotes.json';

const moods = ['happy', 'sad', 'lost', 'lonely', 'energetic', 'confused'] as const;

type Mood = (typeof moods)[number];
type Category = (typeof quoteData.categories)[number];
type Subcategory = Category['subcategories'][number];

const moodThemes: Record<Mood, { color: string; emoji: string; label: string }> = {
  happy: { color: '#F7C948', emoji: 'sun', label: 'Happy' },
  sad: { color: '#5E81AC', emoji: 'rain', label: 'Sad' },
  lost: { color: '#8A7A63', emoji: 'map', label: 'Lost' },
  lonely: { color: '#9B5DE5', emoji: 'moon', label: 'Lonely' },
  energetic: { color: '#F15BB5', emoji: 'bolt', label: 'Energetic' },
  confused: { color: '#00BBF9', emoji: 'maze', label: 'Confused' },
};

const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

export default function App() {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;

  const themeColor = mood ? moodThemes[mood].color : category?.accent ?? '#3D5A80';
  const quotes = useMemo(() => {
    if (!subcategory || !mood) {
      return [];
    }

    const figures = subcategory.figures;
    return quoteData.quoteTemplates[mood].map((template: string, index: number) =>
      template.replace('{figure}', figures[index % figures.length]),
    );
  }, [mood, subcategory]);
  const selectedQuote = quotes[quoteIndex] ?? 'Choose a category, subcategory, and mood to reveal a quote.';

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [float]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0.35, duration: 120, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [category, fade, mood, quoteIndex, subcategory]);

  const selectCategory = (nextCategory: Category) => {
    setCategory(nextCategory);
    setSubcategory(null);
    setMood(null);
    setQuoteIndex(0);
  };

  const selectMood = (nextMood: Mood) => {
    setMood(nextMood);
    setQuoteIndex(getRandomIndex(quoteData.quoteTemplates[nextMood].length));
  };

  const refreshQuote = () => {
    if (quotes.length === 0) {
      return;
    }

    let nextIndex = getRandomIndex(quotes.length);
    if (quotes.length > 1 && nextIndex === quoteIndex) {
      nextIndex = (nextIndex + 1) % quotes.length;
    }
    setQuoteIndex(nextIndex);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: `${themeColor}14` }]}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>MoodQuote</Text>
          <Text style={styles.title}>Find a quote for the exact feeling you are carrying.</Text>
        </View>

        <Animated.View
          style={[
            styles.orbit,
            {
              borderColor: `${themeColor}50`,
              transform: [
                {
                  translateY: float.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -12],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.orbitText, { color: themeColor }]}>
            {mood ? moodThemes[mood].emoji : category ? category.name : 'choose'}
          </Text>
        </Animated.View>

        <Section title="Category">
          <View style={styles.grid}>
            {quoteData.categories.map((item) => (
              <ChoiceButton
                key={item.id}
                label={item.name}
                active={category?.id === item.id}
                color={item.accent}
                onPress={() => selectCategory(item)}
              />
            ))}
          </View>
        </Section>

        {category ? (
          <Section title="Subcategory">
            <View style={styles.grid}>
              {category.subcategories.map((item) => (
                <ChoiceButton
                  key={item.id}
                  label={item.name}
                  active={subcategory?.id === item.id}
                  color={category.accent}
                  onPress={() => {
                    setSubcategory(item);
                    setMood(null);
                    setQuoteIndex(0);
                  }}
                />
              ))}
            </View>
          </Section>
        ) : null}

        {subcategory ? (
          <Section title="Mood">
            <View style={styles.grid}>
              {moods.map((item) => (
                <ChoiceButton
                  key={item}
                  label={moodThemes[item].label}
                  active={mood === item}
                  color={moodThemes[item].color}
                  onPress={() => selectMood(item)}
                />
              ))}
            </View>
          </Section>
        ) : null}

        <Animated.View style={[styles.quoteCard, { opacity: fade, borderColor: `${themeColor}40` }]}>
          <Text style={[styles.quoteMark, { color: themeColor }]}>“</Text>
          <Text style={styles.quote}>{selectedQuote}</Text>
          <View style={styles.quoteFooter}>
            <Text style={styles.quoteMeta}>
              {subcategory && mood ? `${subcategory.name} • ${moodThemes[mood].label}` : 'Waiting for your selection'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={refreshQuote}
              style={({ pressed }) => [
                styles.refresh,
                { backgroundColor: themeColor, opacity: pressed || quotes.length === 0 ? 0.72 : 1 },
              ]}
            >
              <Text style={styles.refreshText}>Random</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ChoiceButton({
  active,
  color,
  label,
  onPress,
}: {
  active: boolean;
  color: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        {
          backgroundColor: active ? color : '#FFFFFF',
          borderColor: active ? color : '#D9E2EC',
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Text style={[styles.choiceText, { color: active ? '#FFFFFF' : '#243B53' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 44,
  },
  header: {
    marginTop: 18,
    marginBottom: 18,
  },
  kicker: {
    color: '#52606D',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#102A43',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    marginTop: 8,
  },
  orbit: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 72,
    borderWidth: 2,
    height: 144,
    justifyContent: 'center',
    marginBottom: 26,
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    width: 144,
  },
  orbitText: {
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#334E68',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  choice: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    minWidth: '47%',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  choiceText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    padding: 22,
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  quoteMark: {
    fontSize: 54,
    fontWeight: '800',
    lineHeight: 54,
  },
  quote: {
    color: '#102A43',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 31,
    marginTop: -8,
  },
  quoteFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 22,
  },
  quoteMeta: {
    color: '#627D98',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  refresh: {
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
