import { create } from 'zustand';
import { Flashcard } from '../types/Flashcard';
import { FlashcardSet } from '../types/FlashcardSet';
import flashcardsData from '../data/flashcards.json';
import flashcardSetsData from '../data/flashcardSets.json';

// Flashcard Store
interface FlashcardState {
  flashcards: Flashcard[];
  setFlashcards: (cards: Flashcard[]) => void;
  addFlashcard: (card: Flashcard) => void;
  updateFlashcard: (id: string, updatedCard: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
}

export const useFlashcardStore = create<FlashcardState>((set) => ({
  flashcards: flashcardsData,
  setFlashcards: (cards) => set({ flashcards: cards }),
  addFlashcard: (card) => set((state) => ({ flashcards: [...state.flashcards, card] })),
  updateFlashcard: (id, updatedCard) =>
    set((state) => ({
      flashcards: state.flashcards.map((card) =>
        card.id === id ? { ...card, ...updatedCard } : card
      ),
    })),
  deleteFlashcard: (id) =>
    set((state) => ({
      flashcards: state.flashcards.filter((card) => card.id !== id),
    })),
}));

// Flashcard Set Store
interface FlashcardSetState {
  flashcardSets: FlashcardSet[];
  setFlashcardSets: (sets: FlashcardSet[]) => void;
  addFlashcardSet: (set: FlashcardSet) => void;
  updateFlashcardSet: (id: string, updatedSet: Partial<FlashcardSet>) => void;
  deleteFlashcardSet: (id: string) => void;
}

export const useFlashcardSetStore = create<FlashcardSetState>((set) => ({
  flashcardSets: flashcardSetsData,
  setFlashcardSets: (sets) => set({ flashcardSets: sets }),
  addFlashcardSet: (newSet) =>
    set((state) => ({ flashcardSets: [...state.flashcardSets, newSet] })),
  updateFlashcardSet: (id, updatedSet) =>
    set((state) => ({
      flashcardSets: state.flashcardSets.map((setItem) =>
        setItem.id === id ? { ...setItem, ...updatedSet } : setItem
      ),
    })),
  deleteFlashcardSet: (id) =>
    set((state) => ({
      flashcardSets: state.flashcardSets.filter((setItem) => setItem.id !== id),
    })),
}));
