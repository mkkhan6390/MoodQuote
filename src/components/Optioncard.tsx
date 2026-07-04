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
import { LinearGradient } from 'expo-linear-gradient';

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
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 450,
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
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <Pressable
        accessibilityRole="button"
        android_ripple={{
          color: `${accent}20`,
        }}
        onPress={async () => {
          await Haptics.selectionAsync();
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          {
            flexBasis: columns === 3 ? '31%' : '48%',
            minHeight: compact ? 105 : 115,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <LinearGradient
          colors={[accent, `${accent}AA`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.leftAccent}
        />

        <View style={styles.topRow}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${accent}15`,
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={24}
              color={accent}
            />
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#BFC5CF"
          />
        </View>

        <View style={styles.content}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              compact && {
                fontSize: 16,
              },
            ]}
          >
            {label}
          </Text>

          <Text
            numberOfLines={1}
            style={styles.subtitle}
          >
            {detail}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 16,

    marginBottom: 12,

    borderWidth: 1,

    borderColor: '#EEF2F7',

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,
  },

  leftAccent: {
    position: 'absolute',

    left: 0,

    top: 0,

    bottom: 0,

    width: 5,
  },

  topRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  iconContainer: {
    width: 48,

    height: 48,

    borderRadius: 16,

    justifyContent: 'center',

    alignItems: 'center',
  },

  content: {
    marginTop: 14,
  },

  title: {
    fontSize: 18,

    fontWeight: '700',

    color: '#111827',

    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,

    color: '#6B7280',
  },
});