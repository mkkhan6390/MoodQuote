import { StatusBar } from 'expo-status-bar';
import { BackHandler } from 'react-native';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './src/css/Styles';
import quoteData from './src/data/quotes.json';
import { Ionicons } from '@expo/vector-icons';
import { quoteBackgrounds } from "./src/constants/backgrounds";
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';

import Progress from './src/components/Progressbar';
import QuotePage from './src/pages/Quote';
import PickerPage from './src/pages/SelectionPage';

const moods = ['happy', 'sad', 'lost', 'lonely', 'energetic', 'confused'] as const;

type Mood = (typeof moods)[number];
type Category = (typeof quoteData.categories)[number];
type Subcategory = Category['subcategories'][number];
type Step = 'category' | 'subcategory' | 'mood' | 'quote';

const steps: Step[] = ['category', 'subcategory', 'mood', 'quote'];

const moodThemes: Record<Mood, { color: string; glyph: string; label: string }> = {
  happy: { color: '#F7C948', glyph: 'Sun', label: 'Happy' },
  sad: { color: '#5E81AC', glyph: 'Rain', label: 'Sad' },
  lost: { color: '#8A7A63', glyph: 'Map', label: 'Lost' },
  lonely: { color: '#8D5CF6', glyph: 'Moon', label: 'Lonely' },
  energetic: { color: '#F15BB5', glyph: 'Bolt', label: 'Energetic' },
  confused: { color: '#00A6D6', glyph: 'Maze', label: 'Confused' },
};

const categoryIcons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  history: 'library-outline',
  science: 'flask-outline',
  philosophy: 'school-outline',
  business: 'briefcase-outline',
  sports: 'football-outline',
  movies: 'film-outline',
  literature: 'book-outline',
};

const moodIcons: Record<Mood, React.ComponentProps<typeof Ionicons>['name']> = {
  happy: 'sunny-outline',
  sad: 'rainy-outline',
  lonely: 'moon-outline',
  energetic: 'flash-outline',
  confused: 'help-circle-outline',
  lost: 'compass-outline',
};

const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

