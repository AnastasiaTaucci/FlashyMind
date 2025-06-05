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
import { wrapAsync } from '../../utils/wrapAsync';

export const getDecks = wrapAsync(async (
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
    // const { page = 1, limit = 10 } = req.pagination || {}; // Pagination can be added when service supports it
    const decks = await getFlashcardDecks(userId); // Reverted to original signature
    res.status(200).json(decks);
    return;
  } catch (error) {
    next(error);
    return;
  }
  });

export const addDeck = wrapAsync(async (
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

    res.status(201).json({
      success: true,
      message: 'Flashcard deck created successfully',
      data: deck
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

export const updateDeck = wrapAsync(async (
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

    res.status(201).json({
      success: true,
      message: 'Flashcard deck updated successfully',
      data: deck
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

export const deleteDeck = wrapAsync(async (
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
    return;
  } catch (error) {
    next(error);
    return;
  }
});
