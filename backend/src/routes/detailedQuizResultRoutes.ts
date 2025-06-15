import express from 'express';
import {
  getDetailedQuizResults,
  getDetailedQuizResultById,
  createDetailedQuizResult,
  updateDetailedQuizResult,
  deleteDetailedQuizResult
} from '../controllers/quiz/detailedQuizResultController';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/detailed-quiz-results', authenticateUser, getDetailedQuizResults);
router.get('/detailed-quiz-results/:id', authenticateUser, getDetailedQuizResultById);
router.post('/detailed-quiz-results', authenticateUser, createDetailedQuizResult);
router.put('/detailed-quiz-results/:id', authenticateUser, updateDetailedQuizResult);
router.delete('/detailed-quiz-results/:id', authenticateUser, deleteDetailedQuizResult);

export default router;
