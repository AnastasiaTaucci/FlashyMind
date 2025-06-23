import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import ExploreDeckScreen from '@/app/(tabs)/(explore)/index';
import { PaperProvider } from 'react-native-paper';

export function renderWithPaper(ui: React.ReactNode) {
  return render(<PaperProvider>{ui}</PaperProvider>);
}

// Mock fetchExploreDeck function
const mockFetchExploreDeck = jest.fn();

// Mock Zustand store
jest.mock('@/store/explore-deck-store', () => ({
  useExploreDeckStore: () => ({
    fetchExploreDeck: mockFetchExploreDeck,
  }),
}));

// Mock router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useFocusEffect: jest.fn((cb) => cb()), // simulate focus effect
}));

describe('ExploreDeckScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render heading and input fields', () => {
    renderWithPaper(<ExploreDeckScreen />);
    expect(screen.getByText(/Import External Decks/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/enter number/i)).toBeTruthy();
    expect(screen.getByText(/Select Category/i)).toBeTruthy();
    expect(screen.getByText(/Select Difficulty/i)).toBeTruthy();
    expect(screen.getByText(/Start Exploring/i)).toBeTruthy();
  });

  it('should submit the form and navigate to subjectCards screen', async () => {
    renderWithPaper(<ExploreDeckScreen />);

    // Fill input with "5"
    fireEvent.changeText(screen.getByPlaceholderText(/enter number/i), '5');

    // Press the Explore button
    fireEvent.press(screen.getByText(/Start Exploring/i));

    await waitFor(() => {
      expect(mockFetchExploreDeck).toHaveBeenCalledWith(5, 'Any Category', 'Any Difficulty');
      expect(mockPush).toHaveBeenCalledWith({
        pathname: './subjectCards',
        params: {
          category: 'Any Category',
          difficulty: 'Any Difficulty',
          amount: 5,
        },
      });
    });
  });

  it('should show validation error when amount is empty', async () => {
    renderWithPaper(<ExploreDeckScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/enter number/i), '');
    fireEvent.press(screen.getByText(/Start Exploring/i));

    await waitFor(() => {
      expect(screen.getByText(/number of questions is required/i)).toBeTruthy();
      expect(mockFetchExploreDeck).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('should show validation error for invalid number', async () => {
    renderWithPaper(<ExploreDeckScreen />);

    fireEvent.changeText(screen.getByPlaceholderText(/enter number/i), '0');
    fireEvent.press(screen.getByText(/Start Exploring/i));

    await waitFor(() => {
      expect(screen.getByText(/must be greater than or equal to 1/i)).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText(/enter number/i), '100');
    fireEvent.press(screen.getByText(/Start Exploring/i));

    await waitFor(() => {
      expect(screen.getByText(/must be less than or equal to 50/i)).toBeTruthy();
    });
  });
});
