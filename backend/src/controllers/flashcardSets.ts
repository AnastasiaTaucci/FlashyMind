import { Request, Response } from 'express';
import { FlashcardSet } from '../models/FlashcardSet';

// POST /flashcard-sets
export const createFlashcardSet = async (req: Request, res: Response) => {
  try {
    const { title, subject, description, flashcards, createdBy } = req.body;
    const newSet = await FlashcardSet.create({ title, subject, description, flashcards, createdBy });
    res.status(201).json(newSet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard set', details: error });
  }
};

// GET /flashcard-sets
export const getFlashcardSets = async (_req: Request, res: Response) => {
  try {
    const sets = await FlashcardSet.find().populate('flashcards');
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flashcard sets', details: error });
  }
};
