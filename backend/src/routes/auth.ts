import { Router } from 'express';
import { login, getCurrentUser, logout, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 用户登录
router.post('/login', login);

// 获取当前用户信息（需要认证）
router.get('/me', authenticateToken, getCurrentUser);

// 验证令牌有效性
router.get('/verify', authenticateToken, verifyToken);

// 用户登出
router.post('/logout', authenticateToken, logout);

export default router;
