import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

const steps = [
  { id: 'category' },
  { id: 'subcategory' },
  { id: 'mood' },
  { id: 'quote' },
];

export default function Progress({
  activeStepIndex,
  color,
}: {
  activeStepIndex: number;
  color: string;
}) {
  const { colors } = useAppTheme();
  // Animate active pill width
  const anims = useRef(steps.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    steps.forEach((_, i) => {
      Animated.timing(anims[i], {
        toValue: i <= activeStepIndex ? 1 : 0,
        duration: 280,
        useNativeDriver: false,
      }).start();
    });
  }, [activeStepIndex]);

  return (
    <View style={styles.row}>
      {steps.map((step, i) => {
        const isActive = i === activeStepIndex;
        const isDone = i < activeStepIndex;

        return (
          <Animated.View
            key={step.id}
            style={[
              styles.pill,
              {
                backgroundColor:
                  isActive || isDone
                    ? color
                    : colors.pillInactive,
                flex: isActive ? 2.2 : 1,
                opacity: anims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },

  pill: {
    height: 4,
    borderRadius: 999,
  },
});