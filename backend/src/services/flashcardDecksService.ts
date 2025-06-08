import supabase from '../utils/supabaseClient';

export const getFlashcardDecks = async (userId: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('created_by', userId);

  if (error) throw new Error(error.message);
  return data;
};

export const getFlashcardDeck = async (userId: string, id: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('id', id)
    .eq('created_by', userId);

  if (error) throw new Error(error.message);
  return data;
};


export const addFlashcardDeck = async (
  userId: string,
  title: string,
  subject: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .insert([{ title, subject, description, created_by: userId }])
    .select('*');
  
  if (error) throw new Error(error.message);
  return data;
};

export const updateFlashcardDeck = async (
  userId: string,
  id: string,
  title: string,
  subject: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .update({ title, subject, description })
    .eq('id', id)
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

export const deleteFlashcardDeck = async (userId: string, id: string) => {
  // First, delete all flashcards associated with the deck
  const { error: flashcardsError } = await supabase
    .from('flashcards')
    .delete()
    .eq('deck_id', id);

  if (flashcardsError) throw new Error(flashcardsError.message);

  // Then, delete the deck itself
  const { data, error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', id)
    .eq('created_by', userId)
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};