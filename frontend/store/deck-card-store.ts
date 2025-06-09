import { create } from 'zustand';
import { Flashcard } from '../types/Flashcard';
import { FlashcardSet } from '../types/FlashcardSet';
import flashcardsData from '../data/flashcards.json';
import flashcardSetsData from '../data/flashcardSets.json';
import * as api from '../service/api';

// Configuration flag
const USE_LOCAL_STORAGE_ONLY = true;

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
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  flashcards: flashcardsData,
  isLoading: false,
  error: null,

  setFlashcards: (cards) => set({ flashcards: cards }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchFlashcards: async () => {
    try {
      set({ isLoading: true, error: null });

      if (USE_LOCAL_STORAGE_ONLY) {
        console.log('Fetching flashcards from LOCAL STORAGE ONLY');
        const localCards = await api.getFlashcardsLocal();
        const hardcodedCards = Array.isArray(flashcardsData) ? flashcardsData : [];
        const combinedCards = localCards.concat(hardcodedCards);
        set({ flashcards: combinedCards, isLoading: false });
      } else {
        console.log('🌐 Fetching flashcards from BACKEND with fallback');
        const data = await api.getFlashcards();
        set({ flashcards: data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch flashcards',
        isLoading: false,
      });
    }
  },

  addFlashcard: async (card, deckId) => {
    try {
      set({ isLoading: true, error: null });

      if (USE_LOCAL_STORAGE_ONLY) {
        console.log('Adding flashcard to LOCAL STORAGE ONLY');
        const newCard = await api.createFlashcardLocal(card);
        set((state) => ({
          flashcards: [newCard, ...state.flashcards],
          isLoading: false,
        }));
      } else {
        throw new Error('Backend add card not implemented yet');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add flashcard',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFlashcard: async (id, updatedCard) => {
    try {
      set({ isLoading: true, error: null });

      if (USE_LOCAL_STORAGE_ONLY) {
        console.log('Updating flashcard in LOCAL STORAGE ONLY');

        // Update local storage first
        const existingCards = await api.getFlashcardsLocal();
        const updatedCards = existingCards.map((card: Flashcard) =>
          card.id === id ? { ...card, ...updatedCard, updated_at: new Date().toISOString() } : card
        );
        await api.updateFlashcardsLocal(updatedCards);

        // Update state
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id ? { ...card, ...updatedCard, updated_at: new Date().toISOString() } : card
          ),
          isLoading: false,
        }));
      } else {
        throw new Error('Backend update not implemented yet');
      }
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

      if (USE_LOCAL_STORAGE_ONLY) {
        console.log('Deleting flashcard from LOCAL STORAGE ONLY');
        const existingCards = await api.getFlashcardsLocal();
        const updatedCards = existingCards.filter((card: Flashcard) => card.id !== id);
        await api.updateFlashcardsLocal(updatedCards);

        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
          isLoading: false,
        }));
      } else {
        throw new Error('Backend delete not implemented yet');
      }
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

// Flashcard Set Store
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
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFlashcardSetStore = create<FlashcardSetState>((set, get) => ({
  flashcardSets: flashcardSetsData,
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
        data?.map((deck: any) => ({
          id: deck.id,
          title: deck.title,
          subject: deck.subject,
          description: deck.description,
          flashcards: [],
          createdBy: deck.created_by,
          createdAt: new Date(deck.created_at),
          updatedAt: new Date(deck.updated_at),
        })) || [];

      set({ flashcardSets: transformedData, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch flashcard sets',
        isLoading: false,
      });
    }
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
      // the backend endpoint for updating decks

      set((state) => ({
        flashcardSets: state.flashcardSets.map((setItem) =>
          setItem.id === id ? { ...setItem, ...updatedSet } : setItem
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
      // the backend endpoint for deleting decks

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
