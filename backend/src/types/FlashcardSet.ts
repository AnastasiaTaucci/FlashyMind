import { Flashcard } from "./Flashcard";

export interface FlashcardSet {
    id: string;
    title: string;                 // e.g., "Intro to Cell Biology"
    subject: string;              // e.g., "Biology"
    description?: string;         // Optional text about the set
    flashcards: Flashcard[];      // Array of flashcards
    createdBy?: string;           // Optional user ID for personalization
    createdAt?: Date;
    updatedAt?: Date;
  }
  