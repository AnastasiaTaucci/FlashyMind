import request from 'supertest';
import express from 'express';
import authRouter from '../src/routes/auth';
import dotenv from 'dotenv';
dotenv.config();

import { expect, it, describe, beforeAll, afterAll, jest } from '@jest/globals';

// Mock supabase client
jest.mock('../src/utils/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(({ email, password }: { email: string; password: string }) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({
          data: { user: { id: '1', email }, session: { access_token: 'token', refresh_token: 'refresh' } },
          error: null
        });
      }
      return Promise.resolve({ data: null, error: { message: 'User creation failed' } });
    }),
    signInWithPassword: jest.fn(({ email, password }: { email: string; password: string }) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({
          data: { user: { id: '1', email }, session: { access_token: 'token', refresh_token: 'refresh' } },
          error: null
        });
      }
      return Promise.resolve({ data: null, error: { message: 'Invalid login credentials' } });
    }),
    verifyOtp: jest.fn()
  },
  from: jest.fn(() => ({
    update: jest.fn(() => ({
      eq: jest.fn()
    }))
  }))
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Signup Integration (Supabase)', () => {

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
    const email = 'test@example.com';
    const password = 'password123';
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    if (res.status !== 200) {
      console.error('Login error:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  
});

afterAll(() => {
  // Add any necessary cleanup logic here
  // For example, if you start a server, make sure to close it
  // server.close();
});
