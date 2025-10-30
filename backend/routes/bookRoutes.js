import express from 'express';
const router = express.Router();
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getBooks).post(protect, createBook);
router
  .route('/:id')
  .get(protect, getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;