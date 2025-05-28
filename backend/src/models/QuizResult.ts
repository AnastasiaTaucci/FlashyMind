import { Schema, model, Document } from 'mongoose';

export interface IQuizResult extends Document {
  userId: string;
  flashcardSetId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  dateTaken: Date;
}

const QuizResultSchema = new Schema<IQuizResult>({
  userId: { type: String, required: true },
  flashcardSetId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  dateTaken: { type: Date, required: true, default: Date.now },
});

export const QuizResult = model<IQuizResult>('QuizResult', QuizResultSchema);
