import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Clock,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { ExecutableData, ExecutionResult } from '@/types/interactive';
import { CodeExecutorFactory } from '@/services/codeExecutor';
import LivePreview from '@/components/study/LivePreview';

interface ExecutableComponentProps {
  id: string;
  data: ExecutableData;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
  className?: string;
}

const ExecutableComponent: React.FC<ExecutableComponentProps> = ({
  id,
  data,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [userCode, setUserCode] = useState(data.starterCode || '');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showPreview, setShowPreview] = useState(data.language !== 'javascript');
  const editorRef = useRef<any>(null);

  // 执行代码（纯演示，不验证）
  const executeCode = async () => {
    if (!userCode.trim()) return;

    setIsExecuting(true);
    setAttempts(prev => prev + 1);

    try {
      const result = await CodeExecutorFactory.executeCode(userCode, data.language);
      setExecutionResult(result);

      // 纯演示代码，不进行验证，只要执行就算完成
      if (result.success) {
        onComplete({
          componentId: id,
          componentType: 'executable',
          isCorrect: true,
          score: 100,
          attempts,
          timeSpent: 0,
          code: userCode
        });
        onProgress(100);
      } else {
        onProgress(0);
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.message || '执行失败',
        executionTime: 0
      });
      onProgress(0);
    } finally {
      setIsExecuting(false);
    }
  };

  // 重置代码
  const resetCode = () => {
    setUserCode(data.starterCode || '');
    setExecutionResult(null);
    setShowSolution(false);
    setShowHints(false);
  };

  // 显示解决方案（演示代码可以直接查看）
  const toggleSolution = () => {
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
            <div className="text-blue-600 dark:text-blue-400">
              <Code className="w-5 h-5" />
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
                <div className="flex items-center space-x-3">
                  <button
                    onClick={executeCode}
                    disabled={isExecuting || !userCode.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
                    <span>{isExecuting ? '运行中...' : '运行代码'}</span>
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
                      <Code className="w-4 h-4" />
                      <span>{showSolution ? '隐藏代码' : '查看代码'}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="flex items-center space-x-3">
                <button
                  onClick={executeCode}
                  disabled={isExecuting || !userCode.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
                  <span>{isExecuting ? '运行中...' : '运行代码'}</span>
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
                    <Code className="w-4 h-4" />
                    <span>{showSolution ? '隐藏代码' : '查看代码'}</span>
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

              {/* HTML/CSS预览 */}
              {showPreview && data.language !== 'javascript' && executionResult?.html && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    预览
                  </h4>
                  <LivePreview
                    htmlCode={executionResult.html}
                    height={200}
                    showToolbar={false}
                  />
                </div>
              )}
            </div>
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

export default ExecutableComponent;