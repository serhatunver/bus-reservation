import express from 'express';
import {
  register,
  login,
  logout,
  getSession,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protectRoute, logout);
router.get('/session', protectRoute, getSession);

export default router;
