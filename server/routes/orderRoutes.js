import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(authenticateUser, addOrderItems)
  .get(authenticateUser, authorizeAdmin, getOrders);

router.route('/mine').get(authenticateUser, getMyOrders);

router.route('/:id')
  .get(authenticateUser, getOrderById)
  .put(authenticateUser, authorizeAdmin, updateOrderStatus);

export default router;
