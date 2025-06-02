import { Flashcard } from "./Flashcard";

export interface FlashcardDeck {
  id: string;
  title: string;                 // e.g., "Intro to Cell Biology"
  subject: string;              // e.g., "Biology"
  description?: string;         // Optional text about the set
  flashcards: Flashcard[];      // Array of flashcards
  createdBy?: string;           // Optional user ID for personalization
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddDeckRequestBody {
  title: string;
  subject: string;
  description?: string;
}

export interface UpdateDeckRequestBody {
  id: string;
  title: string;
  subject: string;
  description?: string;
}

export interface DeleteDeckRequestBody {
  id: string;
}