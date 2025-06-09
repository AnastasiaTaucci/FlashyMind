import { Router } from 'express';
import { createFlashcard, getFlashcards, deleteFlashcard, updateFlashcard } from '../controllers/flashcards/flashcardsController';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = Router();
/**
 * @swagger
 * /api/flashcards:
 *   get:
 *     summary: Get all flashcards
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
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
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flashcard'
 *     responses:
 *       201:
 *         description: Flashcard created
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
