import { Achievement, IAchievement, AchievementType, AchievementRarity } from '../models/Achievement';
import { UserAchievement, IUserAchievement } from '../models/UserAchievement';
import { StudyProgress } from '../models/StudyProgress';
import { StudyStats } from '../models/StudyStats';

// 成就检查事件类型
export interface AchievementEvent {
  userId: string;
  type: string;
  data: any;
}

// 成就服务类
export class AchievementService {
  
  /**
   * 初始化默认成就
   */
  static async initializeAchievements(): Promise<void> {
    const defaultAchievements = [
      // 课程完成成就
      {
        key: 'first_course',
        name: '初学者',
        description: '完成第一节课程',
        type: AchievementType.COURSE_COMPLETION,
        rarity: AchievementRarity.COMMON,
        icon: 'BookOpen',
        points: 10,
        requirement: { type: 'course_count', target: 1 }
      },
      {
        key: 'html_master',
        name: 'HTML大师',
        description: '完成所有HTML课程',
        type: AchievementType.COURSE_COMPLETION,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Code',
        points: 50,
        requirement: { type: 'html_courses_completed', target: 5 }
      },
      {
        key: 'css_expert',
        name: 'CSS专家',
        description: '完成所有CSS课程',
        type: AchievementType.COURSE_COMPLETION,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Palette',
        points: 50,
        requirement: { type: 'css_courses_completed', target: 6 }
      },
      {
        key: 'js_ninja',
        name: 'JavaScript忍者',
        description: '完成所有JavaScript课程',
        type: AchievementType.COURSE_COMPLETION,
        rarity: AchievementRarity.RARE,
        icon: 'Zap',
        points: 100,
        requirement: { type: 'js_courses_completed', target: 1 }
      },
      {
        key: 'completionist',
        name: '完美主义者',
        description: '完成所有课程',
        type: AchievementType.COURSE_COMPLETION,
        rarity: AchievementRarity.EPIC,
        icon: 'Trophy',
        points: 200,
        requirement: { type: 'all_courses_completed', target: 12 }
      },
      
      // 学习时间成就
      {
        key: 'first_hour',
        name: '时间管理者',
        description: '累计学习1小时',
        type: AchievementType.STUDY_TIME,
        rarity: AchievementRarity.COMMON,
        icon: 'Clock',
        points: 15,
        requirement: { type: 'total_study_time', target: 60 }
      },
      {
        key: 'dedicated_learner',
        name: '专注学习者',
        description: '累计学习5小时',
        type: AchievementType.STUDY_TIME,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Target',
        points: 75,
        requirement: { type: 'total_study_time', target: 300 }
      },
      {
        key: 'time_master',
        name: '时间大师',
        description: '累计学习10小时',
        type: AchievementType.STUDY_TIME,
        rarity: AchievementRarity.RARE,
        icon: 'Award',
        points: 150,
        requirement: { type: 'total_study_time', target: 600 }
      },
      
      // 连续学习成就
      {
        key: 'consistent_3',
        name: '三日坚持',
        description: '连续学习3天',
        type: AchievementType.STREAK,
        rarity: AchievementRarity.COMMON,
        icon: 'Calendar',
        points: 25,
        requirement: { type: 'streak', target: 3 }
      },
      {
        key: 'week_warrior',
        name: '一周战士',
        description: '连续学习7天',
        type: AchievementType.STREAK,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Flame',
        points: 60,
        requirement: { type: 'streak', target: 7 }
      },
      {
        key: 'streak_master',
        name: '坚持大师',
        description: '连续学习30天',
        type: AchievementType.STREAK,
        rarity: AchievementRarity.LEGENDARY,
        icon: 'Star',
        points: 300,
        requirement: { type: 'streak', target: 30 }
      },
      
      // 练习成就
      {
        key: 'first_exercise',
        name: '动手实践',
        description: '完成第一个练习',
        type: AchievementType.EXERCISE,
        rarity: AchievementRarity.COMMON,
        icon: 'Play',
        points: 10,
        requirement: { type: 'exercises_completed', target: 1 }
      },
      {
        key: 'exercise_enthusiast',
        name: '练习达人',
        description: '完成50个练习',
        type: AchievementType.EXERCISE,
        rarity: AchievementRarity.RARE,
        icon: 'CheckCircle',
        points: 100,
        requirement: { type: 'exercises_completed', target: 50 }
      },
      
      // 速度成就
      {
        key: 'speed_learner',
        name: '快速学习者',
        description: '在一天内完成3节课程',
        type: AchievementType.SPEED,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Zap',
        points: 40,
        requirement: { type: 'courses_per_day', target: 3 }
      },
      
      // 特殊成就
      {
        key: 'early_bird',
        name: '早起的鸟儿',
        description: '在早上6点前开始学习',
        type: AchievementType.SPECIAL,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Sunrise',
        points: 30,
        requirement: { type: 'early_study', target: 1 }
      },
      {
        key: 'night_owl',
        name: '夜猫子',
        description: '在晚上11点后还在学习',
        type: AchievementType.SPECIAL,
        rarity: AchievementRarity.UNCOMMON,
        icon: 'Moon',
        points: 30,
        requirement: { type: 'late_study', target: 1 }
      }
    ];

    for (const achievement of defaultAchievements) {
      await Achievement.findOneAndUpdate(
        { key: achievement.key },
        achievement,
        { upsert: true, new: true }
      );
    }
  }

  /**
   * 获取所有成就
   */
  static async getAllAchievements(): Promise<IAchievement[]> {
    return await Achievement.find({ isActive: true }).sort({ points: 1 });
  }

