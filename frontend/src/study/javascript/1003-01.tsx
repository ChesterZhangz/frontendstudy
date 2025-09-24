import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const JavaScriptBasicSyntax: React.FC = () => {
  const courseContent = `# JavaScript 基础语法

## 什么是 JavaScript

JavaScript 是一种动态的、解释型的编程语言，主要用于网页开发。它可以让网页变得更加生动和交互性。

\`\`\`executable:javascript
// 这是你的第一个 JavaScript 程序
console.log("Hello, JavaScript!");
console.log("欢迎来到 JavaScript 的世界！");
\`\`\`

> **提示：** JavaScript 代码通常写在 <script> 标签中，或者保存在 .js 文件中。console.log() 用于在控制台输出信息。

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

// const 变量不能重新赋值（下面这行会报错）
// PI = 3.14; // 错误！
\`\`\`

> **提示：** 推荐使用 let 和 const，避免使用 var。const 用于不会改变的值，let 用于会改变的值。

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

// undefined 和 null
let undefinedVar;
let nullVar = null;
console.log("未定义的变量：" + undefinedVar);
console.log("空值：" + nullVar);

// 使用 typeof 检查数据类型
console.log("name 的类型：" + typeof name);
console.log("age 的类型：" + typeof age);
console.log("isStudent 的类型：" + typeof isStudent);
\`\`\`

> **提示：** 使用 typeof 操作符可以检查变量的数据类型。字符串可以用单引号或双引号包围。

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
console.log("取余：" + a + " % " + b + " = " + (a % b));

// 比较运算符
console.log("\\n比较运算：");
console.log("10 == '10'：" + (10 == '10'));   // 相等（会类型转换）
console.log("10 === '10'：" + (10 === '10')); // 严格相等（不会类型转换）
console.log("10 > 5：" + (10 > 5));
console.log("10 < 5：" + (10 < 5));

// 逻辑运算符
let x = true;
let y = false;
console.log("\\n逻辑运算：");
console.log("true && false：" + (x && y)); // 逻辑与
console.log("true || false：" + (x || y)); // 逻辑或
console.log("!true：" + (!x));             // 逻辑非
\`\`\`

> **提示：** 使用 === 进行严格相等比较，避免意外的类型转换。&& 表示"且"，|| 表示"或"，! 表示"非"。

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

// 模板字符串中可以包含表达式
let result = \`\${studentName}的成绩是\${studentGrade >= 60 ? "及格" : "不及格"}\`;
console.log(result);

// 多行字符串
let multiLine = \`这是一个
多行的
字符串示例\`;
console.log(multiLine);
\`\`\`

> **提示：** 模板字符串使用反引号（\`）包围，用 \${} 插入变量或表达式。它比传统的字符串拼接更简洁易读。

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

## 类型转换

JavaScript 会自动进行类型转换，但我们也可以显式地转换数据类型。

\`\`\`executable:javascript
// 自动类型转换（隐式转换）
console.log("自动类型转换：");
console.log("'5' + 3 = " + ('5' + 3));     // 字符串拼接
console.log("'5' - 3 = " + ('5' - 3));     // 数字运算
console.log("'5' * 3 = " + ('5' * 3));     // 数字运算
console.log("true + 1 = " + (true + 1));   // 布尔值转数字

// 显式类型转换
console.log("\\n显式类型转换：");
let str = "123";
let num = Number(str);          // 转换为数字
console.log("Number('123') = " + num + "，类型：" + typeof num);

let age = 25;
let ageStr = String(age);       // 转换为字符串
console.log("String(25) = '" + ageStr + "'，类型：" + typeof ageStr);

let value = 0;
let bool = Boolean(value);      // 转换为布尔值
console.log("Boolean(0) = " + bool);

// 其他转换方法
console.log("\\n其他转换方法：");
console.log("parseInt('123.45') = " + parseInt('123.45'));
console.log("parseFloat('123.45') = " + parseFloat('123.45'));
console.log("(25).toString() = '" + (25).toString() + "'");
\`\`\`

> **提示：** 隐式转换可能导致意外结果，建议使用 Number()、String()、Boolean() 进行显式转换。

:::fill-blank
**填空题：类型转换**

**{Number()}** 函数用于将值转换为数字类型，**{String()}** 函数用于转换为字符串类型，**{Boolean()}** 函数用于转换为布尔类型。**{parseInt()}** 可以将字符串转换为整数。
:::

## 实践练习

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
:::

## 小结

本节课我们学习了：

- JavaScript 的基本概念和作用
- 变量声明：let、const、var 的区别
- 七种基本数据类型：string、number、boolean、undefined、null、symbol、bigint
- 各种运算符：算术、比较、逻辑运算符
- 模板字符串的语法和优势
- 显式和隐式类型转换

下一节课我们将学习 JavaScript 的控制流语句。`;

  return (
    <div className="lesson-content">
      <InteractiveRenderer 
        content={courseContent}
        onComponentComplete={(event) => {
          console.log('组件完成:', event);
        }}
        onComponentProgress={(event) => {
          console.log('组件进度:', event);
        }}
        onStateChange={(state) => {
          console.log('状态变化:', state);
        }}
      />
    </div>
  );
};

export default JavaScriptBasicSyntax;