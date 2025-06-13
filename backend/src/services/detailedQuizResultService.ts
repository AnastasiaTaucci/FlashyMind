import { DetailedQuizResult } from '../types/DetailedQuizResult';
import supabase from '../utils/supabaseClient';

export const getAllDetailedQuizResults = async (): Promise<DetailedQuizResult[]> => {
  const { data, error } = await supabase.from('detailed_quiz_results').select('*');
  if (error) throw error;
  return data;
};

export const getDetailedQuizResultByIdService = async (id: number): Promise<DetailedQuizResult | null> => {
  const { data, error } = await supabase
    .from('detailed_quiz_results')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createDetailedQuizResultService = async (payload: Partial<DetailedQuizResult>): Promise<DetailedQuizResult> => {
  const { data, error } = await supabase.from('detailed_quiz_results').insert(payload).select('*');
  if (error) throw error;
  return data[0];
};

export const updateDetailedQuizResultService = async (id: number, payload: Partial<DetailedQuizResult>): Promise<DetailedQuizResult> => {
  const { data, error } = await supabase
    .from('detailed_quiz_results')
    .update(payload)
    .eq('id', id)
    .select('*');
  if (error) throw error;
  return data[0];
};

export const deleteDetailedQuizResultService = async (id: number): Promise<void> => {
  const { error } = await supabase.from('detailed_quiz_results').delete().eq('id', id);
  if (error) throw error;
};
