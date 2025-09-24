import { Router } from 'express';
import { 
  getCourseList, 
  getCourseContent, 
  getStudyProgress, 
  updateStudyProgress, 
  executeCode, 
  getStudyStats 
} from '../controllers/studyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 获取课程列表（需要认证）
router.get('/courses', authenticateToken, getCourseList);

// 获取特定课程内容（需要认证）
router.get('/courses/:day', authenticateToken, getCourseContent);

// 获取用户学习进度（需要认证）
router.get('/progress', authenticateToken, getStudyProgress);

// 更新学习进度（需要认证）
router.put('/progress', authenticateToken, updateStudyProgress);

// 执行代码（需要认证）
router.post('/execute', authenticateToken, executeCode);

// 获取学习统计（需要认证）
router.get('/stats', authenticateToken, getStudyStats);

export default router;
