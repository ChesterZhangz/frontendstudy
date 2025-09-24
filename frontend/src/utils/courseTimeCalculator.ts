// 课程学习时间计算工具

interface CourseTimeFactors {
  // 基础阅读时间（每1000字符）
  readingTimePerKChar: number;
  // 代码示例时间（每个executable块）
  executableTime: number;
  // 练习时间（每个exercise）
  exerciseTime: number;
  // 测验时间（每个quiz）
  quizTime: number;
  // 填空题时间（每个fill-blank）
  fillBlankTime: number;
  // 拖拽题时间（每个drag-drop）
  dragDropTime: number;
  // 挑战题时间（每个challenge）
  challengeTime: number;
}

// 默认时间因子（单位：分钟）
const DEFAULT_TIME_FACTORS: CourseTimeFactors = {
  readingTimePerKChar: 2,    // 每1000字符2分钟
  executableTime: 3,         // 每个代码示例3分钟
  exerciseTime: 8,           // 每个练习8分钟
  quizTime: 2,              // 每个测验2分钟
  fillBlankTime: 1.5,       // 每个填空题1.5分钟
  dragDropTime: 4,          // 每个拖拽题4分钟
  challengeTime: 15,        // 每个挑战题15分钟
};

/**
 * 计算课程预计学习时间
 * @param courseContent 课程内容字符串
 * @param customFactors 自定义时间因子
 * @returns 预计学习时间（分钟）
 */
export function calculateCourseTime(
  courseContent: string, 
  customFactors?: Partial<CourseTimeFactors>
): number {
  const factors = { ...DEFAULT_TIME_FACTORS, ...customFactors };
  
  // 计算文本阅读时间
  const textContent = courseContent
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/:::[^:]*[\s\S]*?:::/g, '') // 移除交互组件
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/[#*`\-\[\]]/g, '') // 移除Markdown标记
    .trim();
  
  const readingTime = (textContent.length / 1000) * factors.readingTimePerKChar;
  
  // 计算各种交互组件的时间
  const executableCount = (courseContent.match(/```executable:/g) || []).length;
  const exerciseCount = (courseContent.match(/:::exercise/g) || []).length;
  const quizCount = (courseContent.match(/:::quiz/g) || []).length;
  const fillBlankCount = (courseContent.match(/:::fill-blank/g) || []).length;
  const dragDropCount = (courseContent.match(/:::drag-drop/g) || []).length;
  const challengeCount = (courseContent.match(/:::challenge/g) || []).length;
  
  const interactiveTime = 
    executableCount * factors.executableTime +
    exerciseCount * factors.exerciseTime +
    quizCount * factors.quizTime +
    fillBlankCount * factors.fillBlankTime +
    dragDropCount * factors.dragDropTime +
    challengeCount * factors.challengeTime;
  
  // 总时间（向上取整到最近的5分钟）
  const totalTime = readingTime + interactiveTime;
  return Math.ceil(totalTime / 5) * 5;
}

/**
 * 分析课程内容组成
 * @param courseContent 课程内容字符串
 * @returns 课程内容分析结果
 */
export function analyzeCourseContent(courseContent: string) {
  const textLength = courseContent
    .replace(/```[\s\S]*?```/g, '')
    .replace(/:::[^:]*[\s\S]*?:::/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`\-\[\]]/g, '')
    .trim().length;
  
  return {
    textLength,
    executableCount: (courseContent.match(/```executable:/g) || []).length,
    exerciseCount: (courseContent.match(/:::exercise/g) || []).length,
    quizCount: (courseContent.match(/:::quiz/g) || []).length,
    fillBlankCount: (courseContent.match(/:::fill-blank/g) || []).length,
    dragDropCount: (courseContent.match(/:::drag-drop/g) || []).length,
    challengeCount: (courseContent.match(/:::challenge/g) || []).length,
  };
}

/**
 * 获取课程难度建议
 * @param estimatedTime 预计学习时间（分钟）
 * @returns 难度等级
 */
export function getDifficultyByTime(estimatedTime: number): 'beginner' | 'intermediate' | 'advanced' {
  if (estimatedTime <= 30) return 'beginner';
  if (estimatedTime <= 60) return 'intermediate';
  return 'advanced';
}
