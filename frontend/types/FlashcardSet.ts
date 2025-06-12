export interface FlashcardSet {
  id: number;
  title: string; // e.g., "Intro to Cell Biology"
  subject: string; // e.g., "Biology"
  description?: string; // Optional text about the set
  flashcards: number[]; // referencing flashcard IDs
  createdBy?: string; // Optional user ID for personalization
  createdAt?: Date;
  updatedAt?: Date;
}
