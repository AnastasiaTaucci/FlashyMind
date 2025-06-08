import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useUserSessionStore } from '@/store/userSessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_session';

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
      return `http://10.0.2.2:3000/api`;
    }
    return `http://localhost:3000/api`;
  }

  return 'https://api.flashymind.com/api';
}

export const API_BASE_URL = getApiBaseUrl();



export async function signup(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Signup failed');
  }

  return result;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }

  return result;
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Logout failed');
  }

  return result;
}

export async function getDecks() {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcard-decks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch decks');
  }

  return result;
}

export async function getDeck(id: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch deck');
  }

  return result;
}

export async function addDeck(deck: { title: string; subject: string; description?: string }) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(deck),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to add deck');
  }

  return result;
}

export async function updateDeck(
  id: string,
  deck: { title: string; subject: string; description?: string }
) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/update/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(deck),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update deck');
  }

  return result;
}

export async function deleteDeck(id: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete deck');
  }

  return result;
}

export async function fetchCards(id: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/flashcards/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch cards');
  }
  return result.data;
}


export async function getCard(id: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcards/get/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch card');
  }
  return result;
}

export async function updateCard(id: string, card: { question: string; answer: string; subject: string; topic: string }) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcards/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(card),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to update card');
  }
  return result;
}

export async function addCard(card: { question: string; answer: string; deck_id: string; subject: string; topic: string }) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcards/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(card),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to add card');
  }
  return result;
}

export async function deleteFlashcard(id: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/flashcards/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete flashcard');
  }
  return result;
}