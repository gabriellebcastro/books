import express from 'express';
const router = express.Router();
import {
  getBooks,
  getBookById,
  addBookToCatalog,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getBooks);
router.route('/catalog').post(protect, addBookToCatalog);
router
  .route('/:id')
  .get(protect, getBookById);

export default router;