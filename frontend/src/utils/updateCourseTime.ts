import { calculateCourseTime } from './courseTimeCalculator';

// 课程内容映射（需要手动导入课程内容）
const courseContents: Record<string, string> = {
  '1001-01': `# HTML 基础入门

## 什么是 HTML

HTML（HyperText Markup Language）是超文本标记语言，是构建网页的基础语言。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个网页</title>
</head>
<body>
    <h1>欢迎来到 HTML 的世界！</h1>
    <p>这是我的第一个 HTML 页面。</p>
</body>
</html>
\`\`\`

:::fill-blank
**填空题：HTML基础**

HTML 的全称是 **{HyperText Markup Language}**，它使用 **{标签}** 来标记内容。
:::

:::quiz
**问题：HTML文档结构**

HTML文档的基本结构包括哪些部分？

- [x] DOCTYPE声明
- [x] html标签
- [x] head标签
- [x] body标签
- [ ] script标签

:::explanation
HTML文档的基本结构包括DOCTYPE声明、html标签、head标签和body标签。script标签是可选的。
:::
:::

:::exercise
**练习：创建个人介绍页面**

创建一个包含标题、段落和列表的个人介绍页面。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>个人介绍</title>
</head>
<body>
    <!-- 在这里添加你的内容 -->
</body>
</html>
\`\`\`

:::hint
1. 使用 h1 标签作为页面标题
2. 使用 p 标签添加自我介绍
3. 使用 ul 和 li 标签创建兴趣爱好列表
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>个人介绍</title>
</head>
<body>
    <h1>关于我</h1>
    <p>大家好，我是张三，一名正在学习前端开发的学生。</p>
    <ul>
        <li>编程</li>
        <li>阅读</li>
        <li>音乐</li>
    </ul>
</body>
</html>
\`\`\`
:::
:::`,

  '3001-01': `# JavaScript 基础语法

## 什么是 JavaScript

JavaScript 是一种动态的、解释型的编程语言，主要用于网页开发。它可以让网页变得更加生动和交互性。

\`\`\`executable:javascript
// 这是你的第一个 JavaScript 程序
console.log("Hello, JavaScript!");
console.log("欢迎来到 JavaScript 的世界！");
\`\`\`

## 变量声明

在 JavaScript 中，我们可以使用三种关键字来声明变量：var、let 和 const。

\`\`\`executable:javascript
// 使用 let 声明可变的变量
let userName = "张三";
console.log("用户名：" + userName);

// 使用 const 声明常量（不能重新赋值）
const PI = 3.14159;
console.log("圆周率：" + PI);

// 可以修改 let 变量的值
userName = "李四";
console.log("新用户名：" + userName);
\`\`\`

:::fill-blank
**填空题：变量声明**

在 JavaScript 中，**{let}** 关键字用于声明可变的变量，**{const}** 关键字用于声明常量。**{var}** 是旧的变量声明方式，现在不推荐使用。
:::

## 数据类型

JavaScript 有七种基本数据类型：string（字符串）、number（数字）、boolean（布尔值）、undefined、null、symbol 和 bigint。

\`\`\`executable:javascript
// 字符串类型
let name = "小明";
let message = '你好，世界！';
console.log("姓名：" + name);
console.log("消息：" + message);

// 数字类型
let age = 25;
let price = 99.99;
console.log("年龄：" + age);
console.log("价格：" + price);

// 布尔类型
let isStudent = true;
let isWorking = false;
console.log("是学生：" + isStudent);
console.log("在工作：" + isWorking);

// 使用 typeof 检查数据类型
console.log("name 的类型：" + typeof name);
console.log("age 的类型：" + typeof age);
console.log("isStudent 的类型：" + typeof isStudent);
\`\`\`

:::quiz
**问题：JavaScript 数据类型**

以下哪些是 JavaScript 的基本数据类型？

- [x] string（字符串）
- [x] number（数字）
- [x] boolean（布尔值）
- [ ] array（数组）
- [x] undefined
- [ ] object（对象）
- [x] null

:::explanation
JavaScript 的基本数据类型包括：string、number、boolean、undefined、null、symbol 和 bigint。数组和对象都属于复合数据类型，不是基本数据类型。
:::
:::

## 运算符

JavaScript 提供了多种运算符来进行计算和比较操作。

\`\`\`executable:javascript
// 算术运算符
let a = 10;
let b = 3;
console.log("加法：" + a + " + " + b + " = " + (a + b));
console.log("减法：" + a + " - " + b + " = " + (a - b));
console.log("乘法：" + a + " × " + b + " = " + (a * b));
console.log("除法：" + a + " ÷ " + b + " = " + (a / b));

// 比较运算符
console.log("10 == '10'：" + (10 == '10'));
console.log("10 === '10'：" + (10 === '10'));

// 逻辑运算符
let x = true;
let y = false;
console.log("true && false：" + (x && y));
console.log("true || false：" + (x || y));
console.log("!true：" + (!x));
\`\`\`

:::fill-blank
**填空题：运算符**

**{===}** 运算符进行严格相等比较，不会进行类型转换。**{&&}** 是逻辑与运算符，**{||}** 是逻辑或运算符，**{!}** 是逻辑非运算符。
:::

## 模板字符串

模板字符串使用反引号（\`）包围，可以方便地插入变量和表达式。

\`\`\`executable:javascript
let studentName = "王小明";
let studentAge = 20;
let studentGrade = 85;

// 传统的字符串拼接
let message1 = "学生姓名：" + studentName + "，年龄：" + studentAge + "岁，成绩：" + studentGrade + "分";
console.log("传统方式：" + message1);

// 使用模板字符串
let message2 = \`学生姓名：\${studentName}，年龄：\${studentAge}岁，成绩：\${studentGrade}分\`;
console.log("模板字符串：" + message2);
\`\`\`

:::quiz
**问题：模板字符串**

关于 JavaScript 模板字符串，以下说法正确的是？

- [x] 使用反引号（\`）包围字符串
- [x] 用 \${} 插入变量或表达式
- [x] 支持多行字符串
- [ ] 使用单引号（'）包围字符串
- [x] 比传统字符串拼接更简洁

:::explanation
模板字符串是 ES6 引入的新特性，使用反引号包围，用 \${} 语法插入变量或表达式，支持多行字符串，使代码更加简洁易读。
:::
:::

:::exercise
**练习：创建个人信息卡片**

使用变量、模板字符串和类型转换，创建一个显示个人信息的程序。

\`\`\`executable:javascript
// 请完成以下代码
let name = ""; // 设置你的姓名
let age = 0;   // 设置你的年龄
let isStudent = true; // 设置是否为学生

// 使用模板字符串创建个人信息
let info = \`\`; // 在这里使用模板字符串

// 输出个人信息
console.log(info);

// 计算出生年份（假设当前是2024年）
let birthYear = 0; // 计算出生年份

console.log(\`推测出生年份：\${birthYear}\`);
\`\`\`

:::hint
1. 为 name、age、isStudent 变量赋值
2. 使用模板字符串 \`\${}\` 语法创建信息字符串
3. 用当前年份减去年龄计算出生年份
4. 使用 console.log() 输出结果
:::

:::solution
\`\`\`javascript
// 设置个人信息
let name = "张三";
let age = 22;
let isStudent = true;

// 使用模板字符串创建个人信息
let info = \`姓名：\${name}，年龄：\${age}岁，学生身份：\${isStudent ? "是" : "否"}\`;

// 输出个人信息
console.log(info);

// 计算出生年份（假设当前是2024年）
let birthYear = 2024 - age;

console.log(\`推测出生年份：\${birthYear}\`);
\`\`\`
:::
:::`
};

/**
 * 计算并返回所有课程的预计时间
 */
export function calculateAllCourseTimes() {
  const results: Record<string, { estimatedTime: number; analysis: any }> = {};
  
  Object.entries(courseContents).forEach(([courseId, content]) => {
    const estimatedTime = calculateCourseTime(content);
    const analysis = {
      textLength: content.replace(/```[\s\S]*?```/g, '').replace(/:::[^:]*[\s\S]*?:::/g, '').length,
      executableCount: (content.match(/```executable:/g) || []).length,
      exerciseCount: (content.match(/:::exercise/g) || []).length,
      quizCount: (content.match(/:::quiz/g) || []).length,
      fillBlankCount: (content.match(/:::fill-blank/g) || []).length,
    };
    
    results[courseId] = { estimatedTime, analysis };
  });
  
  return results;
}

// 运行计算
if (typeof window === 'undefined') {
  // 在Node.js环境中运行
  const results = calculateAllCourseTimes();
  console.log('课程时间计算结果：');
  Object.entries(results).forEach(([courseId, data]) => {
    console.log(`${courseId}: ${data.estimatedTime}分钟`, data.analysis);
  });
}
