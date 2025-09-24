import axios, { AxiosResponse } from 'axios';
import { env } from '@/config/env';

// 创建axios实例
const api = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('解析认证数据失败:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 处理401错误（未授权）
    if (error.response?.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('auth-storage');
      
      // 重定向到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // 处理网络错误
    if (!error.response) {
      error.message = '网络连接失败，请检查网络设置';
    }
    
    return Promise.reject(error);
  }
);

// 通用API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 登录请求接口
export interface LoginRequest {
  email: string;
  password: string;
}

// 登录响应接口
export interface LoginResponse {
  user: {
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
  };
  token: string;
  expiresIn: string;
}

class AuthService {
  // 登录
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 登出
  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/logout');
      return response.data;
    } catch (error: any) {
      // 即使请求失败，也清除本地数据
      this.clearAuthToken();
      throw error;
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse> {
    try {
      const response = await api.get<ApiResponse>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 验证token有效性
  async verifyToken(): Promise<ApiResponse> {
    try {
      const response = await api.get<ApiResponse>('/auth/verify');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 设置认证token
  setAuthToken(token: string): void {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 清除认证token
  clearAuthToken(): void {
    delete api.defaults.headers.common['Authorization'];
  }

  // 检查是否已认证
  isAuthenticated(): boolean {
    const authData = localStorage.getItem('auth-storage');
    if (!authData) return false;
    
    try {
      const { state } = JSON.parse(authData);
      return !!(state?.token && state?.isAuthenticated);
    } catch (error) {
      return false;
    }
  }

  // 获取当前token
  getToken(): string | null {
    const authData = localStorage.getItem('auth-storage');
    if (!authData) return null;
    
    try {
      const { state } = JSON.parse(authData);
      return state?.token || null;
    } catch (error) {
      return null;
    }
  }

  // 刷新token（如果后端支持）
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
      
      if (response.data.success && response.data.data?.token) {
        this.setAuthToken(response.data.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 重置密码请求（如果后端支持）
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/password-reset-request', { email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 重置密码（如果后端支持）
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/password-reset', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 修改密码（如果后端支持）
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const authService = new AuthService();
export { api };
