import React from 'react';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'branded';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = '正在加载...',
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
          <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
            {message}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'branded') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          {/* Logo区域 */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-2xl flex items-center justify-center mb-4 animate-float">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl animate-pulse opacity-20" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              JavaScript 学习平台
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              交互式编程学习体验
            </p>
          </div>

          {/* 加载动画 */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            {message}
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* 主加载动画 */}
        <div className="relative mb-8">
          <div className={`${sizeClasses[size]} mx-auto animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
          <div className={`${sizeClasses[size]} mx-auto absolute inset-0 animate-ping rounded-full border-4 border-primary-300 opacity-20`} />
        </div>

        {/* 加载文本 */}
        <div className="space-y-2">
          <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
            {message}
          </p>
          
          {/* 动态点点点效果 */}
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>

        {/* 进度指示器 */}
        <div className="mt-8 w-64 mx-auto">
          <div className="progress-bar h-2">
            <div className="progress-fill animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
