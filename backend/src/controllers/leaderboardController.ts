import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { LeaderboardEntry } from '../models/Leaderboard';
import { StudyStats } from '../models/StudyStats';
import { StudyProgress } from '../models/StudyProgress';
import { UserAchievement } from '../models/UserAchievement';
import { ApiResponse } from '../types';

// 获取排行榜
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category = 'overall', period = 'current', limit = 10 } = req.query;
    
    let queryPeriod = period as string;
    
    // 根据类别和周期生成查询条件
    if (category === 'weekly') {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      queryPeriod = `${startOfWeek.getFullYear()}-W${Math.ceil((startOfWeek.getDate()) / 7)}`;
    } else if (category === 'monthly') {
      const now = new Date();
      queryPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    } else if (category === 'all_time') {
      queryPeriod = 'all_time';
    }

    const leaderboard = await LeaderboardEntry.find({
      category: category as string,
      period: queryPeriod
    })
    .sort({ rank: 1 })
    .limit(parseInt(limit as string))
    .populate('userId', 'name email avatar');

    const response: ApiResponse = {
      success: true,
      message: '获取排行榜成功',
      data: {
        category,
        period: queryPeriod,
        entries: leaderboard
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取排行榜错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 更新排行榜
export const updateLeaderboard = async (): Promise<void> => {
  try {
    // 获取所有用户的学习统计
    const allUsers = await StudyStats.find({}).populate('userId', 'name email avatar');
    
    for (const userStats of allUsers) {
      if (!userStats.userId) continue;

      const userId = userStats.userId;
      const userName = (userStats.userId as any).name || 'Unknown User';
      const userAvatar = (userStats.userId as any).avatar;

      // 获取用户完成课程数
      const completedCourses = await StudyProgress.countDocuments({
        userId,
        status: 'completed'
      });

      // 获取用户成就数
      const achievements = await UserAchievement.countDocuments({
        userId,
        isUnlocked: true
      });

      // 计算总分
      const totalPoints = (userStats.totalStudyTime || 0) * 0.1 + 
                         completedCourses * 100 + 
                         (userStats.streak || 0) * 10 + 
                         achievements * 50;

      // 更新各个排行榜
      const categories = ['overall', 'weekly', 'monthly', 'all_time'];
      
      for (const category of categories) {
        let period = 'current';
        
        if (category === 'weekly') {
          const now = new Date();
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          period = `${startOfWeek.getFullYear()}-W${Math.ceil((startOfWeek.getDate()) / 7)}`;
        } else if (category === 'monthly') {
          const now = new Date();
          period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        } else if (category === 'all_time') {
          period = 'all_time';
        }

        // 查找或创建排行榜条目
        let entry = await LeaderboardEntry.findOne({
          userId,
          category,
          period
        });

        if (!entry) {
          entry = new LeaderboardEntry({
            userId,
            userName,
            userAvatar,
            category,
            period,
            rank: 999 // 临时排名
          });
        }

        // 更新数据
        entry.totalPoints = totalPoints;
        entry.completedCourses = completedCourses;
        entry.totalStudyTime = userStats.totalStudyTime || 0;
        entry.currentStreak = userStats.streak || 0;
        entry.achievements = achievements;
        entry.lastActiveAt = userStats.lastStudyDate || new Date();

        await entry.save();
      }
    }

    // 重新计算排名
    await recalculateRanks();
    
  } catch (error) {
    console.error('更新排行榜错误:', error);
  }
};

// 重新计算排名
const recalculateRanks = async (): Promise<void> => {
  try {
    const categories = ['overall', 'weekly', 'monthly', 'all_time'];
    
    for (const category of categories) {
      const entries = await LeaderboardEntry.find({ category })
        .sort({ totalPoints: -1, lastActiveAt: -1 });

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry) {
          entry.rank = i + 1;
          await entry.save();
        }
      }
    }
  } catch (error) {
    console.error('重新计算排名错误:', error);
  }
};

// 获取用户排名
export const getUserRank = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    const { category = 'overall' } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const userEntry = await LeaderboardEntry.findOne({
      userId,
      category: category as string
    }).sort({ period: -1 });

    if (!userEntry) {
      res.status(404).json({
        success: false,
        message: '用户排名未找到',
        error: 'RANK_NOT_FOUND'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: '获取用户排名成功',
      data: userEntry
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取用户排名错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 获取排行榜统计
export const getLeaderboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await LeaderboardEntry.aggregate([
      {
        $group: {
          _id: '$category',
          totalUsers: { $sum: 1 },
          averagePoints: { $avg: '$totalPoints' },
          topScore: { $max: '$totalPoints' },
          averageStudyTime: { $avg: '$totalStudyTime' },
          averageCourses: { $avg: '$completedCourses' }
        }
      }
    ]);

    const response: ApiResponse = {
      success: true,
      message: '获取排行榜统计成功',
      data: stats
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取排行榜统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};
