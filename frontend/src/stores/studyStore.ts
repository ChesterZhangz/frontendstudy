import { create } from 'zustand';
import { studyService } from '@/services/studyService';
import { allCourses } from '@/data/courses';

export interface CourseContent {
  _id: string;
  day: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  topics: string[];
  content: {
    theory: string;
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
  prerequisites: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyProgress {
  _id: string;
  userId: string;
  courseId: string;
  day: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startTime?: string;
  completedTime?: string;
  studyTime: number;
  codeSubmissions: number;
  errors: number;
  achievements: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  // 新增字段
  componentProgress: {
    [componentId: string]: {
      isCompleted: boolean;
      completedAt?: string;
      attempts?: number;
      score?: number;
    };
  };
  isAllTasksCompleted: boolean;
}

export interface StudyStats {
  _id: string;
  userId: string;
  totalStudyTime: number;
  completedDays: number;
  totalExercises: number;
  completedExercises: number;
  totalErrors: number;
  averageScore: number;
  streak: number;
  lastStudyDate?: string;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    unlockedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
}

interface StudyState {
  // 课程相关
  courses: CourseContent[];
  currentCourse: CourseContent | null;
  isLoadingCourses: boolean;
  
  // 学习进度相关
  progress: StudyProgress[];
  currentProgress: StudyProgress | null;
  isLoadingProgress: boolean;
  
  // 学习统计相关
  stats: StudyStats | null;
  isLoadingStats: boolean;
  
  // 代码执行相关
  codeExecutionResult: CodeExecutionResult | null;
  isExecutingCode: boolean;
  
  // 错误处理
  error: string | null;
  
  // Actions
  fetchCourses: () => Promise<void>;
  fetchCourseContent: (day: number) => Promise<void>;
  fetchProgress: () => Promise<void>;
  updateProgress: (data: {
    courseId?: string;
    day: number;
    status: 'not_started' | 'in_progress' | 'completed';
    studyTime?: number;
    codeSubmissions?: number;
    errors?: number;
    notes?: string;
  }) => Promise<void>;
  fetchStats: () => Promise<void>;
  executeCode: (data: {
    code: string;
    language: 'javascript' | 'html' | 'css';
    exerciseId?: string;
  }) => Promise<void>;
  clearError: () => void;
  setCurrentCourse: (course: CourseContent | null) => void;
  setCurrentProgress: (progress: StudyProgress | null) => void;
  
  // 学习时间跟踪
  startLearning: (courseId: string) => Promise<void>;
  updateComponentProgress: (courseId: string, componentId: string, data: {
    isCompleted: boolean;
    score?: number;
    attempts?: number;
  }) => Promise<void>;
  checkAllTasksCompleted: (courseId: string) => boolean;
  completeLearning: (courseId: string) => Promise<void>;
  startStudyTimeTracking: (courseId: string) => void;
  stopStudyTimeTracking: () => void;
  studyTimeInterval: number | null;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  // 初始状态
  courses: [],
  currentCourse: null,
  isLoadingCourses: false,
  
  progress: [],
  currentProgress: null,
  isLoadingProgress: false,
  
  stats: null,
  isLoadingStats: false,
  
  codeExecutionResult: null,
  isExecutingCode: false,
  
  error: null,
  studyTimeInterval: null,

  // Actions
  fetchCourses: async () => {
    try {
      set({ isLoadingCourses: true, error: null });
      
      const response = await studyService.getCourseList();
      
      if (response.success && response.data) {
        set({
          courses: response.data,
          isLoadingCourses: false,
        });
      } else {
        set({
          isLoadingCourses: false,
          error: response.message || '获取课程列表失败',
        });
      }
    } catch (error: any) {
      set({
        isLoadingCourses: false,
        error: error.response?.data?.message || error.message || '获取课程列表失败',
      });
    }
  },

  fetchCourseContent: async (day: number) => {
    try {
      set({ isLoadingCourses: true, error: null });
      
      const response = await studyService.getCourseContent(day);
      
      if (response.success && response.data) {
        set({
          currentCourse: response.data,
          isLoadingCourses: false,
        });
      } else {
        set({
          isLoadingCourses: false,
          error: response.message || '获取课程内容失败',
        });
      }
    } catch (error: any) {
      set({
        isLoadingCourses: false,
        error: error.response?.data?.message || error.message || '获取课程内容失败',
      });
    }
  },

  fetchProgress: async () => {
    try {
      set({ isLoadingProgress: true, error: null });
      
      const response = await studyService.getStudyProgress();
      
      if (response.success && response.data) {
        set({
          progress: response.data,
          isLoadingProgress: false,
        });
      } else {
        set({
          isLoadingProgress: false,
          error: response.message || '获取学习进度失败',
        });
      }
    } catch (error: any) {
      set({
        isLoadingProgress: false,
        error: error.response?.data?.message || error.message || '获取学习进度失败',
      });
    }
  },

  updateProgress: async (data) => {
    try {
      set({ isLoadingProgress: true, error: null });
      
      const response = await studyService.updateStudyProgress(data);
      
      if (response.success && response.data) {
        // 更新本地进度数据
        const { progress } = get();
        const updatedProgress = progress.map(p => 
          p.day === data.day ? response.data : p
        );
        
        // 如果没有找到对应的进度记录，添加新的
        if (!progress.find(p => p.day === data.day)) {
          updatedProgress.push(response.data);
        }
        
        set({
          progress: updatedProgress.filter((p): p is StudyProgress => p !== undefined),
          currentProgress: response.data,
          isLoadingProgress: false,
        });
        
        // 重新获取统计数据
        get().fetchStats();
      } else {
        set({
          isLoadingProgress: false,
          error: response.message || '更新学习进度失败',
        });
      }
    } catch (error: any) {
      set({
        isLoadingProgress: false,
        error: error.response?.data?.message || error.message || '更新学习进度失败',
      });
    }
  },

  fetchStats: async () => {
    try {
      set({ isLoadingStats: true, error: null });
      
      const response = await studyService.getStudyStats();
      
      if (response.success && response.data) {
        set({
          stats: response.data,
          isLoadingStats: false,
        });
      } else {
        set({
          isLoadingStats: false,
          error: response.message || '获取学习统计失败',
        });
      }
    } catch (error: any) {
      set({
        isLoadingStats: false,
        error: error.response?.data?.message || error.message || '获取学习统计失败',
      });
    }
  },

  executeCode: async (data) => {
    try {
      set({ isExecutingCode: true, error: null, codeExecutionResult: null });
      
      const response = await studyService.executeCode(data);
      
      if (response.success && response.data) {
        set({
          codeExecutionResult: response.data.result,
          isExecutingCode: false,
        });
        
        // 如果代码执行成功，更新代码提交次数
        const { currentProgress } = get();
        if (currentProgress) {
          get().updateProgress({
            day: currentProgress.day,
            status: currentProgress.status,
            codeSubmissions: 1,
          });
        }
      } else {
        set({
          isExecutingCode: false,
          error: response.message || '代码执行失败',
        });
      }
    } catch (error: any) {
      set({
        isExecutingCode: false,
        error: error.response?.data?.message || error.message || '代码执行失败',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentCourse: (course: CourseContent | null) => {
    set({ currentCourse: course });
  },

  setCurrentProgress: (progress: StudyProgress | null) => {
    set({ currentProgress: progress });
  },

  // 学习时间跟踪方法
  startLearning: async (courseId: string) => {
    try {
      const course = allCourses.find(c => c.id === courseId);
      if (!course) {
        set({ error: '课程不存在' });
        return;
      }

      const response = await studyService.updateStudyProgress({
        courseId,
        day: course.day,
        status: 'in_progress',
      });
      
      if (response.success) {
        const { progress } = get();
        const startTime = new Date().toISOString();
        const updatedProgress = progress.map(p => 
          p.courseId === courseId 
            ? { ...p, status: 'in_progress' as const, startTime }
            : p
        );
        
        // 立即更新状态
        set({ 
          progress: updatedProgress,
          currentProgress: updatedProgress.find(p => p.courseId === courseId)
        });
        
        // 开始学习时间跟踪
        get().startStudyTimeTracking(courseId);
        
        console.log('学习已开始:', { courseId, startTime });
      }
    } catch (error: any) {
      set({ error: error.message || '开始学习失败' });
    }
  },

  // 开始学习时间跟踪
  startStudyTimeTracking: (courseId: string) => {
    const intervalId = setInterval(() => {
      const { progress } = get();
      const currentProgress = progress.find(p => p.courseId === courseId);
      
      if (currentProgress && currentProgress.status === 'in_progress' && currentProgress.startTime) {
        const startTime = new Date(currentProgress.startTime);
        const now = new Date();
        const studyTimeMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        
        // 更新学习时间
        const updatedProgress = progress.map(p => 
          p.courseId === courseId 
            ? { ...p, studyTime: studyTimeMinutes }
            : p
        );
        
        set({ 
          progress: updatedProgress,
          currentProgress: updatedProgress.find(p => p.courseId === courseId)
        });
        
        console.log('学习时间更新:', { courseId, studyTimeMinutes });
      } else {
        // 如果课程已完成或未开始，停止跟踪
        clearInterval(intervalId);
      }
    }, 60000); // 每分钟更新一次
    
    // 存储interval ID以便后续清理
    set({ studyTimeInterval: intervalId });
  },

  // 停止学习时间跟踪
  stopStudyTimeTracking: () => {
    const { studyTimeInterval } = get();
    if (studyTimeInterval) {
      clearInterval(studyTimeInterval);
      set({ studyTimeInterval: null });
    }
  },

  updateComponentProgress: async (courseId: string, componentId: string, data: {
    isCompleted: boolean;
    score?: number;
    attempts?: number;
  }) => {
    try {
      const { progress } = get();
      const currentProgress = progress.find(p => p.courseId === courseId);
      
      if (currentProgress) {
        const updatedComponentProgress = {
          ...currentProgress.componentProgress,
          [componentId]: {
            isCompleted: data.isCompleted,
            completedAt: data.isCompleted ? new Date().toISOString() : undefined,
            attempts: data.attempts,
            score: data.score,
          }
        };

        // 检查是否所有任务都完成了
        const isAllTasksCompleted = get().checkAllTasksCompleted(courseId);

        const updatedProgress = progress.map(p => 
          p.courseId === courseId 
            ? { 
                ...p, 
                componentProgress: updatedComponentProgress,
                isAllTasksCompleted 
              }
            : p
        );
        
        set({ progress: updatedProgress });
        
        // 更新当前进度
        const newCurrentProgress = updatedProgress.find(p => p.courseId === courseId);
        if (newCurrentProgress) {
          set({ currentProgress: newCurrentProgress });
        }
      }
    } catch (error: any) {
      set({ error: error.message || '更新组件进度失败' });
    }
  },

  checkAllTasksCompleted: (courseId: string) => {
    const { progress } = get();
    const currentProgress = progress.find(p => p.courseId === courseId);
    
    console.log('checkAllTasksCompleted Debug:', {
      courseId,
      currentProgress,
      allProgress: progress.map(p => ({ courseId: p.courseId, status: p.status }))
    });
    
    if (!currentProgress) {
      console.log('No progress found for course:', courseId);
      return false;
    }

    // 如果课程状态已经是completed，直接返回true
    if (currentProgress.status === 'completed') {
      console.log('Course already completed');
      return true;
    }

    // 检查是否有componentProgress且isAllTasksCompleted为true
    if (currentProgress.isAllTasksCompleted) {
      console.log('isAllTasksCompleted is true');
      return true;
    }

    // 如果没有componentProgress，检查是否有基本的完成条件
    if (!currentProgress.componentProgress || Object.keys(currentProgress.componentProgress).length === 0) {
      // 对于没有交互组件的课程，只要状态是in_progress就认为可以完成
      const result = currentProgress.status === 'in_progress';
      console.log('No component progress, checking status:', currentProgress.status, 'result:', result);
      return result;
    }

    // 检查componentProgress中的完成情况
    const componentProgress = currentProgress.componentProgress;
    const allComponents = Object.values(componentProgress);
    const completedComponents = allComponents.filter(cp => cp.isCompleted);
    
    console.log('Component progress check:', {
      allComponents: allComponents.length,
      completedComponents: completedComponents.length,
      componentProgress
    });
    
    // 如果有组件且所有组件都完成了，返回true
    if (allComponents.length > 0 && completedComponents.length === allComponents.length) {
      console.log('All components completed');
      return true;
    }

    // 对于新课程，如果没有组件进度，只要开始学习就认为可以完成
    const result = currentProgress.status === 'in_progress' && allComponents.length === 0;
    console.log('Final check result:', result);
    return result;
  },

  completeLearning: async (courseId: string) => {
    try {
      const isAllCompleted = get().checkAllTasksCompleted(courseId);
      
      if (!isAllCompleted) {
        set({ error: '请完成所有任务后再结束学习' });
        return;
      }

      const course = allCourses.find(c => c.id === courseId);
      if (!course) {
        set({ error: '课程不存在' });
        return;
      }

      const response = await studyService.updateStudyProgress({
        courseId,
        day: course.day,
        status: 'completed',
      });
      
      if (response.success) {
        // 停止学习时间跟踪
        get().stopStudyTimeTracking();
        
        const { progress } = get();
        const updatedProgress = progress.map(p => 
          p.courseId === courseId 
            ? { 
                ...p, 
                status: 'completed' as const, 
                completedTime: new Date().toISOString(),
                isAllTasksCompleted: true
              }
            : p
        );
        
        // 立即更新状态
        set({ 
          progress: updatedProgress,
          currentProgress: updatedProgress.find(p => p.courseId === courseId)
        });
        
        console.log('课程已完成:', { courseId });
      }
    } catch (error: any) {
      set({ error: error.message || '完成学习失败' });
    }
  },
}));