// Inner component — must live inside ThemeProvider
function AppShell() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { width } = useWindowDimensions();
  const entrance = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;
  const blob1 = useRef(new Animated.Value(0)).current;
  const blob2 = useRef(new Animated.Value(0)).current;

  const activeStepIndex = steps.indexOf(step);
  const themeColor = mood ? moodThemes[mood].color : category?.accent ?? '#2F80ED';
  const compact = width < 390;
  const optionColumns = width >= 620 ? 3 : 2;
  type Quote = {
    text: string;
    author: string;
    source: string;
    type: 'verified' | 'inspired';
  };
  const quotes = useMemo<Quote[]>(() => {
    if (!subcategory || !mood) {
      return [];
    }

    return subcategory.quotes[mood] ?? [];
  }, [subcategory, mood]);

  const selectedQuote: Quote = quotes[quoteIndex] ?? {
    text: '',
    author: '',
    source: '',
    type: 'verified',
  };

  const currentBackground = useMemo(() => {
    if (!mood) {
      return null;
    }
    const list = quoteBackgrounds[mood];
    console.log("Current Background List:", quoteBackgrounds);
    return list[Math.floor(Math.random() * (list?.length || 0))];
  }, [mood, quoteIndex]);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(blob1, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(blob2, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [entrance, step]);

  const panelStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [25, 0],
        }),
      },
      {
        scale: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1],
        }),
      },
    ],
  };

  const selectCategory = (nextCategory: Category) => {
    setCategory(nextCategory);
    setSubcategory(null);
    setMood(null);
    setQuoteIndex(0);
    setStep('subcategory');
  };

  const selectSubcategory = (nextSubcategory: Subcategory) => {
    setSubcategory(nextSubcategory);
    setMood(null);
    setQuoteIndex(0);
    setStep('mood');
  };

  const selectMood = (nextMood: Mood) => {
    setMood(nextMood);
    const availableQuotes =
      subcategory?.quotes[nextMood] ?? [];

    setQuoteIndex(
      getRandomIndex(availableQuotes.length)
    ); setStep('quote');
  };

  const refreshQuote = () => {
    if (quotes.length <= 1) return;

    let nextIndex = getRandomIndex(quotes.length);

    while (nextIndex === quoteIndex) {
      nextIndex = getRandomIndex(quotes.length);
    }

    setQuoteIndex(nextIndex);
  };

  const restart = useCallback(() => {
    setCategory(null);
    setSubcategory(null);
    setMood(null);
    setQuoteIndex(0);
    setStep('category');
  }, []);

  const goBack = useCallback(() => {
    if (step === 'quote') {
      setMood(null);
      setQuoteIndex(0);
      setStep('mood');
      return;
    }

    if (step === 'mood') {
      setSubcategory(null);
      setStep('subcategory');
      return;
    }

    if (step === 'subcategory') {
      setCategory(null);
      setStep('category');
      return;
    }

    if (step === 'category') {
      restart();
      return;
    }
  }, [step, restart]);

  useEffect(() => {
    console.log('Setting up back button handler. Current step:', step);
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('Back button pressed. Current step:', step);
        if (step === 'category') {
          return false;
        }
        goBack();
        return true;
      }
    );

    return () => subscription.remove();
  }, [step, goBack]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar style={colors.statusBar} />

      {/* Background */}

      <LinearGradient
        colors={[
          colors.bg,
          `${themeColor}28`,
          colors.bg,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating blobs */}

      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: `${themeColor}${isDark ? '30' : '22'}`,
            top: -80,
            left: -100,
            transform: [
              {
                translateY: blob1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 18]
                })
              }
            ]
          }
        ]}
      />

      <Animated.View
        style={[
          styles.blobLarge,
          {
            backgroundColor: `${themeColor}${isDark ? '22' : '18'}`,
            right: -110,
            bottom: 100,
            transform: [
              {
                translateY: blob2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -22]
                })
              }
            ]
          }
        ]}
      />

      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.topHeader}>

          {/* Row 1: nav + wordmark + theme toggle */}
          <View style={styles.topHeaderRow}>

            <Pressable
              onPress={goBack}
              style={[
                styles.iconBtn,
                {
                  backgroundColor: colors.pill,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
            </Pressable>

            {/* Wordmark */}
            <View style={styles.wordmarkWrap}>
              <Text style={[styles.wordmark, { color: colors.text }]}>Mood</Text>
              <Text style={[styles.wordmarkAccent, { color: themeColor }]}>Quote</Text>
            </View>

            {/* Theme toggle */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                toggleTheme();
              }}
              style={[
                styles.iconBtn,
                {
                  backgroundColor: colors.pill,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={colors.text}
              />
            </Pressable>

          </View>

          {/* Row 2: progress strip */}
          <Progress activeStepIndex={activeStepIndex} color={themeColor} />

        </View>


        {/* Pages */}

        <Animated.View
          style={[
            {
              flex: 1
            },
            panelStyle
          ]}
        >

          {step === 'category' && (
            <PickerPage
              color={themeColor}
              compact={compact}
              columns={optionColumns}
              eyebrow="Theme"
              // illustration="📚"
              title="Choose Source of Wisdom"
              subtitle="Select a collection of voices that inspires you."
              options={quoteData.categories.map((item) => ({
                id: item.id,
                label: item.name,
                accent: item.accent,
                detail: `${item.subcategories.length} personalities`,
                icon: categoryIcons[item.id] ?? "book-outline",
                onPress: () => selectCategory(item),
              }))}
            />
          )}

          {step === 'subcategory' && category && (
            <PickerPage
              color={category.accent}
              compact={compact}
              columns={optionColumns}
              eyebrow={category.name}
              title="Choose a Personality"
              subtitle="Pick someone whose perspective you'd like to hear."
              options={category.subcategories.map((item) => ({
                id: item.id,
                label: item.name,
                accent: category.accent,
                detail: `6 moods`,
                icon: 'person-outline',
                onPress: () => selectSubcategory(item),
              }))}
            />
          )}

          {step === 'mood' && subcategory && (
            <PickerPage
              color={themeColor}
              compact={compact}
              columns={optionColumns}
              eyebrow="Mood"
              title="How are you feeling today?"
              subtitle="Choose the emotion that best matches your current state."
              options={moods.map((item) => ({
                id: item,
                label: moodThemes[item].label,
                accent: moodThemes[item].color,
                detail: moodThemes[item].glyph,
                icon: moodIcons[item],
                onPress: () => selectMood(item),
              }))}
            />
          )}

          {step === 'quote' && subcategory && mood && (
            <QuotePage
              color={themeColor}
              compact={compact}
              float={float}
              mood={mood}
              quote={selectedQuote}
              background={currentBackground}
              restart={restart}
              subcategory={subcategory.name}
              refreshQuote={refreshQuote}
            />
          )}

        </Animated.View>

      </View>

    </SafeAreaView>
  );
}

// Root — provides theme to entire tree
export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
