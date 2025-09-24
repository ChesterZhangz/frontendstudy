// HTML课程数据配置

export interface Course {
  id: string;
  day: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  topics: string[];
  category: 'html' | 'css' | 'javascript';
  component: React.ComponentType;
  isCompleted?: boolean;
  progress?: number;
}

// 动态导入课程组件
const importHTMLCourse = (courseId: string) => {
  switch (courseId) {
    case '1001-01':
      return import('../study/html/1001-01').then(m => m.default);
    case '1001-02':
      return import('../study/html/1001-02').then(m => m.default);
    case '1001-03':
      return import('../study/html/1001-03').then(m => m.default);
    case '1001-04':
      return import('../study/html/1001-04').then(m => m.default);
    case '1001-05':
      return import('../study/html/1001-05').then(m => m.default);
    default:
      return Promise.resolve(() => null);
  }
};

const importCSSCourse = (courseId: string) => {
  switch (courseId) {
    case '2001-01':
      return import('../study/css/1002-01').then(m => m.default);
    case '2001-02':
      return import('../study/css/1002-02').then(m => m.default);
    case '2001-03':
      return import('../study/css/1002-03').then(m => m.default);
    case '2001-04':
      return import('../study/css/1002-04').then(m => m.default);
    case '2001-05':
      return import('../study/css/1002-05').then(m => m.default);
    case '2001-06':
      return import('../study/css/1002-06').then(m => m.default);
    default:
      return Promise.resolve(() => null);
  }
};

const importJavaScriptCourse = (courseId: string) => {
  switch (courseId) {
    case '3001-01':
      return import('../study/javascript/1003-01').then(m => m.default);
    default:
      return Promise.resolve(() => null);
  }
};

// HTML课程配置
export const htmlCourses: Omit<Course, 'component'>[] = [
  {
    id: '1001-01',
    day: 1,
    title: 'HTML 基础入门',
    description: '学习HTML的基本概念、标签语法和文档结构，了解HTML在网页开发中的作用。',
    difficulty: 'intermediate',
    estimatedTime: 35, // 基于内容计算
    topics: ['HTML概念', '标签语法', '文档结构', '常用标签'],
    category: 'html'
  },
  {
    id: '1001-02',
    day: 2,
    title: 'HTML 文本和标题',
    description: '掌握HTML中的标题标签、段落标签、文本格式化标签的使用方法。',
    difficulty: 'beginner',
    estimatedTime: 25, // 基于内容计算
    topics: ['标题标签', '段落标签', '文本格式', '换行分隔'],
    category: 'html'
  },
  {
    id: '1001-03',
    day: 3,
    title: 'HTML 列表和链接',
    description: '学习如何创建有序列表、无序列表，以及各种类型的超链接。',
    difficulty: 'beginner',
    estimatedTime: 20, // 基于内容计算
    topics: ['无序列表', '有序列表', '嵌套列表', '超链接', '锚点链接'],
    category: 'html'
  },
  {
    id: '1001-04',
    day: 4,
    title: 'HTML 图片和媒体',
    description: '掌握图片标签的使用，学习HTML5音频、视频标签和嵌入内容。',
    difficulty: 'beginner',
    estimatedTime: 20, // 基于内容计算
    topics: ['图片标签', '音频视频', '媒体属性', '嵌入内容'],
    category: 'html'
  },
  {
    id: '1001-05',
    day: 5,
    title: 'HTML 表格和表单',
    description: '学习创建数据表格和用户交互表单，掌握各种输入类型的使用。',
    difficulty: 'beginner',
    estimatedTime: 25, // 基于内容计算
    topics: ['表格结构', '表单元素', '输入类型', '表单验证'],
    category: 'html'
  }
];

