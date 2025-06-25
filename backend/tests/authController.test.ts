import { Request, Response } from 'express';
import { signup, login } from '../src/controllers/authController';
import supabase from '../src/utils/supabaseClient';

jest.mock('../src/utils/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    verifyOtp: jest.fn()
  },
  from: jest.fn(() => ({
    update: jest.fn(() => ({
      eq: jest.fn()
    }))
  }))
}));

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    req = { body: {}, query: {} };
    res = { status: statusMock, json: jsonMock };
  });

  describe('signup', () => {
    it('should return 201 and user data on successful signup', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' }, session: { access_token: 'token', refresh_token: 'refresh' } },
        error: null
      });

      await signup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        user: { id: '1', email: 'test@example.com' },
        access_token: 'token',
        refresh_token: 'refresh'
      });
    });

    it('should return 400 if signup fails', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'User creation failed' }
      });

      await signup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User creation failed' });
    });
  });

  describe('login', () => {
    it('should return 200 and user data on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' }, session: { access_token: 'token', refresh_token: 'refresh' } },
        error: null
      });

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        user: { id: '1', email: 'test@example.com' },
        access_token: 'token',
        refresh_token: 'refresh'
      });
    });

    it('should return 401 if login fails', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      });

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid login credentials' });
    });
  });

 
}); 