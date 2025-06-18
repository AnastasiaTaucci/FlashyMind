import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import SubjectCardsScreen from '@/app/(tabs)/(explore)/subjectCards';
import { Alert } from 'react-native';
import mockCards from '@/data/flashcards.json';


const mockAddExploreFlashcardSet = jest.fn();

const mockStoreState = {
  flashcards: mockCards,
  isLoading: false,
  error: null,
  addExploreFlashcardSet: mockAddExploreFlashcardSet,
}

// Mock router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: () => ({ category: 'Science', amount: '3' }),
}));

// Mock Alert. Watches when Alert.alert(...) is called, but doesn’t actually show any popup.
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock Zustand store
jest.mock('@/store/explore-deck-store', () => ({
  useExploreDeckStore: () => mockStoreState,
}));

describe('SubjectCardsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render heading and list of cards', () => {
    render(<SubjectCardsScreen />);

    expect(screen.getByText(/Science Cards/)).toBeTruthy();
    expect(screen.getByText('Card #1')).toBeTruthy();
    expect(screen.getByText('Q: What is the function of the mitochondria?')).toBeTruthy();
  });

  it('should call Alert and go back when "+ Add to Your Decks" is pressed', async () => {
    render(<SubjectCardsScreen />);
    fireEvent.press(screen.getByText('+ Add to Your Decks'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0]; // .mock.calls: an array that shows every time this function was called.
      const buttons = alertCall[2]; // The 3rd argument is the buttons array that holds ["Success", "Deck added to your library!", [array of buttons]]
      const okButton = buttons?.find((btn: any) => btn.text === 'OK');
      okButton?.onPress?.(); // Simulate pressing OK
      
      expect(mockBack).toHaveBeenCalled();
  });

  it('should show error if no flashcards', () => {
    mockStoreState.flashcards = [];

    render(<SubjectCardsScreen />);
    expect(screen.getByText(/error displaying cards/i)).toBeTruthy();
    expect(screen.getByText(/explore one more time/i)).toBeTruthy();
  });
});
