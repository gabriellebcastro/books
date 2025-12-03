import express from 'express';
import {
  criarClube,
  getClubes,
  getMeusClubes,
  getClubeById,
  entrarNoClube,
  aprovarEntrada,
  promoverAdmin,
} from '../controllers/clubController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Rotas principais
router.route('/')
  .post(protect, upload.single('capa'), criarClube)
  .get(getClubes);

// Rotas específicas por ID
router.route('/:id')
  .get(getClubeById);

// Rotas de ações do clube
router.post('/:id/entrar', protect, entrarNoClube);
router.post('/:id/aprovar/:userId', protect, aprovarEntrada);
router.post('/:id/promover/:userId', protect, promoverAdmin);
router.route('/meus-clubes').get(protect, getMeusClubes);

export default router;