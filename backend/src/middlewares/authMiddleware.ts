import { Request, Response, NextFunction } from 'express';
import supabase from '../utils/supabaseClient';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
};