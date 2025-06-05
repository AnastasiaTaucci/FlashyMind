<<<<<<< Updated upstream
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../types/express';
=======
import { Request, Response, NextFunction } from 'express';
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream








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
=======
export const getDecks = wrapAsync(async (
  req: Request,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
export const addDeck = wrapAsync(async (
  req: Request<{}, {}, AddDeckRequestBody>,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
    return;
>>>>>>> Stashed changes
  } catch (error) {
    next(error);
    return;
  }
});

<<<<<<< Updated upstream

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
=======
export const updateDeck = wrapAsync(async (
  req: Request<{}, {}, UpdateDeckRequestBody>,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
export const deleteDeck = wrapAsync(async (
  req: Request<{}, {}, DeleteDeckRequestBody>,
>>>>>>> Stashed changes
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
