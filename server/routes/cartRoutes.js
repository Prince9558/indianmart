import express from 'express';
import {
  getCart,
  syncCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(authenticateUser, getCart)
  .put(authenticateUser, syncCart)
  .delete(authenticateUser, clearCart);

export default router;
