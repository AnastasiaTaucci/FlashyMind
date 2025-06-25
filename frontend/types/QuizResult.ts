export interface QuizResult {
  userId: string;
  flashcardSetId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  dateTaken: Date;
}
