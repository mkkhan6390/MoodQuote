import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../context/ThemeContext';
import { DiaryEntry, fetchDiaryEntries } from '../api/diary';
import DiaryCard from './DiaryCard';
import DiaryForm from './DiaryForm';

export default function DiaryPager() {
  const { colors, isDark } = useAppTheme();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadEntries = async () => {
    const data = await fetchDiaryEntries();
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const pageWidth = Dimensions.get('window').width - 40; // 20px padding each side

  const scrollToPage = (page: number) => {
    if (page < 0 || page >= entries.length) return;
    Haptics.selectionAsync();
    scrollRef.current?.scrollTo({ x: page * pageWidth, animated: true });
    setCurrentPage(page);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / pageWidth);
    if (page !== currentPage && page >= 0 && page < entries.length) {
      setCurrentPage(page);
    }
  };

  const handleSaved = () => {
    loadEntries();
    setCurrentPage(0);
    // Scroll back to first page after saving
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    }, 300);
  };

  const currentEntry = entries[currentPage];
  const currentDate = currentEntry
    ? new Date(currentEntry.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: '800',
            color: colors.text,
            letterSpacing: 0.2,
          }}
        >
          📖 My Diary
        </Text>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setShowForm(true);
          }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons name="add-circle" size={16} color={colors.text} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text }}>New Entry</Text>
        </Pressable>
      </View>

      {entries.length === 0 ? (
        /* Empty state */
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 60,
          }}
        >
          <Text style={{ fontSize: 48 }}>📝</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center' }}>
            No diary entries yet
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '500',
              color: colors.textSub,
              textAlign: 'center',
              maxWidth: 260,
              lineHeight: 20,
            }}
          >
            Start writing about your mood and feelings. Tap "New Entry" to begin.
          </Text>
        </View>
      ) : (
        <>
          {/* Swipeable cards */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            decelerationRate="fast"
            snapToInterval={pageWidth}
            snapToAlignment="start"
            contentContainerStyle={{ gap: 0 }}
          >
            {entries.map((entry, idx) => (
              <View key={entry._id} style={{ width: pageWidth, paddingRight: 0 }}>
                <DiaryCard entry={entry} />
              </View>
            ))}
          </ScrollView>

          {/* Navigation controls */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
              paddingHorizontal: 4,
            }}
          >
            {/* Left arrow */}
            <Pressable
              onPress={() => scrollToPage(currentPage - 1)}
              disabled={currentPage === 0}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: currentPage === 0
                  ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')
                  : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'),
                justifyContent: 'center',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={currentPage === 0 ? colors.textMuted : colors.text}
              />
            </Pressable>

            {/* Page info */}
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }}>
                {currentPage + 1} / {entries.length}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textMuted }}>
                {currentDate}
              </Text>
            </View>

            {/* Right arrow */}
            <Pressable
              onPress={() => scrollToPage(currentPage + 1)}
              disabled={currentPage === entries.length - 1}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: currentPage === entries.length - 1
                  ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')
                  : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'),
                justifyContent: 'center',
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={currentPage === entries.length - 1 ? colors.textMuted : colors.text}
              />
            </Pressable>
          </View>

          {/* Dot indicators */}
          {entries.length <= 10 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
                marginTop: 12,
              }}
            >
              {entries.map((_, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => scrollToPage(idx)}
                  style={{
                    width: idx === currentPage ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: idx === currentPage
                      ? colors.text
                      : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)'),
                  }}
                />
              ))}
            </View>
          )}
        </>
      )}

      {/* Diary Form Modal */}
      <DiaryForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSaved={handleSaved}
      />
    </Animated.View>
  );
}
