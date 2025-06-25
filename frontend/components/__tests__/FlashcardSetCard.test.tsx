import { render, screen, fireEvent } from '@testing-library/react-native';
import FlashcardSetCard from '../FlashcardSetCard';
import { getMockStores } from '@/utils/test-utils/getMockStores';
import mockDecks from '@/data/flashcardSets.json';
import mockCards from '@/data/flashcards.json';
import { Alert } from 'react-native';

// Mock icon components with strings to avoid Icon setState warning
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

// Define mock functions outside so we can check them later
const mockPush = jest.fn();

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('FlashcardSetCard', () => {
  const mockDeck = mockDecks[0]; // deck with id: "01", title: "Intro to Biology"
  const filteredCards = mockCards.filter((card) => card.deck_id === mockDeck.id); // 2 cards

  beforeEach(() => {
    jest.clearAllMocks();
    getMockStores();
  });

  it('should display the correct card count', () => {
    render(<FlashcardSetCard item={mockDeck} />);
    expect(screen.getByText(`Cards: ${filteredCards.length}`)).toBeTruthy();
  });

  it('should navigate to the Study screen when Study button is pressed', () => {
    render(<FlashcardSetCard item={mockDeck} />);
    fireEvent.press(screen.getByText('Study'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: './study',
      params: { deckId: mockDeck.id },
    });
  });

  it('should navigate to the Quiz screen when Quiz button is pressed', () => {
    render(<FlashcardSetCard item={mockDeck} />);
    fireEvent.press(screen.getByText('Quiz'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: './(quiz)/[id]',
      params: { id: mockDeck.id },
    });
  });

  it('should navigate to the Cards screen when cards icon is pressed', () => {
    render(<FlashcardSetCard item={mockDeck} />);
    fireEvent.press(screen.getByTestId('edit-button'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: './subjectCards',
      params: { subject: mockDeck.subject, deckId: mockDeck.id },
    });
  });

  it('should show delete confiramtion when delete icon is pressed', () => {
    // spyOn intercepts any call to Alert.alert (from React Native), so we can track if it's used during the test
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {}); // Mock Alert.alert from React Native so we can verify it's called without actually showing a popup
    render(<FlashcardSetCard item={mockDeck} />);
    fireEvent.press(screen.getByTestId('delete-button'));
    expect(alertSpy).toHaveBeenCalled();
  });
});
