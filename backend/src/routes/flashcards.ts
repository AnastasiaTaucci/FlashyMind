import { Router } from 'express';
import { createFlashcard, getFlashcards } from '../controllers/flashcardsController';

const router = Router();

/**
 * @swagger
 * /flashcards:
 *   get:
 *     summary: Get all flashcards
 *     responses:
 *       200:
 *         description: A list of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
 *   post:
 *     summary: Create a new flashcard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flashcard'
 *     responses:
 *       201:
 *         description: Flashcard created
 */

router.get('/', getFlashcards);
router.post('/', createFlashcard);

export { router };
