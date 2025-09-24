import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  RotateCcw,
  Clock,
  Award,
  Lightbulb,
  FileText,
  PartyPopper
} from 'lucide-react';
import { FillBlankData, ValidationResult } from '@/types/interactive';

interface FillBlankComponentProps {
  id: string;
  data: FillBlankData;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
  className?: string;
}


const FillBlankComponent: React.FC<FillBlankComponentProps> = ({
  id,
  data,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [blankResults, setBlankResults] = useState<Map<string, boolean>>(new Map());
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  // 渲染反馈图标
  const renderFeedbackIcon = (feedback: string) => {
    if (feedback.includes('全部') && feedback.includes('正确')) {
      return <PartyPopper className="w-4 h-4 text-green-600" />;
    } else if (feedback.includes('正确')) {
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  // 解析内容，提取填空位置
  const parseContent = () => {
    const blankRegex = /\*\*\{([^}]+)\}\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blankIndex = 0;

    while ((match = blankRegex.exec(data.content)) !== null) {
      // 添加填空前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: data.content.slice(lastIndex, match.index)
        });
      }

      // 添加填空
      const blankId = data.blanks[blankIndex]?.id || `blank-${blankIndex}`;
      parts.push({
        type: 'blank',
        id: blankId,
        acceptedAnswers: match[1].split('|').map(s => s.trim()),
        blankIndex
      });

      lastIndex = match.index + match[0].length;
      blankIndex++;
    }

    // 添加剩余文本
    if (lastIndex < data.content.length) {
      parts.push({
        type: 'text',
        content: data.content.slice(lastIndex)
      });
    }

    return parts;
  };

  const contentParts = parseContent();

  // 处理答案输入
  const handleAnswerChange = (blankId: string, value: string) => {
    if (isSubmitted) return;
    
    const newAnswers = new Map(answers);
    newAnswers.set(blankId, value);
    setAnswers(newAnswers);
  };

  // 验证单个填空答案
  const validateBlankAnswer = (blankId: string, userAnswer: string): boolean => {
    const blank = data.blanks.find(b => b.id === blankId);
    if (!blank) return false;

    const normalizedAnswer = blank.caseSensitive 
      ? userAnswer.trim() 
      : userAnswer.trim().toLowerCase();

    return blank.acceptedAnswers.some(accepted => {
      const normalizedAccepted = blank.caseSensitive 
        ? accepted.trim() 
        : accepted.trim().toLowerCase();
      return normalizedAnswer === normalizedAccepted;
    });
  };

  // 提交答案
  const submitAnswers = () => {
    if (answers.size === 0) return;

    setIsSubmitted(true);
    setAttempts(prev => prev + 1);

    // 验证所有填空
    const results = new Map<string, boolean>();
    let correctCount = 0;

    data.blanks.forEach(blank => {
      const userAnswer = answers.get(blank.id) || '';
      const isCorrect = validateBlankAnswer(blank.id, userAnswer);
      results.set(blank.id, isCorrect);
      if (isCorrect) correctCount++;
    });

    setBlankResults(results);

    const score = Math.round((correctCount / data.blanks.length) * 100);
    const allCorrect = correctCount === data.blanks.length;

    const validation: ValidationResult = {
      isValid: allCorrect,
      score,
      feedback: allCorrect 
        ? '全部填空都正确！' 
        : `正确 ${correctCount}/${data.blanks.length} 个填空`,
      explanation: data.explanation
    };

    setValidationResult(validation);

    // 如果全部正确且未完成
    if (allCorrect && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      onComplete({
        componentId: id,
        componentType: 'fill-blank',
        isCorrect: true,
        score,
        attempts,
        timeSpent,
        answers: Object.fromEntries(answers)
      });
    }

    onProgress(score);
  };

  // 重置答案
  const resetAnswers = () => {
    setAnswers(new Map());
    setIsSubmitted(false);
    setValidationResult(null);
    setBlankResults(new Map());
  };

  // 获取填空输入框样式
  const getBlankStyle = (blankId: string) => {
    if (!isSubmitted) {
      return 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500';
    }

    const isCorrect = blankResults.get(blankId);
    if (isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    } else {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    }
  };

  // 渲染内容部分
  const renderContentPart = (part: any, index: number) => {
    if (part.type === 'text') {
      return (
        <span 
          key={index}
          className="text-gray-900 dark:text-white"
          dangerouslySetInnerHTML={{ __html: part.content }}
        />
      );
    } else if (part.type === 'blank') {
      const userAnswer = answers.get(part.id) || '';
      const isCorrect = blankResults.get(part.id);
      
      return (
        <span key={index} className="inline-flex items-center">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(part.id, e.target.value)}
            disabled={isSubmitted}
            placeholder="填入答案"
            className={`inline-block w-32 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${getBlankStyle(part.id)}`}
          />
          {isSubmitted && (
            <span className="ml-1">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </span>
          )}
        </span>
      );
    }
    return null;
  };

  // 检查是否所有填空都已填写
  const allBlanksFilled = data.blanks.every(blank => {
    const answer = answers.get(blank.id);
    return answer && answer.trim().length > 0;
  });

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
              {isCompleted ? <Award className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                填空题
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                请在空白处填入正确的答案
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
        {/* 填空内容 */}
        <div className="mb-6">
          <div className="text-lg leading-relaxed">
            {contentParts.map((part, index) => renderContentPart(part, index))}
          </div>
        </div>

        {/* 填空提示 */}
        {!isSubmitted && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              填空提示
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 请在每个空白处填入合适的答案</li>
              <li>• 答案可能有多个正确选项</li>
              <li>• 注意大小写敏感性（如果适用）</li>
              <li>• 填写完所有空白后点击提交</li>
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center space-x-3">
          {!isSubmitted ? (
            <button
              onClick={submitAnswers}
              disabled={!allBlanksFilled}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>提交答案</span>
            </button>
          ) : (
            <button
              onClick={resetAnswers}
              className="flex items-center space-x-2 px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新填写</span>
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
          {isSubmitted && data.explanation && (
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

        {/* 正确答案提示 */}
        <AnimatePresence>
          {isSubmitted && !validationResult?.isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  参考答案
                </h4>
                <div className="space-y-2">
                  {data.blanks.map((blank, index) => {
                    const isCorrect = blankResults.get(blank.id);
                    if (isCorrect) return null;
                    
                    return (
                      <div key={blank.id} className="text-sm">
                        <span className="text-yellow-700 dark:text-yellow-300">
                          空白 {index + 1}: 
                        </span>
                        <span className="font-mono text-yellow-800 dark:text-yellow-200 ml-2">
                          {blank.acceptedAnswers.join(' 或 ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FillBlankComponent;
