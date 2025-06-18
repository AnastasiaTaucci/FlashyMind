import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/express';
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




/**
 * @swagger
 * /api/flashcard-decks:
 *   get:
 *     summary: Get all flashcard decks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of flashcard decks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlashcardDeck'
*/
export const getDecks = async (
  req: CustomRequest,
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

/**
 * @swagger
 * /api/flashcard-decks/add:
 *   post:
 *     summary: Add a new flashcard deck
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddDeckRequestBody'
 *     responses:
 *       201:
 *         description: Flashcard deck created
 */
export const addDeck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = {
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description,
      created_by: userId,
    }
    const deck = await addFlashcardDeck(userId, data.title, data.subject, data.description);
    res.status(201).json(deck[0]);

  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/flashcard-decks/update:
 *   patch:
 *     summary: Update a flashcard deck
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDeckRequestBody'
 *     responses:
 *       200:
 *         description: Flashcard deck updated
 */
export const updateDeck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const idNumber = parseInt(id, 10);

    if (isNaN(idNumber)) {
      res.status(400).json({ error: 'Invalid deck ID' });
      return;
    }

    const { title, subject, description } = req.body;

    const deck = await updateFlashcardDeck(userId, idNumber, title, subject, description);
    res.status(200).json(deck[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/flashcard-decks/delete:
 *   delete:
 *     summary: Delete a flashcard deck
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteDeckRequestBody'
 *     responses:
 *       200:
 *         description: Flashcard deck deleted
 */
export const deleteDeck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const idNumber = parseInt(id, 10);

    if (isNaN(idNumber)) {
      res.status(400).json({ error: 'Invalid deck ID' });
      return;
    }
    
    const forceDelete = req.query.force === 'true';
    const result = await deleteFlashcardDeck(userId, idNumber, forceDelete);

    if (!result.success && result.needsConfirmation) {
      res.status(200).json({ needsConfirmation: result.needsConfirmation, error: result.error });
    }

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ message: 'Flashcard deck deleted successfully' });
  } catch (error) {
    next(error);
  }
};