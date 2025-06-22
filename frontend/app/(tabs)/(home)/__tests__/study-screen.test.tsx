import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import StudyDeckScreen from '@/app/(tabs)/(home)/study';
import mockDecks from '@/data/flashcardSets.json';
import mockCards from '@/data/flashcards.json';

// to be able to change values
let mockFlashcardDecks = mockDecks;
let mockFlashcards = mockCards;

// Mock router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: () => ({ deckId: '1' }),
}));

// mocks the Zustand store with mock data
jest.mock('@/store/deck-card-store', () => ({
  useFlashcardSetStore: () => mockFlashcardDecks,
  useFlashcardStore: () => mockFlashcards,
}));

// Disable shuffle
jest.mock('@/utils/shuffle', () => ({
  shuffle: (arr: any[]) => arr, // disables shuffling
}));

describe('StudyDeckScreen', () => {
  // Silence expected AsyncStorage errors during tests (e.g. mocked save/load failures)
  // Prevents noisy console output for known issues while still allowing real errors to show
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (
        typeof msg === 'string' &&
        (msg.includes('Failed to save review progress') ||
          msg.includes('Failed to save load progress'))
      ) {
        return;
      }
    });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render deck title and first question', () => {
    render(<StudyDeckScreen />);
    expect(screen.getByText(/Study:/i)).toBeTruthy();
    expect(screen.getByText('Intro to Biology')).toBeTruthy();
    expect(screen.getByText(/Q: What is the function of the mitochondria/i)).toBeTruthy();
  });

  it('shows and hides the answer', async () => {
    render(<StudyDeckScreen />);
    // Show the answer
    fireEvent.press(screen.getByText('Show Answer'));

    // Wait for the text to appear
    await waitFor(() => {
      expect(screen.getByText(/A:.*ATP.*respiration/i)).toBeTruthy();
    });

    // Hide it again
    fireEvent.press(screen.getByText('Hide Answer'));

    // Wait for it to disappear
    await waitFor(() => {
      expect(screen.queryByText(/A:.*ATP.*respiration/i)).toBeNull();
    });
  });

  it('should mark card for review and show second card', () => {
    render(<StudyDeckScreen />);
    fireEvent.press(screen.getByText('Needs Practice'));
    expect(screen.getByText(/Q: What are the building blocks of proteins/i)).toBeTruthy();
  });

  it('should mark card as learned and finish deck', () => {
    render(<StudyDeckScreen />);
    fireEvent.press(screen.getByText('Learned')); // skip 1st
    fireEvent.press(screen.getByText('Learned')); // skip 2nd
    expect(screen.getByText(/🎉 You learned all cards!/i)).toBeTruthy();
  });

  it('should show message when deck is not found', () => {
    mockFlashcardDecks = []; // simulate missing deck

    render(<StudyDeckScreen />);
    expect(screen.getByText(/Deck not found/i)).toBeTruthy();
  });
});
