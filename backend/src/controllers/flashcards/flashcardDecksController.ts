import { Request, Response } from 'express';
import { getFlashcardDecks, addFlashcardDeck, updateFlashcardDeck, deleteFlashcardDeck } from '../../services/flashcardDecksService';
import { AddDeckRequestBody, UpdateDeckRequestBody, DeleteDeckRequestBody } from '../../types/FlashcardDeck';

export const getDecks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decks = await getFlashcardDecks(userId);
    res.status(200).json(decks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const addDeck = async (req: Request<{}, {}, AddDeckRequestBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { title, subject, description } = req.body;
    const deck = await addFlashcardDeck(userId, title, subject, description);
    res.status(201).json(deck);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const updateDeck = async (req: Request<{}, {}, UpdateDeckRequestBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id, title, subject, description } = req.body;
    const deck = await updateFlashcardDeck(userId, id, title, subject, description);
    res.status(200).json(deck);
  }  catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteDeck = async (req: Request<{}, {}, DeleteDeckRequestBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.body;
    const deck = await deleteFlashcardDeck(userId, id);
    res.status(200).json(deck);
  }  catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}; 