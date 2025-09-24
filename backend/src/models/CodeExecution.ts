import mongoose, { Schema, Document } from 'mongoose';
import { ICodeExecution } from '../types';

const ExecutionResultSchema = new Schema({
  success: {
    type: Boolean,
    required: true
  },
  output: {
    type: String
  },
  error: {
    type: String
  },
  executionTime: {
    type: Number,
    min: 0
  },
  memoryUsage: {
    type: Number,
    min: 0
  }
});

const CodeExecutionSchema = new Schema<ICodeExecution>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'SharedUser',
    required: true,
    index: true
  },
  courseId: {
    type: String,
    required: true,
    default: 'javascript-20days'
  },
  exerciseId: {
    type: String,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'html', 'css'],
    required: true
  },
  result: {
    type: ExecutionResultSchema,
    required: true
  }
}, {
  timestamps: true
});

// 索引
CodeExecutionSchema.index({ userId: 1, courseId: 1 });
CodeExecutionSchema.index({ userId: 1, createdAt: -1 });
CodeExecutionSchema.index({ exerciseId: 1 });

export const CodeExecution = mongoose.model<ICodeExecution>('CodeExecution', CodeExecutionSchema);
