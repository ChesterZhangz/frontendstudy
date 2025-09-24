import cors from 'cors';

// CORS 配置
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // 允许的源列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://study.mareate.com',
      'http://study.mareate.com'
    ];

    // 开发环境允许所有源
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    // 生产环境检查源
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的 CORS 源'), false);
    }
  },
  credentials: true, // 允许携带凭证
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Authorization'],
  maxAge: 86400 // 预检请求缓存时间（24小时）
};

export const corsMiddleware = cors(corsOptions);
