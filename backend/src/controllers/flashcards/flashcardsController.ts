import { Request, Response } from 'express';
import { Flashcard } from '../../models/Flashcard';

// POST /flashcards
export const createFlashcard = async (req: Request, res: Response) => {
  try {
    const { subject, topic, question, answer } = req.body;
    const flashcard = await Flashcard.create({ subject, topic, question, answer });
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard', details: error });
  }
};

// GET /flashcards
export const getFlashcards = async (req: Request, res: Response) => {
  try {
    const { subject } = req.query;
    const flashcards = await Flashcard.find(subject ? { subject } : {});
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flashcards', details: error });
  }
};
