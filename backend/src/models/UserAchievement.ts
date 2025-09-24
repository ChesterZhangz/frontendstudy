import mongoose, { Document, Schema } from 'mongoose';

// 用户成就接口
export interface IUserAchievement extends Document {
  _id: string;
  userId: string;                 // 用户ID
  achievementKey: string;         // 成就唯一标识
  unlockedAt: Date;              // 解锁时间
  progress: number;              // 当前进度
  isCompleted: boolean;          // 是否完成
  metadata?: any;                // 额外元数据
  createdAt: Date;
  updatedAt: Date;
}

// 用户成就 Schema
const userAchievementSchema = new Schema<IUserAchievement>({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  achievementKey: {
    type: String,
    required: true,
    trim: true
  },
  unlockedAt: {
    type: Date
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 复合索引
userAchievementSchema.index({ userId: 1, achievementKey: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isCompleted: 1 });
userAchievementSchema.index({ userId: 1, unlockedAt: -1 });
userAchievementSchema.index({ achievementKey: 1 });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', userAchievementSchema);