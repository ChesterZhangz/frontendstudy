import mongoose, { Schema, Document } from 'mongoose';
import { IStudyStats } from '../types';

const AchievementSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  unlockedAt: {
    type: Date,
    required: true
  }
});

const StudyStatsSchema = new Schema<IStudyStats>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  totalStudyTime: {
    type: Number,
    default: 0,
    min: 0
  },
  completedDays: {
    type: Number,
    default: 0,
    min: 0,
    max: 20
  },
  totalExercises: {
    type: Number,
    default: 0,
    min: 0
  },
  completedExercises: {
    type: Number,
    default: 0,
    min: 0
  },
  totalErrors: {
    type: Number,
    default: 0,
    min: 0
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastStudyDate: {
    type: Date
  },
  totalAchievementPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: [AchievementSchema]
}, {
  timestamps: true
});

// 索引
StudyStatsSchema.index({ userId: 1 });
StudyStatsSchema.index({ totalStudyTime: -1 });
StudyStatsSchema.index({ completedDays: -1 });
StudyStatsSchema.index({ streak: -1 });

// 虚拟字段：完成率
StudyStatsSchema.virtual('completionRate').get(function() {
  if (this.totalExercises === 0) return 0;
  return Math.round((this.completedExercises / this.totalExercises) * 100);
});

// 虚拟字段：平均每日学习时间
StudyStatsSchema.virtual('averageDailyStudyTime').get(function() {
  if (this.completedDays === 0) return 0;
  return Math.round(this.totalStudyTime / this.completedDays);
});

export const StudyStats = mongoose.model<IStudyStats>('StudyStats', StudyStatsSchema);
