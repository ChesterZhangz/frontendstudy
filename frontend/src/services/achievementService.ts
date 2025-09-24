import { api } from './authService';

// 成就类型定义
export interface Achievement {
  _id: string;
  key: string;
  name: string;
  description: string;
  type: 'course_completion' | 'study_time' | 'streak' | 'exercise' | 'quiz' | 'speed' | 'milestone' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  points: number;
  requirement: {
    type: string;
    target: number;
    params?: any;
  };
  isActive: boolean;
  isHidden: boolean;
  // 用户相关字段
  isCompleted?: boolean;
  progress?: number;
  unlockedAt?: string;
}

// 成就统计
export interface AchievementStats {
  total: number;
  completed: number;
  completionRate: number;
  totalPoints: number;
  rarityDistribution: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

// 排行榜条目
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user?: {
    name: string;
    avatar?: string;
  };
  points: number;
  completedCourses: number;
  studyTime: number;
  streak: number;
}

// API响应类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

class AchievementService {
  private baseUrl = '/achievements';

  /**
   * 获取所有成就
   */
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const response = await api.get<ApiResponse<Achievement[]>>(`${this.baseUrl}/all`);
      return response.data.data;
    } catch (error: any) {
      console.error('获取所有成就失败:', error);
      throw new Error(error.response?.data?.message || '获取成就失败');
    }
  }

  /**
   * 获取用户成就
   */
  async getUserAchievements(): Promise<Achievement[]> {
    try {
      const response = await api.get<ApiResponse<Achievement[]>>(`${this.baseUrl}/user`);
      return response.data.data;
    } catch (error: any) {
      console.error('获取用户成就失败:', error);
      throw new Error(error.response?.data?.message || '获取用户成就失败');
    }
  }

  /**
   * 获取用户已完成的成就
   */
  async getUserCompletedAchievements(): Promise<Achievement[]> {
    try {
      const response = await api.get<ApiResponse<Achievement[]>>(`${this.baseUrl}/user/completed`);
      return response.data.data;
    } catch (error: any) {
      console.error('获取已完成成就失败:', error);
      throw new Error(error.response?.data?.message || '获取已完成成就失败');
    }
  }

  /**
   * 获取成就统计
   */
  async getAchievementStats(): Promise<AchievementStats> {
    try {
      const response = await api.get<ApiResponse<AchievementStats>>(`${this.baseUrl}/user/stats`);
      return response.data.data;
    } catch (error: any) {
      console.error('获取成就统计失败:', error);
      throw new Error(error.response?.data?.message || '获取成就统计失败');
    }
  }

  /**
   * 检查成就进度
   */
  async checkAchievements(type: string, data: any): Promise<Achievement[]> {
    try {
      const response = await api.post<ApiResponse<Achievement[]>>(`${this.baseUrl}/check`, {
        type,
        data
      });
      return response.data.data;
    } catch (error: any) {
      console.error('检查成就失败:', error);
      throw new Error(error.response?.data?.message || '检查成就失败');
    }
  }

  /**
   * 获取成就排行榜
   */
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await api.get<ApiResponse<LeaderboardEntry[]>>(`${this.baseUrl}/leaderboard?limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      console.error('获取排行榜失败:', error);
      throw new Error(error.response?.data?.message || '获取排行榜失败');
    }
  }

  /**
   * 初始化成就系统（开发用）
   */
  async initializeAchievements(): Promise<void> {
    try {
      await api.post<ApiResponse<void>>(`${this.baseUrl}/initialize`);
    } catch (error: any) {
      console.error('初始化成就系统失败:', error);
      throw new Error(error.response?.data?.message || '初始化成就系统失败');
    }
  }

  /**
   * 获取稀有度颜色
   */
  getRarityColor(rarity: Achievement['rarity']): string {
    const colors = {
      common: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
      uncommon: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
      rare: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
      epic: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900',
      legendary: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
    };
    return colors[rarity] || colors.common;
  }

  /**
   * 获取稀有度名称
   */
  getRarityName(rarity: Achievement['rarity']): string {
    const names = {
      common: '普通',
      uncommon: '少见',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说'
    };
    return names[rarity] || '未知';
  }

  /**
   * 获取类型名称
   */
  getTypeName(type: Achievement['type']): string {
    const names = {
      course_completion: '课程完成',
      study_time: '学习时间',
      streak: '连续学习',
      exercise: '练习完成',
      quiz: '测验成绩',
      speed: '学习速度',
      milestone: '里程碑',
      special: '特殊成就'
    };
    return names[type] || '未知';
  }
}

export const achievementService = new AchievementService();
export default achievementService;
