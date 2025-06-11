import { Request, Response } from 'express';
import supabase from '../../utils/supabaseClient';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication (Supabase)
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       400:
 *         description: Invalid input or user already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */

// POST /flashcards
export const createFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: 'Request body is empty' });
      return;
    }

    const { subject, topic, question, answer, deck_id } = req.body;

    if (!deck_id || !subject || !topic || !question || !answer) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if deck exists
    const { data: deck, error: deckError } = await supabase
      .from('flashcard_decks')
      .select('*')
      .eq('id', deck_id)
      .eq('created_by', userId);

    if (deckError) throw new Error(deckError.message);
    if (!deck || deck.length === 0) {
      res.status(404).json({ error: 'Deck not found' });
      return;
    }

    // Check if flashcard already exists
    const { data: existingFlashcard, error: flashcardError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deck_id)
      .eq('created_by', userId)
      .eq('question', question);

    if (flashcardError) throw new Error(flashcardError.message);
    if (existingFlashcard && existingFlashcard.length > 0) {
      res.status(400).json({ error: 'Flashcard already exists with the same question' });
      return;
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ subject, topic, question, answer, deck_id, created_by: userId }])
      .select('*');

    if (error) throw new Error(error.message);

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ error: 'Failed to create flashcard', details: error });
  }
};

// GET /flashcards
export const getFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json({
      data,
      total: data?.length || 0,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Failed to fetch flashcards', details: error });
  }
};

// GET /flashcards/:deck_id
export const getFlashcardsByDeckId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { deck_id } = req.params;

    if (!deck_id) {
      res.status(400).json({ error: 'Deck ID is required' });
      return;
    }

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deck_id)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json({
      data,
      total: data?.length || 0,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    });
  } catch (error) {
    console.error('Error fetching flashcards by deck ID:', error);
    res.status(500).json({ error: 'Failed to fetch flashcards for deck', details: error });
  }
};

// DELETE /flashcards/:id
export const deleteFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)
      .eq('created_by', userId);

    if (error) throw new Error(error.message);

    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Failed to delete flashcard', details: error });
  }
};

// PUT /flashcards/:id
export const updateFlashcard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { subject, topic, question, answer, deck_id } = req.body;
    const { data, error } = await supabase
      .from('flashcards')
      .update({ subject, topic, question, answer, deck_id })
      .eq('id', id)
      .eq('created_by', userId)
      .select('*');

    if (error) throw new Error(error.message);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ error: 'Failed to update flashcard', details: error });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Logged out successfully' });
};

