import { Platform } from 'react-native';
import Constants from 'expo-constants';

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
  console.log('Login API response:', result);

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
  const response = await fetch(`${API_BASE_URL}/flashcard-decks`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch decks');
  }

  return result;
}

export async function addDeck(deck: { title: string; subject: string; description?: string }) {
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/update/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update deck');
  }

  return result;
}

export async function deleteDeck(id: string) {
  const response = await fetch(`${API_BASE_URL}/flashcard-decks/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete deck');
  }

  return result;
}

