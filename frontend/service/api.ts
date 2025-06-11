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

    // Check if token is likely expired (Supabase tokens expire after 1 hour)
    // We'll try to refresh if we have a refresh token and the access token is old
    if (refreshToken && shouldRefreshToken(parsedSession)) {
      try {
        console.log('Attempting to refresh token...');
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const newSession = await refreshResponse.json();
          token = newSession.access_token;

          // Update stored session with new tokens
          const updatedSession = {
            ...parsedSession,
            access_token: newSession.access_token,
            refresh_token: newSession.refresh_token || refreshToken,
            token_refreshed_at: Date.now(),
          };

          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
          console.log('Token refreshed successfully');
        } else {
          console.log('Token refresh failed, will use existing token');
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        // Continue with existing token, will fail gracefully if expired
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return headers;
  } catch (error) {
    console.error('Auth header error:', error);
    throw new Error('Authentication required');
  }
}

// Helper function to determine if token should be refreshed
function shouldRefreshToken(session: any): boolean {
  const lastRefresh = session.token_refreshed_at || session.created_at || 0;
  const now = Date.now();
  const fiftyMinutes = 50 * 60 * 1000; // Refresh before 1-hour expiry

  return (now - lastRefresh) > fiftyMinutes;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.text();
    let errorMessage = errorData;

    try {
      const parsedError = JSON.parse(errorData);
      errorMessage = parsedError.error || parsedError.message || errorData;
    } catch {
      // If parsing fails, use the raw error data
    }

    // Check if it's an authentication error
    if (response.status === 401 && errorMessage.includes('Invalid or expired token')) {
      // Clear the stored session and notify the app to logout
      await AsyncStorage.removeItem(STORAGE_KEY);

      // You might want to emit an event or use a callback here
      // For now, we'll throw a specific error that the UI can catch
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

  const result = await handleResponse(response);
  return result;
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
  } catch (error) {
    console.error('Error updating local cards:', error);
    throw error;
  }
}

export async function createFlashcard(
  card: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'created_by'>,
  deckId?: string
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

  try {
    const response = await fetch(`${API_BASE_URL}/flashcards/`, {
      method: 'GET',
      headers,
    });

    const result = await handleResponse(response);

    // Extract the flashcards from the data property
    if (result && result.data) {
      return result.data;
    }

    return result || [];
  } catch (error) {
    console.error('Failed to fetch flashcards:', error);
    throw error;
  }
}

export async function getFlashcardsByDeckId(deckId: string) {
  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${API_BASE_URL}/flashcards/${deckId}`, {
      method: 'GET',
      headers,
    });

    const result = await handleResponse(response);

    // Extract the flashcards from the data property
    if (result && result.data) {
      return result.data;
    }

    return result || [];
  } catch (error) {
    console.error(`Failed to fetch flashcards for deck ${deckId}:`, error);
    throw error;
  }
}

export async function updateFlashcard(id: string, updatedCard: Partial<Flashcard>) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/update/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatedCard),
  });

  return handleResponse(response);
}

export async function deleteFlashcard(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcards/delete/${id}`, {
    method: 'DELETE',
    headers,
  });

  return handleResponse(response);
}

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

  try {
    const response = await fetch(`${API_BASE_URL}/flashcard-decks/`, {
      method: 'GET',
      headers,
    });

    const result = await handleResponse(response);
    return result || [];
  } catch (error) {
    console.error('Failed to fetch flashcard decks:', error);
    throw error;
  }
}

export async function updateFlashcardDeck(id: string, title: string, subject: string, description?: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ title, subject, description }),
  });

  return handleResponse(response);
}

export async function deleteFlashcardDeck(id: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/flashcard-decks/${id}`, {
    method: 'DELETE',
    headers,
  });

  return handleResponse(response);
}
