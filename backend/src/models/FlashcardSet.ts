import { Schema, model, Document, Types } from 'mongoose';
import { IFlashcard } from './Flashcard';

export interface IFlashcardSet extends Document {
  title: string;
  subject: string;
  description?: string;
  flashcards: Types.DocumentArray<IFlashcard>;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FlashcardSetSchema = new Schema<IFlashcardSet>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  flashcards: [{ type: Schema.Types.ObjectId, ref: 'Flashcard' }],
  createdBy: { type: String },
}, {
  timestamps: true,
});

export const FlashcardSet = model<IFlashcardSet>('FlashcardSet', FlashcardSetSchema);
