import { Request, Response } from 'express';
import AchievementService from '../services/achievementService';
import { Achievement } from '../models/Achievement';
import { UserAchievement } from '../models/UserAchievement';

// 使用全局的Request类型，已经包含用户信息

/**
 * 获取所有成就
 */
export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await AchievementService.getAllAchievements();
    
    res.json({
      success: true,
      data: achievements,
      message: '获取成就列表成功'
    });
  } catch (error: any) {
    console.error('获取成就列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取成就列表失败',
      error: error.message
    });
  }
};

/**
 * 获取用户成就
 */
export const getUserAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '用户未认证'
      });
      return;
    }

    const userAchievements = await AchievementService.getUserAchievements(req.user._id);
    const allAchievements = await Achievement.find({ isActive: true });
    
    // 合并成就信息和用户进度
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementKey === achievement.key);
      
      return {
        ...achievement.toObject(),
        isCompleted: userAchievement?.isCompleted || false,
        progress: userAchievement?.progress || 0,
        unlockedAt: userAchievement?.unlockedAt || null
      };
    });

    res.json({
      success: true,
      data: achievementsWithProgress,
      message: '获取用户成就成功'
    });
  } catch (error: any) {
    console.error('获取用户成就失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户成就失败',
      error: error.message
    });
  }
};

/**
 * 获取用户已完成的成就
 */
export const getUserCompletedAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '用户未认证'
      });
      return;
    }

    const completedAchievements = await AchievementService.getUserCompletedAchievements(req.user._id);
    const achievementKeys = completedAchievements.map(ua => ua.achievementKey);
    const achievements = await Achievement.find({ key: { $in: achievementKeys } });

    const result = completedAchievements.map(userAchievement => {
      const achievement = achievements.find(a => a.key === userAchievement.achievementKey);
      return {
        ...achievement?.toObject(),
        unlockedAt: userAchievement.unlockedAt,
        progress: userAchievement.progress
      };
    });

    res.json({
      success: true,
      data: result,
      message: '获取已完成成就成功'
    });
  } catch (error: any) {
    console.error('获取已完成成就失败:', error);
    res.status(500).json({
      success: false,
      message: '获取已完成成就失败',
      error: error.message
    });
  }
};

/**
 * 获取成就统计
 */
export const getAchievementStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '用户未认证'
      });
      return;
    }

    const stats = await AchievementService.getAchievementStats(req.user._id);

    res.json({
      success: true,
      data: stats,
      message: '获取成就统计成功'
    });
  } catch (error: any) {
    console.error('获取成就统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取成就统计失败',
      error: error.message
    });
  }
};

/**
 * 检查成就进度
 */
export const checkAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        message: '用户未认证'
      });
      return;
    }

    const { type, data } = req.body;

    const newlyUnlocked = await AchievementService.checkAchievements({
      userId: req.user._id,
      type,
      data
    });

    res.json({
      success: true,
      data: newlyUnlocked,
      message: `检查成就完成，新解锁${newlyUnlocked.length}个成就`
    });
  } catch (error: any) {
    console.error('检查成就失败:', error);
    res.status(500).json({
      success: false,
      message: '检查成就失败',
      error: error.message
    });
  }
};

/**
 * 获取成就排行榜
 */
export const getAchievementLeaderboard = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await AchievementService.getLeaderboard(limit);

    res.json({
      success: true,
      data: leaderboard,
      message: '获取排行榜成功'
    });
  } catch (error: any) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      success: false,
      message: '获取排行榜失败',
      error: error.message
    });
  }
};

/**
 * 初始化成就系统
 */
export const initializeAchievements = async (req: Request, res: Response) => {
  try {
    await AchievementService.initializeAchievements();

    res.json({
      success: true,
      message: '成就系统初始化成功'
    });
  } catch (error: any) {
    console.error('成就系统初始化失败:', error);
    res.status(500).json({
      success: false,
      message: '成就系统初始化失败',
      error: error.message
    });
  }
};