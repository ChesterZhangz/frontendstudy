import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Joi from 'joi';
import { ApiResponse, LoginRequest, LoginResponse } from '../types';
import { getSharedataConnection, checkDatabaseHealth, reconnectDatabases } from '../config/database';
import { SharedUser } from '../models/SharedUser';

// 登录验证模式
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '请输入有效的邮箱地址',
    'any.required': '邮箱地址是必填项'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': '密码至少需要6个字符',
    'any.required': '密码是必填项'
  })
});

// 用户登录
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 验证请求数据
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: '请求数据验证失败',
        error: error.details[0]?.message || '验证失败'
      });
      return;
    }

    const { email, password }: LoginRequest = value;

    // 检查数据库连接健康状态
    const isHealthy = await checkDatabaseHealth();
    if (!isHealthy) {
      console.log('🔄 数据库连接不健康，尝试重连...');
      await reconnectDatabases();
    }

    // 获取 Sharedata 数据库连接
    const sharedataConnection = getSharedataConnection();
    const SharedUserModel = SharedUser(sharedataConnection);

    // 查找用户（添加超时控制）
    const user = await Promise.race([
      SharedUserModel.findOne({ email }).select('+password'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库查询超时')), 5000)
      )
    ]) as any;
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
        error: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // 检查用户状态
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: '账户已被禁用',
        error: 'ACCOUNT_DISABLED'
      });
      return;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
        error: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // 生成 JWT 令牌
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT_SECRET 未配置');
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as any
    );

    // 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();

    // 返回用户信息（不包含密码）
    const userResponse = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      userType: user.userType,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const response: ApiResponse<LoginResponse> = {
      success: true,
      message: '登录成功',
      data: {
        user: userResponse,
        token,
        expiresIn: jwtExpiresIn
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 获取当前用户信息
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    // 连接 Sharedata 数据库获取完整用户信息
    const sharedataConnection = getSharedataConnection();
    const SharedUserModel = SharedUser(sharedataConnection);
    
    const user = await SharedUserModel.findById(req.user._id).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在',
        error: 'USER_NOT_FOUND'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: '获取用户信息成功',
      data: user
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 用户登出
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // 在实际应用中，这里可以将令牌加入黑名单
    // 目前只是返回成功响应
    const response: ApiResponse = {
      success: true,
      message: '登出成功'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('登出错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};

// 验证令牌有效性
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '令牌无效',
        error: 'INVALID_TOKEN'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: '令牌有效',
      data: {
        user: req.user
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('令牌验证错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'INTERNAL_ERROR'
    });
  }
};
