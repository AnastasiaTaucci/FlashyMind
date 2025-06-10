import { Request, Response, NextFunction } from 'express';
import supabase from '../utils/supabaseClient';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Token not found' });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal authentication error' });
  }
};
