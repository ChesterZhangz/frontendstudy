import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Maximize2, Minimize2, AlertCircle, CheckCircle } from 'lucide-react';

interface LivePreviewProps {
  /** HTML代码 */
  htmlCode?: string;
  /** CSS代码 */
  cssCode?: string;
  /** JavaScript代码 */
  jsCode?: string;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否自动刷新 */
  autoRefresh?: boolean;
  /** 刷新间隔（毫秒） */
  refreshInterval?: number;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 全屏切换回调 */
  onFullscreenToggle?: (fullscreen: boolean) => void;
  /** 错误回调 */
  onError?: (error: string) => void;
  /** 成功回调 */
  onSuccess?: () => void;
  /** 高度 */
  height?: string | number;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  htmlCode = '',
  cssCode = '',
  jsCode = '',
  showToolbar = true,
  autoRefresh = true,
  refreshInterval = 1000,
  fullscreen = false,
  onFullscreenToggle,
  onError,
  onSuccess,
  height = 400
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

  // 生成完整的HTML文档
  const generateFullHTML = () => {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>实时预览</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        // 错误处理
        window.addEventListener('error', function(e) {
            console.error('JavaScript错误:', e.error);
        });
        
        // 执行JavaScript代码
        try {
            ${jsCode}
        } catch (error) {
            console.error('代码执行错误:', error);
        }
    </script>
</body>
</html>`;
  };

  // 刷新预览
  const refreshPreview = async () => {
    if (!iframeRef.current) return;

    setIsRefreshing(true);
    setLastError(null);
    setLastSuccess(false);

    try {
      const fullHTML = generateFullHTML();
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }

      // 清理之前的URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setLastSuccess(true);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setLastError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 自动刷新逻辑
  useEffect(() => {
    if (!autoRefresh) return;

    // 清除之前的定时器
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // 设置新的定时器
    refreshTimeoutRef.current = setTimeout(() => {
      refreshPreview();
    }, refreshInterval);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [htmlCode, cssCode, jsCode, autoRefresh, refreshInterval]);

  // 组件挂载时刷新
  useEffect(() => {
    refreshPreview();
  }, []);

  // 在新窗口打开预览
  const openInNewWindow = () => {
    const fullHTML = generateFullHTML();
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(fullHTML);
      newWindow.document.close();
    }
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
              实时预览
            </span>
            
            {/* 状态指示器 */}
            <div className="flex items-center space-x-2">
              {lastError && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">有错误</span>
                </div>
              )}
              {lastSuccess && !lastError && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">正常</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 手动刷新按钮 */}
            <button
              onClick={refreshPreview}
              disabled={isRefreshing}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
              title="手动刷新"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {/* 新窗口打开按钮 */}
            <button
              onClick={openInNewWindow}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title="在新窗口打开"
            >
              <ExternalLink className="w-4 h-4" />
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

      {/* 预览区域 */}
      <div className="relative">
        <iframe
          ref={iframeRef}
          className="w-full border-0"
          style={{ 
            height: fullscreen ? 'calc(100vh - 60px)' : height,
            minHeight: '200px'
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          title="实时预览"
        />
        
        {/* 加载遮罩 */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>正在刷新...</span>
            </div>
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {lastError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-700"
        >
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">执行错误:</span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{lastError}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LivePreview;
