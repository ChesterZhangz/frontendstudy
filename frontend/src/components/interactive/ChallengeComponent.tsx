import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trophy,
  Target,
  Eye,
  EyeOff,
  ClipboardList
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { ChallengeData, ValidationResult, ExecutionResult } from '@/types/interactive';
import { CodeExecutorFactory, TestCaseValidator } from '@/services/codeExecutor';
import LivePreview from '@/components/study/LivePreview';

interface ChallengeComponentProps {
  id: string;
  data: ChallengeData;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
  className?: string;
}

const ChallengeComponent: React.FC<ChallengeComponentProps> = ({
  id,
  data,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [userCode, setUserCode] = useState({
    html: data.starterCode.html || '',
    css: data.starterCode.css || '',
    javascript: data.starterCode.javascript || ''
  });
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript'>('html');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const editorRefs = useRef<{[key: string]: any}>({});

  // 渲染反馈图标
  const renderFeedbackIcon = (feedback: string) => {
    if (feedback.includes('恭喜') || feedback.includes('完成')) {
      return <Trophy className="w-4 h-4 text-yellow-600" />;
    } else if (feedback.includes('通过了')) {
      return <Target className="w-4 h-4 text-blue-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  // 与标准答案比较验证
  const validateAgainstSolution = async (userCode: { html: string; css: string; javascript: string }, solutionCode: { html?: string; css?: string; javascript?: string }): Promise<ValidationResult> => {
    try {
      // 生成用户代码的完整HTML
      const userHTML = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>用户代码</title>
          <style>${userCode.css}</style>
        </head>
        <body>
          ${userCode.html}
          <script>${userCode.javascript}</script>
        </body>
        </html>
      `;

      // 生成标准答案的完整HTML
      const solutionHTML = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>标准答案</title>
          <style>${solutionCode.css || ''}</style>
        </head>
        <body>
          ${solutionCode.html || ''}
          <script>${solutionCode.javascript || ''}</script>
        </body>
        </html>
      `;

      // 执行两个版本的代码
      const [userResult, solutionResult] = await Promise.all([
        CodeExecutorFactory.executeCode(userHTML, 'html'),
        CodeExecutorFactory.executeCode(solutionHTML, 'html')
      ]);

      if (!solutionResult.success) {
        return {
          isValid: false,
          score: 0,
          feedback: '标准答案执行失败',
          explanation: '标准答案代码存在问题，请联系管理员。'
        };
      }

      if (!userResult.success) {
        return {
          isValid: false,
          score: 0,
          feedback: '代码执行失败',
          explanation: userResult.error || '代码运行时出现错误，请检查语法和逻辑。'
        };
      }

      // 比较输出结果
      const solutionOutput = (solutionResult.output || '').trim();
      const userOutput = (userResult.output || '').trim();

      if (solutionOutput === userOutput) {
        return {
          isValid: true,
          score: 100,
          feedback: '完美！输出结果与标准答案完全一致！',
          explanation: '你的代码输出与标准答案完全匹配。'
        };
      }

      // 简单的相似度检查
      const similarity = calculateSimilarity(userOutput, solutionOutput);
      if (similarity >= 0.8) {
        return {
          isValid: true,
          score: Math.round(similarity * 100),
          feedback: '很好！输出结果与标准答案基本一致！',
          explanation: `你的代码输出与标准答案相似度为 ${Math.round(similarity * 100)}%。`
        };
      } else if (similarity >= 0.6) {
        return {
          isValid: false,
          score: Math.round(similarity * 100),
          feedback: '输出部分正确，还需要改进',
          explanation: `你的代码输出与标准答案相似度为 ${Math.round(similarity * 100)}%，请检查是否遗漏了某些功能。`
        };
      } else {
        return {
          isValid: false,
          score: Math.round(similarity * 100),
          feedback: '输出与标准答案差异较大',
          explanation: '请仔细检查你的代码逻辑，确保实现了所有要求的功能。'
        };
      }

    } catch (error) {
      return {
        isValid: false,
        score: 0,
        feedback: '验证过程出错',
        explanation: `验证过程中发生错误：${error instanceof Error ? error.message : String(error)}`
      };
    }
  };

  // 计算字符串相似度
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // 计算编辑距离
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // 执行代码和测试
  const executeAndTest = async () => {
    setIsExecuting(true);
    setAttempts(prev => prev + 1);

    try {
      // 生成完整的HTML代码
      const fullHTML = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>挑战项目</title>
          <style>
            ${userCode.css}
          </style>
        </head>
        <body>
          ${userCode.html}
          <script>
            ${userCode.javascript}
          </script>
        </body>
        </html>
      `;

      // 执行HTML代码
      const htmlResult = await CodeExecutorFactory.executeCode(fullHTML, 'html');
      setExecutionResult(htmlResult);

      // 如果有测试用例，运行测试
      if (data.testCases && data.testCases.length > 0) {
        // 对JavaScript代码运行测试用例
        if (userCode.javascript.trim()) {
          const testResult = await TestCaseValidator.validateCode(userCode.javascript, data.testCases);
          setTestResults(testResult);

          const score = Math.round((testResult.passed / testResult.total) * 100);
          const allPassed = testResult.passed === testResult.total;

          const validation: ValidationResult = {
            isValid: allPassed && htmlResult.success,
            score,
            feedback: allPassed && htmlResult.success
              ? '恭喜！挑战完成！所有测试都通过了！' 
              : `通过了 ${testResult.passed}/${testResult.total} 个测试用例`,
            explanation: allPassed && htmlResult.success
              ? '你的代码完全符合要求！' 
              : '还有一些测试用例没有通过，请检查你的代码。'
          };

          setValidationResult(validation);

          // 如果挑战完成
          if (validation.isValid && !isCompleted) {
            setIsCompleted(true);
            const timeSpent = Date.now() - startTime;
            
            onComplete({
              componentId: id,
              componentType: 'challenge',
              isCorrect: true,
              score: validation.score,
              attempts,
              timeSpent,
              code: userCode
            });
          }

          onProgress(score);
        } else {
          // 没有JavaScript代码，只检查HTML/CSS是否能正常执行
          const score = htmlResult.success ? 100 : 0;
          const validation: ValidationResult = {
            isValid: htmlResult.success,
            score,
            feedback: htmlResult.success ? '代码执行成功！' : '代码执行失败',
            explanation: htmlResult.success ? '你的HTML/CSS代码运行正常' : '请检查你的代码是否有错误'
          };

          setValidationResult(validation);
          onProgress(score);
        }
      } else {
        // 没有测试用例，检查是否有标准答案进行比较
        if (data.solution && htmlResult.success) {
          const validation = await validateAgainstSolution(userCode, data.solution);
          setValidationResult(validation);
          
          if (validation.isValid && !isCompleted) {
            setIsCompleted(true);
            const timeSpent = Date.now() - startTime;
            
            onComplete({
              componentId: id,
              componentType: 'challenge',
              isCorrect: true,
              score: validation.score,
              attempts,
              timeSpent,
              code: userCode
            });
          }
          
          onProgress(validation.score);
        } else {
          // 没有测试用例也没有标准答案，只要代码能执行就算完成
          const score = htmlResult.success ? 100 : 0;
          if (htmlResult.success && !isCompleted) {
            setIsCompleted(true);
            const timeSpent = Date.now() - startTime;
            
            onComplete({
              componentId: id,
              componentType: 'challenge',
              isCorrect: true,
              score: 100,
              attempts,
              timeSpent,
              code: userCode
            });
          }

          onProgress(score);
        }
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.message || '执行失败',
        executionTime: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // 重置代码
  const resetCode = () => {
    setUserCode({
      html: data.starterCode.html || '',
      css: data.starterCode.css || '',
      javascript: data.starterCode.javascript || ''
    });
    setExecutionResult(null);
    setTestResults(null);
    setValidationResult(null);
    setShowSolution(false);
    setShowHints(false);
  };

  // 显示解决方案
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  // 处理代码变化
  const handleCodeChange = (value: string | undefined, language: 'html' | 'css' | 'javascript') => {
    setUserCode(prev => ({
      ...prev,
      [language]: value || ''
    }));
  };

  // 编辑器配置
  const handleEditorDidMount = (editor: any, language: string) => {
    editorRefs.current[language] = editor;
    
    // 添加快捷键
    editor.addAction({
      id: 'run-code',
      label: '运行代码',
      keybindings: [2048 | 49], // Ctrl+1
      run: executeAndTest
    });
  };

  // 获取标签页样式
  const getTabStyle = (tab: string) => {
    return tab === activeTab
      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600';
  };

  // 生成预览HTML
  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>挑战预览</title>
        <style>
          ${userCode.css}
        </style>
      </head>
      <body>
        ${userCode.html}
        <script>
          ${userCode.javascript}
        </script>
      </body>
      </html>
    `;
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 头部 */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${
              isCompleted 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-purple-600 dark:text-purple-400'
            }`}>
              {isCompleted ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {data.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>尝试次数: {attempts}</span>
            {isCompleted && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                挑战完成
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-6">
        {/* 要求列表 */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            挑战要求
          </h4>
          <ul className="space-y-2">
            {data.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {index + 1}.
                </span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
          {/* 左侧：代码编辑器 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                代码编辑器
              </h4>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  title={showPreview ? "隐藏预览" : "显示预览"}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 标签页 */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {(['html', 'css', 'javascript'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${getTabStyle(tab)}`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* 编辑器 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language={activeTab}
                value={userCode[activeTab]}
                onChange={(value) => handleCodeChange(value, activeTab)}
                onMount={(editor) => handleEditorDidMount(editor, activeTab)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true
                }}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={executeAndTest}
                disabled={isExecuting}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
                <span>{isExecuting ? '运行中...' : '运行测试'}</span>
              </button>

              <button
                onClick={resetCode}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置</span>
              </button>

              {data.hints && data.hints.length > 0 && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center space-x-2 px-4 py-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHints ? '隐藏提示' : '显示提示'}</span>
                </button>
              )}

              {data.solution && (
                <button
                  onClick={toggleSolution}
                  className="flex items-center space-x-2 px-4 py-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{showSolution ? '隐藏答案' : '查看答案'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 右侧：预览和结果 */}
          <div className="space-y-4">
            {/* 实时预览 */}
            {showPreview && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  实时预览
                </h4>
                <LivePreview
                  htmlCode={generatePreviewHTML()}
                  height={520}
                  showToolbar={false}
                />
              </div>
            )}

            {/* 测试结果 */}
            {testResults && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  测试结果
                </h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-[200px] overflow-auto">
                  <div className="mb-2">
                    <span className={testResults.passed === testResults.total ? 'text-green-400' : 'text-yellow-400'}>
                      通过: {testResults.passed}/{testResults.total} 个测试用例
                    </span>
                  </div>
                  
                  {testResults.results.map((result: any, index: number) => (
                    <div key={index} className="mb-2 text-xs">
                      <div className={result.passed ? 'text-green-400' : 'text-red-400'}>
                        {result.passed ? '✓' : '✗'} {result.testCase.description}
                      </div>
                      {!result.passed && result.error && (
                        <div className="text-red-300 ml-2">错误: {result.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 执行结果 */}
            {executionResult && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  执行状态
                </h4>
                <div className={`p-3 rounded-lg text-sm ${
                  executionResult.success 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                }`}>
                  {executionResult.success ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>代码执行成功</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <XCircle className="w-4 h-4" />
                        <span>代码执行失败</span>
                      </div>
                      {executionResult.error && (
                        <div className="text-xs">{executionResult.error}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 验证结果 */}
        <AnimatePresence>
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className={`p-4 rounded-lg border ${
                validationResult.isValid 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
              }`}>
                <div className={`font-medium flex items-center gap-2 ${
                  validationResult.isValid 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {renderFeedbackIcon(validationResult.feedback)}
                  {validationResult.feedback}
                </div>
                <div className={`mt-1 text-sm ${
                  validationResult.isValid 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  得分: {validationResult.score}/100
                </div>
                {validationResult.explanation && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {validationResult.explanation}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 提示信息 */}
        <AnimatePresence>
          {showHints && data.hints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg"
            >
              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                💡 提示
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {data.hints.map((hint, index) => (
                  <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                    {hint}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 答案区域 */}
        <AnimatePresence>
          {showSolution && data.solution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  标准答案
                </h4>
                
                <div className="space-y-4">
                  {data.solution.html && (
                    <div>
                      <h5 className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">HTML</h5>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                        <code>{data.solution.html}</code>
                      </pre>
                    </div>
                  )}
                  
                  {data.solution.css && (
                    <div>
                      <h5 className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">CSS</h5>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                        <code>{data.solution.css}</code>
                      </pre>
                    </div>
                  )}
                  
                  {data.solution.javascript && (
                    <div>
                      <h5 className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">JavaScript</h5>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                        <code>{data.solution.javascript}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChallengeComponent;
