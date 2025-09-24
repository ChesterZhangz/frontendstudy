import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { CourseContent } from '../models/CourseContent';

// 完整的20天课程数据
const sampleCourses = [
  {
    day: 1,
    title: 'JavaScript 基础语法',
    description: '学习 JavaScript 的基本语法，包括变量、数据类型和运算符',
    difficulty: 'beginner',
    estimatedTime: 30,
    topics: ['变量声明', '数据类型', '运算符', '类型转换'],
    content: {
      theory: `
# JavaScript 基础语法

JavaScript 是一种动态类型的编程语言，具有以下特点：

## 1. 变量声明

JavaScript 提供了三种声明变量的方式：

- **var**: 函数作用域，存在变量提升
- **let**: 块作用域，不存在变量提升
- **const**: 块作用域，常量，不可重新赋值

\`\`\`javascript
var name = "张三";        // 函数作用域
let age = 25;            // 块作用域
const PI = 3.14159;      // 常量
\`\`\`

## 2. 数据类型

JavaScript 有七种基本数据类型：

- **原始类型**: number, string, boolean, null, undefined, symbol, bigint
- **对象类型**: object

\`\`\`javascript
let num = 42;                    // number
let str = "Hello World";         // string
let bool = true;                 // boolean
let empty = null;                // null
let notDefined = undefined;     // undefined
\`\`\`

## 3. 运算符

JavaScript 支持各种运算符：

- **算术运算符**: +, -, *, /, %, **
- **比较运算符**: ==, ===, !=, !==, <, >, <=, >=
- **逻辑运算符**: &&, ||, !
- **赋值运算符**: =, +=, -=, *=, /=

\`\`\`javascript
let a = 10;
let b = 3;
console.log(a + b);    // 13
console.log(a - b);    // 7
console.log(a * b);    // 30
console.log(a / b);    // 3.333...
console.log(a % b);    // 1
\`\`\`

## 4. 类型转换

JavaScript 会自动进行类型转换：

\`\`\`javascript
let num = "123";
let converted = Number(num);     // 显式转换为数字
let autoConverted = +num;        // 隐式转换为数字
console.log(typeof converted);  // "number"
\`\`\`
      `,
      examples: [
        {
          title: '变量声明示例',
          code: `// 使用 let 声明变量
let userName = "张三";
let userAge = 25;
let isStudent = true;

console.log("用户名:", userName);
console.log("年龄:", userAge);
console.log("是否为学生:", isStudent);`,
          explanation: '这个示例展示了如何使用 let 声明不同类型的变量，并输出它们的值。'
        },
        {
          title: '数据类型检查',
          code: `// 检查数据类型
let value = 42;
console.log("值的类型:", typeof value);
console.log("是否为数字:", typeof value === "number");

// 类型转换
let stringNumber = "123";
let numberValue = Number(stringNumber);
console.log("转换后的值:", numberValue);
console.log("转换后的类型:", typeof numberValue);`,
          explanation: '这个示例展示了如何检查数据类型并进行类型转换。'
        }
      ],
      exercises: [
        {
          id: 'ex1',
          title: '变量声明练习',
          description: '声明三个变量：姓名、年龄和职业，并输出它们。',
          starterCode: `// 在这里声明变量
// let name = "你的姓名";
// let age = 你的年龄;
// let job = "你的职业";

// 输出变量
console.log("姓名:", name);
console.log("年龄:", age);
console.log("职业:", job);`,
          solution: `let name = "张三";
let age = 25;
let job = "前端开发工程师";

console.log("姓名:", name);
console.log("年龄:", age);
console.log("职业:", job);`,
          testCases: [
            {
              input: null,
              expectedOutput: "姓名: 张三\n年龄: 25\n职业: 前端开发工程师",
              description: '输出三个变量的值'
            }
          ],
          hints: [
            '使用 let 关键字声明变量',
            '变量名要具有描述性',
            '字符串要用引号包围'
          ]
        },
        {
          id: 'ex2',
          title: '数据类型练习',
          description: '创建一个包含不同数据类型的对象，并检查每个属性的类型。',
          starterCode: `// 创建一个包含不同数据类型的对象
let person = {
  // 在这里添加属性
};

// 检查每个属性的类型
// console.log("name 的类型:", typeof person.name);
// console.log("age 的类型:", typeof person.age);
// console.log("isStudent 的类型:", typeof person.isStudent);`,
          solution: `let person = {
  name: "李四",
  age: 30,
  isStudent: false,
  hobbies: ["读书", "游泳"],
  address: null
};

console.log("name 的类型:", typeof person.name);
console.log("age 的类型:", typeof person.age);
console.log("isStudent 的类型:", typeof person.isStudent);
console.log("hobbies 的类型:", typeof person.hobbies);
console.log("address 的类型:", typeof person.address);`,
          testCases: [
            {
              input: null,
              expectedOutput: "name 的类型: string\nage 的类型: number\nisStudent 的类型: boolean\nhobbies 的类型: object\naddress 的类型: object",
              description: '输出每个属性的数据类型'
            }
          ],
          hints: [
            '对象可以包含不同类型的属性',
            '数组在 JavaScript 中也是对象类型',
            'null 的类型是 object'
          ]
        }
      ]
    },
    prerequisites: [],
    isActive: true
  },
  {
    day: 2,
    title: '控制流程',
    description: '学习条件语句和循环语句，掌握程序流程控制',
    difficulty: 'beginner',
    estimatedTime: 45,
    topics: ['if语句', 'switch语句', 'for循环', 'while循环', 'do-while循环'],
    content: {
      theory: `
# 控制流程

控制流程是编程中的核心概念，它决定了程序执行的顺序和条件。

## 1. 条件语句

### if 语句

\`\`\`javascript
let age = 18;
if (age >= 18) {
  console.log("成年人");
} else {
  console.log("未成年人");
}
\`\`\`

### if-else if-else 语句

\`\`\`javascript
let score = 85;
if (score >= 90) {
  console.log("优秀");
} else if (score >= 80) {
  console.log("良好");
} else if (score >= 70) {
  console.log("中等");
} else {
  console.log("需要努力");
}
\`\`\`

### switch 语句

\`\`\`javascript
let day = "Monday";
switch (day) {
  case "Monday":
    console.log("星期一");
    break;
  case "Tuesday":
    console.log("星期二");
    break;
  default:
    console.log("其他");
}
\`\`\`

## 2. 循环语句

### for 循环

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("第", i + 1, "次循环");
}
\`\`\`

### while 循环

\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log("计数:", count);
  count++;
}
\`\`\`

### do-while 循环

\`\`\`javascript
let num = 0;
do {
  console.log("数字:", num);
  num++;
} while (num < 3);
\`\`\`

## 3. 循环控制

### break 和 continue

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 3) {
    continue; // 跳过本次循环
  }
  if (i === 7) {
    break; // 跳出循环
  }
  console.log(i);
}
\`\`\`
      `,
      examples: [
        {
          title: '条件语句示例',
          code: `// 判断成绩等级
let score = 85;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "D";
}

console.log("成绩:", score, "等级:", grade);`,
          explanation: '这个示例展示了如何使用 if-else if-else 语句来判断成绩等级。'
        },
        {
          title: '循环语句示例',
          code: `// 计算1到10的和
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
}
console.log("1到10的和:", sum);

// 使用while循环计算阶乘
let n = 5;
let factorial = 1;
let i = 1;
while (i <= n) {
  factorial *= i;
  i++;
}
console.log(n + "的阶乘:", factorial);`,
          explanation: '这个示例展示了如何使用 for 循环和 while 循环进行数学计算。'
        }
      ],
      exercises: [
        {
          id: 'ex1',
          title: '成绩判断',
          description: '根据分数判断等级：90分以上为A，80-89分为B，70-79分为C，60-69分为D，60分以下为F。',
          starterCode: `let score = 85;
let grade;

// 在这里添加条件判断
// if (score >= 90) {
//   grade = "A";
// } else if (score >= 80) {
//   grade = "B";
// } else if (score >= 70) {
//   grade = "C";
// } else if (score >= 60) {
//   grade = "D";
// } else {
//   grade = "F";
// }

console.log("分数:", score, "等级:", grade);`,
          solution: `let score = 85;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else if (score >= 60) {
  grade = "D";
} else {
  grade = "F";
}

console.log("分数:", score, "等级:", grade);`,
          testCases: [
            {
              input: null,
              expectedOutput: "分数: 85 等级: B",
              description: '输出分数和对应的等级'
            }
          ],
          hints: [
            '使用 if-else if-else 语句',
            '注意条件的顺序，从高到低',
            '使用 >= 进行比较'
          ]
        }
      ]
    },
    prerequisites: ['JavaScript 基础语法'],
    isActive: true
  }
];

// 插入示例数据
const seedData = async () => {
  try {
    await connectDatabase();
    
    // 清空现有数据
    await CourseContent.deleteMany({});
    console.log('✅ 清空现有课程数据');
    
    // 插入示例数据
    await CourseContent.insertMany(sampleCourses);
    console.log('✅ 插入示例课程数据成功');
    
    console.log('🎉 数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据初始化失败:', error);
    process.exit(1);
  }
};

// 运行数据初始化
seedData();
