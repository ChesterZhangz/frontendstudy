// 交互式组件类型定义

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  html?: string;
  logs?: string[];
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

export interface InteractiveComponent {
  type: 'exercise' | 'quiz' | 'fill-blank' | 'drag-drop' | 'challenge' | 'executable';
  id: string;
  data: any;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
}

// 可执行代码块数据（纯演示，不验证）
export interface ExecutableData {
  title: string;
  description: string;
  starterCode: string;
  language: 'javascript' | 'html' | 'css';
  hints?: string[];
  solution?: string;
  isDemo?: boolean; // 标记为演示代码，不进行验证
}

// 练习组件数据
export interface ExerciseData {
  title: string;
  description: string;
  starterCode: string;
  language: 'javascript' | 'html' | 'css';
  hints?: string[];
  solution?: string;
  testCases?: TestCase[];
  expectedOutput?: string; // 预期输出，用于自动验证
}

// 选择题组件数据
export interface QuizData {
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  explanation?: string;
  multipleChoice?: boolean;
}

// 填空题组件数据
export interface FillBlankData {
  content: string; // 包含 {answer1|answer2|answer3} 格式的填空
  blanks: Array<{
    id: string;
    acceptedAnswers: string[];
    caseSensitive?: boolean;
  }>;
  explanation?: string;
}

// 拖拽题组件数据
export interface DragDropData {
  title: string;
  description: string;
  sourceItems: Array<{
    id: string;
    content: string;
    category?: string;
  }>;
  dropZones: Array<{
    id: string;
    label: string;
    acceptedItems: string[];
    maxItems?: number;
  }>;
  template?: string; // HTML模板，包含 {drop-zone:id} 占位符
}

// 挑战组件数据
export interface ChallengeData {
  title: string;
  description: string;
  requirements: string[];
  starterCode: {
    html?: string;
    css?: string;
    javascript?: string;
  };
  testCases: TestCase[];
  hints?: string[];
  solution?: {
    html?: string;
    css?: string;
    javascript?: string;
  };
}

// 用户答案类型
export interface UserAnswer {
  componentId: string;
  componentType: string;
  answer: any;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
  timestamp: Date;
}

// 进度数据
export interface ProgressData {
  componentId: string;
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
  lastAttempt: Date;
}

// 编辑器状态
export interface EditorState {
  content: string;
  cursorPosition: number;
  selectedText: string;
  isPreviewMode: boolean;
  isFullscreen: boolean;
  isDirty: boolean;
}

// 渲染器状态
export interface RendererState {
  executionResults: Map<string, ExecutionResult>;
  userAnswers: Map<string, UserAnswer>;
  progress: Map<string, ProgressData>;
  completedExercises: Set<string>;
  currentScore: number;
  totalScore: number;
}

// 课程内容格式
export interface CourseContent {
  id: string;
  title: string;
  content: string;
  interactiveElements: Array<{
    id: string;
    type: InteractiveComponent['type'];
    position: number;
    data: any;
  }>;
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    tags: string[];
    prerequisites?: string[];
  };
}

// 解析结果
export interface ParsedContent {
  markdown: string;
  interactiveElements: Map<string, InteractiveComponent>;
}

// 组件事件
export interface ComponentEvent {
  type: 'complete' | 'progress' | 'error' | 'reset';
  componentId: string;
  data: any;
  timestamp: Date;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string;
  hints?: string[];
  explanation?: string;
}

// 代码执行上下文
export interface ExecutionContext {
  language: 'javascript' | 'html' | 'css';
  code: string;
  testCases?: TestCase[];
  timeout?: number;
  memoryLimit?: number;
}

// 拖拽状态
export interface DragState {
  isDragging: boolean;
  draggedItem?: {
    id: string;
    content: string;
    sourceZone?: string;
  };
  dropZones: Map<string, string[]>; // zoneId -> itemIds
}

// 主题配置
export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// 动画配置
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// 快捷键配置
export interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: string;
  description: string;
}

// 工具栏按钮配置
export interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  tooltip?: string;
  disabled?: boolean;
}

// 插件接口
export interface Plugin {
  name: string;
  version: string;
  description: string;
  install: (editor: any) => void;
  uninstall: (editor: any) => void;
}

// 导出配置
export interface ExportConfig {
  format: 'markdown' | 'html' | 'pdf' | 'json';
  includeAnswers?: boolean;
  includeProgress?: boolean;
  includeMetadata?: boolean;
}

// 导入配置
export interface ImportConfig {
  format: 'markdown' | 'json';
  validateContent?: boolean;
  mergeMode?: 'replace' | 'append' | 'merge';
}
