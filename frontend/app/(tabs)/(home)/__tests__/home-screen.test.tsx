import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import HomeScreen from '../index';
import { getMockStores } from '../../../../utils/test-utils/getMockStores';

// Mock icon components with strings to avoid Icon setState warning
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('@expo/vector-icons/SimpleLineIcons', () => 'SimpleLineIcons');
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

// Define mock functions outside so we can check them later
const mockLogout = jest.fn();
const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockPush = jest.fn();

// MOCK useAuth() to avoid needing real context
jest.mock('../../../../context/AuthContext', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

// Mock router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useFocusEffect: jest.fn((cb) => cb()), // simulate focus effect
}));

jest.mock('../../../../store/deck-card-store');

jest.spyOn(Alert, 'alert').mockImplementation(() => { });

// Mock console.error to suppress expected error logs during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('HomeScreen', () => {
  const mockRouter = {
    push: mockPush,
    replace: mockReplace,
    navigate: mockNavigate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    getMockStores(); // Use the mock stores utility
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

    render(<HomeScreen />);
    expect(screen.getByText(/loading flashcard decks/i)).toBeTruthy();
  });

  it('should display error message when there is an error loading cards', () => {
    getMockStores({ error: 'Something went wrong' }); // override only this value

    render(<HomeScreen />);
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
  });
});
