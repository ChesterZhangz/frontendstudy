import mongoose, { Document, Schema } from 'mongoose';

// 成就类型枚举
export enum AchievementType {
  COURSE_COMPLETION = 'course_completion',      // 课程完成
  STUDY_TIME = 'study_time',                   // 学习时间
  STREAK = 'streak',                           // 连续学习
  EXERCISE = 'exercise',                       // 练习完成
  QUIZ = 'quiz',                              // 测验成绩
  SPEED = 'speed',                            // 学习速度
  MILESTONE = 'milestone',                     // 里程碑
  SPECIAL = 'special'                         // 特殊成就
}

// 成就稀有度枚举
export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon', 
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// 成就接口
export interface IAchievement extends Document {
  _id: string;
  key: string;                    // 成就唯一标识
  name: string;                   // 成就名称
  description: string;            // 成就描述
  type: AchievementType;          // 成就类型
  rarity: AchievementRarity;      // 稀有度
  icon: string;                   // 图标标识符
  points: number;                 // 成就积分
  requirement: {                  // 达成条件
    type: string;                 // 条件类型
    target: number;               // 目标值
    params?: any;                 // 额外参数
  };
  isActive: boolean;              // 是否激活
  isHidden: boolean;              // 是否隐藏（直到达成）
  createdAt: Date;
  updatedAt: Date;
}

// 成就 Schema
const achievementSchema = new Schema<IAchievement>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(AchievementType),
    required: true
  },
  rarity: {
    type: String,
    enum: Object.values(AchievementRarity),
    required: true
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  requirement: {
    type: {
      type: String,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    params: Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
achievementSchema.index({ key: 1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ isActive: 1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);