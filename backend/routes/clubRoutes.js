import express from 'express';
import {
  criarClube,
  getClubes,
  getMeusClubes,
  getClubeById,
  entrarNoClube,
  aprovarEntrada,
  rejeitarEntrada,
  promoverAdmin,
  updateClube,
  deleteClube,
  removeMembro,
  setLeituraAtual,
  addEncontro,
  sairDoClube,
  confirmarPresencaEncontro,
  getClubeDoMes,
  deleteEncontro,
  getEncontrosDestaque,
} from '../controllers/clubController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Rotas principais
router.route('/')
  .post(protect, upload.single('capa'), criarClube)
  .get(getClubes);

// Rota para buscar os clubes do usuário logado (deve vir antes de /:id)
router.route('/meus-clubes').get(protect, getMeusClubes);

// Rota para buscar o clube do mês
router.route('/clube-do-mes').get(getClubeDoMes);

// Rota para buscar os encontros em destaque
router.route('/encontros-destaque').get(getEncontrosDestaque);

// Rotas específicas por ID
router.route('/:id')
  .get(getClubeById)
  .put(protect, upload.single('capa'), updateClube)
  .delete(protect, deleteClube);

// Rotas de ações do clube
router.post('/:id/entrar', protect, entrarNoClube);
router.post('/:id/aprovar/:userId', protect, aprovarEntrada);
router.post('/:id/rejeitar/:userId', protect, rejeitarEntrada);
router.post('/:id/promover/:userId', protect, promoverAdmin);
router.post('/:id/sair', protect, sairDoClube);
router.put('/:id/leitura', protect, setLeituraAtual);
router.delete('/:id/membros/:memberId', protect, removeMembro);
router.post('/:id/encontros', protect, addEncontro);
router.post('/:id/encontros/:encontroId/confirmar', protect, confirmarPresencaEncontro);
router.delete('/:id/encontros/:encontroId', protect, deleteEncontro);

export default router;