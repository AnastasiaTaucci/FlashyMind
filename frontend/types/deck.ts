export interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  reviewCount?: number;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: FlashCard[];
  category: string;
  color: string;
  createdAt: Date;
  lastStudied?: Date;
  totalStudyTime?: number;
  accuracy?: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: Date;
  endTime?: Date;
  correctAnswers: number;
  totalAnswers: number;
  cardsStudied: string[];
}