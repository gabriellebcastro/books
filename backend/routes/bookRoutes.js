import express from 'express';
const router = express.Router();
import {
  getBooks,
  getBookById,
  addBookToCatalog,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getBooks); // Rota pública para listar todos os livros
router.route('/catalog').post(protect, addBookToCatalog);
router.route('/:id').get(getBookById); // Rota pública para ver detalhes de um livro

export default router;