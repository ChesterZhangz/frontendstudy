import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import { StudyProgress } from '../models/StudyProgress';
import { CourseContent } from '../models/CourseContent';
import { StudyStats } from '../models/StudyStats';
import { CodeExecution } from '../models/CodeExecution';
import { CodeExecutorFactory, CodeSecurityChecker, CodeExecutionResult, Language } from '../services/codeExecutor';
import { ApiResponse, UpdateProgressRequest, ExecuteCodeRequest, GetCourseContentRequest } from '../types';

// 获取课程列表
export const getCourseList = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await CourseContent.find({ isActive: true })
      .select('day title description difficulty estimatedTime topics')
      .sort({ day: 1 });

    const response: ApiResponse = {
      success: true,
      message: '获取课程列表成功',
      data: courses
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取课程列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 获取特定课程内容
export const getCourseContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = Joi.object({
      day: Joi.number().integer().min(1).max(20).required()
    }).validate({ day: parseInt(req.params.day || '1') });

    if (error) {
      res.status(400).json({
        success: false,
        message: '请求参数验证失败',
        error: error.details[0]?.message || '验证失败'
      });
      return;
    }

    const { day } = value as { day: number };

    const courseContent = await CourseContent.findOne({ day, isActive: true });
    
    if (!courseContent) {
      res.status(404).json({
        success: false,
        message: '课程内容不存在',
        error: 'COURSE_NOT_FOUND'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: '获取课程内容成功',
      data: courseContent
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取课程内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 获取用户学习进度
export const getStudyProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const progress = await StudyProgress.find({ userId })
      .sort({ day: 1 });

    const response: ApiResponse = {
      success: true,
      message: '获取学习进度成功',
      data: progress
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取学习进度错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 更新学习进度
export const updateStudyProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    const { error, value } = Joi.object({
      courseId: Joi.string().default('javascript-20days'),
      day: Joi.number().integer().min(1).max(20).required(),
      status: Joi.string().valid('not_started', 'in_progress', 'completed').required(),
      studyTime: Joi.number().min(0).optional(),
      codeSubmissions: Joi.number().min(0).optional(),
      errors: Joi.number().min(0).optional(),
      notes: Joi.string().optional()
    }).validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: '请求数据验证失败',
        error: error.details[0]?.message || '验证失败'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const updateData: UpdateProgressRequest = value as any;

    // 查找或创建学习进度记录
    let progress = await StudyProgress.findOne({
      userId,
      courseId: updateData.courseId,
      day: updateData.day
    });

    if (!progress) {
      progress = new StudyProgress({
        userId,
        courseId: updateData.courseId,
        day: updateData.day,
        status: updateData.status,
        startTime: updateData.status === 'in_progress' ? new Date() : undefined
      });
    } else {
      // 更新现有记录
      if (updateData.status === 'in_progress' && progress.status === 'not_started') {
        progress.startTime = new Date();
      }
      
      progress.status = updateData.status;
      
      if (updateData.studyTime !== undefined) {
        progress.studyTime += updateData.studyTime;
      }
      
      if (updateData.codeSubmissions !== undefined) {
        progress.codeSubmissions += updateData.codeSubmissions;
      }
      
      if (updateData.errors !== undefined) {
        // @ts-ignore
        progress.errors += Number(updateData.errors);
      }
      
      if (updateData.notes !== undefined) {
        progress.notes = updateData.notes;
      }
    }

    await progress.save();

    // 更新学习统计
    await updateStudyStats(userId);

    const response: ApiResponse = {
      success: true,
      message: '学习进度更新成功',
      data: progress
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('更新学习进度错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 执行代码
export const executeCode = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    const { error, value } = Joi.object({
      code: Joi.string().required(),
      language: Joi.string().valid('javascript', 'html', 'css').required(),
      exerciseId: Joi.string().optional()
    }).validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: '请求数据验证失败',
        error: error.details[0]?.message || '验证失败'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { code, language, exerciseId }: ExecuteCodeRequest = value as any;

    // 安全检查
    const securityCheck = CodeSecurityChecker.isSafe(code);
    if (!securityCheck.safe) {
      res.status(400).json({
        success: false,
        message: securityCheck.reason || '代码安全检查失败',
        error: 'UNSAFE_CODE'
      });
      return;
    }

    // 执行代码
    const executionResult = await CodeExecutorFactory.executeCode(code, language);

    // 保存代码执行记录
    const codeExecution = new CodeExecution({
      userId,
      courseId: 'javascript-20days',
      exerciseId,
      code,
      language,
      result: executionResult
    });

    await codeExecution.save();

    const response: ApiResponse = {
      success: true,
      message: executionResult.success ? '代码执行成功' : '代码执行失败',
      data: {
        result: executionResult,
        executionId: codeExecution._id
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('代码执行错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 获取学习统计
export const getStudyStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    let stats = await StudyStats.findOne({ userId });
    
    if (!stats) {
      // 创建新的统计记录
      stats = new StudyStats({ userId });
      await stats.save();
    }

    const response: ApiResponse = {
      success: true,
      message: '获取学习统计成功',
      data: stats
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取学习统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 更新学习统计的辅助函数
const updateStudyStats = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  try {
    // 计算总学习时间
    const progressRecords = await StudyProgress.find({ userId });
    const totalStudyTime = progressRecords.reduce((sum, record) => sum + record.studyTime, 0);
    const completedDays = progressRecords.filter(record => record.status === 'completed').length;
    const totalErrors = progressRecords.reduce((sum, record) => sum + record.errors, 0);

    // 更新或创建统计记录
    await StudyStats.findOneAndUpdate(
      { userId },
      {
        $set: {
          totalStudyTime,
          completedDays,
          totalErrors,
          lastStudyDate: new Date()
        }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('更新学习统计错误:', error);
  }
};
