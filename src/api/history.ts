import * as FileSystem from 'expo-file-system/legacy';

export type Mood = 'Happy' | 'Sad' | 'Lost' | 'Lonely' | 'Afraid' | 'Angry' | 'Regretful';

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: Mood;
  category: string;
  subcategory: string;
}

const HISTORY_FILE = FileSystem.documentDirectory + 'mood_history.json';

export async function getMoodHistory(): Promise<MoodEntry[]> {
  //   await FileSystem.writeAsStringAsync(
  //   HISTORY_FILE,
  //   JSON.stringify([])
  // );
  try {
    const info = await FileSystem.getInfoAsync(HISTORY_FILE);
    if (!info.exists) {
      return [];
    }
    const content = await FileSystem.readAsStringAsync(HISTORY_FILE);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading mood history:', error);
    return [];
  }
}

export async function logMood(mood: Mood, category: string, subcategory: string): Promise<void> {
  try {
    const history = await getMoodHistory();
    const entry: MoodEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      mood,
      category,
      subcategory,
    };
    history.push(entry);
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error logging mood:', error);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify([], null, 2));
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}
