import request from 'supertest';
import express, { NextFunction } from 'express';
import quizRoutes from '../src/routes/quizRoutes';
import { expect, it, describe, jest } from '@jest/globals';
import { Request, Response } from 'express';

// Mock the authentication middleware
jest.mock('../src/middlewares/authMiddleware', () => ({
    authenticateUser: (req: Request, res: Response, next: NextFunction) => next(),
  }));
  
  const app = express();
  app.use(express.json());
  app.use('/api', quizRoutes);
  
  describe('Quiz API', () => {
    it('should get all quizzes', async () => {
      const res = await request(app).get('/api/quizzes');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  
    it('should get a quiz by ID', async () => {
      const res = await request(app).get('/api/quizzes/1');
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('id', 1);
      } else {
        expect(res.statusCode).toEqual(404);
      }
    });
  
    it('should create a new quiz', async () => {
      const newQuiz = {
        user_id: "12c3771b-6d77-472f-a14b-1ae1728bb44f",
        flashcard_deck_id: 89,
        score: 10,
        total_questions: 10,
        correct_answers: 10,
        date_taken: new Date().toISOString(),
      };
      const res = await request(app).post('/api/quizzes').send(newQuiz);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });
  
    it('should update a quiz', async () => {
      const updatedQuiz = {
        score: 8,
        total_questions: 10,
        correct_answers: 8,
      };
      const res = await request(app).put('/api/quizzes/2').send(updatedQuiz);
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('score', 8);
      } else {
        expect(res.statusCode).toEqual(404);
      }
    });
  
    it('should delete a quiz', async () => {
      const res = await request(app).delete('/api/quizzes/1');
      if (res.statusCode === 204) {
        expect(res.statusCode).toEqual(204);
      } else {
        expect(res.statusCode).toEqual(404);
      }
    });
  });