import { Schema, model, Document } from 'mongoose';

export interface IFlashcard extends Document {
  subject: string;
  topic: string;
  question: string;
  answer: string;
}

const FlashcardSchema = new Schema<IFlashcard>({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export const Flashcard = model<IFlashcard>('Flashcard', FlashcardSchema);
