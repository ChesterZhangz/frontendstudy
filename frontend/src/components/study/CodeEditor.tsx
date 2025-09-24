import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Copy, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  /** 初始代码 */
  initialCode?: string;
  /** 语言类型 */
  language?: 'javascript' | 'html' | 'css';
  /** 是否显示运行按钮 */
  showRunButton?: boolean;
  /** 是否显示重置按钮 */
  showResetButton?: boolean;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 代码变化回调 */
  onCodeChange?: (code: string) => void;
  /** 运行代码回调 */
  onRun?: (code: string) => void;
  /** 重置代码回调 */
  onReset?: () => void;
  /** 主题 */
  theme?: 'light' | 'dark';
  /** 高度 */
  height?: string | number;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 全屏切换回调 */
  onFullscreenToggle?: (fullscreen: boolean) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'javascript',
  showRunButton = true,
  showResetButton = true,
  showToolbar = true,
  editable = true,
  onCodeChange,
  onRun,
  onReset,
  theme = 'light',
  height = 400,
  fullscreen = false,
  onFullscreenToggle
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState(theme === 'dark' ? 'vs-dark' : 'light');
  const editorRef = useRef<any>(null);

  // 监听主题变化
  useEffect(() => {
    setEditorTheme(theme === 'dark' ? 'vs-dark' : 'light');
  }, [theme]);

  // 处理代码变化
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  // 运行代码
  const handleRun = async () => {
    if (!onRun) return;
    
    setIsRunning(true);
    try {
      await onRun(code);
    } catch (error) {
      console.error('代码运行错误:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // 重置代码
  const handleReset = () => {
    setCode(initialCode);
    onReset?.();
  };

  // 复制代码
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // 这里可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 下载代码
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 处理编辑器挂载
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // 配置编辑器选项
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineHeight: 1.5,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
      wordWrap: 'on',
      automaticLayout: true,
    });

    // 添加快捷键 (Ctrl+S 运行代码)
    editor.addAction({
      id: 'run-code',
      label: '运行代码',
      keybindings: [2048 | 49], // Ctrl+S
      run: () => {
        handleRun();
      }
    });
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.toUpperCase()} 编辑器
            </span>
            {editable && (
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                可编辑
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 复制按钮 */}
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title="复制代码"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            {/* 下载按钮 */}
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title="下载代码"
            >
              <Download className="w-4 h-4" />
            </button>
            
            {/* 全屏按钮 */}
            {onFullscreenToggle && (
              <button
                onClick={() => onFullscreenToggle(!fullscreen)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                title={fullscreen ? "退出全屏" : "全屏"}
              >
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 编辑器区域 */}
      <div className="relative">
        <Editor
          height={fullscreen ? 'calc(100vh - 60px)' : height}
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme={editorTheme}
          options={{
            readOnly: !editable,
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: 'line',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'gutter',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
          }}
        />
      </div>

      {/* 底部操作栏 */}
      {(showRunButton || showResetButton) && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            {showResetButton && (
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置</span>
              </button>
            )}
          </div>
          
          {showRunButton && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? '运行中...' : '运行代码'}</span>
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CodeEditor;
