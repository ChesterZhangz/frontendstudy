import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  RotateCcw,
  Clock,
  Award,
  Lightbulb
} from 'lucide-react';
import { QuizData, ValidationResult } from '@/types/interactive';

interface QuizComponentProps {
  id: string;
  data: QuizData;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
  className?: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  id,
  data,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  // 渲染反馈图标
  const renderFeedbackIcon = (feedback: string) => {
    if (feedback.includes('正确')) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (feedback.includes('错误')) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    return <HelpCircle className="w-4 h-4 text-gray-600" />;
  };

  // 处理选项选择
  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;

    const newSelected = new Set(selectedOptions);
    
    if (data.multipleChoice) {
      // 多选题
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else {
        newSelected.add(optionId);
      }
    } else {
      // 单选题
      newSelected.clear();
      newSelected.add(optionId);
    }
    
    setSelectedOptions(newSelected);
  };

  // 提交答案
  const submitAnswer = () => {
    if (selectedOptions.size === 0) return;

    setIsSubmitted(true);
    setAttempts(prev => prev + 1);

    // 验证答案
    const correctOptions = new Set(
      data.options.filter(option => option.isCorrect).map(option => option.id)
    );
    
    const isCorrect = 
      selectedOptions.size === correctOptions.size &&
      Array.from(selectedOptions).every(id => correctOptions.has(id));

    const score = isCorrect ? 100 : 0;
    
    const validation: ValidationResult = {
      isValid: isCorrect,
      score,
      feedback: isCorrect 
        ? '回答正确！' 
        : '回答错误，请重试。',
      explanation: data.explanation
    };

    setValidationResult(validation);
    setShowExplanation(true);

    // 如果回答正确且未完成
    if (isCorrect && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      onComplete({
        componentId: id,
        componentType: 'quiz',
        isCorrect: true,
        score,
        attempts,
        timeSpent,
        selectedOptions: Array.from(selectedOptions)
      });
    }

    onProgress(score);
  };

  // 重置答案
  const resetAnswer = () => {
    setSelectedOptions(new Set());
    setIsSubmitted(false);
    setValidationResult(null);
    setShowExplanation(false);
  };

  // 获取选项状态样式
  const getOptionStyle = (option: any) => {
    const isSelected = selectedOptions.has(option.id);
    
    if (!isSubmitted) {
      return isSelected 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';
    }

    // 已提交状态
    if (option.isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    } else if (isSelected) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    } else {
      return 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400';
    }
  };

  // 获取选项图标
  const getOptionIcon = (option: any) => {
    const isSelected = selectedOptions.has(option.id);
    
    if (!isSubmitted) {
      return (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
      );
    }

    // 已提交状态
    if (option.isCorrect) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (isSelected) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
      );
    }
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 头部 */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${
              isCompleted 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {isCompleted ? <Award className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                选择题
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.multipleChoice ? '多选题（可选择多个答案）' : '单选题（只能选择一个答案）'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>尝试次数: {attempts}</span>
            {isCompleted && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                已完成
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-6">
        {/* 问题 */}
        <div className="mb-6">
          <div 
            className="text-lg text-gray-900 dark:text-white prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: data.question }}
          />
        </div>

        {/* 选项 */}
        <div className="space-y-3 mb-6">
          {data.options.map((option, index) => (
            <motion.div
              key={option.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${getOptionStyle(option)}`}
              onClick={() => handleOptionSelect(option.id)}
              whileHover={{ scale: isSubmitted ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
            >
              <div className="flex items-center space-x-3">
                {getOptionIcon(option)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {option.text}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-3">
          {!isSubmitted ? (
            <button
              onClick={submitAnswer}
              disabled={selectedOptions.size === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>提交答案</span>
            </button>
          ) : (
            <button
              onClick={resetAnswer}
              className="flex items-center space-x-2 px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新答题</span>
            </button>
          )}
        </div>

        {/* 验证结果 */}
        <AnimatePresence>
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className={`p-4 rounded-lg border ${
                validationResult.isValid 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
              }`}>
                <div className={`font-medium flex items-center gap-2 ${
                  validationResult.isValid 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-red-800 dark:text-red-300'
                }`}>
                  {renderFeedbackIcon(validationResult.feedback)}
                  {validationResult.feedback}
                </div>
                <div className={`mt-1 text-sm ${
                  validationResult.isValid 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  得分: {validationResult.score}/100
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 解释说明 */}
        <AnimatePresence>
          {showExplanation && data.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  解释说明
                </h4>
                <div 
                  className="text-sm text-blue-700 dark:text-blue-300 prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.explanation }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuizComponent;
