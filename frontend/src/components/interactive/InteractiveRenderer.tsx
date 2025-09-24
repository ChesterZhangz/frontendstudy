import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { 
  ExerciseData, 
  ExecutableData,
  QuizData, 
  FillBlankData, 
  DragDropData, 
  ChallengeData,
  TestCase,
  ParsedContent,
  InteractiveComponent,
  RendererState,
  ComponentEvent
} from '@/types/interactive';
import ExerciseComponent from './ExerciseComponent';
import ExecutableComponent from './ExecutableComponent';
import QuizComponent from './QuizComponent';
import FillBlankComponent from './FillBlankComponent';
import DragDropComponent from './DragDropComponent';
import ChallengeComponent from './ChallengeComponent';

interface InteractiveRendererProps {
  content: string;
  onComponentComplete?: (event: ComponentEvent) => void;
  onComponentProgress?: (event: ComponentEvent) => void;
  onStateChange?: (state: RendererState) => void;
  className?: string;
}

const InteractiveRenderer: React.FC<InteractiveRendererProps> = ({
  content,
  onComponentComplete,
  onComponentProgress,
  onStateChange,
  className = ''
}) => {
  const [rendererState, setRendererState] = useState<RendererState>({
    executionResults: new Map(),
    userAnswers: new Map(),
    progress: new Map(),
    completedExercises: new Set(),
    currentScore: 0,
    totalScore: 0
  });

  // 解析Markdown内容，提取交互式组件
  const parsedContent = useMemo(() => {
    return parseInteractiveMarkdown(content);
  }, [content]);

  // 处理组件完成事件
  const handleComponentComplete = (result: any) => {
    const event: ComponentEvent = {
      type: 'complete',
      componentId: result.componentId,
      data: result,
      timestamp: new Date()
    };

    // 更新状态
    setRendererState(prev => {
      const newState = {
        ...prev,
        completedExercises: new Set([...prev.completedExercises, result.componentId]),
        userAnswers: new Map(prev.userAnswers.set(result.componentId, result)),
        progress: new Map(prev.progress.set(result.componentId, {
          componentId: result.componentId,
          completed: true,
          score: result.score || 0,
          attempts: result.attempts || 1,
          timeSpent: result.timeSpent || 0,
          lastAttempt: new Date()
        }))
      };

      // 计算总分
      const scores = Array.from(newState.progress.values()).map(p => p.score);
      newState.currentScore = scores.reduce((sum, score) => sum + score, 0);
      newState.totalScore = scores.length * 100;

      return newState;
    });

    onComponentComplete?.(event);
  };

  // 处理组件进度事件
  const handleComponentProgress = (componentId: string, progress: number) => {
    const event: ComponentEvent = {
      type: 'progress',
      componentId,
      data: { progress },
      timestamp: new Date()
    };

    onComponentProgress?.(event);
  };

  // 通知状态变化
  useEffect(() => {
    onStateChange?.(rendererState);
  }, [rendererState, onStateChange]);

  // 渲染混合内容（Markdown + 交互式组件）
  const renderMixedContent = (parsedContent: ParsedContent) => {
    // 将Markdown按占位符分割，然后交替渲染Markdown和交互组件
    const parts = parsedContent.markdown.split(/<!-- INTERACTIVE_COMPONENT:([\w-]+) -->/);
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      // 偶数索引是Markdown内容
      if (i % 2 === 0) {
        const markdownContent = parts[i];
        if (markdownContent && markdownContent.trim()) {
          elements.push(
            <div 
              key={`markdown-${i}`}
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: markdownContent }}
            />
          );
        }
      } else {
        // 奇数索引是组件ID
        const componentId = parts[i];
        const component = parsedContent.interactiveElements.get(componentId);
        if (component) {
          elements.push(renderInteractiveComponent(component));
        }
      }
    }
    
    return <>{elements}</>;
  };

  // 渲染交互式组件
  const renderInteractiveComponent = (component: InteractiveComponent) => {
    const commonProps = {
      id: component.id,
      onComplete: handleComponentComplete,
      onProgress: (progress: number) => handleComponentProgress(component.id, progress),
      className: 'mb-6'
    };

    switch (component.type) {
      case 'exercise':
        return (
          <ExerciseComponent
            key={component.id}
            {...commonProps}
            data={component.data as ExerciseData}
          />
        );

      case 'executable':
        return (
          <ExecutableComponent
            key={component.id}
            {...commonProps}
            data={component.data as ExecutableData}
          />
        );

      case 'quiz':
        return (
          <QuizComponent
            key={component.id}
            {...commonProps}
            data={component.data as QuizData}
          />
        );

      case 'fill-blank':
        return (
          <FillBlankComponent
            key={component.id}
            {...commonProps}
            data={component.data as FillBlankData}
          />
        );

      case 'drag-drop':
        return (
          <DragDropComponent
            key={component.id}
            {...commonProps}
            data={component.data as DragDropData}
          />
        );

      case 'challenge':
        return (
          <ChallengeComponent
            key={component.id}
            {...commonProps}
            data={component.data as ChallengeData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`interactive-renderer ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 渲染混合内容 */}
      <div className="space-y-6">
        {renderMixedContent(parsedContent)}
      </div>

      {/* 进度统计 */}
      {parsedContent.interactiveElements.size > 0 && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            学习进度
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {rendererState.completedExercises.size}
              </div>
              <div className="text-gray-600 dark:text-gray-400">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {parsedContent.interactiveElements.size}
              </div>
              <div className="text-gray-600 dark:text-gray-400">总数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {rendererState.totalScore > 0 ? Math.round((rendererState.currentScore / rendererState.totalScore) * 100) : 0}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">完成率</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {Array.from(rendererState.progress.values()).reduce((sum, p) => sum + p.attempts, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">总尝试</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// 解析交互式Markdown内容
function parseInteractiveMarkdown(content: string): ParsedContent {
  const interactiveElements = new Map<string, InteractiveComponent>();
  let markdown = content;
  let componentId = 0;

  // 解析练习块（手动处理嵌套结构，优先级高于独立的可执行代码块）
  const exerciseMatches: Array<{start: number, end: number, content: string}> = [];
  let exerciseSearchStart = 0;
  
  while (true) {
    const startIndex = markdown.indexOf(':::exercise', exerciseSearchStart);
    if (startIndex === -1) break;
    
    const contentStart = markdown.indexOf('\n', startIndex) + 1;
    let depth = 1;
    let currentPos = contentStart;
    let endIndex = -1;
    
    // 手动计算嵌套深度
    while (currentPos < markdown.length && depth > 0) {
      const nextTriple = markdown.indexOf(':::', currentPos);
      if (nextTriple === -1) break;
      
      // 检查是否是行首的 :::
      const lineStart = markdown.lastIndexOf('\n', nextTriple) + 1;
      const beforeTriple = markdown.substring(lineStart, nextTriple).trim();
      
      if (beforeTriple === '') {
        // 这是一个行首的 :::
        const afterTriple = markdown.substring(nextTriple + 3, nextTriple + 20);
        if (afterTriple.match(/^[a-zA-Z-]/)) {
          // 这是开始标记，如 :::hint
          depth++;
        } else {
          // 这是结束标记
          depth--;
          if (depth === 0) {
            endIndex = nextTriple;
            break;
          }
        }
      }
      currentPos = nextTriple + 3;
    }
    
    if (endIndex !== -1) {
      const content = markdown.substring(contentStart, endIndex);
      exerciseMatches.push({
        start: startIndex,
        end: endIndex + 3,
        content: content
      });
    }
    
    exerciseSearchStart = endIndex !== -1 ? endIndex + 3 : startIndex + 11;
  }
  
  // 从后往前替换，避免索引偏移
  for (let i = exerciseMatches.length - 1; i >= 0; i--) {
    const match = exerciseMatches[i];
    const id = `exercise-${++componentId}`;
    const exerciseData = parseExerciseContent(match.content);

    interactiveElements.set(id, {
      type: 'exercise',
      id,
      data: exerciseData,
      onComplete: () => {},
      onProgress: () => {}
    });

    const before = markdown.substring(0, match.start);
    const after = markdown.substring(match.end);
    markdown = before + `<!-- INTERACTIVE_COMPONENT:${id} -->` + after;
  }

  // 解析独立的可执行代码块（支持紧随其后的 hint 与 solution）
  markdown = markdown.replace(/```executable:(\w+)\n([\s\S]*?)```(?:\n+:::hint\n([\s\S]*?):::)?(?:\n+:::solution\n```(?:\w+)?\n([\s\S]*?)```\n:::)?/g, (_m, language, code, hintBlock, solutionBlock) => {
    const id = `executable-${++componentId}`;
    const executableData: ExecutableData = {
      title: `${language.toUpperCase()} 代码演示`,
      description: '这是一个可执行的代码演示',
      starterCode: code.trim(),
      language: language as 'javascript' | 'html' | 'css',
      isDemo: true // 标记为演示代码
    };

    if (hintBlock && String(hintBlock).trim()) {
      executableData.hints = [String(hintBlock).trim()];
    }
    if (solutionBlock && String(solutionBlock).trim()) {
      executableData.solution = String(solutionBlock).trim();
    }

    interactiveElements.set(id, {
      type: 'executable',
      id,
      data: executableData,
      onComplete: () => {},
      onProgress: () => {}
    });

    // 返回一个占位符，保持位置，并同时消费掉 hint/solution
    return `<!-- INTERACTIVE_COMPONENT:${id} -->`;
  });

  // 解析选择题块（严谨匹配，兼容 CRLF/空格，并整体吞掉 explanation）
  markdown = markdown.replace(/:::quiz[ \t]*\r?\n([\s\S]*?)(?:\r?\n:::explanation[ \t]*\r?\n([\s\S]*?)\r?\n:::)?[ \t]*\r?\n:::/g, (_m, quizMain, explanationBody) => {
    const quizContent = explanationBody 
      ? `${quizMain}\n:::explanation\n${explanationBody}\n:::`
      : quizMain;
    const id = `quiz-${++componentId}`;
    const quizData = parseQuizContent(quizContent);

    interactiveElements.set(id, {
      type: 'quiz',
      id,
      data: quizData,
      onComplete: () => {},
      onProgress: () => {}
    });

    return `<!-- INTERACTIVE_COMPONENT:${id} -->`;
  });

  // 解析填空题块
  markdown = markdown.replace(/:::fill-blank\n([\s\S]*?)\n:::/g, (_, fillBlankContent) => {
    const id = `fill-blank-${++componentId}`;
    const fillBlankData = parseFillBlankContent(fillBlankContent);

    interactiveElements.set(id, {
      type: 'fill-blank',
      id,
      data: fillBlankData,
      onComplete: () => {},
      onProgress: () => {}
    });

    return `<!-- INTERACTIVE_COMPONENT:${id} -->`;
  });

  // 解析拖拽题块（手动处理嵌套结构）
  const dragDropMatches: Array<{start: number, end: number, content: string}> = [];
  let searchStart = 0;
  
  while (true) {
    const startIndex = markdown.indexOf(':::drag-drop', searchStart);
    if (startIndex === -1) break;
    
    const contentStart = markdown.indexOf('\n', startIndex) + 1;
    let depth = 1;
    let currentPos = contentStart;
    let endIndex = -1;
    
    // 手动计算嵌套深度
    while (currentPos < markdown.length && depth > 0) {
      const nextTriple = markdown.indexOf(':::', currentPos);
      if (nextTriple === -1) break;
      
      // 检查是否是行首的 :::
      const lineStart = markdown.lastIndexOf('\n', nextTriple) + 1;
      const beforeTriple = markdown.substring(lineStart, nextTriple).trim();
      
      if (beforeTriple === '') {
        // 这是一个行首的 :::
        const afterTriple = markdown.substring(nextTriple + 3, nextTriple + 20);
        if (afterTriple.match(/^[a-zA-Z-]/)) {
          // 这是开始标记，如 :::source
          depth++;
        } else {
          // 这是结束标记
          depth--;
          if (depth === 0) {
            endIndex = nextTriple;
            break;
          }
        }
      }
      currentPos = nextTriple + 3;
    }
    
    if (endIndex !== -1) {
      const content = markdown.substring(contentStart, endIndex);
      dragDropMatches.push({
        start: startIndex,
        end: endIndex + 3,
        content: content
      });
    }
    
    searchStart = endIndex !== -1 ? endIndex + 3 : startIndex + 12;
  }
  
  // 从后往前替换，避免索引偏移
  for (let i = dragDropMatches.length - 1; i >= 0; i--) {
    const match = dragDropMatches[i];
    const id = `drag-drop-${++componentId}`;
    const dragDropData = parseDragDropContent(match.content);

    interactiveElements.set(id, {
      type: 'drag-drop',
      id,
      data: dragDropData,
      onComplete: () => {},
      onProgress: () => {}
    });

    const before = markdown.substring(0, match.start);
    const after = markdown.substring(match.end);
    markdown = before + `<!-- INTERACTIVE_COMPONENT:${id} -->` + after;
  }

  // 解析挑战块（手动处理嵌套结构，包含 :::starter-code 与可选 :::test-cases）
  const challengeMatches: Array<{start: number, end: number, content: string}> = [];
  let challengeSearchStart = 0;
  
  while (true) {
    const startIndex = markdown.indexOf(':::challenge', challengeSearchStart);
    if (startIndex === -1) break;
    
    const contentStart = markdown.indexOf('\n', startIndex) + 1;
    let depth = 1;
    let currentPos = contentStart;
    let endIndex = -1;
    
    // 手动计算嵌套深度
    while (currentPos < markdown.length && depth > 0) {
      const nextTriple = markdown.indexOf(':::', currentPos);
      if (nextTriple === -1) break;
      
      // 检查是否是行首的 :::
      const lineStart = markdown.lastIndexOf('\n', nextTriple) + 1;
      const beforeTriple = markdown.substring(lineStart, nextTriple).trim();
      
      if (beforeTriple === '') {
        // 这是一个行首的 :::
        const afterTriple = markdown.substring(nextTriple + 3, nextTriple + 20);
        if (afterTriple.match(/^[a-zA-Z-]/)) {
          // 这是开始标记，如 :::starter-code
          depth++;
        } else {
          // 这是结束标记
          depth--;
          if (depth === 0) {
            endIndex = nextTriple;
            break;
          }
        }
      }
      currentPos = nextTriple + 3;
    }
    
    if (endIndex !== -1) {
      const content = markdown.substring(contentStart, endIndex);
      challengeMatches.push({
        start: startIndex,
        end: endIndex + 3,
        content: content
      });
    }
    
    challengeSearchStart = endIndex !== -1 ? endIndex + 3 : startIndex + 12;
  }
  
  // 从后往前替换，避免索引偏移
  for (let i = challengeMatches.length - 1; i >= 0; i--) {
    const match = challengeMatches[i];
    const id = `challenge-${++componentId}`;
    const challengeData = parseChallengeContent(match.content);

    interactiveElements.set(id, {
      type: 'challenge',
      id,
      data: challengeData,
      onComplete: () => {},
      onProgress: () => {}
    });

    const before = markdown.substring(0, match.start);
    const after = markdown.substring(match.end);
    markdown = before + `<!-- INTERACTIVE_COMPONENT:${id} -->` + after;
  }

  // 基本Markdown渲染
  markdown = renderBasicMarkdown(markdown);

  return {
    markdown,
    interactiveElements
  };
}

// 解析练习内容
function parseExerciseContent(content: string): ExerciseData {
  // 支持两种标题格式：**标题** 和 <b>标题</b>
  const titleMatch = content.match(/(?:\*\*(.*?)\*\*|<b>(.*?)<\/b>)/);
  const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '编程练习';
  
  // 支持两种描述格式
  const descriptionMatch = content.match(/(?:\*\*.*?\*\*|<b>.*?<\/b>)\n(.*?)(?=```|:::)/s);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';

  const codeMatch = content.match(/```executable:(\w+)\n([\s\S]*?)```/);
  const language = codeMatch ? codeMatch[1] as 'javascript' | 'html' | 'css' : 'javascript';
  const starterCode = codeMatch ? codeMatch[2].trim() : '';

  // 支持多个 :::hint 块
  const hints: string[] | undefined = (() => {
    const matches = content.match(/:::hint\n([\s\S]*?):::/g);
    if (!matches) return undefined;
    return matches.map(m => (m.match(/:::hint\n([\s\S]*?):::/) || [,''])[1].trim());
  })();

  const solutionMatch = content.match(/:::solution\n```(?:\w+)?\n([\s\S]*?)```\n:::/);
  const solution = solutionMatch ? solutionMatch[1].trim() : undefined;

  // 解析测试用例
  const testCasesMatch = content.match(/:::test-cases\n([\s\S]*?):::/);
  const testCases = testCasesMatch ? parseTestCases(testCasesMatch[1].trim()) : undefined;

  return {
    title,
    description,
    starterCode,
    language,
    hints,
    solution,
    testCases
  };
}

// 解析测试用例
function parseTestCases(testCasesContent: string): TestCase[] {
  const lines = testCasesContent.split('\n').filter(line => line.trim());
  const testCases: TestCase[] = [];
  
  lines.forEach((line, index) => {
    line = line.trim();
    
    // 解析格式1：functionName(param1, param2) -> expectedResult
    const matchWithExpected = line.match(/^(.+?)\s*->\s*(.+)$/);
    if (matchWithExpected) {
      const [, functionCall, expectedResult] = matchWithExpected;
      
      // 解析函数调用
      const funcMatch = functionCall.trim().match(/^(\w+)\((.*)\)$/);
      if (funcMatch) {
        const [, functionName, paramsStr] = funcMatch;
        
        // 解析参数
        let params: any[] = [];
        if (paramsStr.trim()) {
          try {
            // 使用 eval 来解析参数（在安全的上下文中）
            params = eval(`[${paramsStr}]`);
          } catch (e) {
            console.warn('Failed to parse test case parameters:', paramsStr);
            params = [];
          }
        }
        
        // 解析期望结果
        let expectedOutput: any;
        try {
          expectedOutput = eval(expectedResult.trim());
        } catch (e) {
          // 如果不能解析为 JavaScript 值，就当作字符串
          expectedOutput = expectedResult.trim().replace(/^["']|["']$/g, '');
        }
        
        testCases.push({
          input: { functionName, params },
          expectedOutput,
          description: `测试用例${index + 1}: ${functionCall.trim()}`
        });
      }
    } else {
      // 解析格式2：functionName(param1, param2) （没有期望结果，将通过标准答案获取）
      const funcMatch = line.match(/^(\w+)\((.*)\)$/);
      if (funcMatch) {
        const [, functionName, paramsStr] = funcMatch;
        
        // 解析参数
        let params: any[] = [];
        if (paramsStr.trim()) {
          try {
            params = eval(`[${paramsStr}]`);
          } catch (e) {
            console.warn('Failed to parse test case parameters:', paramsStr);
            params = [];
          }
        }
        
        testCases.push({
          input: { functionName, params },
          expectedOutput: null, // 标记为需要通过标准答案获取
          description: `测试用例${index + 1}: ${line}`
        });
      }
    }
  });
  
  return testCases;
}

// 解析选择题内容
function parseQuizContent(content: string): QuizData {
  const questionMatch = content.match(/\*\*(.*?)\*\*/);
  const question = questionMatch ? questionMatch[1] : '';

  const optionsRegex = /^- \[([ x])\] (.*)$/gm;
  const options = [];
  let match;
  let optionId = 0;

  while ((match = optionsRegex.exec(content)) !== null) {
    options.push({
      id: `option-${++optionId}`,
      text: match[2],
      isCorrect: match[1] === 'x'
    });
  }

  const explanationMatch = content.match(/:::explanation\n([\s\S]*?):::/);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  const multipleChoice = options.filter(o => o.isCorrect).length > 1;

  return {
    question,
    options,
    explanation,
    multipleChoice
  };
}

// 解析填空题内容
function parseFillBlankContent(content: string): FillBlankData {
  const blankRegex = /\*\*\{([^}]+)\}\*\*/g;
  const blanks = [];
  let match;
  let blankId = 0;

  while ((match = blankRegex.exec(content)) !== null) {
    blanks.push({
      id: `blank-${++blankId}`,
      acceptedAnswers: match[1].split('|').map(s => s.trim()),
      caseSensitive: false
    });
  }

  const explanationMatch = content.match(/:::explanation\n([\s\S]*?):::/);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  return {
    content,
    blanks,
    explanation
  };
}

// 解析拖拽题内容
function parseDragDropContent(content: string): DragDropData {
  const titleMatch = content.match(/\*\*(.*?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '拖拽练习';

  const descriptionMatch = content.match(/\*\*.*?\*\*\s*\n(.*?)(?=:::)/s);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';

  // 解析源项目
  const sourceItems: Array<{id: string; content: string}> = [];
  
  // 查找 :::source 到 ::: 之间的内容
  const sourceStartIndex = content.indexOf(':::source');
  if (sourceStartIndex !== -1) {
    const sourceContentStart = content.indexOf('\n', sourceStartIndex) + 1;
    const sourceEndIndex = content.indexOf('\n:::', sourceContentStart);
    
    if (sourceEndIndex !== -1) {
      const sourceContent = content.substring(sourceContentStart, sourceEndIndex).trim();
      const sourceLines = sourceContent.split('\n');
      
      let itemIndex = 1;
      sourceLines.forEach((line) => {
        const trimmedLine = line.trim();
        // 匹配 "- `<html>` - 根元素" 格式
        const itemMatch = trimmedLine.match(/^-\s*`([^`]+)`\s*-\s*(.*)$/);
        
        if (itemMatch) {
          const item = {
            id: `item-${itemIndex}`,
            content: `${itemMatch[1]} - ${itemMatch[2]}`
          };
          sourceItems.push(item);
          itemIndex++;
        }
      });
    }
  }

  // 查找 :::html-structure 到 ::: 之间的内容
  let template = '';
  const htmlStructureIndex = content.indexOf(':::html-structure');
  if (htmlStructureIndex !== -1) {
    const templateStart = content.indexOf('\n', htmlStructureIndex) + 1;
    const templateEnd = content.indexOf('\n:::', templateStart);
    
    if (templateEnd !== -1) {
      template = content.substring(templateStart, templateEnd).trim();
    }
  }

  // 解析拖拽区域
  const dropZones: Array<{id: string; label: string; acceptedItems: string[]; maxItems: number}> = [];
  const dropZoneRegex = /\{drop-zone:(\w+)\}/g;
  let zoneMatch;
  
  while ((zoneMatch = dropZoneRegex.exec(template)) !== null) {
    const zoneId = zoneMatch[1];
    
    // 根据zone ID匹配对应的HTML标签
    const zoneToTag: {[key: string]: string} = {
      'root': '<html>',
      'head': '<head>',
      'body': '<body>',
      'title': '<title>'
    };
    
    let acceptedItems: string[] = [];
    const expectedTag = zoneToTag[zoneId];
    
    if (expectedTag) {
      // 查找包含对应标签的源项目
      const matchingItem = sourceItems.find(item => item.content.includes(expectedTag));
      if (matchingItem) {
        acceptedItems = [matchingItem.id];
      }
    }
    
    // 如果没有找到匹配的，使用顺序映射作为后备
    if (acceptedItems.length === 0 && sourceItems.length > 0) {
      const fallbackIndex = dropZones.length;
      if (fallbackIndex < sourceItems.length) {
        acceptedItems = [sourceItems[fallbackIndex].id];
      }
    }
    
    const zone = {
      id: zoneId,
      label: zoneId === 'root' ? 'HTML根元素' : 
            zoneId === 'head' ? 'HEAD区域' :
            zoneId === 'body' ? 'BODY区域' :
            zoneId === 'title' ? 'TITLE标签' : zoneId,
      acceptedItems,
      maxItems: 1
    };
    
    dropZones.push(zone);
  }
  
  return {
    title,
    description,
    sourceItems,
    dropZones,
    template
  };
}

// 解析挑战内容
function parseChallengeContent(content: string): ChallengeData {
  const titleMatch = content.match(/\*\*(.*?)\*\*/);
  const title = titleMatch ? titleMatch[1] : '编程挑战';

  const descriptionMatch = content.match(/\*\*.*?\*\*\n(.*?)(?=要求：)/s);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';

  const requirementsMatch = content.match(/要求：\n([\s\S]*?)(?=:::)/);
  const requirements: string[] = [];
  if (requirementsMatch) {
    const reqLines = requirementsMatch[1].trim().split('\n');
    reqLines.forEach(line => {
      const reqMatch = line.match(/^\d+\. (.*)$/);
      if (reqMatch) {
        requirements.push(reqMatch[1]);
      }
    });
  }

  const starterCodeMatch = content.match(/:::starter-code\n([\s\S]*?):::/);
  const starterCode = { html: '', css: '', javascript: '' };
  if (starterCodeMatch) {
    const htmlMatch = starterCodeMatch[1].match(/```html\n([\s\S]*?)```/);
    const cssMatch = starterCodeMatch[1].match(/```css\n([\s\S]*?)```/);
    const jsMatch = starterCodeMatch[1].match(/```javascript\n([\s\S]*?)```/);
    
    if (htmlMatch) starterCode.html = htmlMatch[1].trim();
    if (cssMatch) starterCode.css = cssMatch[1].trim();
    if (jsMatch) starterCode.javascript = jsMatch[1].trim();
  }

  const testCasesMatch = content.match(/:::test-cases\n([\s\S]*?):::/);
  const testCases: Array<{input: any; expectedOutput: any; description: string}> = [];
  if (testCasesMatch) {
    const testLines = testCasesMatch[1].trim().split('\n');
    testLines.forEach(line => {
      const testMatch = line.match(/测试用例\d+：输入 (.*?)，期望输出 (.*?)$/);
      if (testMatch) {
        testCases.push({
          input: testMatch[1],
          expectedOutput: testMatch[2],
          description: line
        });
      }
    });
  }

  return {
    title,
    description,
    requirements,
    starterCode,
    testCases
  };
}

// 基本Markdown渲染
function renderBasicMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  let html = markdown;
  
  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">$1</h1>');
  
  // 粗体和斜体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
  
  // 链接
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
  
  // 代码
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm font-mono">$1</code>');
  
  // 引用
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 italic">$1</blockquote>');
  
  // 列表
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300">$1</li>');
  
  // 处理段落 - 更安全的方式
  const lines = html.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '') {
      continue;
    }
    
    // 如果是HTML标签，直接添加
    if (line.startsWith('<')) {
      processedLines.push(line);
    } else if (line.length > 0) {
      // 普通文本包装成段落
      processedLines.push(`<p class="mb-4 text-gray-700 dark:text-gray-300">${line}</p>`);
    }
  }
  
  return processedLines.join('\n');
}

export default InteractiveRenderer;
