import { Router } from 'express';
import { createFlashcard, getFlashcards, deleteFlashcard, updateFlashcard } from '../controllers/flashcards/flashcardsController';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = Router();
/**
 * @swagger
 * /api/flashcards/{deck_id}:
 *   get:
 *     summary: Get all flashcards
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deck_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
 * /api/flashcards/add:
 *   post:  
 *     summary: Create a flashcard
 *     tags: [Flashcards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               topic:
 *                 type: string
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               deck_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *       400:
 *         description: Missing required fields or flashcard already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Deck not found
 *       500:
 *         description: Failed to create flashcard
 * 
 * /api/flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flashcard deleted
 *   put:
 *     summary: Update a flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flashcard'
 *     responses:
 *       200:
 *         description: Flashcard updated
 */

router.get('/:deck_id', authenticateUser, getFlashcards);
router.post('/add', authenticateUser, createFlashcard);
router.delete('/delete/:id', authenticateUser, deleteFlashcard);
router.put('/update/:id', authenticateUser, updateFlashcard);

export default router;  
