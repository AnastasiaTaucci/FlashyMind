import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

jest.mock('../src/utils/supabaseClient', () => ({
  auth: {
    signUp: jest.fn().mockImplementation(({ email, password }) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({
          data: { user: { id: '1', email }, session: { access_token: 'token', refresh_token: 'refresh' } },
          error: null
        });
      }
      return Promise.resolve({ data: null, error: { message: 'User creation failed' } });
    }),
    signInWithPassword: jest.fn().mockImplementation(({ email, password }) => {
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

describe('Auth Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should return 201 and user data on successful signup', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and user data on successful login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    it('should return 401 if login fails', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'degerrahmet@gmail.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 