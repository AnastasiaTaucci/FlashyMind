import { Request, Response } from 'express';
import supabase from '../utils/supabaseClient';

// POST /flashcards


// POST /auth/signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(201).json({ user: data.user });
};

// POST /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    res.status(401).json({ error: error.message });
    return;
  }
  res.status(200).json({ session: data.session, user: data.user });
};