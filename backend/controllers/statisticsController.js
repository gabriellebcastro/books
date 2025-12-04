import asyncHandler from 'express-async-handler';
import Statistics from '../models/statisticsModel.js'; // Corrected path
import { recalculateUserStats } from '../services/statisticsService.js'; // Corrected path

// @desc    Get user statistics
// @route   GET /api/stats/my-stats
// @access  Private
const getUserStatistics = asyncHandler(async (req, res) => {
  // Garante que as estatísticas estejam atualizadas antes de retornar
  await recalculateUserStats(req.user._id);
  
  const stats = await Statistics.findOne({ user: req.user._id });

  if (stats) {
    res.json(stats);
  } else {
    res.json({ totalLivrosLidos: 0, totalPaginasLidas: 0, generosLidos: {} });
  }
});

export { getUserStatistics };