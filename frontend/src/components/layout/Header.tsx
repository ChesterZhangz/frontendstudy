import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeStore } from '@/stores/themeStore';
import { useStudyStore } from '@/stores/studyStore';
import { getTotalCourses } from '@/data/courses';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const { toggleTheme, isDark } = useThemeStore();
  const { stats } = useStudyStore();

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获取页面标题
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: { [key: string]: string } = {
      '/': '学习概览',
      '/courses': '课程学习',
      '/progress': '学习进度',
      '/achievements': '成就系统',
      '/leaderboard': '排行榜',
      '/profile': '个人资料',
    };
    
    // 处理动态路由
    if (path.startsWith('/courses/')) {
      const day = path.split('/')[2];
      return `第${day}天课程`;
    }
    
    return titles[path] || '学习平台';
  };


  // 模拟通知数据
  const notifications = [
    {
      id: 1,
      title: '新课程已发布',
      message: '第21天课程：高级JavaScript特性现已上线',
      time: '2小时前',
      type: 'info',
      read: false,
    },
    {
      id: 2,
      title: '学习提醒',
      message: '您今天还没有开始学习，继续保持学习节奏吧！',
      time: '4小时前',
      type: 'warning',
      read: false,
    },
    {
      id: 3,
      title: '成就解锁',
      message: '恭喜您解锁了"连续学习7天"成就！',
      time: '1天前',
      type: 'success',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* 左侧：菜单按钮和标题 */}
        <div className="flex items-center space-x-4">
          {/* 移动端菜单按钮 */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 页面标题 */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            
            {/* 面包屑导航 */}
            {location.pathname.startsWith('/courses/') && (
              <nav className="hidden sm:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>/</span>
                <span className="text-gray-700 dark:text-gray-300">课程学习</span>
                <span>/</span>
                <span className="text-gray-700 dark:text-gray-300">当前课程</span>
              </nav>
            )}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center space-x-2">
          {/* 学习统计快速查看 */}
          {stats && (
            <div className="hidden md:flex items-center space-x-4 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
              <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{stats.completedDays}/{getTotalCourses()}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-1 text-warning-600 dark:text-warning-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{Math.round(stats.totalStudyTime / 60)}h</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-1 text-success-600 dark:text-success-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>{stats.streak}</span>
              </div>
            </div>
          )}

          {/* 通知按钮 */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 3a7 7 0 00-7 7v4.586l-1.707 1.707A1 1 0 003 18h8m0 0a3 3 0 106 0m-6 0H9" />
              </svg>
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 通知下拉菜单 */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-large border border-gray-200 dark:border-gray-700 py-2 animate-slide-down">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">通知</h3>
                </div>
                
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                        !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'info' ? 'bg-primary-500' :
                          notification.type === 'warning' ? 'bg-warning-500' :
                          notification.type === 'success' ? 'bg-success-500' :
                          'bg-gray-400'
                        }`} />
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
                    查看所有通知
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title={`切换到${isDark ? '浅色' : '深色'}模式`}
          >
            {isDark ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
