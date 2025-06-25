export interface Flashcard {
  id: number;
  subject: string; // e.g., "Biology"
  topic: string; // e.g., "Cell Biology"
  question: string; // The front of the card
  answer: string; // The back of the card
  deck_id?: number; // Optional deck association
  created_by?: string; // User who created the card
  created_at?: string; // Creation timestamp
  updated_at?: string; // Update timestamp
}
