import { ObjectId } from 'mongoose';

// 用户相关类型
export interface IUser {
  _id: ObjectId | string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'teacher' | 'student' | 'user';
  isActive: boolean;
  isEmailVerified: boolean;
  userType: 'individual' | 'enterprise';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 学习进度相关类型
export interface IStudyProgress {
  _id: ObjectId;
  userId: string;
  courseId: string;
  day: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startTime?: Date;
  completedTime?: Date;
  studyTime: number; // 学习时长（分钟）
  codeSubmissions: number; // 代码提交次数
  errors: number; // 错误次数
  achievements: string[]; // 获得的成就
  componentProgress: Map<string, {
    isCompleted: boolean;
    completedAt?: Date;
    attempts: number;
    score: number;
    componentId?: string;
  }>; // 组件完成进度
  isAllTasksCompleted: boolean; // 是否完成所有任务
  notes: string; // 学习笔记
  createdAt: Date;
  updatedAt: Date;
}

// 课程内容类型
export interface ICourseContent {
  _id: ObjectId;
  day: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 预计学习时间（分钟）
  topics: string[]; // 知识点列表
  content: {
    theory: string; // 理论知识
    examples: Array<{
      title: string;
      code: string;
      explanation: string;
    }>;
    exercises: Array<{
      id: string;
      title: string;
      description: string;
      starterCode: string;
      solution: string;
      testCases: Array<{
        input: any;
        expectedOutput: any;
        description: string;
      }>;
      hints: string[];
    }>;
  };
  prerequisites: string[]; // 前置知识点
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 代码执行结果类型
export interface ICodeExecution {
  _id: ObjectId;
  userId: ObjectId;
  courseId: string;
  exerciseId?: string;
  code: string;
  language: 'javascript' | 'html' | 'css';
  result: {
    success: boolean;
    output?: string;
    error?: string;
    executionTime?: number;
    memoryUsage?: number;
  };
  createdAt: Date;
}

// 学习统计类型
export interface IStudyStats {
  _id: ObjectId;
  userId: string;
  totalStudyTime: number; // 总学习时间（分钟）
  completedDays: number; // 完成的天数
  totalExercises: number; // 总练习数
  completedExercises: number; // 完成的练习数
  totalErrors: number; // 总错误数
  averageScore: number; // 平均分数
  streak: number; // 连续学习天数
  lastStudyDate?: Date;
  totalAchievementPoints: number; // 总成就积分
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: IUser;
  token: string;
  expiresIn: string;
}

// 学习进度更新类型
export interface UpdateProgressRequest {
  courseId: string;
  day: number;
  status: 'not_started' | 'in_progress' | 'completed';
  studyTime?: number;
  codeSubmissions?: number;
  errors?: number;
  notes?: string;
}

// 代码执行请求类型
export interface ExecuteCodeRequest {
  code: string;
  language: 'javascript' | 'html' | 'css';
  exerciseId?: string;
}

// 课程内容请求类型
export interface GetCourseContentRequest {
  day: number;
}

// 学习统计请求类型
export interface GetStudyStatsRequest {
  userId: string;
  timeRange?: 'week' | 'month' | 'all';
}
