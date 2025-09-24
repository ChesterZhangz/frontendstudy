import mongoose, { Schema, Document } from 'mongoose';
import { ICourseContent } from '../types';

const ExampleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  }
});

const TestCaseSchema = new Schema({
  input: {
    type: Schema.Types.Mixed,
    required: true
  },
  expectedOutput: {
    type: Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const ExerciseSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  starterCode: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  testCases: [TestCaseSchema],
  hints: [{
    type: String
  }]
});

const CourseContentSchema = new Schema<ICourseContent>({
  day: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 20
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedTime: {
    type: Number,
    required: true,
    min: 1
  },
  topics: [{
    type: String
  }],
  content: {
    theory: {
      type: String,
      required: true
    },
    examples: [ExampleSchema],
    exercises: [ExerciseSchema]
  },
  prerequisites: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引
CourseContentSchema.index({ day: 1 });
CourseContentSchema.index({ difficulty: 1 });
CourseContentSchema.index({ isActive: 1 });

export const CourseContent = mongoose.model<ICourseContent>('CourseContent', CourseContentSchema);
