import { create } from 'zustand';
import { Flashcard } from '../types/Flashcard';
import { FlashcardSet } from '../types/FlashcardSet';
import * as api from '../service/api';
import { router } from 'expo-router';

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
  fetchFlashcardsByDeckId: (deckId: number) => Promise<void>;
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

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  flashcards: [],
  isLoading: false,
  error: null,

  fetchFlashcards: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.getFlashcards();
      const transformedData = data?.map(transformFlashcard) || [];
      set({ flashcards: transformedData, isLoading: false });
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        router.replace('/login');
        return;
      }
      set({
        error: error.message || 'Failed to fetch flashcards',
        flashcards: [],
        isLoading: false,
      });
    }
  },

  fetchFlashcardsByDeckId: async (deckId) => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.getFlashcardsByDeckId(deckId);
      const transformedData = data?.map(transformFlashcard) || [];
      set({ flashcards: transformedData, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch flashcards',
        flashcards: [],
        isLoading: false,
      });
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
  error: string | null;
  addFlashcardSet: (set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFlashcardSet: (id: number, updatedSet: Partial<FlashcardSet>) => Promise<void>;
  deleteFlashcardSet: (id: number) => Promise<void>;
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

export const useFlashcardSetStore = create<FlashcardSetState>((set, get) => ({
  flashcardSets: [],
  isLoading: false,
  error: null,

  fetchFlashcardSets: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await api.getFlashcardDecks();
      const transformedData = data?.map(transformFlashcardSet) || [];
      set({ flashcardSets: transformedData, isLoading: false });
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        router.replace('/login');
        return;
      }
      set({
        error: error.message || 'Failed to fetch flashcard sets',
        flashcardSets: [],
        isLoading: false,
      });
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

  deleteFlashcardSet: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.deleteFlashcardDeck(id);
      set((state) => ({
        flashcardSets: state.flashcardSets.filter((setItem) => setItem.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete flashcard set',
        isLoading: false,
      });
      throw error;
    }
  },

  getFlashcardSetById: (id) =>
    get().flashcardSets.find((set) => set.id === id || String(set.id) === String(id)),
}));
