import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const steps = [
  { id: 'category', label: 'Category' },
  { id: 'subcategory', label: 'Person' },
  { id: 'mood', label: 'Mood' },
  { id: 'quote', label: 'Quote' },
];

export default function Progress({
  activeStepIndex,
  color,
}: {
  activeStepIndex: number;
  color: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>
          Step {activeStepIndex + 1} of {steps.length}
        </Text>

        <Text style={[styles.current, { color }]}>
          {steps[activeStepIndex].label}
        </Text>
      </View>

      <View style={styles.row}>
        {steps.map((step, index) => {
          const completed = index < activeStepIndex;
          const active = index === activeStepIndex;

          return (
            <React.Fragment key={step.id}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: completed || active ? color : '#E5E7EB',
                    borderColor: completed || active ? color : '#E5E7EB',
                    transform: [{ scale: active ? 1.12 : 1 }],
                  },
                ]}
              >
                {completed ? (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#fff"
                  />
                ) : (
                  <View
                    style={[
                      styles.innerDot,
                      {
                        backgroundColor: active ? '#fff' : '#BFC5CF',
                      },
                    ]}
                  />
                )}
              </View>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index < activeStepIndex
                          ? color
                          : '#E5E7EB',
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',

    padding: 18,

    borderRadius: 20,

    marginVertical: 20,

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 15,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 3,
  },

  header: {
    marginBottom: 18,
  },

  step: {
    fontSize: 13,

    color: '#6B7280',

    marginBottom: 4,

    fontWeight: '600',
  },

  current: {
    fontSize: 20,

    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  circle: {
    width: 30,

    height: 30,

    borderRadius: 15,

    justifyContent: 'center',

    alignItems: 'center',

    borderWidth: 2,
  },

  innerDot: {
    width: 8,

    height: 8,

    borderRadius: 4,
  },

  line: {
    flex: 1,

    height: 4,

    borderRadius: 2,

    marginHorizontal: 6,
  },
});