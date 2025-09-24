import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Lightbulb, Target, CheckCircle, RotateCcw } from 'lucide-react';
import CodeEditor from './CodeEditor';
import LivePreview from './LivePreview';

interface LessonStep {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'example' | 'exercise' | 'challenge';
  content: {
    html?: string;
    css?: string;
    javascript?: string;
    explanation?: string;
    hints?: string[];
    solution?: {
      html?: string;
      css?: string;
      javascript?: string;
    };
  };
  objectives?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface InteractiveLessonProps {
  /** 课程步骤 */
  steps: LessonStep[];
  /** 当前步骤索引 */
  currentStep?: number;
  /** 步骤变化回调 */
  onStepChange?: (stepIndex: number) => void;
  /** 完成回调 */
  onComplete?: (stepIndex: number) => void;
  /** 是否显示进度 */
  showProgress?: boolean;
}

const InteractiveLesson: React.FC<InteractiveLessonProps> = ({
  steps,
  currentStep = 0,
  onStepChange,
  onComplete,
  showProgress = true
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [userCode, setUserCode] = useState({
    html: '',
    css: '',
    javascript: ''
  });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentLesson = steps[activeStep];

  // 初始化用户代码
  useEffect(() => {
    if (currentLesson) {
      setUserCode({
        html: currentLesson.content.html || '',
        css: currentLesson.content.css || '',
        javascript: currentLesson.content.javascript || ''
      });
    }
  }, [currentLesson]);

  // 处理步骤切换
  const handleStepChange = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setActiveStep(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  // 处理代码变化
  const handleCodeChange = (code: string, type: 'html' | 'css' | 'javascript') => {
    setUserCode(prev => ({
      ...prev,
      [type]: code
    }));
  };

  // 处理运行代码
  const handleRunCode = async (code: string) => {
    // 这里可以添加代码执行逻辑
    console.log('运行代码:', code);
  };

  // 重置代码
  const handleResetCode = () => {
    if (currentLesson) {
      setUserCode({
        html: currentLesson.content.html || '',
        css: currentLesson.content.css || '',
        javascript: currentLesson.content.javascript || ''
      });
    }
  };

  // 显示解决方案
  const handleShowSolution = () => {
    if (currentLesson?.content.solution) {
      setUserCode({
        html: currentLesson.content.solution.html || userCode.html,
        css: currentLesson.content.solution.css || userCode.css,
        javascript: currentLesson.content.solution.javascript || userCode.javascript
      });
    }
  };

  // 标记步骤完成
  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(activeStep);
    setCompletedSteps(newCompleted);
    onComplete?.(activeStep);
  };

  // 获取步骤类型图标
  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'theory': return <BookOpen className="w-5 h-5" />;
      case 'example': return <Play className="w-5 h-5" />;
      case 'exercise': return <Target className="w-5 h-5" />;
      case 'challenge': return <Lightbulb className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        没有可用的课程内容
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 进度条 */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              学习进度
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {activeStep + 1} / {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* 步骤导航 */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepChange(index)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                index === activeStep
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {getStepTypeIcon(step.type)}
              <span>{step.title}</span>
              {completedSteps.has(index) && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：课程内容 */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 课程标题和描述 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentLesson.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentLesson.description}
                </p>
              </div>
              {currentLesson.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentLesson.difficulty)}`}>
                  {currentLesson.difficulty}
                </span>
              )}
            </div>

            {/* 学习目标 */}
            {currentLesson.objectives && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  学习目标:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {currentLesson.objectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 解释内容 */}
            {currentLesson.content.explanation && (
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content.explanation }} />
              </div>
            )}

            {/* 提示 */}
            {currentLesson.content.hints && currentLesson.content.hints.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  提示:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {currentLesson.content.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleResetCode}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重置代码</span>
            </button>

            {currentLesson.content.solution && (
              <button
                onClick={handleShowSolution}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>查看解决方案</span>
              </button>
            )}

            <button
              onClick={handleStepComplete}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>完成此步骤</span>
            </button>
          </div>
        </motion.div>

        {/* 右侧：代码编辑器和预览 */}
        <div className="space-y-6">
          {/* HTML编辑器 */}
          {userCode.html !== undefined && (
            <CodeEditor
              initialCode={userCode.html}
              language="html"
              onCodeChange={(code) => handleCodeChange(code, 'html')}
              onRun={handleRunCode}
              onReset={handleResetCode}
              height={200}
              fullscreen={isFullscreen}
              onFullscreenToggle={setIsFullscreen}
            />
          )}

          {/* CSS编辑器 */}
          {userCode.css !== undefined && (
            <CodeEditor
              initialCode={userCode.css}
              language="css"
              onCodeChange={(code) => handleCodeChange(code, 'css')}
              onRun={handleRunCode}
              onReset={handleResetCode}
              height={200}
            />
          )}

          {/* JavaScript编辑器 */}
          {userCode.javascript !== undefined && (
            <CodeEditor
              initialCode={userCode.javascript}
              language="javascript"
              onCodeChange={(code) => handleCodeChange(code, 'javascript')}
              onRun={handleRunCode}
              onReset={handleResetCode}
              height={200}
            />
          )}

          {/* 实时预览 */}
          <LivePreview
            htmlCode={userCode.html}
            cssCode={userCode.css}
            jsCode={userCode.javascript}
            height={400}
            fullscreen={isFullscreen}
            onFullscreenToggle={setIsFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveLesson;
