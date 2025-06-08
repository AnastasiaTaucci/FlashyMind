import { Router } from 'express';
import { createFlashcard, getFlashcards, deleteFlashcard, updateFlashcard, getFlashcard  } from '../controllers/flashcards/flashcardsController';
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
 * /api/flashcards/delete/{id}:
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
 * 
 * /api/flashcards/update/{id}:
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Failed to update flashcard
 * 
 * /api/flashcards/get/{id}:
 *   get:
 *     summary: Get a flashcard by ID
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
 *         description: Flashcard retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Failed to fetch flashcard
 */

router.get('/:deck_id', authenticateUser, getFlashcards);
router.post('/add', authenticateUser, createFlashcard);
router.delete('/delete/:id', authenticateUser, deleteFlashcard);
router.put('/update/:id', authenticateUser, updateFlashcard);
router.get('/get/:id', authenticateUser, getFlashcard);

export default router;  
