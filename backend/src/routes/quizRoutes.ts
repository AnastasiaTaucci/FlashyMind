import express from 'express';
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } from '../controllers/quiz/quizController';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/quizzes', authenticateUser, getQuizzes);
router.get('/quizzes/:id', authenticateUser, getQuizById);
router.post('/quizzes', authenticateUser, createQuiz);
router.put('/quizzes/:id', authenticateUser, updateQuiz);
router.delete('/quizzes/:id', authenticateUser, deleteQuiz);

export default router;