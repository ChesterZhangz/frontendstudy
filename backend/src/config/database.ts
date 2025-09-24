import mongoose from 'mongoose';

// 数据库连接实例
let sharedataConnection: mongoose.Connection | null = null;

// 主数据库连接（学习平台数据 - STUDYROOM）
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.STUDYROOM || 'mongodb://localhost:27017/STUDYROOM';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5秒超时
      connectTimeoutMS: 10000,       // 10秒连接超时
      socketTimeoutMS: 45000,        // 45秒socket超时
      maxPoolSize: 10,               // 最大连接池大小
      minPoolSize: 5,                // 最小连接池大小
      maxIdleTimeMS: 30000,         // 最大空闲时间
      bufferCommands: false,         // 禁用缓冲
    });
    console.log('✅ STUDYROOM 数据库连接成功');
  } catch (error) {
    console.error('❌ STUDYROOM 数据库连接失败:', error);
    process.exit(1);
  }
};

// Sharedata 数据库连接（用户数据 - SHARED_DATA_URI）
export const connectSharedataDatabase = async (): Promise<void> => {
  try {
    const sharedataUri = process.env.SHARED_DATA_URI || 'mongodb://localhost:27017/SHARED_DATA_URI';
    sharedataConnection = mongoose.createConnection(sharedataUri, {
      serverSelectionTimeoutMS: 5000, // 5秒超时
      connectTimeoutMS: 10000,       // 10秒连接超时
      socketTimeoutMS: 45000,        // 45秒socket超时
      maxPoolSize: 10,               // 最大连接池大小
      minPoolSize: 5,                // 最小连接池大小
      maxIdleTimeMS: 30000,         // 最大空闲时间
      bufferCommands: false,         // 禁用缓冲
    });
    console.log('✅ SHARED_DATA_URI 数据库连接成功');
  } catch (error) {
    console.error('❌ SHARED_DATA_URI 数据库连接失败:', error);
    process.exit(1);
  }
};

// 获取 Sharedata 数据库连接
export const getSharedataConnection = (): mongoose.Connection => {
  if (!sharedataConnection) {
    throw new Error('Sharedata 数据库未连接');
  }
  return sharedataConnection;
};

// 数据库连接健康检查
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    // 检查主数据库
    const mainDbState = mongoose.connection.readyState;
    if (mainDbState !== 1) {
      console.log('主数据库连接状态:', mainDbState);
      return false;
    }

    // 检查 Sharedata 数据库
    if (!sharedataConnection) {
      console.log('Sharedata 数据库未连接');
      return false;
    }

    const sharedataState = sharedataConnection.readyState;
    if (sharedataState !== 1) {
      console.log('Sharedata 数据库连接状态:', sharedataState);
      return false;
    }

    return true;
  } catch (error) {
    console.error('数据库健康检查失败:', error);
    return false;
  }
};

// 快速重连机制
export const reconnectDatabases = async (): Promise<void> => {
  try {
    console.log('🔄 尝试重新连接数据库...');
    
    // 关闭现有连接
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    if (sharedataConnection && sharedataConnection.readyState !== 0) {
      await sharedataConnection.close();
    }
    
    // 重新连接
    await connectDatabase();
    await connectSharedataDatabase();
    
    console.log('✅ 数据库重连成功');
  } catch (error) {
    console.error('❌ 数据库重连失败:', error);
    throw error;
  }
};

// 数据库连接状态检查
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const state = mongoose.connection.readyState;
    return state === 1; // 1 表示已连接
  } catch (error) {
    console.error('数据库连接检查失败:', error);
    return false;
  }
};

// 优雅关闭数据库连接
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ 数据库连接已关闭');
  } catch (error) {
    console.error('❌ 关闭数据库连接失败:', error);
  }
};
