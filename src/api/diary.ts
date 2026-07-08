import { Mood } from './history';

const BACKEND_URL = 'http://192.168.0.4:6000';

export interface DiaryEntry {
  _id: string;
  userId?: string;
  mood: Mood;
  subcategoryId?: string;
  description: string;
  createdAt: string;
}

export interface CreateDiaryPayload {
  userId?: string;
  mood: Mood;
  subcategoryId?: string;
  description: string;
}

export async function createDiaryEntry(payload: CreateDiaryPayload): Promise<DiaryEntry | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/diary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return null;
  }
}

export async function fetchDiaryEntries(userId?: string): Promise<DiaryEntry[]> {
  try {
    let url = `${BACKEND_URL}/api/diary`;
    if (userId) url += `?userId=${encodeURIComponent(userId)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return [];
  }
}
