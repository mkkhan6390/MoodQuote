import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { DiaryEntry } from '../api/diary';
import { Mood } from '../api/history';

const moodThemes: Record<Mood, { color: string; glyph: string; label: string }> = {
  Happy: { color: '#F7C948', glyph: '☀️', label: 'Happy' },
  Sad: { color: '#5E81AC', glyph: '🌧️', label: 'Sad' },
  Lost: { color: '#8A7A63', glyph: '🧭', label: 'Lost' },
  Lonely: { color: '#8D5CF6', glyph: '🌙', label: 'Lonely' },
  Angry: { color: '#F15BB5', glyph: '⚡', label: 'Angry' },
  Afraid: { color: '#00A6D6', glyph: '🌀', label: 'Afraid' },
  Regretful: { color: '#00A6D6', glyph: '💭', label: 'Regretful' },
};

type Props = {
  entry: DiaryEntry;
};

export default function DiaryCard({ entry }: Props) {
  const { colors, isDark } = useAppTheme();
  const theme = moodThemes[entry.mood] ?? moodThemes.Happy;

  const date = new Date(entry.createdAt);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const formattedDate = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        gap: 16,
        // Glassmorphism-style shadow
        shadowColor: theme.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.15 : 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      {/* Date header */}
      <View style={{ gap: 2 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {formattedDate}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: colors.textMuted,
          }}
        >
          {formattedTime}
        </Text>
      </View>

      {/* Mood badge */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          alignSelf: 'flex-start',
          backgroundColor: `${theme.color}15`,
          borderWidth: 1,
          borderColor: `${theme.color}30`,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 6,
        }}
      >
        <Text style={{ fontSize: 16 }}>{theme.glyph}</Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '800',
            color: theme.color,
            letterSpacing: 0.3,
          }}
        >
          {theme.label}
        </Text>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.border }} />

      {/* Description */}
      <Text
        style={{
          fontSize: 15,
          lineHeight: 24,
          color: colors.textSub,
          fontWeight: '500',
        }}
      >
        {entry.description}
      </Text>
    </View>
  );
}
