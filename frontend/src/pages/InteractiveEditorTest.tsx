import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InteractiveMarkdownEditor from '@/components/interactive/InteractiveMarkdownEditor';
import { ComponentEvent, RendererState } from '@/types/interactive';
// CSS样式已在index.css中导入

const InteractiveEditorTest: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rendererState, setRendererState] = useState<RendererState | null>(null);
  const [events, setEvents] = useState<ComponentEvent[]>([]);

  // 示例内容 - JavaScript函数编程练习
  const sampleContent = `# JavaScript函数编程练习

欢迎来到JavaScript函数编程练习！这里的题目会自动测试你编写的函数是否正确。

## 第一题：数学运算函数

让我们从一个简单的数学函数开始：

` + '```executable:javascript' + `
// 这是一个示例函数
function add(a, b) {
    return a + b;
}

// 测试函数
console.log("3 + 5 =", add(3, 5));
console.log("10 + 20 =", add(10, 20));
` + '```' + `

现在轮到你了：

:::exercise
**练习1：编写乘法函数**
请编写一个名为 \`multiply\` 的函数，接收两个参数并返回它们的乘积。

` + '```executable:javascript' + `
// 在这里编写你的 multiply 函数
function multiply(a, b) {
    // 你的代码
}
` + '```' + `

:::hint
乘法运算符是 \`*\`，函数需要使用 \`return\` 语句返回结果
:::

:::solution
` + '```javascript' + `
function multiply(a, b) {
    return a * b;
}
` + '```' + `
:::

:::test-cases
multiply(3, 4) -> 12
multiply(7, 8) -> 56
multiply(0, 5) -> 0
multiply(-2, 3) -> -6
:::
:::

## 第二题：字符串处理函数

:::exercise
**练习2：编写问候函数**
编写一个名为 \`greet\` 的函数，接收一个姓名参数，返回格式为"你好，[姓名]！"的问候语。

` + '```executable:javascript' + `
// 在这里编写你的 greet 函数
function greet(name) {
    // 你的代码
}
` + '```' + `

:::hint
使用字符串拼接或模板字符串来组合文本和变量
:::

:::solution
` + '```javascript' + `
function greet(name) {
    return "你好，" + name + "！";
}
` + '```' + `
:::

:::test-cases
greet("张三") -> "你好，张三！"
greet("李四") -> "你好，李四！"
greet("王五") -> "你好，王五！"
:::
:::

## 第三题：数组操作函数

:::exercise
**练习3：计算数组总和**
编写一个名为 \`sumArray\` 的函数，接收一个数字数组，返回所有数字的总和。

` + '```executable:javascript' + `
// 在这里编写你的 sumArray 函数
function sumArray(numbers) {
    // 你的代码
}
` + '```' + `

:::hint
使用 for 循环遍历数组，或者使用 reduce 方法。记得处理空数组的情况！
:::

:::solution
` + '```javascript' + `
function sumArray(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum;
}
` + '```' + `
:::

:::test-cases
sumArray([1, 2, 3, 4, 5]) -> 15
sumArray([10, 20, 30]) -> 60
sumArray([]) -> 0
sumArray([7]) -> 7
:::
:::

## 第四题：条件判断函数

:::exercise
**练习4：判断奇偶数**
编写一个名为 \`isEven\` 的函数，接收一个数字，如果是偶数返回 true，奇数返回 false。

` + '```executable:javascript' + `
// 在这里编写你的 isEven 函数
function isEven(number) {
    // 你的代码
}
` + '```' + `

:::hint
使用取模运算符 \`%\` 来判断一个数除以2的余数
:::

:::solution
` + '```javascript' + `
function isEven(number) {
    return number % 2 === 0;
}
` + '```' + `
:::

:::test-cases
isEven(4) -> true
isEven(7) -> false
isEven(0) -> true
isEven(13) -> false
isEven(2) -> true
:::
:::

## 第五题：综合练习

:::exercise
**练习5：找出数组中的最大值**
编写一个名为 \`findMax\` 的函数，接收一个数字数组，返回数组中的最大值。如果数组为空，返回 null。

` + '```executable:javascript' + `
// 在这里编写你的 findMax 函数
function findMax(numbers) {
    // 你的代码
}
` + '```' + `

:::hint
可以使用 Math.max() 函数配合扩展运算符，或者用循环遍历比较。记得处理空数组！
:::

:::solution
` + '```javascript' + `
function findMax(numbers) {
    if (numbers.length === 0) {
        return null;
    }
    
    let max = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }
    return max;
}
` + '```' + `
:::

:::test-cases
findMax([1, 5, 3, 9, 2]) -> 9
findMax([100, 50, 200, 75]) -> 200
findMax([42]) -> 42
findMax([]) -> null
findMax([-1, -5, -2]) -> -1
:::
:::

## 总结

恭喜你完成了JavaScript函数编程练习！你已经掌握了：

- ✅ 函数的定义和调用
- ✅ 参数传递和返回值
- ✅ 数学运算和字符串处理
- ✅ 数组操作和循环
- ✅ 条件判断和逻辑运算

这些都是编程的基础技能，继续练习会让你更加熟练！`;

  const handleContentChange = (content: string) => {
    console.log('Content changed:', content.length, 'characters');
  };

  const handleSave = (content: string) => {
    console.log('Saving content:', content.length, 'characters');
    // 这里可以添加保存到服务器的逻辑
    alert('内容已保存！');
  };

  const handleComponentComplete = (event: ComponentEvent) => {
    console.log('Component completed:', event);
    setEvents(prev => [event, ...prev.slice(0, 9)]); // 保留最近10个事件
  };

  const handleComponentProgress = (event: ComponentEvent) => {
    console.log('Component progress:', event);
  };

  const handleRendererStateChange = (state: RendererState) => {
    setRendererState(state);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 交互式Markdown编辑器
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            体验全新的交互式课程编辑器，支持代码执行、选择题、填空题、拖拽题和编程挑战！
          </p>
        </motion.div>

        {/* 统计信息 */}
        {rendererState && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {rendererState.completedExercises.size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">已完成练习</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {rendererState.totalScore > 0 ? Math.round((rendererState.currentScore / rendererState.totalScore) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">完成率</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Array.from(rendererState.progress.values()).reduce((sum, p) => sum + p.attempts, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">总尝试次数</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {events.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">事件记录</div>
            </div>
          </motion.div>
        )}

        {/* 编辑器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <InteractiveMarkdownEditor
            initialContent={sampleContent}
            height={isFullscreen ? '100vh' : 800}
            fullscreen={isFullscreen}
            onFullscreenToggle={setIsFullscreen}
            onContentChange={handleContentChange}
            onSave={handleSave}
            onComponentComplete={handleComponentComplete}
            onComponentProgress={handleComponentProgress}
            onRendererStateChange={handleRendererStateChange}
            className="shadow-lg"
          />
        </motion.div>

        {/* 事件日志 */}
        {events.length > 0 && (
          <motion.div
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📊 最近活动
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'complete' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.type === 'complete' ? '完成' : '进度'}: {event.componentId}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {event.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {event.data.score !== undefined && (
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {event.data.score}/100
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 功能说明 */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✨ 编辑器功能特色
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">可执行代码块</div>
                <div className="text-gray-600 dark:text-gray-400">支持JavaScript、HTML、CSS实时执行</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">交互式练习</div>
                <div className="text-gray-600 dark:text-gray-400">带提示和解决方案的编程练习</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">选择题系统</div>
                <div className="text-gray-600 dark:text-gray-400">支持单选和多选题，带解释说明</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">填空题</div>
                <div className="text-gray-600 dark:text-gray-400">智能答案匹配，支持多个正确答案</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">拖拽题</div>
                <div className="text-gray-600 dark:text-gray-400">直观的拖拽操作，适合结构化学习</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">编程挑战</div>
                <div className="text-gray-600 dark:text-gray-400">完整项目挑战，测试用例验证</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveEditorTest;
