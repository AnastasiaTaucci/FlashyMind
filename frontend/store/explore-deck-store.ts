import { create } from 'zustand';
import { Flashcard } from '@/types/Flashcard';
import { decode } from 'he';
import * as api from '../service/api';
import { FlashcardSet } from '@/types/FlashcardSet';

type ExploreState = {
  isLoading: boolean;
  error: string | null;
  flashcards: Omit<Flashcard, 'id'>[];
  fetchExploreDeck: (amount: string, category: string, difficulty: string) => Promise<void>;
  addExploreFlashcardSet: (set: Omit<FlashcardSet, 'id' | 'flashcards'>) => Promise<void>;
};

const categoryMap: Record<string, number> = {
  'General Knowledge': 9,
  'Entertainment: Books': 10,
  'Entertainment: Film': 11,
  'Entertainment: Music': 12,
  'Entertainment: Musicals & Theatres': 13,
  'Entertainment: Television': 14,
  'Entertainment: Video Games': 15,
  'Entertainment: Board Games': 16,
  'Science & Nature': 17,
  'Science: Computers': 18,
  'Science: Mathematics': 19,
  Mythology: 20,
  Sports: 21,
  Geography: 22,
  History: 23,
  Politics: 24,
  Art: 25,
  Celebrities: 26,
  Animals: 27,
  Vehicles: 28,
  'Entertainment: Comics': 29,
  'Science: Gadgets': 30,
  'Entertainment: Japanese Anime & Manga': 31,
  'Entertainment: Cartoon & Animations': 32,
};

export const useExploreDeckStore = create<ExploreState>((set, get) => ({
  flashcards: [],
  isLoading: false,
  error: null,

  fetchExploreDeck: async (amount, category, difficulty) => {
    try {
      set({ isLoading: true, error: null });

      let url = `https://opentdb.com/api.php?amount=${amount}`;

      if (category !== 'Any Category' && categoryMap[category]) {
        url += `&category=${categoryMap[category]}`;
      }

      if (difficulty !== 'Any Difficulty') {
        url += `&difficulty=${difficulty.toLowerCase()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!data.results) throw new Error('Invalid response from API');

      set({
        flashcards: data.results.map((item: any) => ({
          subject: decode(item.category),
          topic: decode(item.category).replace(/^[^:]+:\s*/, ''),
          question: decode(item.question),
          answer: decode(item.correct_answer),
        })),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch explore deck', isLoading: false });
    }
  },
  addExploreFlashcardSet: async (newSet) => {
    try {
      set({ error: null });
      const data = await api.createFlashcardDeck(newSet.title, newSet.subject, newSet.description);
      const deckId = data.id;
      const { flashcards } = get();
      for (const card of flashcards) {
        await api.createFlashcard(card, deckId);
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add explore flashcard set',
      });
      throw error;
    }
  },
}));
