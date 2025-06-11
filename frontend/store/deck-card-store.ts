import { create } from 'zustand';
import { Flashcard } from '../types/Flashcard';
import { FlashcardSet } from '../types/FlashcardSet';
import * as api from '../service/api';
import { router } from 'expo-router';

// Flashcard Store
interface FlashcardState {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  setFlashcards: (cards: Flashcard[]) => void;
  addFlashcard: (
    card: Omit<Flashcard, 'id' | 'created_at' | 'updated_at' | 'created_by'>,
    deckId?: string
  ) => Promise<void>;
  updateFlashcard: (id: string, updatedCard: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  getFlashcardById: (id: string) => Flashcard | undefined;
  fetchFlashcards: () => Promise<void>;
  fetchFlashcardsByDeckId: (deckId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  flashcards: [],
  isLoading: false,
  error: null,

  setFlashcards: (cards) => set({ flashcards: cards }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchFlashcards: async () => {
    try {
      set({ isLoading: true, error: null });

      const data = await api.getFlashcards();

      const transformedData =
        data?.map((card: any) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          topic: card.topic,
          subject: card.subject,
          deck_id: card.deck_id,
          created_by: card.created_by,
          created_at: card.created_at,
          updated_at: card.updated_at,
        })) || [];

      set({ flashcards: transformedData, isLoading: false });
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        // Redirect to login
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

      const transformedData =
        data?.map((card: any) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          topic: card.topic,
          subject: card.subject,
          deck_id: card.deck_id,
          created_by: card.created_by,
          created_at: card.created_at,
          updated_at: card.updated_at,
        })) || [];

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

      const transformedData = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        topic: data.topic,
        subject: data.subject,
        deck_id: data.deck_id,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

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

      const transformedData = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        topic: data.topic,
        subject: data.subject,
        deck_id: data.deck_id,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      set((state) => ({
        flashcards: state.flashcards.map((card) =>
          card.id === id ? transformedData : card
        ),
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

  getFlashcardById: (id) => get().flashcards.find((card) => card.id === id),
}));

interface FlashcardSetState {
  flashcardSets: FlashcardSet[];
  isLoading: boolean;
  error: string | null;
  setFlashcardSets: (sets: FlashcardSet[]) => void;
  addFlashcardSet: (set: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFlashcardSet: (id: string, updatedSet: Partial<FlashcardSet>) => Promise<void>;
  deleteFlashcardSet: (id: string) => Promise<void>;
  getFlashcardSetById: (id: string) => FlashcardSet | undefined;
  fetchFlashcardSets: () => Promise<void>;
  updateFlashcardCounts: (flashcards: Flashcard[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFlashcardSetStore = create<FlashcardSetState>((set, get) => ({
  flashcardSets: [],
  isLoading: false,
  error: null,

  setFlashcardSets: (sets) => set({ flashcardSets: sets }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchFlashcardSets: async () => {
    try {
      set({ isLoading: true, error: null });

      const data = await api.getFlashcardDecks();

      const transformedData =
        data?.map((deck: any) => {
          return {
            id: deck.id,
            title: deck.title,
            subject: deck.subject,
            description: deck.description,
            flashcards: [],
            createdBy: deck.created_by,
            createdAt: new Date(deck.created_at),
            updatedAt: new Date(deck.updated_at),
          };
        }) || [];

      set({ flashcardSets: transformedData, isLoading: false });
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        // Redirect to login
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

  updateFlashcardCounts: (flashcards) => {
    set((state) => ({
      flashcardSets: state.flashcardSets.map((deck) => {
        const matchingFlashcards = flashcards.filter((card) => {
          if (card.deck_id && deck.id) {
            return card.deck_id === deck.id;
          }

          if (card.subject && deck.subject) {
            return card.subject.toLowerCase() === deck.subject.toLowerCase();
          }

          return false;
        });

        return {
          ...deck,
          flashcards: matchingFlashcards.map(card => card.id),
        };
      }),
    }));
  },

  addFlashcardSet: async (newSet) => {
    try {
      set({ isLoading: true, error: null });

      const data = await api.createFlashcardDeck(newSet.title, newSet.subject, newSet.description);

      const transformedData = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        description: data.description,
        flashcards: [],
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

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

      const transformedData = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        description: data.description,
        flashcards: [],
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

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

  getFlashcardSetById: (id) => get().flashcardSets.find((set) => set.id === id),
}));
