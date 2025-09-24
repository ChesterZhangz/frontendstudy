import { api, ApiResponse } from './authService';
import { CourseContent, StudyProgress, StudyStats, CodeExecutionResult } from '@/stores/studyStore';

// 更新学习进度请求接口
export interface UpdateProgressRequest {
  courseId?: string;
  day: number;
  status: 'not_started' | 'in_progress' | 'completed';
  studyTime?: number;
  codeSubmissions?: number;
  errors?: number;
  notes?: string;
}

// 代码执行请求接口
export interface ExecuteCodeRequest {
  code: string;
  language: 'javascript' | 'html' | 'css';
  exerciseId?: string;
}

// 代码执行响应接口
export interface ExecuteCodeResponse {
  result: CodeExecutionResult;
  executionId: string;
}

class StudyService {
  // 获取课程列表
  async getCourseList(): Promise<ApiResponse<CourseContent[]>> {
    try {
      const response = await api.get<ApiResponse<CourseContent[]>>('/study/courses');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 获取特定课程内容
  async getCourseContent(day: number): Promise<ApiResponse<CourseContent>> {
    try {
      const response = await api.get<ApiResponse<CourseContent>>(`/study/courses/${day}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 获取用户学习进度
  async getStudyProgress(): Promise<ApiResponse<StudyProgress[]>> {
    try {
      const response = await api.get<ApiResponse<StudyProgress[]>>('/study/progress');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 更新学习进度
  async updateStudyProgress(data: UpdateProgressRequest): Promise<ApiResponse<StudyProgress>> {
    try {
      const response = await api.put<ApiResponse<StudyProgress>>('/study/progress', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 获取学习统计
  async getStudyStats(): Promise<ApiResponse<StudyStats>> {
    try {
      const response = await api.get<ApiResponse<StudyStats>>('/study/stats');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 执行代码
  async executeCode(data: ExecuteCodeRequest): Promise<ApiResponse<ExecuteCodeResponse>> {
    try {
      const response = await api.post<ApiResponse<ExecuteCodeResponse>>('/study/execute', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 获取特定天数的学习进度
  async getDayProgress(day: number): Promise<ApiResponse<StudyProgress | null>> {
    try {
      const progressResponse = await this.getStudyProgress();
      
      if (progressResponse.success && progressResponse.data) {
        const dayProgress = progressResponse.data.find(p => p.day === day) || null;
        return {
          success: true,
          message: '获取进度成功',
          data: dayProgress,
        };
      }
      
      return {
        success: false,
        message: '获取进度失败',
        data: null,
      };
    } catch (error: any) {
      throw error;
    }
  }

  // 开始学习某一天的课程
  async startCourse(day: number): Promise<ApiResponse<StudyProgress>> {
    try {
      return await this.updateStudyProgress({
        day,
        status: 'in_progress',
      });
    } catch (error: any) {
      throw error;
    }
  }

  // 完成某一天的课程
  async completeCourse(day: number, studyTime?: number, notes?: string): Promise<ApiResponse<StudyProgress>> {
    try {
      return await this.updateStudyProgress({
        day,
        status: 'completed',
        studyTime,
        notes,
      });
    } catch (error: any) {
      throw error;
    }
  }

  // 记录代码提交
  async recordCodeSubmission(day: number, errors?: number): Promise<ApiResponse<StudyProgress>> {
    try {
      return await this.updateStudyProgress({
        day,
        status: 'in_progress',
        codeSubmissions: 1,
        errors,
      });
    } catch (error: any) {
      throw error;
    }
  }

  // 保存学习笔记
  async saveNotes(day: number, notes: string): Promise<ApiResponse<StudyProgress>> {
    try {
      return await this.updateStudyProgress({
        day,
        status: 'in_progress',
        notes,
      });
    } catch (error: any) {
      throw error;
    }
  }

  // 获取课程完成率
  async getCompletionRate(): Promise<number> {
    try {
      const progressResponse = await this.getStudyProgress();
      
      if (progressResponse.success && progressResponse.data) {
        const totalCourses = 20; // 总共20天课程
        const completedCourses = progressResponse.data.filter(p => p.status === 'completed').length;
        return Math.round((completedCourses / totalCourses) * 100);
      }
      
      return 0;
    } catch (error: any) {
      console.error('获取完成率失败:', error);
      return 0;
    }
  }

  // 获取学习连续天数
  async getStudyStreak(): Promise<number> {
    try {
      const statsResponse = await this.getStudyStats();
      
      if (statsResponse.success && statsResponse.data) {
        return statsResponse.data.streak;
      }
      
      return 0;
    } catch (error: any) {
      console.error('获取学习连续天数失败:', error);
      return 0;
    }
  }

  // 获取总学习时间（小时）
  async getTotalStudyTime(): Promise<number> {
    try {
      const statsResponse = await this.getStudyStats();
      
      if (statsResponse.success && statsResponse.data) {
        // 转换分钟为小时
        return Math.round(statsResponse.data.totalStudyTime / 60 * 10) / 10;
      }
      
      return 0;
    } catch (error: any) {
      console.error('获取总学习时间失败:', error);
      return 0;
    }
  }

  // 检查是否可以开始某一天的课程（检查前置条件）
  async canStartCourse(day: number): Promise<boolean> {
    try {
      if (day === 1) return true; // 第一天总是可以开始
      
      const progressResponse = await this.getStudyProgress();
      
      if (progressResponse.success && progressResponse.data) {
        const previousDayProgress = progressResponse.data.find(p => p.day === day - 1);
        return previousDayProgress?.status === 'completed';
      }
      
      return false;
    } catch (error: any) {
      console.error('检查课程开始条件失败:', error);
      return false;
    }
  }

  // 获取推荐的下一个学习课程
  async getNextRecommendedCourse(): Promise<number> {
    try {
      const progressResponse = await this.getStudyProgress();
      
      if (progressResponse.success && progressResponse.data) {
        const progress = progressResponse.data;
        
        // 找到第一个未完成的课程
        for (let day = 1; day <= 20; day++) {
          const dayProgress = progress.find(p => p.day === day);
          
          if (!dayProgress || dayProgress.status !== 'completed') {
            return day;
          }
        }
        
        // 如果所有课程都完成了，返回最后一个
        return 20;
      }
      
      return 1; // 默认返回第一天
    } catch (error: any) {
      console.error('获取推荐课程失败:', error);
      return 1;
    }
  }
}

export const studyService = new StudyService();
