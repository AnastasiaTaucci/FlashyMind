export interface Quiz {
  id: number;
  created_at: string;
  user_id: string;
  flashcard_deck_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  date_taken: string;
}

export interface QuizResult {
  id: number;
  quiz_id: number;
  user_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  date_taken: string;
}