  /**
   * 获取用户成就
   */
  static async getUserAchievements(userId: string): Promise<IUserAchievement[]> {
    return await UserAchievement.find({ userId }).sort({ unlockedAt: -1 });
  }

  /**
   * 获取用户已完成的成就
   */
  static async getUserCompletedAchievements(userId: string): Promise<IUserAchievement[]> {
    return await UserAchievement.find({ userId, isCompleted: true }).sort({ unlockedAt: -1 });
  }

  /**
   * 检查并更新成就进度
   */
  static async checkAchievements(event: AchievementEvent): Promise<IUserAchievement[]> {
    const achievements = await Achievement.find({ isActive: true });
    const newlyUnlocked: IUserAchievement[] = [];

    for (const achievement of achievements) {
      const progress = await this.calculateProgress(event.userId, achievement);
      
      if (progress >= achievement.requirement.target) {
        const userAchievement = await this.unlockAchievement(event.userId, achievement.key);
        if (userAchievement && !userAchievement.isCompleted) {
          newlyUnlocked.push(userAchievement);
        }
      } else {
        // 更新进度
        await this.updateProgress(event.userId, achievement.key, progress);
      }
    }

    return newlyUnlocked;
  }

  /**
   * 计算成就进度
   */
  private static async calculateProgress(userId: string, achievement: IAchievement): Promise<number> {
    const { type } = achievement.requirement;

    switch (type) {
      case 'course_count':
        return await StudyProgress.countDocuments({ userId, status: 'completed' });
      
      case 'html_courses_completed':
        return await StudyProgress.countDocuments({ 
          userId, 
          status: 'completed',
          courseId: { $regex: '^1001-' }
        });
      
      case 'css_courses_completed':
        return await StudyProgress.countDocuments({ 
          userId, 
          status: 'completed',
          courseId: { $regex: '^2001-' }
        });
      
      case 'js_courses_completed':
        return await StudyProgress.countDocuments({ 
          userId, 
          status: 'completed',
          courseId: { $regex: '^3001-' }
        });
      
      case 'all_courses_completed':
        return await StudyProgress.countDocuments({ userId, status: 'completed' });
      
      case 'total_study_time':
        const stats = await StudyStats.findOne({ userId });
        return stats?.totalStudyTime || 0;
      
      case 'streak':
        const userStats = await StudyStats.findOne({ userId });
        return userStats?.streak || 0;
      
      case 'exercises_completed':
        const progressRecords = await StudyProgress.find({ userId });
        let exerciseCount = 0;
        for (const progress of progressRecords) {
          if (progress.componentProgress) {
            exerciseCount += Object.values(progress.componentProgress)
              .filter(cp => cp.isCompleted && cp.componentId?.includes('exercise')).length;
          }
        }
        return exerciseCount;
      
      case 'courses_per_day':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return await StudyProgress.countDocuments({
          userId,
          status: 'completed',
          completedTime: { $gte: today, $lt: tomorrow }
        });
      
      default:
        return 0;
    }
  }

  /**
   * 解锁成就
   */
  private static async unlockAchievement(userId: string, achievementKey: string): Promise<IUserAchievement | null> {
    const existing = await UserAchievement.findOne({ userId, achievementKey });
    
    if (existing && existing.isCompleted) {
      return existing;
    }

    const userAchievement = await UserAchievement.findOneAndUpdate(
      { userId, achievementKey },
      {
        userId,
        achievementKey,
        isCompleted: true,
        unlockedAt: new Date(),
        progress: 100
      },
      { upsert: true, new: true }
    );

    // 更新用户总积分
    await this.updateUserPoints(userId);

    return userAchievement;
  }

  /**
   * 更新进度
   */
  private static async updateProgress(userId: string, achievementKey: string, progress: number): Promise<void> {
    await UserAchievement.findOneAndUpdate(
      { userId, achievementKey },
      {
        userId,
        achievementKey,
        progress,
        isCompleted: false
      },
      { upsert: true }
    );
  }

  /**
   * 更新用户总积分
   */
  private static async updateUserPoints(userId: string): Promise<void> {
    const userAchievements = await UserAchievement.find({ userId, isCompleted: true });
    const achievements = await Achievement.find({ 
      key: { $in: userAchievements.map(ua => ua.achievementKey) }
    });

    const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

    await StudyStats.findOneAndUpdate(
      { userId },
      { totalAchievementPoints: totalPoints },
      { upsert: true }
    );
  }

  /**
   * 获取成就统计
   */
  static async getAchievementStats(userId: string) {
    const allAchievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ userId });
    const completedAchievements = userAchievements.filter(ua => ua.isCompleted);

    const stats = {
      total: allAchievements.length,
      completed: completedAchievements.length,
      completionRate: Math.round((completedAchievements.length / allAchievements.length) * 100),
      totalPoints: 0,
      rarityDistribution: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      }
    };

    // 计算总积分和稀有度分布
    for (const userAchievement of completedAchievements) {
      const achievement = allAchievements.find(a => a.key === userAchievement.achievementKey);
      if (achievement) {
        stats.totalPoints += achievement.points;
        stats.rarityDistribution[achievement.rarity]++;
      }
    }

    return stats;
  }

  /**
   * 获取排行榜
   */
  static async getLeaderboard(limit: number = 10) {
    const topUsers = await StudyStats.find()
      .sort({ totalAchievementPoints: -1 })
      .limit(limit);

    return topUsers.map((stats, index) => ({
      rank: index + 1,
      userId: stats.userId,
      points: stats.totalAchievementPoints || 0,
      completedCourses: stats.completedDays || 0,
      studyTime: stats.totalStudyTime || 0,
      streak: stats.streak || 0
    }));
  }
}

export default AchievementService;
