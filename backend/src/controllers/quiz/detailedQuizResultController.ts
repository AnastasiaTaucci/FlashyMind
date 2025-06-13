import { Request, Response } from 'express';
import supabase from '../../utils/supabaseClient';

export const getDetailedQuizResults = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from('detailed_quiz_results').select('*');
  if (error) {
    res.status(500).json(error);
    return;
  }
  res.json(data);
};

export const getDetailedQuizResultById = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('detailed_quiz_results')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    res.status(404).json(error);
    return;
  }
  res.json(data);
};

export const createDetailedQuizResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('detailed_quiz_results').insert(req.body).select('*');
    if (error) throw error;
    const responseData = data[0];
    res.status(201).json(responseData);
  } catch (err) {
    console.error('Error creating detailed quiz result:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateDetailedQuizResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('detailed_quiz_results')
      .update(req.body)
      .eq('id', req.params.id)
      .select('*');
    if (error) throw error;
    const responseData = data[0];
    res.json(responseData);
  } catch (err) {
    console.error('Error updating detailed quiz result:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteDetailedQuizResult = async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.from('detailed_quiz_results').delete().eq('id', req.params.id).select('*');
  if (error) {
    res.status(500).json(error);
    return;
  }
  res.status(204).send();
};
