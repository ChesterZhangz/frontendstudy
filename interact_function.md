# 交互式 Markdown 功能完整指南

## 概述

本系统支持扩展的 Markdown 语法，提供丰富的交互式学习组件，包括代码执行、编程练习、测验、填空题、拖拽题和综合挑战等。

## 🚀 核心功能

### 1. 可执行代码块 (`executable`)

**语法：**
```markdown
```executable:javascript
// 这是一个可执行的代码块
let message = "Hello, World!";
console.log(message);
```

:::hint
使用 `let` 或 `const` 关键字来声明变量
:::

:::solution
```javascript
let name = "张三";
console.log("我的名字是：" + name);
```
:::
```

**功能特点：**
- 支持 JavaScript、HTML、CSS 代码执行
- 实时代码编辑器（Monaco Editor）
- 安全的沙盒执行环境（Web Workers）
- 实时预览和输出显示
- 可选的提示和解决方案
- 不进行评分，纯演示用途

### 2. 编程练习 (`exercise`)

**语法：**
```markdown
:::exercise
**练习1：创建你的第一个变量**

请创建一个名为 `name` 的变量，并赋值为你的姓名，然后输出到控制台。

```executable:javascript
// 在这里编写你的代码
```

:::hint
使用 `let` 或 `const` 关键字来声明变量，使用 `console.log()` 来输出
:::

:::solution
```javascript
let name = "张三";
console.log("我的名字是：" + name);
```
:::

:::test-cases
add(2, 3) -> 5
add(0, 0) -> 0
add(-1, 1) -> 0
add(10, -5) -> 5
:::
:::
```

**功能特点：**
- 完整的编程练习环境
- 智能代码验证系统
- 支持两种验证模式：
  - **函数测试**：基于 `test-cases` 的自动化测试
  - **输出比较**：与 `solution` 代码输出比较
- 提示系统和标准答案
- 尝试历史记录
- 自动评分和反馈
- 进度跟踪

**验证逻辑：**
1. 如果有 `test-cases`：运行函数测试，比较返回值
2. 如果只有 `solution`：比较代码输出结果
3. 如果都没有：基于 `expected-output` 进行智能匹配

### 3. 选择题测验 (`quiz`)

**语法：**
```markdown
:::quiz
**问题：以下哪些是JavaScript中的基本数据类型？**

- [x] string（字符串）
- [x] number（数字）
- [x] boolean（布尔值）
- [ ] array（数组）

:::explanation
JavaScript的基本数据类型包括：string、number、boolean、undefined、null、symbol和bigint。数组（array）是对象类型，不是基本数据类型。
:::
:::
```

**功能特点：**
- 支持单选和多选题
- 即时反馈和解释
- 自动评分系统
- 重新答题功能
- 答案统计和分析

### 4. 填空题 (`fill-blank`)

**语法：**
```markdown
:::fill-blank
**填空题：JavaScript变量声明**

在JavaScript中，我们可以使用 **{let}** 或 **{const}** 关键字来声明变量。
其中 **{const}** 用于声明常量，**{let}** 用于声明可变的变量。

:::explanation
let 和 const 都是ES6引入的块级作用域变量声明方式，比var更加安全。
:::
:::
```

**功能特点：**
- 灵活的填空格式
- 多答案支持（用 | 分隔）
- 实时验证反馈
- 详细的解释说明
- 参考答案显示

### 5. 拖拽题 (`drag-drop`)

**语法：**
```markdown
:::drag-drop
**拖拽题：构建HTML页面结构**

:::source
- `<html>` - 根元素
- `<head>` - 头部信息
- `<body>` - 页面内容
- `<title>` - 页面标题
:::

:::html-structure
<!DOCTYPE html>
{drop-zone:root}
{drop-zone:head}
    {drop-zone:title}
</head>
{drop-zone:body}
    <h1>欢迎来到我的网站</h1>
</body>
</html>
:::
:::
```

**功能特点：**
- HTML5 原生拖拽支持
- 智能拖拽区域映射
- 实时结构预览
- 防重复拖拽机制
- 自动答案验证

### 6. 综合挑战 (`challenge`)

**语法：**
```markdown
:::challenge
**挑战：创建一个问候程序**

创建一个简单的网页，包含一个输入框和按钮，用户输入姓名后点击按钮显示问候信息。

:::requirements
- 创建一个输入框用于输入姓名
- 创建一个按钮触发问候功能
- 点击按钮后显示"你好，[姓名]！欢迎学习JavaScript！"
- 使用适当的CSS样式美化页面
:::

:::starter-code
```html
<!DOCTYPE html>
<html>
<head>
    <title>问候程序</title>
</head>
<body>
    <!-- 在这里添加你的HTML代码 -->
</body>
</html>
```

```css
/* 在这里添加你的CSS样式 */
body {
    font-family: Arial, sans-serif;
    padding: 20px;
}
```

```javascript
// 在这里添加你的JavaScript代码
function greetUser() {
    // 你的代码
}
```
:::

:::solution
```html
<!DOCTYPE html>
<html>
<head>
    <title>问候程序</title>
