import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SubjectCardsScreen from '../subjectCards';
import { useFlashcardStore, useFlashcardSetStore } from '../../../../store/deck-card-store';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock('../../../../store/deck-card-store', () => ({
  useFlashcardStore: jest.fn(),
  useFlashcardSetStore: jest.fn(),
}));

// Mock MaterialIcons to prevent act() warnings
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('SubjectCardsScreen', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockFlashcardStore = {
    flashcards: [
      {
        id: 1,
        subject: 'Biology',
        topic: 'Cells',
        question: 'What is a cell?',
        answer: 'Basic unit of life',
        deck_id: 1,
      },
    ],
    fetchFlashcards: jest.fn(),
    deleteFlashcard: jest.fn(),
    isLoading: false,
    error: null,
  };

  const mockFlashcardSetStore = {
    flashcardSets: [
      {
        id: 1,
        title: 'Biology Basics',
        subject: 'Biology',
        description: 'Introduction to biology',
      },
    ],
    fetchFlashcardSets: jest.fn(),
    getFlashcardSetById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      subject: 'Biology',
      deckId: '1',
    });
    (useFlashcardStore as unknown as jest.Mock).mockReturnValue(mockFlashcardStore);
    (useFlashcardSetStore as unknown as jest.Mock).mockReturnValue(mockFlashcardSetStore);
    mockFlashcardSetStore.getFlashcardSetById.mockReturnValue(
      mockFlashcardSetStore.flashcardSets[0]
    );
  });

  // Render
  it('renders subject cards screen correctly', () => {
    const { getByText } = render(<SubjectCardsScreen />);

    expect(getByText('Biology Basics Cards')).toBeTruthy();
    expect(getByText('+ Create New Card')).toBeTruthy();
    expect(getByText('1 card')).toBeTruthy();
  });

  // Empty State
  it('shows empty state when no cards exist', () => {
    (useFlashcardStore as unknown as jest.Mock).mockReturnValue({
      ...mockFlashcardStore,
      flashcards: [],
    });

    const { getByText } = render(<SubjectCardsScreen />);

    expect(getByText('No cards yet')).toBeTruthy();
    expect(getByText('Create your first flashcard for Biology')).toBeTruthy();
    expect(getByText('Create First Card')).toBeTruthy();
  });

  // Card Display
  it('displays flashcards correctly', () => {
    const { getByText } = render(<SubjectCardsScreen />);

    expect(getByText('Cells')).toBeTruthy();
    expect(getByText('Q: What is a cell?')).toBeTruthy();
    expect(getByText('A: Basic unit of life')).toBeTruthy();
    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  // Navigation
  it('navigates to create card screen', () => {
    const { getByText } = render(<SubjectCardsScreen />);

    fireEvent.press(getByText('+ Create New Card'));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/addCard',
      params: { subject: 'Biology', deckId: '1' },
    });
  });

  it('navigates to edit card screen', () => {
    const { getByText } = render(<SubjectCardsScreen />);

    fireEvent.press(getByText('Edit'));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/addCard',
      params: {
        cardId: '1',
        deckId: '1',
        subject: 'Biology',
      },
    });
  });

  // Delete Card
  it('handles card deletion', async () => {
    mockFlashcardStore.deleteFlashcard.mockResolvedValueOnce({});
    const { getByText } = render(<SubjectCardsScreen />);

    fireEvent.press(getByText('Delete'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Card',
      'Are you sure you want to delete this flashcard?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Delete' }),
      ])
    );
  });

  // Loading State
  it('shows loading state', () => {
    (useFlashcardStore as unknown as jest.Mock).mockReturnValue({
      ...mockFlashcardStore,
      isLoading: true,
    });

    const { getByText } = render(<SubjectCardsScreen />);

    expect(getByText('Loading cards...')).toBeTruthy();
  });

  // Error State
  it('displays error message when present', () => {
    const errorMessage = 'Failed to load cards';
    (useFlashcardStore as unknown as jest.Mock).mockReturnValue({
      ...mockFlashcardStore,
      error: errorMessage,
    });

    const { getByText } = render(<SubjectCardsScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });
});
