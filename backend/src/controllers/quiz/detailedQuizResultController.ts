import { Request, Response } from 'express';
import supabase from '../../utils/supabaseClient';
import { createQuiz } from './quizController';

export const getDetailedQuizResults = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase.from('detailed_quiz_results').select('*');
  if (error) {
    console.log('❌ Error fetching detailed quiz results:', error);
    res.locals.responseData = { error: error.message };
    res.status(500).json(error);
    return;
  }
  console.log('✅ Fetched detailed quiz results:', data);
  res.locals.responseData = data;
  res.json(data);
};

export const getDetailedQuizResultById = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('detailed_quiz_results')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) {
    console.log('❌ Error fetching detailed quiz result by ID:', error);
    res.locals.responseData = { error: error.message };
    res.status(404).json(error);
    return;
  }
  console.log('✅ Fetched detailed quiz result by ID:', data);
  res.locals.responseData = data;
  res.json(data);
};

export const createDetailedQuizResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deck_id, user_id, user_answer } = req.body;

    const { data: deck, error: deckError } = await supabase.from('flashcard_decks').select('*').eq('id', deck_id).single();
    if (deckError) throw deckError;

    // Check the question answers with the deck flashcards
    const { data: flashcards, error: flashcardsError } = await supabase.from('flashcards').select('*').eq('deck_id', deck_id);
    if (flashcardsError) throw flashcardsError;
    
    // Calculate the correct answers array
    // user_answer is an array of answer objects with card_id property
    const correctAnswersArray = flashcards.filter((flashcard) => {
      return user_answer.some((answer: any) => answer.card_id === flashcard.id && answer.answer === flashcard.answer);
    }).map((correctAnswer) => {
      return {
        question: correctAnswer.question,
        user_answer: user_answer.find((answer: any) => answer.card_id === correctAnswer.id)?.answer || '',
        correct_answer: correctAnswer.answer,
      }
    });

    // Calculate the number of correct answers
    const correctAnswers = correctAnswersArray.length;
    
    // Create a new array with the incorrect answers
    const incorrectAnswersArray = flashcards.filter((flashcard) => {
      return !user_answer.some((answer: any) => answer.card_id === flashcard.id && answer.answer === flashcard.answer);
    }).map((incorrectAnswer) => {
      return {
        question: incorrectAnswer.question,
        user_answer: user_answer.find((answer: any) => answer.card_id === incorrectAnswer.id)?.answer || '',
        correct_answer: incorrectAnswer.answer,
      }
    });

    // Calculate the total score
    const totalScore = correctAnswers * 10;

    const supabaseData = {
      user_id: user_id, // Don't convert to int, keep as UUID string
      flashcard_deck_id: deck_id,
      score: totalScore,
      correct_answers: correctAnswersArray,
      wrong_answers: incorrectAnswersArray,
    }

    const { data, error } = await supabase.from('detailed_quiz_results').insert(supabaseData).select('*');

    if (error) throw error;
    const responseData = data[0];
    console.log('✅ Created detailed quiz result:', responseData);
    
    // After successfully creating detailed quiz result, create a quiz result
    try {
      const quizData = {
        user_id: user_id,
        flashcard_deck_id: deck_id,
        score: totalScore,
        total_questions: flashcards.length,
        correct_answers: correctAnswers,
      };
      
      // Create a mock request and response for the createQuiz function
      const mockReq = {
        body: quizData
      } as Request;
      
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => {
            console.log('✅ Created quiz result:', data);
          }
        }),
        json: (data: any) => {
          console.log('✅ Created quiz result:', data);
        }
      } as Response;
      
      await createQuiz(mockReq, mockRes);
    } catch (quizError) {
      console.error('❌ Error creating quiz result:', quizError);
      // Don't fail the entire request if quiz creation fails
    }
    
    res.locals.responseData = responseData;
    res.status(201).json(responseData);
  } catch (err) {
    console.error('❌ Error creating detailed quiz result:', err);
    res.locals.responseData = { error: 'Internal Server Error' };
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
