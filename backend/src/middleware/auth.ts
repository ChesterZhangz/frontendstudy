import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { getSharedataConnection, checkDatabaseHealth, reconnectDatabases } from '../config/database';
import { SharedUser } from '../models/SharedUser';

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        name: string;
        role: string;
        userType: string;
      };
    }
  }
}

// JWT 验证中间件
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: '访问令牌缺失',
        error: 'MISSING_TOKEN'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET 未配置');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // 检查数据库连接健康状态
    const isHealthy = await checkDatabaseHealth();
    if (!isHealthy) {
      console.log('🔄 数据库连接不健康，尝试重连...');
      await reconnectDatabases();
    }
    
    // 验证用户是否仍然有效
    const sharedataConnection = getSharedataConnection();
    const SharedUserModel = SharedUser(sharedataConnection);
    
    // 添加超时控制
    const user = await Promise.race([
      SharedUserModel.findById(decoded.userId).select('-password'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库查询超时')), 3000)
      )
    ]) as any;
    
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用',
        error: 'INVALID_USER'
      });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      userType: user.userType
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: '无效的访问令牌',
        error: 'INVALID_TOKEN'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: '访问令牌已过期',
        error: 'TOKEN_EXPIRED'
      });
    } else {
      console.error('认证中间件错误:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: 'INTERNAL_ERROR'
      });
    }
  }
};

// 角色验证中间件
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '用户未认证',
        error: 'UNAUTHENTICATED'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: '权限不足',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

// 可选认证中间件（用于某些可以匿名访问的接口）
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as any;
        const sharedataConnection = getSharedataConnection();
        const SharedUserModel = SharedUser(sharedataConnection);
        
        const user = await SharedUserModel.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            userType: user.userType
          };
        }
      }
    }

    next();
  } catch (error) {
    // 可选认证失败时不阻止请求继续
    next();
  }
};
