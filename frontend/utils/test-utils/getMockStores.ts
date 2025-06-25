/**
 * Mocks Zustand stores for decks and flashcards.
 * Use this in test setup to control store state like flashcardSets, isLoading, etc.
 *
 * Example usage:
 *   getMockStores(); // uses default mocks
 *   getMockStores({ isLoading: true }); // override just one value
 */

import * as deckStore from '@/store/deck-card-store';
import * as exploreStore from '@/store/explore-deck-store';
import mockDecks from '@/data/flashcardSets.json';
import mockCards from '@/data/flashcards.json';

type MockOptions = {
  flashcardSets?: any[];
  flashcards?: any[];
  isLoading?: boolean;
  error?: string | null;
  fetchFlashcardSets?: jest.Mock;
  fetchFlashcards?: jest.Mock;
  fetchExploreDeck?: jest.Mock;
};

// Helper function to mock deck and flashcard store values for tests
export function getMockStores({
  // Set default values for the store mocks (used if no overrides are passed in)
  flashcardSets = mockDecks, // Default deck data from mockDecks.json
  flashcards = mockCards, // Default flashcard data from mockCards.json
  isLoading = false, // Default loading state is false
  error = null, // Default error state is null
  fetchFlashcardSets = jest.fn(), // Allow injecting a custom mock to track calls to fetchFlashcardSets
  fetchFlashcards = jest.fn(), // Allow injecting a custom mock to track calls to fetchFlashcards
  fetchExploreDeck = jest.fn(), // Allow injecting a custom mock to track calls to fetchExploreDeck
}: MockOptions = {}) {
  // {} makes sure the function receives an empty object by default.
  // Mock the return value of useFlashcardSetStore (used to manage decks)
  jest.spyOn(deckStore, 'useFlashcardSetStore').mockReturnValue({
    flashcardSets, // Use either the passed-in or default deck data
    fetchFlashcardSets, // Fake fetch function (prevents real API calls)
    isLoading, // Set loading state for testing loading UI
    error, // Set error message to simulate fetch failure
    setState: jest.fn(), // Mock setState for error clearing
    notConnected: false, // Add notConnected to prevent button disabling
    isDeleting: false, // Add isDeleting state
  });

  // Mock the return value of useFlashcardStore (used to manage flashcards)
  jest.spyOn(deckStore, 'useFlashcardStore').mockReturnValue({
    flashcards, // Use either the passed-in or default flashcard data
    fetchFlashcards, // Fake fetch function (prevents real API calls)
    setState: jest.fn(), // Mock setState for error clearing
  });

  // Mock the return value of useExploreDeckStore (used to manage explore functionality)
  jest.spyOn(exploreStore, 'useExploreDeckStore').mockReturnValue({
    fetchExploreDeck, // Fake fetch function (prevents real API calls)
    setState: jest.fn(), // Mock setState for error clearing
  });
}
