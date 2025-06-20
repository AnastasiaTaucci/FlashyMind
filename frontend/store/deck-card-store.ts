import { create } from 'zustand';
import { Flashcard } from '../types/Flashcard';
import { FlashcardSet } from '../types/FlashcardSet';
import * as api from '../service/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransformedFlashcard } from '@/types/transformedFlashard';

// ===================
// Flashcard Store
// ===================

interface FlashcardState {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  addFlashcard: (
    card: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'created_by'>,
    deckId?: number
  ) => Promise<void>;
  updateFlashcard: (id: number, updatedCard: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: number) => Promise<void>;
  getFlashcardById: (id: number) => Flashcard | undefined;
  fetchFlashcards: () => Promise<void>;
}

const transformFlashcard = (card: any): Flashcard => ({
  id: card.id,
  question: card.question,
  answer: card.answer,
  topic: card.topic,
  subject: card.subject,
  deck_id: card.deck_id,
  created_by: card.created_by,
  created_at: card.created_at,
  updated_at: card.updated_at,
});

// AsyncStorage helpers
const cacheDeckFlashcards = async (flashcards: Flashcard[]) => {
  try {
    const jsonValue = JSON.stringify(flashcards);
    await AsyncStorage.setItem('RecentDeckFlashcards', jsonValue);
  } catch (error) {
    console.error('Failed to cache flashcards', error);
  }
};

const loadCachedDeckFlashcards = async (): Promise<Flashcard[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('RecentDeckFlashcards');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Failed to load cached flashcards', error);
    return null;
  }
};

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  flashcards: [],
  isLoading: false,
  error: null,

  fetchFlashcards: async () => {
    try {
      set({ isLoading: true, error: null });

      // Load and show cached flashcards from those decks
      const cachedCards = await loadCachedDeckFlashcards();
      if (cachedCards && cachedCards.length > 0) {
        set({ flashcards: cachedCards, isLoading: false });
      }

      // Then try fetching cards from Supabase
      const data = await api.getFlashcards();
      const transformedData = data?.map(transformFlashcard) || [];
      set({ flashcards: transformedData, isLoading: false });

      // Get saved decks and extract IDs
      const cachedDecks = await loadCachedDecks();
      const threeSavedDecks = cachedDecks?.map(deck => deck.id) || [];

      // From all fetched cards, store only those from the 3 saved decks
      const recentDeckFlashcards = transformedData.filter((card: TransformedFlashcard) =>
        threeSavedDecks.includes(card.deck_id)
      );

      await cacheDeckFlashcards(recentDeckFlashcards);
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        router.replace('/login');
        return;
      }
      set((state) => ({
        error: error.message || 'Failed to fetch flashcards',
        flashcards: state.flashcards.length > 0 ? state.flashcards : [],
        isLoading: false,
      }));
    }
  },

  addFlashcard: async (card, deckId) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.createFlashcard(card, deckId);
      const transformedData = transformFlashcard(data);
      set((state) => ({
        flashcards: [transformedData, ...state.flashcards],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create flashcard',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFlashcard: async (id, updatedCard) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.updateFlashcard(id, updatedCard);
      const transformedData = transformFlashcard(data);
      set((state) => ({
        flashcards: state.flashcards.map((card) => (card.id === id ? transformedData : card)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update flashcard',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFlashcard: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.deleteFlashcard(id);
      set((state) => ({
        flashcards: state.flashcards.filter((card) => card.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete flashcard',
        isLoading: false,
      });
      throw error;
    }
  },

  getFlashcardById: (id) =>
    get().flashcards.find((card) => card.id === id || String(card.id) === String(id)),
}));

// ======================
// Flashcard Set Store
// ======================

interface FlashcardSetState {
  flashcardSets: FlashcardSet[];
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
  addFlashcardSet: (set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<FlashcardSet>;
  updateFlashcardSet: (id: number, updatedSet: Partial<FlashcardSet>) => Promise<void>;
  deleteFlashcardSet: (
    id: number,
    forseDelete: boolean
  ) => Promise<{
    message?: string;
    needsConfirmation?: boolean;
    error?: string;
  }>;
  getFlashcardSetById: (id: number) => FlashcardSet | undefined;
  fetchFlashcardSets: () => Promise<void>;
}

const transformFlashcardSet = (deck: any): FlashcardSet => ({
  id: deck.id,
  title: deck.title,
  subject: deck.subject,
  description: deck.description,
  flashcards: [],
  createdBy: deck.created_by,
  createdAt: new Date(deck.created_at),
  updatedAt: new Date(deck.updated_at),
});

// AsyncStorage helpers

const cacheRecentDecks = async (decks: FlashcardSet[]) => {
  try {
    const jsonValue = JSON.stringify(decks);
    await AsyncStorage.setItem('RecentDecks', jsonValue);
  } catch (error) {
    console.error('Failed to cache decks', error);
  }
};

const loadCachedDecks = async (): Promise<FlashcardSet[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('RecentDecks');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Failed to load cached decks', error);
    return null;
  }
};

export const useFlashcardSetStore = create<FlashcardSetState>((set, get) => ({
  flashcardSets: [],
  isLoading: false,
  isDeleting: false,
  error: null,

  fetchFlashcardSets: async () => {
    try {
      set({ isLoading: true, error: null });

      // Load and show cached decks first
      const cached = await loadCachedDecks();
      if (cached && cached.length > 0) {
        set({ flashcardSets: cached, isLoading: false });
      }

      // Then try fetching decks from Supabase
      const data = await api.getFlashcardDecks();
      const transformedData = data?.map(transformFlashcardSet) || [];
      set({ flashcardSets: transformedData, isLoading: false });

      // Save top 3 decks to AsyncStorage
      await cacheRecentDecks(transformedData.slice(0, 3));

    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        router.replace('/login');
        return;
      }
      set((state) => ({
        error: error.message || 'Failed to fetch flashcard sets',
        flashcardSets: state.flashcardSets.length > 0 ? state.flashcardSets : [],
        isLoading: false,
      }));
    }
  },

  addFlashcardSet: async (newSet) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.createFlashcardDeck(newSet.title, newSet.subject, newSet.description);
      const transformedData = transformFlashcardSet(data);
      set((state) => ({
        flashcardSets: [transformedData, ...state.flashcardSets],
        isLoading: false,
      }));
      return transformedData; // Return the new deck!
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add flashcard set',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFlashcardSet: async (id, updatedSet) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.updateFlashcardDeck(
        id,
        updatedSet.title || '',
        updatedSet.subject || '',
        updatedSet.description
      );
      const transformedData = transformFlashcardSet(data);
      set((state) => ({
        flashcardSets: state.flashcardSets.map((setItem) =>
          setItem.id === id ? transformedData : setItem
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update flashcard set',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFlashcardSet: async (id, forceDelete) => {
    try {
      set({ isDeleting: true, error: null });
      const result = await api.deleteFlashcardDeck(id, forceDelete);
      if (!result.needsConfirmation) {
        set((state) => ({
          flashcardSets: state.flashcardSets.filter((setItem) => setItem.id !== id),
          isDeleting: false,
        }));
      }
      return result;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete flashcard set',
        isDeleting: false,
      });
      throw error;
    }
  },

  getFlashcardSetById: (id) =>
    get().flashcardSets.find((set) => set.id === id || String(set.id) === String(id)),
}));
