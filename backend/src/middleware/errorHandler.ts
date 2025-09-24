import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

// 全局错误处理中间件
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('全局错误处理:', error);

  // Mongoose 验证错误
  if (error.name === 'ValidationError') {
    const response: ApiResponse = {
      success: false,
      message: '数据验证失败',
      error: 'VALIDATION_ERROR'
    };
    res.status(400).json(response);
    return;
  }

  // Mongoose 重复键错误
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    const response: ApiResponse = {
      success: false,
      message: '数据重复',
      error: 'DUPLICATE_ERROR'
    };
    res.status(409).json(response);
    return;
  }

  // JWT 错误
  if (error.name === 'JsonWebTokenError') {
    const response: ApiResponse = {
      success: false,
      message: '无效的访问令牌',
      error: 'INVALID_TOKEN'
    };
    res.status(401).json(response);
    return;
  }

  // 令牌过期错误
  if (error.name === 'TokenExpiredError') {
    const response: ApiResponse = {
      success: false,
      message: '访问令牌已过期',
      error: 'TOKEN_EXPIRED'
    };
    res.status(401).json(response);
    return;
  }

  // 默认服务器错误
  const response: ApiResponse = {
    success: false,
    message: '服务器内部错误',
    error: 'INTERNAL_ERROR'
  };
  res.status(500).json(response);
};

// 404 错误处理
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `路由 ${req.originalUrl} 不存在`,
    error: 'ROUTE_NOT_FOUND'
  };
  res.status(404).json(response);
};
