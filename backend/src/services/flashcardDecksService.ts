import supabase from '../utils/supabaseClient';

export const getFlashcardDecks = async (userId: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('created_by', userId);

  if (error) throw new Error(error.message);
  return data;
};

export const addFlashcardDeck = async (userId: string, title: string, subject: string, description?: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .insert([{ title, subject, description, created_by: userId }]);

  if (error) throw new Error(error.message);
  return data;
};

export const updateFlashcardDeck = async (userId: string, id: string, title: string, subject: string, description?: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .update({ title, subject, description })
    .eq('id', id)
    .eq('created_by', userId);

  if (error) throw new Error(error.message);
  return data;
};

export const deleteFlashcardDeck = async (userId: string, id: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', id)
    .eq('created_by', userId);

  if (error) throw new Error(error.message);
  return data;
}; 