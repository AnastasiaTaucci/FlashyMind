export interface DetailedQuizResult {
  id: number;
  created_at: string;
  user_id: string;
  quiz_result_id: number;
  correct_answers: any; // JSON
  wrong_answers: any; // JSON
}
