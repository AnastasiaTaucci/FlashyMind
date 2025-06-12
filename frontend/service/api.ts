import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard } from '../types/Flashcard';

const STORAGE_KEY = '@user_session';

export function getApiBaseUrl(): string {
  if (__DEV__) {
    const localhost = Constants.expoConfig?.hostUri?.split(':')[0];

    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    return `http://${localhost}:3000/api`;
  }

  return 'https://api.flashymind.com/api';
}

async function getAuthHeaders() {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEY);

    if (!session) {
      throw new Error('No authentication session found');
    }

    const parsedSession = JSON.parse(session);
    let token = parsedSession.access_token || parsedSession.token;
    const refreshToken = parsedSession.refresh_token;

    if (!token) {
      throw new Error('No access token found');
    }

    if (refreshToken && shouldRefreshToken(parsedSession)) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const newSession = await refreshResponse.json();
          token = newSession.access_token;

          const updatedSession = {
            ...parsedSession,
            access_token: newSession.access_token,
            refresh_token: newSession.refresh_token || refreshToken,
            token_refreshed_at: Date.now(),
          };

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
        }
      } catch (error) {
        console.error('Refresh token failed:', error);
        throw error;
      }
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error('Auth header error:', error);
    throw new Error('Authentication required');
  }
}

function shouldRefreshToken(session: any): boolean {
  const lastRefresh = session.token_refreshed_at || session.created_at || 0;
  const now = Date.now();
  const fiftyMinutes = 50 * 60 * 1000;

  return now - lastRefresh > fiftyMinutes;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.text();
    let errorMessage = 'Something went wrong. Please try again.';

    try {
      const parsedError = JSON.parse(errorData);
      errorMessage = parsedError.error || parsedError.message || errorMessage;
    } catch {
      console.error('Server error:', errorData);
      errorMessage = `Server error (${response.status}). Please try again later.`;
    }

    if (response.status === 401 && errorMessage.includes('Invalid or expired token')) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      throw new Error('SESSION_EXPIRED');
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export const API_BASE_URL = getApiBaseUrl();

// ===================
// Auth API functions
// ===================

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

// ========================
// Flashcard API functions
// ========================

export async function createFlashcard(
  card: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'created_by'>,
  deckId?: number
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/add`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...card, deck_id: deckId }),
  });

  return handleResponse(response);
}

export async function getFlashcards() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/`, {
    method: 'GET',
    headers,
  });

  const result = await handleResponse(response);
  return result?.data || result || [];
}

export async function getFlashcardsByDeckId(deckId: number) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/${deckId}`, {
    method: 'GET',
    headers,
  });

  const result = await handleResponse(response);
  return result?.data || result || [];
}

export async function updateFlashcard(id: number, updatedCard: Partial<Flashcard>) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedCard),
  });

  return handleResponse(response);
}

export async function deleteFlashcard(id: number) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    method: 'DELETE',
    headers,
  });

  return handleResponse(response);
}

// =============================
// Flashcard Deck API functions
// =============================

export async function createFlashcardDeck(title: string, subject: string, description?: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ title, subject, description }),
  });

  return handleResponse(response);
}

export async function getFlashcardDecks() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/`, {
    method: 'GET',
    headers,
  });

  return handleResponse(response);
}

export async function updateFlashcardDeck(
  id: string,
  title: string,
  subject: string,
  description?: string
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ title, subject, description }),
  });

  return handleResponse(response);
}

export async function deleteFlashcardDeck(id: number) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/${id}`, {
    method: 'DELETE',
    headers,
  });

  return handleResponse(response);
}
