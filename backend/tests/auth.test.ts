import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth';
import dotenv from 'dotenv';
dotenv.config();

import { expect, it, describe, beforeAll, afterAll, jest } from '@jest/globals';

// Mock supabase client
jest.mock('../src/utils/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signUp: jest.fn(({ email, password }) => {
        if (!email || !password) {
          return { data: null, error: { message: 'Missing email or password' } };
        }
        if (email === 'existing@example.com') {
          return { data: null, error: { message: 'User already exists' } };
        }
        return { data: { user: { email, id: 'mock-user-id', email_confirmed_at: new Date().toISOString() } }, error: null };
      }),
      signInWithPassword: jest.fn(({ email, password }) => {
        if (email === 'ahmetdegeeer@gmail.com' && password === 'TestPassword123!') {
          return { data: { session: { token: 'mock-session-token', expires_in: 3600 }, user: { id: 'mock-user-id', email, email_confirmed_at: new Date().toISOString() } }, error: null };
        }
        return { data: null, error: { message: 'Invalid login credentials' } };
      })
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Signup Integration (Supabase)', () => {
  it('should return 201 and user object for valid signup', async () => {
    const email = `ahmetdegeeer@gmail.com`;
    const password = 'TestPassword123!';
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email, password });
    if (res.status !== 201) {
      console.error('Signup error:', res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('should return 400 for missing email or password', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('Auth Login Integration (Supabase)', () => {
  it('should login with the signup credentials', async () => {
    const email = `ahmetdegeeer@gmail.com`;
    const password = 'TestPassword123!';
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    if (res.status !== 200) {
      console.error('Login error:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.session).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  it('should return 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});
