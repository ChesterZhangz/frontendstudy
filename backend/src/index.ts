import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mime from 'mime-types';
import { connectDatabase, connectSharedataDatabase } from './config/database';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import studyRoutes from './routes/study';
import achievementsRoutes from './routes/achievements';
import leaderboardRoutes from './routes/leaderboard';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5200;

// 信任代理设置
app.set('trust proxy', true);

// 安全中间件 - 配置CSP以允许内联脚本
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS 中间件
app.use(corsMiddleware);

// 请求限制中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试',
    error: 'TOO_MANY_REQUESTS'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// 登录接口特殊限制
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制每个IP 15分钟内最多5次登录尝试
  message: {
    success: false,
    message: '登录尝试过于频繁，请15分钟后再试',
    error: 'LOGIN_TOO_MANY_ATTEMPTS'
  },
  skipSuccessfulRequests: true
});

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点 - 优先处理
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由 - 优先处理
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 静态文件服务 - 在API路由之后，配置正确的MIME类型
app.use(express.static(path.join(__dirname, '../../frontend/dist'), {
  setHeaders: (res, path) => {
    // 设置正确的MIME类型
    const mimeType = mime.lookup(path);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    
    // 设置缓存头
    if (path.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

app.use(express.static(path.join(__dirname, '../../nginx-static'), {
  setHeaders: (res, path) => {
    const mimeType = mime.lookup(path);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
  }
}));

// SPA路由处理 - 所有未匹配的路由返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// 404 处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async (): Promise<void> => {
  try {
    // 连接数据库
    await connectDatabase();
    await connectSharedataDatabase();

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📚 JavaScript 交互式学习平台后端服务已启动`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

// 启动服务器
startServer();
