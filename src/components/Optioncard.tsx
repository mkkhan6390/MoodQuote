import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function OptionCard({
  accent,
  columns,
  compact,
  detail,
  label,
  onPress,
  icon = 'sparkles-outline',
  delay = 0,
}: {
  accent: string;
  columns: number;
  compact: boolean;
  detail: string;
  label: string;
  onPress: () => void;
  icon?: IconName;
  delay?: number;
}) {
  const { colors } = useAppTheme();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 380,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [
          {
            translateY: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
          },
        ],
      }}
    >
      <Pressable
        accessibilityRole="button"
        android_ripple={{ color: `${accent}18` }}
        onPress={async () => {
          await Haptics.selectionAsync();
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          {
            opacity: pressed ? 0.82 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Icon pill */}
        <View style={[styles.iconWrap, { backgroundColor: `${accent}20` }]}>
          <Ionicons name={icon} size={22} color={accent} />
        </View>

        {/* Label + detail */}
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            style={[styles.label, { color: colors.text }, compact && { fontSize: 15 }]}
          >
            {label}
          </Text>
          <Text numberOfLines={1} style={[styles.detail, { color: colors.textSub }]}>
            {detail}
          </Text>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  content: {
    flex: 1,
    gap: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  detail: {
    fontSize: 12,
    fontWeight: '500',
  },
});