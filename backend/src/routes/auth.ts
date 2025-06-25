import { Router } from 'express';
import { signup, login, logout, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;


