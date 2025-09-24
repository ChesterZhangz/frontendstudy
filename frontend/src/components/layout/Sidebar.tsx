import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useStudyStore } from '@/stores/studyStore';
import useModalStore from '@/stores/modalStore';
import RightSlideModal from '@/components/ui/RightSlideModal';
import { getTotalCourses } from '@/data/courses';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'danger';
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuthStore();
  const { stats } = useStudyStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen: modalOpen, title, message, type, autoClose, showProgress, hideModal } = useModalStore();

  // 计算完成的课程数
  const completedCourses = stats?.completedDays || 0;
  const totalCourses = getTotalCourses();
  const completionPercentage = Math.round((completedCourses / totalCourses) * 100);

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: '学习概览',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      path: '/',
    },
    {
      id: 'courses',
      label: '课程学习',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      path: '/courses',
      badge: `${completedCourses}/${totalCourses}`,
      badgeColor: completedCourses === totalCourses ? 'success' : 'primary',
    },
    {
      id: 'progress',
      label: '学习进度',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/progress',
      badge: `${completionPercentage}%`,
      badgeColor: completionPercentage >= 80 ? 'success' : completionPercentage >= 50 ? 'warning' : 'danger',
    },
    {
      id: 'achievements',
      label: '成就系统',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      path: '/achievements',
      badge: stats?.achievements?.length ? `${stats.achievements.length}` : undefined,
      badgeColor: 'success',
    },
    {
      id: 'leaderboard',
      label: '排行榜',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      path: '/leaderboard',
    },
  ];

  // 徽章颜色样式
  const badgeColorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
    success: 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300',
    warning: 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300',
    danger: 'bg-danger-100 dark:bg-danger-900 text-danger-700 dark:text-danger-300',
  };

  // 渲染菜单项
  const renderMenuItem = (item: MenuItem) => {
    const isActive = location.pathname === item.path;
    
    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={onClose}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
        }`}
      >
        <div className={`flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'group-hover:text-primary-500'} transition-colors duration-200`}>
          {item.icon}
        </div>
        
        {!isCollapsed && (
          <>
            <span className="ml-3 flex-1 truncate">{item.label}</span>
            
            {item.badge && (
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${badgeColorClasses[item.badgeColor || 'primary']}`}>
                {item.badge}
              </span>
            )}
          </>
        )}
        
        {isCollapsed && item.badge && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            {item.label}: {item.badge}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div
        className={`fixed top-0 left-0 z-30 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } hidden lg:block shadow-soft`}
        style={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo区域 - 固定在顶部 */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold gradient-text truncate">
                  JS学习平台
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  交互式编程学习
                </p>
              </div>
            )}
          </div>
          
          {/* 折叠按钮 */}
          <button
            onClick={onToggleCollapse}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* 用户信息 - 固定在顶部 */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* 学习进度条 */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>学习进度</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="progress-bar h-2">
                <div 
                  className="progress-fill transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 导航菜单 - 占据中间空间，可滚动 */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin min-h-0">
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* 底部功能区域 - 固定在页面底部 */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 flex-shrink-0" style={{ marginTop: 'auto' }}>
          {/* 用户操作菜单 */}
          <div className="p-4 space-y-1">
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {!isCollapsed && <span>个人资料</span>}
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!isCollapsed && <span>设置</span>}
            </button>
            
            <button
              onClick={async () => {
                try {
                  await logout();
                  useModalStore.getState().showSuccess('已安全退出登录');
                  navigate('/login');
                } catch (error) {
                  useModalStore.getState().showError('退出登录失败');
                }
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && <span>退出登录</span>}
            </button>
          </div>
          
          {/* 版本信息 */}
          {!isCollapsed && (
            <div className="px-4 pb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>版本 v1.0.0</p>
                <p className="mt-1">© 2024 JS学习平台</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:hidden shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 移动端头部 - 固定在顶部 */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-lg font-bold gradient-text">
              JS学习平台
            </h1>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 移动端用户信息 - 固定在顶部 */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>学习进度</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="progress-bar h-2">
                <div 
                  className="progress-fill transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 移动端导航菜单 - 占据中间空间，可滚动 */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin min-h-0">
          {menuItems.map(renderMenuItem)}
        </nav>
        
        {/* 移动端底部功能区域 - 固定在页面底部 */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 flex-shrink-0" style={{ marginTop: 'auto' }}>
          {/* 用户操作菜单 */}
          <div className="p-4 space-y-1">
            <button
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>个人资料</span>
            </button>
            
            <button
              onClick={() => {
                navigate('/settings');
                onClose();
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>设置</span>
            </button>
            
            <button
              onClick={async () => {
                try {
                  await logout();
                  useModalStore.getState().showSuccess('已安全退出登录');
                  navigate('/login');
                } catch (error) {
                  useModalStore.getState().showError('退出登录失败');
                }
                onClose();
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>退出登录</span>
            </button>
          </div>
          
          {/* 版本信息 */}
          <div className="px-4 pb-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>版本 v1.0.0</p>
              <p className="mt-1">© 2024 JS学习平台</p>
            </div>
          </div>
        </div>
      </div>

      {/* RightSlideModal 组件 */}
      <RightSlideModal
        isOpen={modalOpen}
        onClose={hideModal}
        title={title}
        message={message}
        type={type}
        autoClose={autoClose}
        showProgress={showProgress}
      />
    </>
  );
};

export default Sidebar;
