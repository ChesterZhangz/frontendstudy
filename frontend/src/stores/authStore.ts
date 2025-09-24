import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  userType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login({ email, password });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            // 设置默认的Authorization header
            authService.setAuthToken(token);
            
            return true;
          } else {
            set({
              isLoading: false,
              error: response.message || '登录失败',
            });
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || '登录失败，请重试';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return false;
        }
      },

      logout: () => {
        // 清除本地存储
        localStorage.removeItem('auth-storage');
        
        // 清除axios默认header
        authService.clearAuthToken();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        
        // 重定向到登录页
        window.location.href = '/login';
      },

      getCurrentUser: async () => {
        const { token } = get();
        
        if (!token) {
          return;
        }
        
        try {
          set({ isLoading: true });
          
          const response = await authService.getCurrentUser();
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            // Token可能已过期，清除认证状态
            get().logout();
          }
        } catch (error: any) {
          console.error('获取用户信息失败:', error);
          
          // 如果是401错误，说明token已过期
          if (error.response?.status === 401) {
            get().logout();
          } else {
            set({
              isLoading: false,
              error: error.response?.data?.message || '获取用户信息失败',
            });
          }
        }
      },

      initializeAuth: async () => {
        const { token, user } = get();
        
        if (token && user) {
          // 设置axios默认header
          authService.setAuthToken(token);
          
          // 验证token是否仍然有效
          try {
            await authService.verifyToken();
            set({ isAuthenticated: true });
          } catch (error) {
            // Token无效，清除认证状态
            get().logout();
          }
        } else {
          set({ isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
