import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../context/ThemeContext';

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
  const { colors, isDark } = useAppTheme();

  type ActionProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
    primary?: boolean;
  };

  const Action = ({ icon, onPress, primary = false }: ActionProps) => (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.action,
        primary && styles.primaryAction,
        primary && { backgroundColor: `${accentColor}30` },
        { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.92 : 1 }] },
      ]}
    >
      <Ionicons
        name={icon}
        size={primary ? 24 : 21}
        color={primary ? accentColor : (isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.60)')}
      />
    </Pressable>
  );

  return (
    <BlurView
      intensity={colors.blurIntensity - 10}
      tint={colors.blurTint}
      style={[
        styles.blurWrap,
        { borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)' }
      ]}
    >
      <View style={[styles.container, { backgroundColor: colors.actionBar }]}>
        <Action icon="share-social-outline" onPress={onShare} />
        <Action icon="download-outline" onPress={onDownload} />
        <Action icon="refresh-outline" onPress={onRefresh} primary />
        <Action icon="copy-outline" onPress={onCopy} />
        <Action icon="heart-outline" onPress={onFavorite} />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 12,
    borderWidth: 1,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },

  action: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryAction: {
    borderRadius: 25,
    marginHorizontal: 4,
  },
});