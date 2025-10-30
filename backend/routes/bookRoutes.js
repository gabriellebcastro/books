import express from 'express';
const router = express.Router();
import {
  searchBooks,
  addBookToCatalog,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

// @route   /api/books

// Rota para buscar livros no catálogo global
router.route('/search').get(protect, searchBooks);

// Rota para adicionar um novo livro ao catálogo global
router.route('/').post(protect, addBookToCatalog);

export default router;