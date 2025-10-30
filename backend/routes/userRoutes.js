import express from 'express';
const router = express.Router();
import { authUser, registerUser } from '../controllers/userController.js';
import {
  getUserBooks,
  addBookToUserLibrary,
  removeBookFromUserLibrary,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser);
router.post('/login', authUser);

// Rotas para a estante de livros do usuário
router
  .route('/mybooks')
  .get(protect, getUserBooks)
  .post(protect, addBookToUserLibrary);

// Rota para remover um livro da estante do usuário
router.route('/mybooks/:id').delete(protect, removeBookFromUserLibrary);

export default router;