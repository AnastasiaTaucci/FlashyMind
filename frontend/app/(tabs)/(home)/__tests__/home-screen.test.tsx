import { render, screen, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/(home)/index';
import { getMockStores } from '@/utils/test-utils/getMockStores';

// Mock icon components with strings to avoid Icon setState warning
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('@expo/vector-icons/SimpleLineIcons', () => 'SimpleLineIcons');
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

// Define mock functions outside so we can check them later
const mockLogout = jest.fn();
const mockReplace = jest.fn();
const mockNavigate = jest.fn();

// MOCK useAuth() to avoid needing real context
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ navigate: mockNavigate, replace: mockReplace }),
  useFocusEffect: jest.fn((fn) => fn()),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    getMockStores(); // uses default mockDecks and mockCards
  });

  it('should render HomeSceen heading and "+ New Deck" button', () => {
    render(<HomeScreen />);

    expect(screen.getByText(/your flashcard decks/i)).toBeTruthy();
    expect(screen.getByText('+ New Deck')).toBeTruthy();
  });

  it('should call logout and redirect to login screen', async () => {
    render(<HomeScreen />);
    await fireEvent.press(screen.getByText(/Logout/i));

    // logout was called
    expect(mockLogout).toHaveBeenCalled();

    // router.replace('/login') was called
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('should navigate to addDeck screen when "+ New Deck" is pressed', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText(/new deck/i));

    expect(mockNavigate).toHaveBeenCalledWith('./addDeck');
  });

  it('should show loading message when loading', () => {
      getMockStores({ isLoading: true }); // override only this value

      render(<HomeScreen/>);
      expect(screen.getByText(/loading flashcard sets/i)).toBeTruthy();
  });

  it('should display error message when there is an error loading cards', () => {
    getMockStores({ error: 'Something went wrong' }); // override only this value

    render(<HomeScreen/>);
    expect(screen.getByText(/.*something went wrong.*/i)).toBeTruthy();
  });

  it('should show empty state when no decks exist and offer the user to create one', () => {
    getMockStores({ flashcardSets: [] }); // override only this value

    render(<HomeScreen />);
    expect(screen.getByText(/you have no decks yet. tap/i)).toBeTruthy();
  });

  it('should call fetch functions when pull-to-refresh is triggered', async () => {
    const mockFetchSets = jest.fn();
    const mockFetchCards = jest.fn();

    getMockStores({
        flashcardSets: [],
        flashcards: [],
        fetchFlashcardSets: mockFetchSets,
        fetchFlashcards: mockFetchCards,
    });

    render(<HomeScreen />);
    await act(async () => {
        await screen.getByTestId('flatlist').props.refreshControl.props.onRefresh();
    });

    expect(mockFetchSets).toHaveBeenCalled();
    expect(mockFetchCards).toHaveBeenCalled();
  })
});
