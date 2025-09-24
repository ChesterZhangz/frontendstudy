import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  totalPoints: number;
  completedCourses: number;
  totalStudyTime: number; // 分钟
  currentStreak: number;
  rank: number;
  category: 'overall' | 'weekly' | 'monthly' | 'all_time';
  period: string; // 如 '2024-W01' 或 '2024-01'
  achievements: number;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'SharedUser',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: String,
  totalPoints: {
    type: Number,
    default: 0
  },
  completedCourses: {
    type: Number,
    default: 0
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['overall', 'weekly', 'monthly', 'all_time'],
    required: true
  },
  period: {
    type: String,
    required: true
  },
  achievements: {
    type: Number,
    default: 0
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 索引
LeaderboardEntrySchema.index({ category: 1, period: 1, rank: 1 });
LeaderboardEntrySchema.index({ userId: 1, category: 1, period: 1 });
LeaderboardEntrySchema.index({ totalPoints: -1 });
LeaderboardEntrySchema.index({ lastActiveAt: -1 });

export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
