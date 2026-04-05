import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/')
  .get(getProducts)
  .post(authenticateUser, authorizeAdmin, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authenticateUser, authorizeAdmin, upload.single('image'), updateProduct)
  .delete(authenticateUser, authorizeAdmin, deleteProduct);

export default router;
