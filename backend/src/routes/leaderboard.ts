import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getLeaderboard,
  getUserRank,
  getLeaderboardStats
} from '../controllers/leaderboardController';

const router = express.Router();

// 获取排行榜
router.get('/', getLeaderboard);

// 获取用户排名
router.get('/user-rank', authenticateToken, getUserRank);

// 获取排行榜统计
router.get('/stats', getLeaderboardStats);

export default router;
