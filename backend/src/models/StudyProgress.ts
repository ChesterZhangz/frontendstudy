import mongoose, { Schema, Document } from 'mongoose';
import { IStudyProgress } from '../types';

const StudyProgressSchema = new Schema<IStudyProgress>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  courseId: {
    type: String,
    required: true,
    default: 'javascript-20days'
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  startTime: {
    type: Date
  },
  completedTime: {
    type: Date
  },
  studyTime: {
    type: Number,
    default: 0,
    min: 0
  },
  codeSubmissions: {
    type: Number,
    default: 0,
    min: 0
  },
  errors: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: [{
    type: String
  }],
  componentProgress: {
    type: Map,
    of: {
      isCompleted: { type: Boolean, default: false },
      completedAt: { type: Date },
      attempts: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      componentId: { type: String }
    },
    default: {}
  },
  isAllTasksCompleted: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// 复合索引
StudyProgressSchema.index({ userId: 1, courseId: 1, day: 1 }, { unique: true });
StudyProgressSchema.index({ userId: 1, status: 1 });
StudyProgressSchema.index({ userId: 1, completedTime: -1 });

// 中间件：更新完成时间
StudyProgressSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedTime) {
    this.completedTime = new Date();
  }
  next();
});

export const StudyProgress = mongoose.model<IStudyProgress>('StudyProgress', StudyProgressSchema);
