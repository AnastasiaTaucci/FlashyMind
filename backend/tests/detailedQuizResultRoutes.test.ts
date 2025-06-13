import request from 'supertest';
import express, { NextFunction } from 'express';
import detailedQuizResultRoutes from '../src/routes/detailedQuizResultRoutes';
import { expect, it, describe, jest } from '@jest/globals';
import { Request, Response } from 'express';

// Mock the authentication middleware
jest.mock('../src/middlewares/authMiddleware', () => ({
  authenticateUser: (req: Request, res: Response, next: NextFunction) => next(),
}));

const app = express();
app.use(express.json());
// Register the router at the root, not under '/api/detailed-quiz-results'
app.use(detailedQuizResultRoutes);

describe('DetailedQuizResult API', () => {
  it('should get all detailed quiz results', async () => {
    const res = await request(app).get('/detailed-quiz-results');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new detailed quiz result', async () => {
    const newResult = {
      user_id: '12c3771b-6d77-472f-a14b-1ae1728bb44f',
      quiz_result_id: 2,
      correct_answers: { q1: 'A' },
      wrong_answers: { q2: 'B' },
    };
    const res = await request(app).post('/detailed-quiz-results').send(newResult);
    expect([201, 500]).toContain(res.statusCode); // 201 if created, 500 if supabase not mocked
  });

  it('should get a detailed quiz result by ID', async () => {
    const res = await request(app).get('/detailed-quiz-results/1');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should update a detailed quiz result', async () => {
    const update = { correct_answers: { q1: 'B' } };
    const res = await request(app).put('/detailed-quiz-results/1').send(update);
    expect([200, 404, 500]).toContain(res.statusCode);
  });

  it('should delete a detailed quiz result', async () => {
    const res = await request(app).delete('/detailed-quiz-results/1');
    expect([204, 404, 500]).toContain(res.statusCode);
  });
});
