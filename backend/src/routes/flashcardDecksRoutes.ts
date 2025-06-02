import express from 'express';
import {
    getDecks,
    addDeck,
    updateDeck,
    deleteDeck
  } from '../controllers/flashcards/flashcardDecksController';

import { authenticateUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateUser, getDecks);
router.post('/add', authenticateUser, addDeck);
router.patch('/update', authenticateUser, updateDeck);
router.delete('/delete', authenticateUser, deleteDeck);

export default router; 