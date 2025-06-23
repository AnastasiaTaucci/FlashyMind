import supabase from '../utils/supabaseClient';

export const getFlashcardDecks = async (userId: string) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .select('*')
    .order('updated_at', { ascending: false })
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
  id: number,
  title: string,
  subject: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('flashcard_decks')
    .update({ title, subject, description })
    .eq('id', id)
    .eq('created_by', userId)
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

export const deleteFlashcardDeck = async (userId: string, id: number, forceDelete: boolean) => {
  if (!forceDelete){
      const { data: flashcards, error: flashcardsCheckError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('deck_id', id)
      .eq('created_by', userId);

    if (flashcardsCheckError) throw new Error(`Failed to check flashcards: ${flashcardsCheckError.message}`);

    if (flashcards && flashcards.length > 0) {
      return {
        success: false,
        needsConfirmation: true,
        error: `This deck contains ${flashcards.length} flashcard(s). Are you sure you want to delete all of them?`
      };
    }
  }
  // Delete deck
  const { data, error } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', id)
    .eq('created_by', userId)
    .select('*');

  if (error) throw new Error(`Failed to delete deck: ${error.message}`);

  return {
    success: true,
    data
  };
};