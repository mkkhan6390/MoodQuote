import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../context/ThemeContext';
import { createDiaryEntry, CreateDiaryPayload } from '../api/diary';
import { Mood } from '../api/history';

const moodOptions: { mood: Mood; color: string; glyph: string; label: string }[] = [
  { mood: 'Happy', color: '#F7C948', glyph: '☀️', label: 'Happy' },
  { mood: 'Sad', color: '#5E81AC', glyph: '🌧️', label: 'Sad' },
  { mood: 'Lost', color: '#8A7A63', glyph: '🧭', label: 'Lost' },
  { mood: 'Lonely', color: '#8D5CF6', glyph: '🌙', label: 'Lonely' },
  { mood: 'Angry', color: '#F15BB5', glyph: '⚡', label: 'Angry' },
  { mood: 'Afraid', color: '#00A6D6', glyph: '🌀', label: 'Afraid' },
  { mood: 'Regretful', color: '#00A6D6', glyph: '💭', label: 'Regretful' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  prefilledMood?: Mood;
  subcategoryId?: string;
};

export default function DiaryForm({ visible, onClose, onSaved, prefilledMood, subcategoryId }: Props) {
  const { colors, isDark } = useAppTheme();
  const [mood, setMood] = useState<Mood | null>(prefilledMood ?? null);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = mood && description.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const payload: CreateDiaryPayload = {
      mood: mood!,
      description: description.trim(),
      subcategoryId,
    };

    const result = await createDiaryEntry(payload);
    setSaving(false);

    if (result) {
      setDescription('');
      setMood(prefilledMood ?? null);
      onSaved();
      onClose();
    }
  };

  const handleClose = () => {
    setDescription('');
    setMood(prefilledMood ?? null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View
            style={{
              backgroundColor: colors.bg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 16,
              paddingBottom: Platform.OS === 'ios' ? 40 : 24,
              paddingHorizontal: 20,
              maxHeight: '85%',
            }}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.textMuted,
                alignSelf: 'center',
                marginBottom: 16,
              }}
            />

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.3 }}>
                📝 New Diary Entry
              </Text>
              <Pressable onPress={handleClose} hitSlop={12}>
                <Ionicons name="close-circle" size={26} color={colors.textSub} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Mood Selector */}
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSub, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                How are you feeling?
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {moodOptions.map((item) => {
                  const selected = mood === item.mood;
                  return (
                    <Pressable
                      key={item.mood}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setMood(item.mood);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1.5,
                        borderColor: selected ? item.color : colors.border,
                        backgroundColor: selected ? `${item.color}18` : colors.surface,
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{item.glyph}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: selected ? item.color : colors.textSub }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Description */}
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSub, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                What happened?
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe how you feel and why..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={{
                  fontSize: 14,
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  minHeight: 120,
                  marginBottom: 24,
                }}
              />

              {/* Save Button */}
              <Pressable
                onPress={handleSave}
                disabled={!canSave || saving}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  backgroundColor: canSave
                    ? (mood ? moodOptions.find(m => m.mood === mood)?.color ?? '#2F80ED' : '#2F80ED')
                    : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  borderRadius: 16,
                  paddingVertical: 16,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="bookmark" size={18} color={canSave ? '#fff' : colors.textMuted} />
                    <Text style={{ fontSize: 15, fontWeight: '800', color: canSave ? '#fff' : colors.textMuted }}>
                      Save Entry
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
