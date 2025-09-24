import mongoose, { Schema, Document } from 'mongoose';

// SharedUser 接口定义（基于 combine-viquard-database.md）
export interface ISharedUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;                    // 用户邮箱 (唯一)
  password: string;                 // 加密密码
  name: string;                     // 用户姓名
  role: 'superadmin' | 'admin' | 'teacher' | 'student' | 'user'; // 用户角色
  isActive: boolean;                // 是否激活
  isEmailVerified: boolean;         // 邮箱是否验证
  emailSuffix?: string;             // 企业邮箱后缀 (可选)
  userType: 'individual' | 'enterprise'; // 用户类型
  lastLogin?: Date;                 // 最后登录时间
  createdAt: Date;                  // 创建时间
  updatedAt: Date;                  // 更新时间
}

// SharedUser Schema
const SharedUserSchema = new Schema<ISharedUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // 默认不返回密码字段
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'teacher', 'student', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailSuffix: {
    type: String,
    trim: true
  },
  userType: {
    type: String,
    enum: ['individual', 'enterprise'],
    default: 'individual'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// 索引
SharedUserSchema.index({ email: 1 });
SharedUserSchema.index({ role: 1 });
SharedUserSchema.index({ isActive: 1 });
SharedUserSchema.index({ userType: 1 });

// 导出模型（不指定数据库，让调用者指定）
export const SharedUser = (connection: mongoose.Connection) => 
  connection.model<ISharedUser>('SharedUser', SharedUserSchema);
