import express from 'express';
import { getUserStatistics } from '../controllers/statisticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my-stats').get(protect, getUserStatistics);

export default router;