import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Progress from '@/pages/Progress';
import Achievements from '@/pages/Achievements';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import InteractiveEditorTest from '@/pages/InteractiveEditorTest';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import LoadingScreen from '@/components/ui/LoadingScreen';

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
});

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <LoadingScreen message="正在验证身份..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 公开路由组件（已登录用户重定向到首页）
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <LoadingScreen message="正在加载..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { initializeTheme } = useThemeStore();

  // 初始化主题
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <Routes>
            {/* 公开路由 */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />

            {/* 受保护的路由 */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/courses" element={<Layout><Courses /></Layout>} />
                    <Route path="/courses/:day" element={<Layout><CourseDetail /></Layout>} />
                    <Route path="/interactive-editor" element={<Layout><InteractiveEditorTest /></Layout>} />
                    <Route path="/progress" element={<Layout><Progress /></Layout>} />
                    <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
                    <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
