import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import OptionCard from '../components/Optioncard';
import { useAppTheme } from '../context/ThemeContext';

export default function PickerPage({
  color,
  columns,
  compact,
  eyebrow,
  options,
  subtitle,
  title,
}: {
  color: string;
  columns: number;
  compact: boolean;
  eyebrow: string;
  options: {
    accent: string;
    detail: string;
    id: string;
    label: string;
    icon?: string;
    onPress: () => void;
  }[];
  subtitle: string;
  title: string;
}) {
  const { colors } = useAppTheme();
  const fade = useRef(new Animated.Value(0)).current;
  console.log("options: ", options);
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fade,
        transform: [
          {
            translateY: fade.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Header */}
        <View style={styles.header}>

          {/* Eyebrow badge */}
          <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
            <Text style={[styles.badgeText, { color }]}>
              {eyebrow}
            </Text>
          </View>

          <Text style={[styles.title, compact && styles.titleCompact, { color: colors.text }]}>
            {title}
          </Text>

          <Text style={[styles.subtitle, compact && styles.subtitleCompact, { color: colors.textSub }]}>
            {subtitle}
          </Text>

        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* List */}
        <View style={styles.list}>
          {options.map((item, index) =>
            <OptionCard
              key={item.id}
              {...item}
              compact={compact}
              columns={columns}
              delay={index * 55}
            />
          )}
        </View>

      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingBottom: 48,
  },

  header: {
    paddingBottom: 16,
    gap: 6,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 4,
  },

  badgeText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.1,
    lineHeight: 34,
  },

  titleCompact: {
    fontSize: 23,
    lineHeight: 29,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },

  subtitleCompact: {
    fontSize: 13,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    marginVertical: 16,
  },
  list: {
    gap: 10,
  },
});