</head>
<body>
    <input type="text" id="nameInput" placeholder="请输入你的姓名">
    <button onclick="greetUser()">问候</button>
    <div id="greeting"></div>
</body>
</html>
```

```css
body {
    font-family: Arial, sans-serif;
    padding: 20px;
}

input, button {
    padding: 10px;
    margin: 5px;
    font-size: 16px;
}

#greeting {
    margin-top: 20px;
    font-size: 18px;
    color: #2563eb;
}
```

```javascript
function greetUser() {
    const name = document.getElementById('nameInput').value;
    const greeting = document.getElementById('greeting');
    if (name.trim()) {
        greeting.textContent = `你好，${name}！欢迎学习JavaScript！`;
    } else {
        greeting.textContent = '请输入你的姓名';
    }
}
```
:::

:::test-cases
测试用例1：输入"张三"，期望显示"你好，张三！欢迎学习JavaScript！"
测试用例2：输入"李四"，期望显示"你好，李四！欢迎学习JavaScript！"
:::
:::
```

**功能特点：**
- 多语言代码编辑器（HTML、CSS、JavaScript）
- 实时预览功能
- 可隐藏/显示预览面板
- 自动布局调整
- 综合项目测试
- 标准答案展示
- 支持两种验证模式：
  - **测试用例验证**：基于具体测试场景
  - **解决方案比较**：与标准答案输出比较

## 🎯 验证系统

### Exercise 组件验证逻辑
1. **有 test-cases**：函数级测试，比较返回值
2. **有 solution（无 test-cases）**：比较代码输出
3. **有 expected-output**：智能输出匹配
4. **都没有**：只要代码能执行就通过

### Challenge 组件验证逻辑
1. **有 test-cases**：运行测试用例验证
2. **有 solution（无 test-cases）**：与标准答案比较
3. **都没有**：只要代码能执行就通过

## 🎨 UI 特性

### 现代化界面
- 完全使用 Lucide React 图标库
- 支持深色模式
- 响应式布局设计
- 流畅的动画效果

### 交互体验
- 纯图标按钮配 Tooltip
- 智能布局调整
- 实时反馈系统
- 尝试历史记录

### 状态管理
- 动态隐藏空内容区域
- 智能预览高度调整
- 自适应列数布局

## 🔧 技术实现

### 代码执行引擎
- **Web Workers 沙盒**：安全的代码执行环境
- **多语言支持**：JavaScript、HTML、CSS
- **实时输出捕获**：console.log 和错误信息
- **执行时间限制**：防止无限循环

### 验证算法
- **函数测试**：参数注入和返回值比较
- **输出比较**：字符串相似度算法
- **智能匹配**：关键词提取和匹配度计算
- **编辑距离**：Levenshtein 距离算法

### 安全机制
- **代码沙盒**：隔离执行环境
- **XSS 防护**：输入验证和转义
- **资源限制**：内存和时间限制

## 📊 数据结构

### 组件数据接口
```typescript
interface ExerciseData {
  title: string;
  description: string;
  language: string;
  starterCode: string;
  solution?: string;
  hints?: string[];
  testCases?: TestCase[];
  expectedOutput?: string;
}

interface ChallengeData {
  title: string;
  description: string;
  requirements: string[];
  starterCode: {
    html: string;
    css: string;
    javascript: string;
  };
  solution?: {
    html?: string;
    css?: string;
    javascript?: string;
  };
  testCases?: TestCase[];
  hints?: string[];
}
```

## 🚀 使用示例

### 基础编程练习
```markdown
:::exercise
**练习：数组求和**

编写一个函数 `sumArray`，计算数组中所有数字的和。

```executable:javascript
function sumArray(arr) {
    // 你的代码
}
```

:::test-cases
sumArray([1, 2, 3, 4]) -> 10
sumArray([]) -> 0
sumArray([-1, 1, -2, 2]) -> 0
:::
:::
```

### 综合项目挑战
```markdown
:::challenge
**项目：计算器**

创建一个简单的网页计算器，支持基本的四则运算。

:::requirements
- 数字按钮 0-9
- 运算符按钮 +、-、×、÷
- 等号按钮和清除按钮
- 显示屏显示当前数字和结果
:::

:::starter-code
```html
<!DOCTYPE html>
<html>
<head>
    <title>计算器</title>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <!-- 添加按钮 -->
    </div>
</body>
</html>
```
:::
:::
```

## 📈 学习分析

### 进度跟踪
- 完成状态统计
- 得分分布分析
- 尝试次数记录
- 学习时间统计

### 个性化反馈
- 基于表现的提示
- 错误模式识别
- 学习路径推荐
- 成就系统

---

**版本：** v2.0  
**更新时间：** 2024年12月  
**支持的语言：** JavaScript, HTML, CSS  
**兼容性：** 现代浏览器，支持 Web Workers
