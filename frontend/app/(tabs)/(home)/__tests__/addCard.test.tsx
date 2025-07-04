import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CreateCardScreen from '../addCard';
import { useFlashcardStore, useFlashcardSetStore } from '@/store/deck-card-store';
import { getMockStores } from '@/utils/test-utils/getMockStores';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  useFocusEffect: jest.fn((cb) => cb()), // simulate focus effect
}));

jest.mock('@/store/deck-card-store');

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock console.error to suppress expected error logs during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('CreateCardScreen', () => {
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
  };

  const mockFlashcardStore = {
    getFlashcardById: jest.fn(),
    addFlashcard: jest.fn(),
    updateFlashcard: jest.fn(),
    setState: jest.fn(),
    fetchFlashcards: jest.fn(),
    flashcards: [],
    isLoading: false,
    error: null,
  };

  const mockFlashcardSetStore = {
    getFlashcardSetById: jest.fn(),
    setState: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      subject: 'Biology',
      deckId: '1',
    });

    getMockStores();
    (useFlashcardStore as unknown as jest.Mock).mockReturnValue(mockFlashcardStore);
    (useFlashcardSetStore as unknown as jest.Mock).mockReturnValue(mockFlashcardSetStore);
  });

  // Render
  it('renders create card form correctly', () => {
    const { getByText, getByPlaceholderText } = render(<CreateCardScreen />);

    expect(getByText('Create Flashcard')).toBeTruthy();
    expect(getByPlaceholderText('Enter subject')).toBeTruthy();
    expect(getByPlaceholderText('Enter topic')).toBeTruthy();
    expect(getByPlaceholderText('Enter question')).toBeTruthy();
    expect(getByPlaceholderText('Enter answer')).toBeTruthy();
    expect(getByText('Save Card')).toBeTruthy();
  });

  // Edit Mode Test
  it('renders edit mode when cardId is provided', () => {
    const existingCard = {
      id: 1,
      subject: 'Biology',
      topic: 'Cells',
      question: 'What is a cell?',
      answer: 'Basic unit of life',
    };

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      cardId: '1',
      subject: 'Biology',
      deckId: '1',
    });
    mockFlashcardStore.getFlashcardById.mockReturnValue(existingCard);

    const { getByText, getByDisplayValue } = render(<CreateCardScreen />);

    expect(getByText('Edit Flashcard')).toBeTruthy();
    expect(getByDisplayValue('Cells')).toBeTruthy();
    expect(getByDisplayValue('What is a cell?')).toBeTruthy();
    expect(getByText('Update Card')).toBeTruthy();
  });

  // Validation
  it('shows validation errors for empty required fields', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateCardScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter subject'), '');
    fireEvent.changeText(getByPlaceholderText('Enter topic'), '');
    fireEvent.changeText(getByPlaceholderText('Enter question'), '');
    fireEvent.changeText(getByPlaceholderText('Enter answer'), '');

    fireEvent.press(getByText('Save Card'));

    await waitFor(() => {
      expect(getByText('Subject is required')).toBeTruthy();
      expect(getByText('Topic is required')).toBeTruthy();
      expect(getByText('Question is required')).toBeTruthy();
      expect(getByText('Answer is required')).toBeTruthy();
    });
  });

  // Creation
  it('handles successful card creation', async () => {
    mockFlashcardStore.addFlashcard.mockResolvedValueOnce({});
    const { getByText, getByPlaceholderText } = render(<CreateCardScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter subject'), 'Biology');
    fireEvent.changeText(getByPlaceholderText('Enter topic'), 'Cells');
    fireEvent.changeText(getByPlaceholderText('Enter question'), 'What is a cell?');
    fireEvent.changeText(getByPlaceholderText('Enter answer'), 'Basic unit of life');

    fireEvent.press(getByText('Save Card'));

    await waitFor(
      () => {
        expect(mockFlashcardStore.addFlashcard).toHaveBeenCalledWith(
          {
            subject: 'Biology',
            topic: 'Cells',
            question: 'What is a cell?',
            answer: 'Basic unit of life',
          },
          1
        );
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Flashcard created successfully!');
      },
      { timeout: 3000 }
    );
  });

  // Error Handling
  it('handles creation error', async () => {
    const errorMessage = 'Failed to create card';
    mockFlashcardStore.addFlashcard.mockRejectedValueOnce(new Error(errorMessage));
    const { getByText, getByPlaceholderText } = render(<CreateCardScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter subject'), 'Biology');
    fireEvent.changeText(getByPlaceholderText('Enter topic'), 'Cells');
    fireEvent.changeText(getByPlaceholderText('Enter question'), 'What is a cell?');
    fireEvent.changeText(getByPlaceholderText('Enter answer'), 'Basic unit of life');

    fireEvent.press(getByText('Save Card'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });
});
