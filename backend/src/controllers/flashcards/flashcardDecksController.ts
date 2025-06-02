import { Request, Response, NextFunction } from 'express';
import {
  getFlashcardDecks,
  addFlashcardDeck,
  updateFlashcardDeck,
  deleteFlashcardDeck
} from '../../services/flashcardDecksService';
import {
  AddDeckRequestBody,
  UpdateDeckRequestBody,
  DeleteDeckRequestBody
} from '../../types/FlashcardDeck';

export const getDecks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const decks = await getFlashcardDecks(userId);
    res.status(200).json(decks);
  } catch (error) {
    next(error);
  }
};

export const addDeck = async (
  req: Request<{}, {}, AddDeckRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { title, subject, description } = req.body;
    const deck = await addFlashcardDeck(userId, title, subject, description);
    res.status(201).json(deck);
  } catch (error) {
    next(error);
  }
};

export const updateDeck = async (
  req: Request<{}, {}, UpdateDeckRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { id, title, subject, description } = req.body;
    const deck = await updateFlashcardDeck(userId, id, title, subject, description);
    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
};

export const deleteDeck = async (
  req: Request<{}, {}, DeleteDeckRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { id } = req.body;
    const deck = await deleteFlashcardDeck(userId, id);
    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
};