// CSS课程配置
export const cssCourses: Omit<Course, 'component'>[] = [
  {
    id: '2001-01',
    day: 6,
    title: 'CSS 基础入门',
    description: '学习CSS的基本概念、语法规则和引入方式，掌握基础选择器的使用方法。',
    difficulty: 'beginner',
    estimatedTime: 25, // 基于内容计算
    topics: ['CSS概念', '语法规则', '引入方式', '基础选择器'],
    category: 'css'
  },
  {
    id: '2001-02',
    day: 7,
    title: 'CSS 选择器',
    description: '深入学习各种CSS选择器，包括元素、类、ID、属性和伪类选择器。',
    difficulty: 'beginner',
    estimatedTime: 30, // 基于内容计算
    topics: ['元素选择器', '类选择器', 'ID选择器', '属性选择器', '伪类选择器'],
    category: 'css'
  },
  {
    id: '2001-03',
    day: 8,
    title: 'CSS 文字和字体',
    description: '掌握CSS中文字样式、字体设置、颜色和文本效果的控制方法。',
    difficulty: 'beginner',
    estimatedTime: 30, // 基于内容计算
    topics: ['字体属性', '文字样式', '颜色设置', '文本效果', '阴影效果'],
    category: 'css'
  },
  {
    id: '2001-04',
    day: 9,
    title: 'CSS 颜色和背景',
    description: '学习CSS颜色表示方法、背景属性和渐变效果的创建技巧。',
    difficulty: 'beginner',
    estimatedTime: 30, // 基于内容计算
    topics: ['颜色表示', '背景属性', '线性渐变', '径向渐变', '多层背景'],
    category: 'css'
  },
  {
    id: '2001-05',
    day: 10,
    title: 'CSS 盒模型和布局',
    description: '深入理解CSS盒模型，学习内边距、边框、外边距和基本布局技术。',
    difficulty: 'beginner',
    estimatedTime: 30, // 基于内容计算
    topics: ['盒模型概念', '内边距', '边框样式', '外边距', '布局基础'],
    category: 'css'
  },
  {
    id: '2001-06',
    day: 11,
    title: 'CSS 响应式设计',
    description: '掌握响应式设计原理，学习媒体查询、Flexbox和Grid布局技术。',
    difficulty: 'intermediate',
    estimatedTime: 35, // 基于内容计算
    topics: ['响应式概念', '媒体查询', 'Flexbox布局', 'Grid布局', '移动优先'],
    category: 'css'
  }
];

// JavaScript课程配置
export const javascriptCourses: Omit<Course, 'component'>[] = [
  {
    id: '3001-01',
    day: 12,
    title: 'JavaScript 基础语法',
    description: '学习JavaScript的基本语法、变量声明、数据类型、运算符和模板字符串。',
    difficulty: 'beginner',
    estimatedTime: 45, // 基于内容计算：7个executable + 4个quiz + 4个fill-blank + 1个exercise
    topics: ['变量声明', '数据类型', '运算符', '模板字符串', '类型转换'],
    category: 'javascript'
  },
  // ... 更多JavaScript课程
];

// 合并所有课程
export const allCourses = [...htmlCourses, ...cssCourses, ...javascriptCourses];

// 获取课程组件的函数
export const getCourseComponent = async (courseId: string): Promise<React.ComponentType | null> => {
  try {
    if (courseId.startsWith('1001-')) {
      return await importHTMLCourse(courseId);
    } else if (courseId.startsWith('2001-')) {
      return await importCSSCourse(courseId);
    } else if (courseId.startsWith('3001-')) {
      return await importJavaScriptCourse(courseId);
    }
    return null;
  } catch (error) {
    console.error(`Failed to load course component: ${courseId}`, error);
    return null;
  }
};

// 根据类别获取课程
export const getCoursesByCategory = (category: 'html' | 'css' | 'javascript') => {
  return allCourses.filter(course => course.category === category);
};

// 获取总课程数
export const getTotalCourses = () => {
  return allCourses.length;
};

// 获取各类别课程数量
export const getCourseCounts = () => {
  return {
    html: htmlCourses.length,
    css: cssCourses.length,
    javascript: javascriptCourses.length,
    total: allCourses.length
  };
};

// 根据难度获取课程
export const getCoursesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  return allCourses.filter(course => course.difficulty === difficulty);
};

// 获取已完成课程数（这里需要结合实际的学习进度数据）
export const getCompletedCourses = (progress: any[] = []) => {
  return progress.filter(p => p.status === 'completed').length;
};
