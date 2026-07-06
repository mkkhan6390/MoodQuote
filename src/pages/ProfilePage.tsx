import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../context/ThemeContext';
import styles from '../css/Styles';
import { getMoodHistory, clearHistory, MoodEntry, Mood } from '../api/history';

const moodsList = ['happy', 'sad', 'lost', 'lonely', 'energetic', 'confused'] as const;

const moodThemes: Record<Mood, { color: string; glyph: string; label: string; icon: any }> = {
  happy: { color: '#F7C948', glyph: '☀️', label: 'Happy', icon: 'sunny-outline' },
  sad: { color: '#5E81AC', glyph: '🌧️', label: 'Sad', icon: 'rainy-outline' },
  lost: { color: '#8A7A63', glyph: '🧭', label: 'Lost', icon: 'compass-outline' },
  lonely: { color: '#8D5CF6', glyph: '🌙', label: 'Lonely', icon: 'moon-outline' },
  energetic: { color: '#F15BB5', glyph: '⚡', label: 'Energetic', icon: 'flash-outline' },
  confused: { color: '#00A6D6', glyph: '🌀', label: 'Confused', icon: 'help-circle-outline' },
};

type Duration = 'week' | 'month' | 'year' | 'all';

export default function ProfilePage() {
  const { colors, isDark } = useAppTheme();
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [duration, setDuration] = useState<Duration>('week');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadHistory();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadHistory = async () => {
    const data = await getMoodHistory();
    setHistory(data.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all mood history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearHistory();
            loadHistory();
          },
        },
      ]
    );
  };

  // Filter logs by duration
  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;
    
    return history.filter(entry => {
      if (duration === 'all') return true;
      
      const diffDays = (now - entry.timestamp) / msInDay;
      if (duration === 'week') return diffDays <= 7;
      if (duration === 'month') return diffDays <= 30;
      if (duration === 'year') return diffDays <= 365;
      return true;
    });
  }, [history, duration]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (history.length === 0) {
      return { total: 0, streak: 0, dominant: 'None' };
    }

    // Streak calculation
    let currentStreak = 0;
    const checkinDays = new Set(
      history.map(h => new Date(h.timestamp).toDateString())
    );

    let checkDate = new Date();
    // If no check-in today, check if yesterday had one to maintain a continuous streak
    if (!checkinDays.has(checkDate.toDateString())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (checkinDays.has(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Dominant Mood calculation
    const counts = filteredHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    let dominantMood: Mood | 'None' = 'None';
    let maxCount = 0;
    Object.keys(counts).forEach(m => {
      if (counts[m as Mood] > maxCount) {
        maxCount = counts[m as Mood];
        dominantMood = m as Mood;
      }
    });

    // Most popular Category & Subcategory calculation
    const catCounts = filteredHistory.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let topCategory = 'None';
    let maxCatCount = 0;
    Object.keys(catCounts).forEach(c => {
      if (catCounts[c] > maxCatCount) {
        maxCatCount = catCounts[c];
        topCategory = c;
      }
    });

    const subCounts = filteredHistory.reduce((acc, entry) => {
      acc[entry.subcategory] = (acc[entry.subcategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let topSubcategory = 'None';
    let maxSubCount = 0;
    Object.keys(subCounts).forEach(s => {
      if (subCounts[s] > maxSubCount) {
        maxSubCount = subCounts[s];
        topSubcategory = s;
      }
    });

    return {
      total: history.length,
      filteredTotal: filteredHistory.length,
      streak: currentStreak,
      dominant: dominantMood !== 'None' ? moodThemes[dominantMood].label : 'None',
      dominantColor: dominantMood !== 'None' ? moodThemes[dominantMood].color : colors.textSub,
      topCategory,
      topSubcategory,
    };
  }, [history, filteredHistory, colors]);

  // Chart data configuration
  const chartData = useMemo(() => {
    const counts = filteredHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    const maxCount = Math.max(...moodsList.map(m => counts[m] || 0), 1);

    return moodsList.map(m => {
      const count = counts[m] || 0;
      const percentage = filteredHistory.length > 0 ? (count / filteredHistory.length) * 100 : 0;
      return {
        mood: m,
        count,
        percentage,
        color: moodThemes[m].color,
        glyph: moodThemes[m].glyph,
        label: moodThemes[m].label.substring(0, 3), // short label
        fillHeight: (count / maxCount) * 100, // scaled height for chart representation
      };
    });
  }, [filteredHistory]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  type ProfileTab = 'graph' | 'stats' | 'history';
  const [activeTab, setActiveTab] = useState<ProfileTab>('graph');

  // Mood timeline trend for the Graph tab (last 6 entries)
  const recentTrends = useMemo(() => {
    return history.slice(0, 6).reverse();
  }, [history]);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {/* Profile Section Selector Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', marginBottom: 14 }]}>
        {([
          { id: 'graph', label: 'Graph', icon: 'bar-chart-outline' },
          { id: 'stats', label: 'Statistics', icon: 'pie-chart-outline' },
          { id: 'history', label: 'History', icon: 'list-outline' }
        ] as const).map(tabItem => {
          const active = activeTab === tabItem.id;
          return (
            <Pressable
              key={tabItem.id}
              onPress={async () => {
                await Haptics.selectionAsync();
                setActiveTab(tabItem.id);
              }}
              style={[
                styles.tab,
                active && { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.90)', elevation: 1 },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name={tabItem.icon} size={14} color={active ? colors.text : colors.textSub} />
                <Text
                  style={[
                    styles.tabText,
                    { color: active ? colors.text : colors.textSub },
                  ]}
                >
                  {tabItem.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.profileScroll}
      >
        {/* VIEW 1: GRAPH OF MOODS */}
        {activeTab === 'graph' && (
          <View style={{ gap: 20 }}>
            {/* Graphical Analytics Chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.chartTitle, { color: colors.text }]}>Mood Distribution</Text>
                {/* Duration Selector Tabs */}
                <View style={[styles.tabsRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', alignSelf: 'flex-start' }]}>
                  {(['week', 'month', 'year', 'all'] as const).map(t => {
                    const active = duration === t;
                    return (
                      <Pressable
                        key={t}
                        onPress={async () => {
                          await Haptics.selectionAsync();
                          setDuration(t);
                        }}
                        style={[
                          styles.tab,
                          { paddingHorizontal: 10, paddingVertical: 4 },
                          active && { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.90)', elevation: 1 },
                        ]}
                      >
                        <Text style={[styles.tabText, { fontSize: 10, color: active ? colors.text : colors.textSub }]}>
                          {t.toUpperCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Custom vector bars */}
              <View style={styles.chartRow}>
                {chartData.map(item => (
                  <View key={item.mood} style={styles.chartCol}>
                    {item.count > 0 && (
                      <Text style={{ fontSize: 10, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                        {item.count}
                      </Text>
                    )}
                    <View style={[styles.chartBarWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${item.fillHeight}%`,
                            backgroundColor: item.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={{ fontSize: 13, marginBottom: 2 }}>{item.glyph}</Text>
                    <Text style={[styles.chartLabel, { color: colors.textSub }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Mood Trend Timeline (Mood Flow) */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Mood Flow (Recent)</Text>
              {recentTrends.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textSub, paddingVertical: 16 }]}>
                  Save some moods to see your recent mood flow timeline.
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 6 }}>
                  {recentTrends.map((entry, idx) => {
                    const theme = moodThemes[entry.mood];
                    return (
                      <View key={entry.id} style={{ alignItems: 'center', flex: 1, position: 'relative' }}>
                        {/* Connecting Line */}
                        {idx < recentTrends.length - 1 && (
                          <View
                            style={{
                              position: 'absolute',
                              right: '-50%',
                              top: 20,
                              width: '100%',
                              height: 2,
                              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                              zIndex: 1,
                            }}
                          />
                        )}
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: `${theme.color}20`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1.5,
                            borderColor: theme.color,
                            zIndex: 2,
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>{theme.glyph}</Text>
                        </View>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textSub, marginTop: 6 }}>
                          {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}

        {/* VIEW 2: STATISTICS */}
        {activeTab === 'stats' && (
          <View style={{ gap: 20 }}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
                <Text style={[styles.statLabel, { color: colors.textSub }]}>Total Logs</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {stats.streak} 🔥
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSub }]}>Streak</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: stats.dominantColor ?? colors.text }]}>
                  {stats.dominant}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSub }]}>Dominant</Text>
              </View>
            </View>

            {/* Detailed percentages & progress meters */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Breakdown Statistics</Text>
              <View style={{ gap: 12 }}>
                {chartData.map(item => (
                  <View key={item.mood} style={{ gap: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 13 }}>{item.glyph}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                          {moodThemes[item.mood].label}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSub }}>
                        {item.count} ({Math.round(item.percentage)}%)
                      </Text>
                    </View>
                    <View style={{ height: 6, borderRadius: 99, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${item.percentage}%`, backgroundColor: item.color, borderRadius: 99 }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Top Categories / Preferences */}
            <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Reflection Preferences</Text>
              <View style={{ gap: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSub }}>Most Visited Theme</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>{stats.topCategory}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: colors.border }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSub }}>Favorite Personality</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>{stats.topSubcategory}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* VIEW 3: HISTORY */}
        {activeTab === 'history' && (
          <View style={{ gap: 14 }}>
            {/* History Header Row */}
            <View style={styles.historyHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Check-in Log</Text>
              {history.length > 0 && (
                <Pressable onPress={handleClearHistory} style={styles.clearTextButton}>
                  <Text style={[styles.clearText, { color: '#EF4444' }]}>Clear History</Text>
                </Pressable>
              )}
            </View>

            {/* List */}
            <View style={styles.historyList}>
              {history.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textSub }]}>
                  No check-ins logged yet.
                </Text>
              ) : (
                history.map(entry => {
                  const theme = moodThemes[entry.mood];
                  return (
                    <View
                      key={entry.id}
                      style={[
                        styles.historyItem,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ]}
                    >
                      <View style={[styles.historyIcon, { backgroundColor: `${theme.color}20` }]}>
                        <Ionicons name={theme.icon} size={20} color={theme.color} />
                      </View>
                      <View style={styles.historyDetails}>
                        <View style={styles.historyMeta}>
                          <Text style={[styles.historyLabel, { color: colors.text }]}>
                            {theme.label}
                          </Text>
                          <Text style={[styles.historyTime, { color: colors.textMuted }]}>
                            {formatDate(entry.timestamp)}
                          </Text>
                        </View>
                        <Text style={[styles.historySub, { color: colors.textSub }]}>
                          {entry.category} • {entry.subcategory}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}
