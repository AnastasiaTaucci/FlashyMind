import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AddDeckScreen from '../addDeck';
import { useFlashcardSetStore } from '../../../../store/deck-card-store';
import { getMockStores } from '../../../../utils/test-utils/getMockStores';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  useFocusEffect: jest.fn((cb) => cb()),
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

describe('AddDeckScreen', () => {
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
  };

  const mockStore = {
    getFlashcardSetById: jest.fn(),
    addFlashcardSet: jest.fn(),
    updateFlashcardSet: jest.fn(),
    fetchFlashcardSets: jest.fn(),
    error: null,
    setState: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    // Use getMockStores but then override with our specific mock
    getMockStores();
    (useFlashcardSetStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  // Render
  it('renders create deck form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AddDeckScreen />);

    expect(getByText('Create New Deck')).toBeTruthy();
    expect(getByPlaceholderText('e.g., Introduction to Biology')).toBeTruthy();
    expect(getByPlaceholderText('e.g., Biology, Math, History')).toBeTruthy();
    expect(getByPlaceholderText('Describe what this deck is about...')).toBeTruthy();
    expect(getByText('Create Deck')).toBeTruthy();
  });

  // Edit Mode Test
  it('renders edit mode when deckId is provided', () => {
    const existingDeck = {
      id: 1,
      title: 'Biology Basics',
      subject: 'Biology',
      description: 'Introduction to biology concepts',
    };

    (useLocalSearchParams as jest.Mock).mockReturnValue({ deckId: '1' });
    mockStore.getFlashcardSetById.mockReturnValue(existingDeck);

    const { getByText, getByDisplayValue } = render(<AddDeckScreen />);

    expect(getByText('Edit Deck')).toBeTruthy();
    expect(getByDisplayValue('Biology Basics')).toBeTruthy();
    expect(getByDisplayValue('Biology')).toBeTruthy();
    expect(getByText('Update Deck')).toBeTruthy();
  });

  // Validation
  it('shows validation errors for empty required fields', async () => {
    const { getByText, getByPlaceholderText } = render(<AddDeckScreen />);

    fireEvent.changeText(getByPlaceholderText('e.g., Introduction to Biology'), '');
    fireEvent.changeText(getByPlaceholderText('e.g., Biology, Math, History'), '');

    fireEvent.press(getByText('Create Deck'));

    await waitFor(() => {
      expect(getByText('Title is required')).toBeTruthy();
      expect(getByText('Subject is required')).toBeTruthy();
    });
  });

  // Creation
  it('handles successful deck creation', async () => {
    mockStore.addFlashcardSet.mockResolvedValueOnce({});
    const { getByText, getByPlaceholderText } = render(<AddDeckScreen />);

    fireEvent.changeText(getByPlaceholderText('e.g., Introduction to Biology'), 'Biology Basics');
    fireEvent.changeText(getByPlaceholderText('e.g., Biology, Math, History'), 'Biology');
    fireEvent.changeText(
      getByPlaceholderText('Describe what this deck is about...'),
      'Basic biology concepts'
    );

    fireEvent.press(getByText('Create Deck'));

    await waitFor(() => {
      expect(mockStore.addFlashcardSet).toHaveBeenCalledWith({
        title: 'Biology Basics',
        subject: 'Biology',
        description: 'Basic biology concepts',
        flashcards: [],
      });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Deck created successfully!',
        expect.any(Array)
      );
    });
  });

  // Error Handling
  it('handles creation error', async () => {
    const errorMessage = 'Failed to create deck';
    mockStore.addFlashcardSet.mockRejectedValueOnce(new Error(errorMessage));
    const { getByText, getByPlaceholderText } = render(<AddDeckScreen />);

    fireEvent.changeText(getByPlaceholderText('e.g., Introduction to Biology'), 'Biology Basics');
    fireEvent.changeText(getByPlaceholderText('e.g., Biology, Math, History'), 'Biology');

    fireEvent.press(getByText('Create Deck'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });

  // Cancel Button
  it('navigates back when cancel is pressed', () => {
    const { getByText } = render(<AddDeckScreen />);

    fireEvent.press(getByText('Cancel'));

    expect(mockRouter.back).toHaveBeenCalled();
  });
});
