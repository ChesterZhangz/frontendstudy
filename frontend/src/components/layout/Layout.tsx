import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useThemeStore } from '@/stores/themeStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark } = useThemeStore();
  const location = useLocation();

  // 在移动端路由变化时关闭侧边栏
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // 大屏幕时关闭移动端侧边栏覆盖
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 主内容区域 */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* 顶部导航 */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* 页面内容 */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto min-h-full">
            {/* 内容容器 */}
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>

        {/* 页脚 - 固定在底部 */}
        <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>© 2025 JavaScript学习平台</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">让编程学习更简单</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  帮助文档
                </a>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  反馈建议
                </a>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  关于我们
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* 全局样式注入 */}
      <style>{`
        /* 自定义滚动条样式 */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDark ? '#1f2937' : '#f3f4f6'};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDark ? '#4b5563' : '#d1d5db'};
          border-radius: 4px;
          border: 2px solid ${isDark ? '#1f2937' : '#f3f4f6'};
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#6b7280' : '#9ca3af'};
        }

        /* Firefox滚动条样式 */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? '#4b5563 #1f2937' : '#d1d5db #f3f4f6'};
        }

        /* 平滑滚动 */
        html {
          scroll-behavior: smooth;
        }

        /* 选中文本样式 */
        ::selection {
          background-color: ${isDark ? '#3b82f6' : '#dbeafe'};
          color: ${isDark ? '#ffffff' : '#1e40af'};
        }

        /* Focus样式 */
        :focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Layout;
