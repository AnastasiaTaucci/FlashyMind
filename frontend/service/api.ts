import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard } from '../types/Flashcard';

const STORAGE_KEY = '@user_session';
import { useUserSessionStore } from '@/store/userSessionStore';



export async function getAccessToken() {
  const storedSession = await AsyncStorage.getItem(STORAGE_KEY);
  if (storedSession) {
    const parsedSession = JSON.parse(storedSession);
    const accessToken = parsedSession.access_token;
    return accessToken;
  } else {
    throw new Error('No access token found');
  }
}

export function getApiBaseUrl(): string {
  if (__DEV__) {
    const localhost = Constants.expoConfig?.hostUri?.split(':')[0];

    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    return `http://localhost:3000/api`;
  }

  return 'https://api.flashymind.com/api';
}


export const API_BASE_URL = getApiBaseUrl();


export async function handleResponse(response: Response) {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Request failed');
  }
  return result;
}

export async function signup(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}


export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse(response);
}

export async function createFlashcardLocal(
  card: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'created_by'>
) {
  try {
    const existingCards = await AsyncStorage.getItem('@local_flashcards');
    const cards = existingCards ? JSON.parse(existingCards) : [];

    const newCard = {
      id: Date.now().toString(),
      ...card,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'local_user',
    };

    cards.unshift(newCard);
    await AsyncStorage.setItem('@local_flashcards', JSON.stringify(cards));

    console.log('Card saved locally:', newCard);
    return newCard;
  } catch (error) {
    console.error('Error saving card locally:', error);
    throw error;
  }
}

export async function getFlashcardsLocal() {
  try {
    const existingCards = await AsyncStorage.getItem('@local_flashcards');
    return existingCards ? JSON.parse(existingCards) : [];
  } catch (error) {
    console.error('Error getting local cards:', error);
    return [];
  }
}

export async function updateFlashcardsLocal(cards: Flashcard[]) {
  try {
    await AsyncStorage.setItem('@local_flashcards', JSON.stringify(cards));
    console.log('Local flashcards updated:', cards.length);
  } catch (error) {
    console.error('Error updating local cards:', error);
    throw error;
  }
}

export async function createFlashcard(
  card: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'created_by'>,
  deckId?: string
) {
  throw new Error('Backend createFlashcard will be implemented');
}

export async function getFlashcards() {
  const headers = await getAccessToken();

  try {
    const response = await fetch(`${API_BASE_URL}/flashcard-decks/`, {
      method: 'GET',
      headers,
    });

    const decks = await handleResponse(response);

    const flashcards = decks
      .filter((deck: any) => {
        try {
          const desc = JSON.parse(deck.description || '{}');
          return desc.type === 'flashcard';
        } catch {
          return false;
        }
      })
      .map((deck: any) => {
        const cardData = JSON.parse(deck.description);
        return {
          id: deck.id,
          subject: deck.subject,
          topic: cardData.topic,
          question: cardData.question,
          answer: cardData.answer,
          created_at: deck.created_at,
          updated_at: deck.updated_at,
          created_by: deck.created_by,
        };
      });

    return flashcards;
  } catch (error) {
    console.error('Backend API failed, falling back to local storage:', error);

    return await getFlashcardsLocal();
  }
}

export async function updateFlashcard(id: string, updatedCard: Partial<Flashcard>) {
  // deck update endpoint
  throw new Error('Update not implemented yet.');
}

export async function deleteFlashcard(id: string) {
  // deck delete endpoint
  throw new Error('Delete not implemented yet.');
}


export async function createFlashcardDeck(title: string, subject: string, description?: string) {
  const headers = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/add`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ title, subject, description }),
  });

  return handleResponse(response);
}

