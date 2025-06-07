export interface Flashcard {
    id: string;
    subject: string;        // e.g., "Biology"
    topic: string;          // e.g., "Cell Biology"
    question: string;       // The front of the card
    answer: string;         // The back of the card
    deck_id: string;        // The ID of the deck this card belongs to
  }
  