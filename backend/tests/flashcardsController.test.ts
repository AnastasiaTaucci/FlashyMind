import { Request, Response } from 'express';
import { createFlashcard } from '../src/controllers/flashcards/flashcardsController';
import supabase from '../src/utils/supabaseClient';
import { expect, it, describe, beforeAll, afterAll, jest, beforeEach } from '@jest/globals';

let deckId: number;
let userId: string;

beforeAll(async () => {
  // Login user
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'degerahmet.dev@gmail.com',
    password: 'StrongTestPassword123!'
  });
  if (authError || !user) throw new Error('Failed to login user');
  userId = user.id;

  // Create a flashcard deck and get its ID
  const { data, error } = await supabase
    .from('flashcard_decks')
    .insert([{ title: 'Test Deck', subject: 'Math', description: 'Test Description', created_by: userId }])
    .select('id');

  if (error) {
    console.error('Error creating flashcard deck:', error);
    throw new Error('Failed to create flashcard deck');
  }
  deckId = data?.[0]?.id;
});

afterAll(async () => {
  // Clean up flashcards and decks
  await supabase.from('flashcards').delete().eq('deck_id', deckId);
  await supabase.from('flashcard_decks').delete().eq('id', deckId);

  // Logout user
  await supabase.auth.signOut();

  // Wait a bit to prevent open handles error
  await new Promise(resolve => setTimeout(resolve, 1000));
});

describe('Flashcards Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn() as jest.Mock;
    statusMock = jest.fn(() => ({ json: jsonMock })) as jest.Mock;
    req = { body: {}, query: {}, params: {}, user: { id: userId } } as Partial<Request>;
    res = { status: statusMock, json: jsonMock } as Partial<Response>;
  });

  describe('createFlashcard', () => {
    it('should return 400 if body is empty', async () => {
      req.body = {};
      await createFlashcard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Request body is empty' });
    });

    it('should return 201 and flashcard data on successful creation', async () => {
      const uniqueQuestion = `What is x? ${Date.now()}`;
      req.body = {
        subject: 'Math',
        topic: 'Algebra',
        question: uniqueQuestion,
        answer: 'x is a variable',
        deck_id: deckId
      };

      await createFlashcard(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        subject: 'Math',
        topic: 'Algebra',
        question: uniqueQuestion,
        answer: 'x is a variable',
        deck_id: deckId
      }));
    });
  });
});
