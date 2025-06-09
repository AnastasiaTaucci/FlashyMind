import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/express';
import {
  getFlashcardDecks,
  addFlashcardDeck,
  updateFlashcardDeck,
  deleteFlashcardDeck,
  getFlashcardDeck
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
    console.log('userId', userId);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    // const { page = 1, limit = 10 } = req.pagination || {}; // Pagination can be added when service supports it
    const decks = await getFlashcardDecks(userId); // Reverted to original signature
    res.status(200).json(decks);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/flashcard-decks/{id}:
 *   get:
 *     summary: Get a flashcard deck by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the flashcard deck to retrieve
 *         schema:
 *           type: string 
 *     responses:
 *       200:
 *         description: Flashcard deck retrieved
 */
export const getDeck = async (
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
    const deck = await getFlashcardDeck(userId, id);

    const deckData = {  
      id: deck[0].id,
      title: deck[0].title,
      subject: deck[0].subject,
      description: deck[0].description,
    }
    res.status(200).json(deckData);
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
    res.status(201).json({
      success: true,
      message: 'Flashcard deck created successfully',
      data: deck
    });

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
    const { id, title, subject, description } = req.body;
    const deck = await updateFlashcardDeck(userId, id, title, subject, description);
    res.status(201).json({
      success: true,
      message: 'Flashcard deck updated successfully',
      data: deck
    });
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
    const deck = await deleteFlashcardDeck(userId, id);
    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
};