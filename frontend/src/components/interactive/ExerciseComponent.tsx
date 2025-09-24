import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Clock,
  Code,
  Eye,
  EyeOff,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { ExerciseData, ValidationResult, ExecutionResult, TestCase } from '@/types/interactive';
import { CodeExecutorFactory } from '@/services/codeExecutor';
import LivePreview from '@/components/study/LivePreview';

interface ExerciseComponentProps {
  id: string;
  data: ExerciseData;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
  className?: string;
}

const ExerciseComponent: React.FC<ExerciseComponentProps> = ({
  id,
  data,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [userCode, setUserCode] = useState(data.starterCode || '');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPreview, setShowPreview] = useState(data.language !== 'javascript');
  const [hasExecuted, setHasExecuted] = useState(false); // 是否已经执行过代码
  const [attemptHistory, setAttemptHistory] = useState<Array<{
    id: number;
    timestamp: Date;
    code: string;
    result: ValidationResult | null;
    executionTime: number;
  }>>([]);
  const editorRef = useRef<any>(null);

  // 图标组件辅助函数
  const IconWithText = ({ icon: Icon, text, className = "" }: { icon: any, text: string, className?: string }) => (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Icon className="w-4 h-4" />
      {text}
    </span>
  );

  // 渲染带图标的反馈
  const renderFeedback = (feedback: string, isValid: boolean) => {
    if (feedback.includes('完美') || feedback.includes('恭喜')) {
      return <IconWithText icon={Trophy} text={feedback} className="text-yellow-600" />;
    } else if (feedback.includes('很好') || feedback.includes('通过')) {
      return <IconWithText icon={CheckCircle} text={feedback} className="text-green-600" />;
    } else if (feedback.includes('部分正确') || feedback.includes('改进')) {
      return <IconWithText icon={AlertTriangle} text={feedback} className="text-yellow-600" />;
    } else if (feedback.includes('失败') || feedback.includes('错误')) {
      return <IconWithText icon={XCircle} text={feedback} className="text-red-600" />;
    } else if (isValid) {
      return <IconWithText icon={CheckCircle} text={feedback} className="text-green-600" />;
    } else {
      return <IconWithText icon={XCircle} text={feedback} className="text-red-600" />;
    }
  };

  // 与标准答案比较验证
  const validateAgainstSolution = async (userCode: string, solutionCode: string): Promise<ValidationResult> => {
    try {
      // 执行标准答案代码
      const solutionResult = await CodeExecutorFactory.executeCode(solutionCode, data.language);
      
      if (!solutionResult.success) {
        return {
          isValid: false,
          score: 0,
          feedback: '标准答案执行失败',
          explanation: '标准答案代码存在问题，请联系管理员。'
        };
      }
      
      // 执行用户代码
      const userResult = await CodeExecutorFactory.executeCode(userCode, data.language);
      
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
      
      // 使用智能匹配进行部分匹配检查
      return validateOutput(userOutput, solutionOutput);
      
    } catch (error) {
      return {
        isValid: false,
        score: 0,
        feedback: '验证过程出错',
        explanation: `验证过程中发生错误：${error instanceof Error ? error.message : String(error)}`
      };
    }
  };

  // 智能验证输出结果（更灵活的验证逻辑）
  const validateOutput = (actualOutput: string, expectedOutput: string): ValidationResult => {
    if (!expectedOutput) {
      // 如果没有预期输出，只要代码能执行就算通过
      return {
        isValid: true,
        score: 100,
        feedback: '代码执行成功！',
        explanation: '代码运行正常，没有错误。'
      };
    }

    // 清理输出内容（去除多余空白字符）
    const cleanActual = actualOutput.trim().replace(/\s+/g, ' ');
    const cleanExpected = expectedOutput.trim().replace(/\s+/g, ' ');

    // 完全匹配
    if (cleanActual === cleanExpected) {
      return {
        isValid: true,
        score: 100,
        feedback: '完美！输出结果完全正确！',
        explanation: '你的代码输出与预期结果完全匹配。'
      };
    }

    // 更灵活的验证逻辑：检查关键内容是否包含
    const expectedKeywords = cleanExpected.toLowerCase().split(/[：:，,。.！!？?；;]/).filter(part => part.trim().length > 0);
    const actualLower = cleanActual.toLowerCase();
    
    let keywordMatches = 0;
    let importantMatches = 0;
    
    expectedKeywords.forEach(keyword => {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword.length > 0) {
        if (actualLower.includes(trimmedKeyword)) {
          keywordMatches++;
          // 如果关键词包含变量名或重要信息，给予更高权重
          if (trimmedKeyword.length > 2) {
            importantMatches++;
          }
        }
      }
    });

    const keywordMatchPercentage = expectedKeywords.length > 0 ? (keywordMatches / expectedKeywords.length) * 100 : 0;
    const hasImportantContent = importantMatches > 0;

    // 如果包含重要内容且关键词匹配度较高，就算通过
    if (hasImportantContent && keywordMatchPercentage >= 60) {
      return {
        isValid: true,
        score: Math.max(80, Math.round(keywordMatchPercentage)),
        feedback: '很好！输出内容符合要求！',
        explanation: `你的代码输出了正确的内容，虽然格式可能略有不同，但核心信息正确。`
      };
    }

    // 检查是否至少包含一些预期的内容
    if (keywordMatchPercentage >= 40) {
      return {
        isValid: false,
        score: Math.round(keywordMatchPercentage),
        feedback: '输出部分正确，还需要改进',
        explanation: `你的代码输出了部分正确内容。\n预期输出：${expectedOutput}\n实际输出：${actualOutput}\n请检查是否遗漏了某些信息。`
      };
    } else {
      return {
        isValid: false,
        score: Math.round(keywordMatchPercentage),
        feedback: '输出结果不符合要求',
        explanation: `预期输出：${expectedOutput}\n实际输出：${actualOutput}\n请检查你的代码逻辑，确保输出了正确的内容。`
      };
    }
  };

  // 后台函数验证（先运行标准答案，再对比用户代码）
  const validateFunction = async (code: string, testCases: TestCase[]): Promise<ValidationResult> => {
    let passedTests = 0;
    const results: string[] = [];
    
    console.log('🔍 开始函数验证，测试用例数量:', testCases.length);
    console.log('📋 测试用例:', testCases);
    
    try {
      // 检查是否有标准答案
      if (!data.solution) {
        return {
          isValid: false,
          score: 0,
          feedback: '无法进行测试',
          explanation: '缺少标准答案，无法进行对比测试'
        };
      }

      // 先执行用户代码，检查是否有语法错误
      const userResult = await CodeExecutorFactory.executeCode(code, 'javascript');
      if (!userResult.success) {
        return {
          isValid: false,
          score: 0,
          feedback: ' 代码执行失败',
          explanation: userResult.error || '代码运行时出现错误'
        };
      }
      
      // 为每个测试用例执行对比测试
      for (const testCase of testCases) {
        try {
          const { functionName, params } = testCase.input;
          const paramStr = params.map((p: any) => JSON.stringify(p)).join(', ');
          
          // 1. 先运行标准答案获取正确结果
          const solutionTestCode = `
            ${data.solution}
            
            try {
              const result = ${functionName}(${paramStr});
              console.log('SOLUTION_RESULT:', JSON.stringify(result));
            } catch (error) {
              console.log('SOLUTION_ERROR:', error.message);
            }
          `;
          
          const solutionResult = await CodeExecutorFactory.executeCode(solutionTestCode, 'javascript');
          
          if (!solutionResult.success || !solutionResult.output) {
            results.push(` ${testCase.description}: 标准答案执行失败`);
            continue;
          }
          
          const solutionOutput = solutionResult.output.trim();
          const solutionMatch = solutionOutput.match(/SOLUTION_RESULT:\s*(.+)/);
          
          if (!solutionMatch) {
            if (solutionOutput.includes('SOLUTION_ERROR:')) {
              results.push(` ${testCase.description}: 标准答案执行错误`);
            } else {
              results.push(` ${testCase.description}: 无法获取标准答案结果`);
            }
            continue;
          }
          
          // 2. 再运行用户代码
          const userTestCode = `
            ${code}
            
            try {
              const result = ${functionName}(${paramStr});
              console.log('USER_RESULT:', JSON.stringify(result));
            } catch (error) {
              console.log('USER_ERROR:', error.message);
            }
          `;
          
          const userTestResult = await CodeExecutorFactory.executeCode(userTestCode, 'javascript');
          
          if (!userTestResult.success || !userTestResult.output) {
            results.push(` ${testCase.description}: 用户代码执行失败`);
            continue;
          }
          
          const userOutput = userTestResult.output.trim();
          const userMatch = userOutput.match(/USER_RESULT:\s*(.+)/);
          
          if (!userMatch) {
            if (userOutput.includes('USER_ERROR:')) {
              const errorMatch = userOutput.match(/USER_ERROR:\s*(.+)/);
              results.push(` ${testCase.description}: ${errorMatch ? errorMatch[1] : '函数执行错误'}`);
            } else {
              results.push(` ${testCase.description}: 无法获取函数返回值`);
            }
            continue;
          }
          
          // 3. 对比两者结果
          try {
            const solutionValue = JSON.parse(solutionMatch[1]);
            const userValue = JSON.parse(userMatch[1]);
            
            if (JSON.stringify(solutionValue) === JSON.stringify(userValue)) {
              passedTests++;
              results.push(` ${testCase.description}: 通过`);
            } else {
              results.push(` ${testCase.description}: 期望 ${JSON.stringify(solutionValue)}, 实际 ${JSON.stringify(userValue)}`);
            }
          } catch (e) {
            results.push(` ${testCase.description}: 结果解析失败`);
          }
          
        } catch (error) {
          results.push(` ${testCase.description}: 测试执行异常 - ${error}`);
        }
      }
      
      const score = Math.round((passedTests / testCases.length) * 100);
      const isValid = passedTests === testCases.length;
      
      return {
        isValid,
        score,
        feedback: isValid 
          ? ` 完美！所有 ${testCases.length} 个测试用例都通过了！` 
          : `通过了 ${passedTests}/${testCases.length} 个测试用例`,
        explanation: results.join('\n')
      };
      
    } catch (error) {
      return {
        isValid: false,
        score: 0,
        feedback: ' 函数测试失败',
        explanation: `测试过程中出现错误: ${error}`
      };
    }
  };

  // 执行代码
  const executeCode = async () => {
    if (!userCode.trim()) return;

    const executionStartTime = Date.now();
    setIsExecuting(true);
    setAttempts(prev => prev + 1);
    setHasExecuted(true); // 标记已执行过代码

    try {
      const result = await CodeExecutorFactory.executeCode(userCode, data.language);
      setExecutionResult(result);

      let validation: ValidationResult;

      // 如果有测试用例，使用新的函数验证逻辑
      if (data.testCases && data.testCases.length > 0) {
        validation = await validateFunction(userCode, data.testCases);
      } else if (result.success) {
        if (data.solution) {
          // 如果有标准答案但没有测试用例，比较输出结果
          validation = await validateAgainstSolution(userCode, data.solution);
        } else {
          // 使用智能输出验证
          const actualOutput = result.output || '';
          const expectedOutput = data.expectedOutput || '';
          validation = validateOutput(actualOutput, expectedOutput);
        }
      } else {
        // 代码执行失败
        validation = {
          isValid: false,
          score: 0,
          feedback: ' 代码执行失败',
          explanation: result.error || '代码运行时出现错误，请检查语法和逻辑。'
        };
      }

      setValidationResult(validation);

      // 如果完成了练习
      if (validation.isValid && !isCompleted) {
        setIsCompleted(true);
        const timeSpent = Date.now() - startTime;
        
        onComplete({
          componentId: id,
          componentType: 'exercise',
          isCorrect: true,
          score: validation.score,
          attempts,
          timeSpent,
          code: userCode
        });
      }

      onProgress(validation.score);
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.message || '执行失败',
        executionTime: 0
      });
      
      setValidationResult({
        isValid: false,
        score: 0,
        feedback: ' 代码执行失败',
        explanation: error.message || '代码运行时出现错误，请检查语法和逻辑。'
      });
    } finally {
      const executionTime = Date.now() - executionStartTime;
      
      // 记录这次尝试
      setAttemptHistory(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date(),
        code: userCode,
        result: validationResult,
        executionTime
      }]);
      
      setIsExecuting(false);
    }
  };

  // 重置代码
  const resetCode = () => {
    setUserCode(data.starterCode || '');
    setExecutionResult(null);
    setValidationResult(null);
    setShowSolution(false);
    setShowHints(false);
    setHasExecuted(false); // 重置执行状态
  };

  // 显示解决方案（需要先执行代码）
  const toggleSolution = () => {
    if (!hasExecuted) {
      alert('请先运行代码，然后才能查看答案！');
      return;
    }
    
    if (!showSolution && data.solution) {
      setUserCode(data.solution);
    } else {
      setUserCode(data.starterCode || '');
    }
    setShowSolution(!showSolution);
  };

  // 编辑器配置
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // 添加快捷键
    editor.addAction({
      id: 'run-code',
      label: '运行代码',
      keybindings: [2048 | 49], // Ctrl+1
      run: executeCode
    });

    editor.addAction({
      id: 'reset-code',
      label: '重置代码',
      keybindings: [2048 | 82], // Ctrl+R
      run: resetCode
    });
  };

  // 获取状态颜色
  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 dark:text-green-400';
    if (validationResult && !validationResult.isValid) return 'text-red-600 dark:text-red-400';
    if (executionResult && !executionResult.success) return 'text-red-600 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5" />;
    if (validationResult && !validationResult.isValid) return <XCircle className="w-5 h-5" />;
    if (executionResult && !executionResult.success) return <XCircle className="w-5 h-5" />;
    return <Code className="w-5 h-5" />;
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 头部 */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                已完成
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-6">
        {/* HTML/CSS 布局：左右布局，预览在右侧 */}
        {data.language === 'html' || data.language === 'css' ? (
          <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* 左侧：代码编辑器 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    代码编辑器 ({data.language.toUpperCase()})
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
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <Editor
                    height="500px"
                    language={data.language}
                    value={userCode}
                    onChange={(value) => setUserCode(value || '')}
                    onMount={handleEditorDidMount}
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={executeCode}
                    disabled={isExecuting || !userCode.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed group relative"
                    title={isExecuting ? '运行中...' : '运行代码 (Ctrl+1)'}
                  >
                    <Play className={`w-5 h-5 ${isExecuting ? 'animate-spin' : ''}`} />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {isExecuting ? '运行中...' : '运行代码'}
                    </span>
                  </button>

                  <button
                    onClick={resetCode}
                    className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                    title="重置代码 (Ctrl+R)"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      重置代码
                    </span>
                  </button>

                  {data.hints && data.hints.length > 0 && (
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className={`p-3 rounded-lg transition-colors group relative ${
                        showHints 
                          ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30' 
                          : 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      title={showHints ? '隐藏提示' : '显示提示'}
                    >
                      <Lightbulb className="w-5 h-5" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {showHints ? '隐藏提示' : '显示提示'}
                      </span>
                    </button>
                  )}

                  {data.solution && (
                    <button
                      onClick={toggleSolution}
                      disabled={!hasExecuted}
                      className={`p-3 rounded-lg transition-colors group relative ${
                        !hasExecuted 
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                          : showSolution
                            ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
                            : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={!hasExecuted ? '请先运行代码才能查看答案' : showSolution ? '隐藏答案' : '查看答案'}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {!hasExecuted ? '请先运行代码' : showSolution ? '隐藏答案' : '查看答案'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* 右侧：预览窗口 */}
              {showPreview && executionResult?.html && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    预览
                  </h4>
                  <LivePreview
                    htmlCode={executionResult.html}
                    height={600}
                    showToolbar={false}
                  />
                </div>
              )}
            </div>

            {/* 执行结果 - 放在下方 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                执行结果
              </h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm min-h-[120px] overflow-auto">
                {executionResult ? (
                  <div>
                    {executionResult.success ? (
                      <div className="text-green-400">
                        <div>✓ 执行成功</div>
                        {executionResult.output && (
                          <div className="mt-2 text-gray-300">
                            输出：
                            <pre className="mt-1 whitespace-pre-wrap">{executionResult.output}</pre>
                          </div>
                        )}
                        {executionResult.executionTime && (
                          <div className="mt-2 text-gray-400 text-xs">
                            执行时间: {executionResult.executionTime}ms
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-400">
                        <div>✗ 执行失败</div>
                        {executionResult.error && (
                          <div className="mt-2 text-red-300">
                            错误：{executionResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400">点击"运行代码"查看结果...</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* JavaScript 和其他语言：保持原有的网格布局 */
          <div className={`grid gap-6 ${attemptHistory.length > 0 && data.language === 'javascript' ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* 左侧：代码编辑器 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                代码编辑器 ({data.language.toUpperCase()})
              </h4>
              
              <div className="flex items-center space-x-2">
                {data.language !== 'javascript' && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                    title={showPreview ? "隐藏预览" : "显示预览"}
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="300px"
                language={data.language}
                value={userCode}
                onChange={(value) => setUserCode(value || '')}
                onMount={handleEditorDidMount}
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
            <div className="flex items-center space-x-2">
              <button
                onClick={executeCode}
                disabled={isExecuting || !userCode.trim()}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed group relative"
                title={isExecuting ? '运行中...' : '运行代码 (Ctrl+1)'}
              >
                <Play className={`w-5 h-5 ${isExecuting ? 'animate-spin' : ''}`} />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isExecuting ? '运行中...' : '运行代码'}
                </span>
              </button>

              <button
                onClick={resetCode}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                title="重置代码 (Ctrl+R)"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  重置代码
                </span>
              </button>

              {data.hints && data.hints.length > 0 && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`p-3 rounded-lg transition-colors group relative ${
                    showHints 
                      ? 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30' 
                      : 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                  title={showHints ? '隐藏提示' : '显示提示'}
                >
                  <Lightbulb className="w-5 h-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {showHints ? '隐藏提示' : '显示提示'}
                  </span>
                </button>
              )}

              {data.solution && (
                <button
                  onClick={toggleSolution}
                  disabled={!hasExecuted}
                  className={`p-3 rounded-lg transition-colors group relative ${
                    !hasExecuted 
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                      : showSolution
                        ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
                        : 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                  title={!hasExecuted ? '请先运行代码才能查看答案' : showSolution ? '隐藏答案' : '查看答案'}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {!hasExecuted ? '请先运行代码' : showSolution ? '隐藏答案' : '查看答案'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 右侧：输出和预览 */}
          <div className="space-y-4">
            {/* 执行结果 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                执行结果
              </h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm min-h-[120px] overflow-auto">
                {executionResult ? (
                  <div>
                    {executionResult.success ? (
                      <div className="text-green-400">
                        <div>✓ 执行成功</div>
                        {executionResult.output && (
                          <div className="mt-2 text-gray-300">
                            输出：
                            <pre className="mt-1 whitespace-pre-wrap">{executionResult.output}</pre>
                          </div>
                        )}
                        {executionResult.executionTime && (
                          <div className="mt-2 text-gray-400 text-xs">
                            执行时间: {executionResult.executionTime}ms
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-400">
                        <div>✗ 执行失败</div>
                        {executionResult.error && (
                          <div className="mt-2 text-red-300">
                            错误：{executionResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400">点击"运行代码"查看结果...</div>
                )}
              </div>
            </div>

              {/* 测试结果 - 只有JavaScript练习显示 */}
              {validationResult && data.language === 'javascript' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  测试结果
                </h4>
                <div className={`p-4 rounded-lg border ${
                  validationResult.isValid 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}>
                  <div className={`font-medium ${
                    validationResult.isValid 
                      ? 'text-green-800 dark:text-green-300' 
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    得分: {validationResult.score}/100
                  </div>
                  <div className="mt-1 text-sm">
                    {renderFeedback(validationResult.feedback, validationResult.isValid)}
                  </div>
                  {validationResult.explanation && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {validationResult.explanation}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HTML/CSS预览 */}
            {showPreview && data.language !== 'javascript' && executionResult?.html && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  预览
                </h4>
                <LivePreview
                  htmlCode={executionResult.html}
                    height={400}
                  showToolbar={false}
                />
              </div>
            )}
          </div>

            {/* 第三列：尝试历史 - 只在JavaScript练习且有历史记录时显示 */}
            {attemptHistory.length > 0 && data.language === 'javascript' && (
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                尝试历史 ({attemptHistory.length})
              </h4>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              {attemptHistory.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">还没有尝试记录</p>
                  <p className="text-xs mt-1">运行代码后会显示历史记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attemptHistory.slice().reverse().map((attempt, index) => (
                    <motion.div
                      key={attempt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            尝试 #{attemptHistory.length - index}
                          </span>
                          {attempt.result && (
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                              attempt.result.isValid 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {attempt.result.isValid ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                                {/* HTML和CSS练习不显示得分 */}
                                {data.language === 'html' || data.language === 'css' 
                                  ? (attempt.result.isValid ? '通过' : '未通过')
                                  : `${attempt.result.score}分`
                                }
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {attempt.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {attempt.result && (
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {renderFeedback(attempt.result.feedback, attempt.result.isValid)}
                        </div>
                      )}
                      
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                          查看代码
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                          <code>{attempt.code}</code>
                        </pre>
                      </details>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            </div>
          )}
        </div>
        )}

        {/* 提示信息 */}
        <AnimatePresence>
          {showHints && data.hints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg"
            >
              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                提示
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
      </div>
    </motion.div>
  );
};

export default ExerciseComponent;
