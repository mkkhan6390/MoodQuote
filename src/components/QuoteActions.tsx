import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  accentColor: string;

  onShare: () => void;

  onDownload: () => void;

  onCopy: () => void;

  onFavorite: () => void;

  onRefresh: () => void;
};

export default function QuoteActions({
  accentColor,
  onShare,
  onDownload,
  onCopy,
  onFavorite,
  onRefresh,
}: Props) {
  const Action = ({
    icon,
    label,
    onPress,
  }: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.action,
        {
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: `${accentColor}15`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={accentColor}
        />
      </View>

      <Text style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Action
        icon="share-social-outline"
        label="Share"
        onPress={onShare}
      />

      <Action
        icon="download-outline"
        label="Save"
        onPress={onDownload}
      />

      <Action
        icon="copy-outline"
        label="Copy"
        onPress={onCopy}
      />

      <Action
        icon="heart-outline"
        label="Favorite"
        onPress={onFavorite}
      />

      <Action
        icon="refresh-outline"
        label="New"
        onPress={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 22,

    marginBottom: 18,
  },

  action: {
    alignItems: 'center',

    flex: 1,
  },

  icon: {
    width: 56,

    height: 56,

    borderRadius: 28,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 8,
  },

  label: {
    fontSize: 12,

    color: '#4B5563',

    fontWeight: '600',
  },
});