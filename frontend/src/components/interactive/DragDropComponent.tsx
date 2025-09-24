import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Move, 
  RotateCcw,
  Clock,
  Award,
  GripVertical,
  FileText,
  PartyPopper
} from 'lucide-react';
import { DragDropData, ValidationResult } from '@/types/interactive';

interface DragDropComponentProps {
  id: string;
  data: DragDropData;
  onComplete: (result: any) => void;
  onProgress: (progress: number) => void;
  className?: string;
}

interface DraggedItem {
  id: string;
  content: string;
  sourceZone?: string;
}

const DragDropComponent: React.FC<DragDropComponentProps> = ({
  id,
  data,
  onComplete,
  onProgress,
  className = ''
}) => {
  const [dropZones, setDropZones] = useState<Map<string, string[]>>(new Map());
  const [availableItems, setAvailableItems] = useState<string[]>(
    data.sourceItems.map(item => item.id)
  );
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [zoneResults, setZoneResults] = useState<Map<string, boolean>>(new Map());
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  // 渲染反馈图标
  const renderFeedbackIcon = (feedback: string) => {
    if (feedback.includes('所有') && feedback.includes('正确')) {
      return <PartyPopper className="w-4 h-4 text-green-600" />;
    } else if (feedback.includes('正确')) {
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  // 初始化拖拽区域
  useEffect(() => {
    const initialZones = new Map<string, string[]>();
    data.dropZones.forEach(zone => {
      initialZones.set(zone.id, []);
    });
    setDropZones(initialZones);
  }, [data.dropZones]);

  // 开始拖拽
  const handleDragStart = (e: React.DragEvent, item: DraggedItem) => {
    const draggedItemWithSource = {
      ...item,
      sourceZone: item.sourceZone || undefined // 明确标记来源
    };
    setDraggedItem(draggedItemWithSource);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    
    // 添加拖拽样式
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  // 拖拽结束
  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    
    // 恢复样式
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  // 拖拽悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 拖拽进入
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
    }
  };

  // 拖拽离开
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
    }
  };

  // 放置到拖拽区域
  const handleDropToZone = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
    }

    if (!draggedItem) return;

    const zone = data.dropZones.find(z => z.id === zoneId);
    if (!zone) return;

    // 检查是否超过最大数量限制
    const currentItems = dropZones.get(zoneId) || [];
    if (zone.maxItems && currentItems.length >= zone.maxItems) {
      return;
    }

    // 从原位置移除
    if (draggedItem.sourceZone) {
      const sourceItems = dropZones.get(draggedItem.sourceZone) || [];
      const newSourceItems = sourceItems.filter(itemId => itemId !== draggedItem.id);
      setDropZones(prev => new Map(prev.set(draggedItem.sourceZone!, newSourceItems)));
    } else {
      setAvailableItems(prev => prev.filter(itemId => itemId !== draggedItem.id));
    }

    // 添加到新位置
    const newItems = [...currentItems, draggedItem.id];
    setDropZones(prev => new Map(prev.set(zoneId, newItems)));
  };

  // 放置回源区域
  const handleDropToSource = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // 从拖拽区域移除
    if (draggedItem.sourceZone) {
      const sourceItems = dropZones.get(draggedItem.sourceZone) || [];
      const newSourceItems = sourceItems.filter(itemId => itemId !== draggedItem.id);
      setDropZones(prev => new Map(prev.set(draggedItem.sourceZone!, newSourceItems)));
    }

    // 添加回源区域（避免重复）
    setAvailableItems(prev => {
      if (prev.includes(draggedItem.id)) {
        return prev; // 已存在，不重复添加
      }
      return [...prev, draggedItem.id];
    });
  };

  // 从拖拽区域移除项目
  const removeFromZone = (itemId: string, zoneId: string) => {
    if (isSubmitted) return;

    const currentItems = dropZones.get(zoneId) || [];
    const newItems = currentItems.filter(id => id !== itemId);
    setDropZones(prev => new Map(prev.set(zoneId, newItems)));
    
    // 添加回源区域（避免重复）
    setAvailableItems(prev => {
      if (prev.includes(itemId)) {
        return prev; // 已存在，不重复添加
      }
      return [...prev, itemId];
    });
  };

  // 验证答案
  const validateAnswers = () => {
    const results = new Map<string, boolean>();
    let correctCount = 0;

    data.dropZones.forEach(zone => {
      const itemsInZone = dropZones.get(zone.id) || [];
      const isCorrect = itemsInZone.every(itemId => zone.acceptedItems.includes(itemId)) &&
                       zone.acceptedItems.every(acceptedId => itemsInZone.includes(acceptedId));
      
      results.set(zone.id, isCorrect);
      if (isCorrect) correctCount++;
    });

    return { results, correctCount };
  };

  // 提交答案
  const submitAnswers = () => {
    setIsSubmitted(true);
    setAttempts(prev => prev + 1);

    const { results, correctCount } = validateAnswers();
    setZoneResults(results);

    const score = Math.round((correctCount / data.dropZones.length) * 100);
    const allCorrect = correctCount === data.dropZones.length;

    const validation: ValidationResult = {
      isValid: allCorrect,
      score,
      feedback: allCorrect 
        ? '所有拖拽都正确！' 
        : `正确 ${correctCount}/${data.dropZones.length} 个拖拽区域`,
      explanation: '检查每个拖拽区域的内容是否正确'
    };

    setValidationResult(validation);

    // 如果全部正确且未完成
    if (allCorrect && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      onComplete({
        componentId: id,
        componentType: 'drag-drop',
        isCorrect: true,
        score,
        attempts,
        timeSpent,
        dropZones: Object.fromEntries(dropZones)
      });
    }

    onProgress(score);
  };

  // 重置答案
  const resetAnswers = () => {
    // 重置拖拽区域
    const initialZones = new Map<string, string[]>();
    data.dropZones.forEach(zone => {
      initialZones.set(zone.id, []);
    });
    setDropZones(initialZones);
    
    // 重置可用项目
    setAvailableItems(data.sourceItems.map(item => item.id));
    
    setIsSubmitted(false);
    setValidationResult(null);
    setZoneResults(new Map());
  };

  // 获取项目内容
  const getItemContent = (itemId: string) => {
    return data.sourceItems.find(item => item.id === itemId)?.content || '';
  };

  // 获取拖拽区域样式
  const getZoneStyle = (zoneId: string) => {
    if (!isSubmitted) {
      return 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    }

    const isCorrect = zoneResults.get(zoneId);
    if (isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    } else {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }
  };

  // 检查是否有项目被放置
  const hasItemsPlaced = Array.from(dropZones.values()).some(items => items.length > 0);

  // 渲染带有拖拽区域的模板
  const renderTemplateWithDropZones = () => {
    if (!data.template) return null;

    const lines = data.template.split('\n');
    return lines.map((line, lineIndex) => {
      // 查找这一行中的拖拽区域占位符
      const dropZoneRegex = /\{drop-zone:(\w+)\}/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = dropZoneRegex.exec(line)) !== null) {
        // 添加占位符前的文本
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${lineIndex}-${lastIndex}`} className="text-gray-600 dark:text-gray-400">
              {line.substring(lastIndex, match.index)}
            </span>
          );
        }

        // 添加拖拽区域
        const zoneId = match[1];
        const itemsInZone = dropZones.get(zoneId) || [];
        const isCorrect = zoneResults.get(zoneId);

        parts.push(
          <div
            key={`zone-${lineIndex}-${zoneId}`}
            className={`inline-block min-w-[120px] min-h-[32px] mx-1 px-2 py-1 border-2 border-dashed rounded transition-colors ${getZoneStyle(zoneId)}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDropToZone(e, zoneId)}
          >
            {itemsInZone.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {itemsInZone.map(itemId => (
                  <div
                    key={itemId}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded text-xs cursor-move"
                    draggable={!isSubmitted}
                    onDragStart={(e) => handleDragStart(e, { 
                      id: itemId, 
                      content: getItemContent(itemId),
                      sourceZone: zoneId 
                    })}
                    onDragEnd={handleDragEnd}
                  >
                    <GripVertical className="w-3 h-3 text-gray-400" />
                    <span className="text-blue-800 dark:text-blue-200 font-sans">
                      {getItemContent(itemId)}
                    </span>
                    {!isSubmitted && (
                      <button
                        onClick={() => removeFromZone(itemId, zoneId)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    )}
                    {isSubmitted && (
                      <div className="ml-1">
                        {isCorrect ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-1">
                请拖拽至此
              </div>
            )}
          </div>
        );

        lastIndex = match.index + match[0].length;
      }

      // 添加剩余的文本
      if (lastIndex < line.length) {
        parts.push(
          <span key={`text-${lineIndex}-${lastIndex}`} className="text-gray-600 dark:text-gray-400">
            {line.substring(lastIndex)}
          </span>
        );
      }

      return (
        <div key={lineIndex} className="leading-relaxed">
          {parts.length > 0 ? parts : (
            <span className="text-gray-600 dark:text-gray-400">{line}</span>
          )}
        </div>
      );
    });
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
              {isCompleted ? <Award className="w-5 h-5" /> : <Move className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.description}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：源项目 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              拖拽项目
            </h4>
            <div 
              className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              onDragOver={handleDragOver}
              onDrop={handleDropToSource}
            >
              <div className="grid grid-cols-1 gap-2">
                {availableItems.map(itemId => {
                  const item = data.sourceItems.find(i => i.id === itemId);
                  if (!item) return null;

                  return (
                    <div
                      key={itemId}
                      className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:shadow-md transition-shadow"
                      draggable={!isSubmitted}
                      onDragStart={(e) => handleDragStart(e, { id: item.id, content: item.content })}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-900 dark:text-white">
                        {item.content}
                      </span>
                    </div>
                  );
                })}
                
                {availableItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Move className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">所有项目都已拖拽</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：HTML结构模板 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              HTML结构模板
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg font-mono text-sm">
              {renderTemplateWithDropZones()}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex items-center space-x-3">
          {!isSubmitted ? (
            <button
              onClick={submitAnswers}
              disabled={!hasItemsPlaced}
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
              <span>重新拖拽</span>
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
                  正确答案
                </h4>
                <div className="space-y-2">
                  {data.dropZones.map(zone => {
                    const isCorrect = zoneResults.get(zone.id);
                    if (isCorrect) return null;
                    
                    return (
                      <div key={zone.id} className="text-sm">
                        <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                          {zone.label}: 
                        </span>
                        <span className="text-yellow-800 dark:text-yellow-200 ml-2">
                          {zone.acceptedItems.map(itemId => getItemContent(itemId)).join(', ')}
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

export default DragDropComponent;
