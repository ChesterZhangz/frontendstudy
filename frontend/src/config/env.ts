// 环境变量配置
export const env = {
  // API配置
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5200/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'JavaScript学习平台',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // 环境
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  
  // Monaco Editor
  MONACO_EDITOR_CDN: import.meta.env.VITE_MONACO_EDITOR_CDN || 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0',
  
  // 功能开关
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

// 开发环境配置
export const devConfig = {
  API_URL: 'http://localhost:5200/api',
  ENABLE_LOGGING: true,
  ENABLE_DEVTOOLS: true,
} as const;

// 生产环境配置
export const prodConfig = {
  API_URL: 'https://api.study.example.com/api',
  ENABLE_LOGGING: false,
  ENABLE_DEVTOOLS: false,
} as const;

// 根据环境获取配置
export const config = env.DEV ? devConfig : prodConfig;

// 验证必需的环境变量
export const validateEnv = () => {
  const requiredVars = ['VITE_API_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('缺少环境变量:', missing);
  }
  
  return missing.length === 0;
};

// 初始化环境配置
export const initEnv = () => {
  validateEnv();
  
  if (env.DEV) {
    console.log('🚀 开发环境配置:', {
      API_URL: env.API_URL,
      APP_NAME: env.APP_NAME,
      VERSION: env.APP_VERSION,
    });
  }
};

export default env;
