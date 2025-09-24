import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAllAchievements,
  getUserAchievements,
  getUserCompletedAchievements,
  getAchievementStats,
  checkAchievements,
  getAchievementLeaderboard,
  initializeAchievements
} from '../controllers/achievementController';

const router = Router();

// 公开路由
router.get('/all', getAllAchievements);                    // 获取所有成就
router.get('/leaderboard', getAchievementLeaderboard);     // 获取排行榜
router.post('/initialize', initializeAchievements);        // 初始化成就系统（开发用）

// 需要认证的路由
router.get('/user', authenticateToken, getUserAchievements);              // 获取用户成就
router.get('/user/completed', authenticateToken, getUserCompletedAchievements); // 获取用户已完成成就
router.get('/user/stats', authenticateToken, getAchievementStats);        // 获取成就统计
router.post('/check', authenticateToken, checkAchievements);              // 检查成就进度

export default router;
