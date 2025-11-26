import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/userController.js';
import {
  getUserBooks,
  addBookToUserLibrary,
  removeBookFromUserLibrary,
  updateUserBookDetails,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

// Rota para registrar um novo usuário
router.route('/').post(registerUser);

// Rota para autenticar (login) um usuário
router.post('/login', authUser);

// Rota para buscar o perfil do usuário logado (protegida)
router.route('/profile').get(protect, getUserProfile);

// Rotas para a estante de livros do usuário (protegidas)
router
  .route('/mybooks')
  .get(protect, getUserBooks)
  .post(protect, addBookToUserLibrary);

// Rota para remover um livro da estante do usuário (protegida)
router
  .route('/mybooks/:id')
  .delete(protect, removeBookFromUserLibrary)
  .put(protect, updateUserBookDetails);

export default router;