import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const HTMLTablesAndForms: React.FC = () => {
  const courseContent = `<h1>HTML 表格和表单</h1>

<h2>表格标签（table）</h2>

<p>表格用于显示结构化数据，HTML 使用 <code>&lt;table&gt;</code> 标签创建表格。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>表格示例</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h2>学生成绩表</h2>
    <table>
        <thead>
            <tr>
                <th>姓名</th>
                <th>数学</th>
                <th>英语</th>
                <th>总分</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>张三</td>
                <td>95</td>
                <td>88</td>
                <td>183</td>
            </tr>
            <tr>
                <td>李四</td>
                <td>87</td>
                <td>92</td>
                <td>179</td>
            </tr>
            <tr>
                <td>王五</td>
                <td>91</td>
                <td>85</td>
                <td>176</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
\`\`\`

<div class="hint-box">
表格由 <code>&lt;table&gt;</code> 标签包围，<code>&lt;thead&gt;</code> 定义表头，<code>&lt;tbody&gt;</code> 定义表格主体，<code>&lt;tr&gt;</code> 定义行，<code>&lt;th&gt;</code> 定义表头单元格，<code>&lt;td&gt;</code> 定义数据单元格。
</div>

<h3>表格的基本结构</h3>

:::fill-blank
<h2>填空题：表格结构</h2>

表格使用 **{table}** 标签创建，**{tr}** 标签定义行，**{th}** 标签定义表头单元格，**{td}** 标签定义数据单元格。
:::

:::quiz
<h2>问题：关于 HTML 表格，以下说法正确的是？</h2>

- [x] thead 用于定义表格头部
- [x] tbody 用于定义表格主体
- [x] th 标签用于表头单元格
- [ ] 表格必须包含 thead 和 tbody
:::

<h2>表单标签（form）</h2>

<p>表单用于收集用户输入，HTML 使用 <code>&lt;form&gt;</code> 标签创建表单。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>表单示例</title>
    <style>
        form {
            max-width: 400px;
            margin: 20px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select, textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h2>用户注册表单</h2>
    <form>
        <label for="username">用户名：</label>
        <input type="text" id="username" name="username" required>
        
        <label for="email">邮箱：</label>
        <input type="email" id="email" name="email" required>
        
        <label for="password">密码：</label>
        <input type="password" id="password" name="password" required>
        
        <label for="gender">性别：</label>
        <select id="gender" name="gender">
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
        </select>
        
        <label for="bio">个人简介：</label>
        <textarea id="bio" name="bio" rows="4" placeholder="请输入个人简介..."></textarea>
        
        <button type="submit">注册</button>
        <button type="reset">重置</button>
    </form>
</body>
</html>
\`\`\`

<div class="hint-box">
表单包含各种输入控件：<code>&lt;input&gt;</code> 用于文本、邮箱、密码等输入，<code>&lt;select&gt;</code> 用于下拉选择，<code>&lt;textarea&gt;</code> 用于多行文本输入。<code>required</code> 属性表示必填字段。
</div>

<h3>常用输入类型</h3>

:::fill-blank
<h2>填空题：输入类型</h2>

**{text}** 类型用于普通文本输入，**{email}** 类型用于邮箱输入，**{password}** 类型用于密码输入，**{submit}** 类型用于提交按钮。
:::

:::quiz
<h2>问题：关于 HTML 表单元素，以下说法正确的是？</h2>

- [x] input 标签可以有多种类型
- [x] select 标签用于下拉选择
- [x] textarea 用于多行文本输入
- [ ] 所有输入元素都必须有 name 属性
:::

<h2>实践练习</h2>

:::exercise
<b>练习：创建完整的联系表单</b>

创建一个包含各种输入类型的联系表单。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>联系我们</title>
    <style>
        form {
            max-width: 500px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select, textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <!-- 创建一个完整的联系表单 -->
    <!-- 要求：包含姓名、邮箱、电话、主题、消息等字段 -->
</body>
</html>
\`\`\`

:::hint
1. 包含文本输入、邮箱输入字段<br>
2. 添加下拉选择框选择主题<br>
3. 添加多行文本区域输入消息<br>
4. 包含提交和重置按钮<br>
5. 为表单添加适当的样式
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>联系我们</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h2 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #34495e;
        }
        input, select, textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 2px solid #e1e8ed;
            border-radius: 5px;
            box-sizing: border-box;
            font-size: 16px;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #3498db;
            outline: none;
        }
        button {
            background-color: #3498db;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        }
        button:hover {
            background-color: #2980b9;
        }
        button[type="reset"] {
            background-color: #95a5a6;
        }
        button[type="reset"]:hover {
            background-color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>联系我们</h2>
        <form>
            <label for="name">姓名 *</label>
            <input type="text" id="name" name="name" required placeholder="请输入您的姓名">
            
            <label for="email">邮箱 *</label>
            <input type="email" id="email" name="email" required placeholder="请输入您的邮箱地址">
            
            <label for="phone">电话</label>
            <input type="tel" id="phone" name="phone" placeholder="请输入您的电话号码">
            
            <label for="subject">主题</label>
            <select id="subject" name="subject">
                <option value="">请选择主题</option>
                <option value="general">一般咨询</option>
                <option value="support">技术支持</option>
                <option value="business">商务合作</option>
                <option value="complaint">投诉建议</option>
            </select>
            
            <label for="message">消息内容 *</label>
            <textarea id="message" name="message" rows="6" required placeholder="请详细描述您的问题或需求..."></textarea>
            
            <button type="submit">发送消息</button>
            <button type="reset">重置表单</button>
        </form>
    </div>
</body>
</html>
\`\`\`
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>表格标签（table）的结构和用法</li>
<li>表格的语义化标签（thead、tbody、th、td）</li>
<li>表单标签（form）和各种输入控件</li>
<li>不同类型的输入元素（text、email、password、select、textarea等）</li>
<li>表单验证和用户体验优化</li>
</ul>

<p>恭喜你完成了 HTML 基础课程！接下来我们将学习 CSS 样式设计。</p>`;

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

export default HTMLTablesAndForms;