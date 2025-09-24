import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const CSSIntroduction: React.FC = () => {
  const courseContent = `<h1>CSS 介绍</h1>

<h2>什么是 CSS</h2>

<p>CSS（Cascading Style Sheets，层叠样式表）是用来描述 HTML 文档样式的语言。它控制网页的外观和布局。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>CSS 介绍</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            margin: 20px;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        p {
            color: #34495e;
            line-height: 1.6;
            font-size: 16px;
        }
        .highlight {
            background-color: #f39c12;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>欢迎学习 CSS</h1>
    <p>这是一个使用了 CSS 样式的网页。</p>
    <p>CSS 让网页变得<span class="highlight">更加美观</span>和易读。</p>
    <p>试试修改上面的 CSS 代码，看看效果如何变化！</p>
</body>
</html>
\`\`\`

<div class="hint-box">
CSS 通过选择器选中 HTML 元素，然后应用样式规则。上面的例子展示了如何改变文字颜色、背景色、字体等。
</div>

<h2>CSS 的三种使用方式</h2>

<p>CSS 可以通过三种方式添加到 HTML 中：内联样式、内部样式表和外部样式表。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>CSS 使用方式</title>
    <!-- 内部样式表 -->
    <style>
        .internal-style {
            background-color: #e74c3c;
            color: white;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .external-example {
            background-color: #27ae60;
            color: white;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h2>CSS 的三种使用方式</h2>
    
    <!-- 内联样式 -->
    <div style="background-color: #3498db; color: white; padding: 10px; margin: 10px 0; border-radius: 5px;">
        这是内联样式：直接写在 HTML 标签的 style 属性中
    </div>
    
    <!-- 内部样式表 -->
    <div class="internal-style">
        这是内部样式表：写在 &lt;head&gt; 标签中的 &lt;style&gt; 标签内
    </div>
    
    <!-- 外部样式表示例 -->
    <div class="external-example">
        这是外部样式表的效果：通常写在单独的 .css 文件中
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
内联样式优先级最高，但不推荐大量使用。内部样式表适合单页面，外部样式表适合多页面网站。
</div>

:::fill-blank
<h2>填空题：CSS 基础</h2>

CSS 的全称是 **{Cascading Style Sheets}**，它用来控制网页的 **{样式}** 和 **{布局}**。CSS 可以通过 **{内联}**、**{内部}** 和 **{外部}** 三种方式添加到 HTML 中。
:::

:::quiz
<h2>问题：关于 CSS，以下说法正确的是？</h2>

- [x] CSS 用于控制网页的外观和布局
- [x] CSS 可以改变文字颜色和背景色
- [x] 内联样式的优先级最高
- [ ] CSS 只能写在 HTML 文件内部
:::

<h2>CSS 基本语法</h2>

<p>CSS 规则由选择器和声明块组成。声明块包含一个或多个声明，每个声明包含属性和值。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>CSS 语法</title>
    <style>
        /* 这是 CSS 注释 */
        
        /* 元素选择器 */
        h2 {
            color: #2c3e50;
            font-size: 24px;
        }
        
        /* 类选择器 */
        .example-box {
            background-color: #ecf0f1;
            border: 2px solid #bdc3c7;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
        }
        
        /* ID 选择器 */
        #special-text {
            color: #e74c3c;
            font-weight: bold;
            text-decoration: underline;
        }
        
        /* 多个选择器 */
        p, span {
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <h2>CSS 语法示例</h2>
    
    <div class="example-box">
        <p>这个段落使用了类选择器 <code>.example-box</code> 的样式。</p>
        <p id="special-text">这个段落使用了 ID 选择器 <code>#special-text</code> 的样式。</p>
        <span>这个 span 元素也应用了样式。</span>
    </div>
    
    <div class="example-box">
        <p>CSS 语法格式：<br>
        选择器 { 属性: 值; 属性: 值; }</p>
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
CSS 选择器包括元素选择器（如 h1）、类选择器（如 .class）、ID选择器（如 #id）等。每个声明以分号结尾。
</div>

:::quiz
<h2>问题：关于 CSS 语法，以下说法正确的是？</h2>

- [x] 类选择器以点号开头
- [x] ID选择器以井号开头
- [x] CSS 声明以分号结尾
- [ ] CSS 不支持注释
:::

<h2>实践练习</h2>

:::exercise
<b>练习：创建简单的样式页面</b>

使用 CSS 为 HTML 页面添加基本样式。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个 CSS 页面</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        
    </style>
</head>
<body>
    <h1>我的网页</h1>
    <p class="intro">这是介绍段落。</p>
    <p>这是普通段落。</p>
    <div id="highlight">这是重要信息。</div>
    <span class="small-text">这是小字文本。</span>
</body>
</html>
\`\`\`

:::starter-code
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个 CSS 页面</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        
    </style>
</head>
<body>
    <h1>我的网页</h1>
    <p class="intro">这是介绍段落。</p>
    <p>这是普通段落。</p>
    <div id="highlight">这是重要信息。</div>
    <span class="small-text">这是小字文本。</span>
</body>
</html>
\`\`\`
:::

:::hint
1. 为 h1 标题设置颜色和字体大小<br>
2. 为 .intro 类设置背景色和内边距<br>
3. 为 #highlight ID 设置边框和文字样式<br>
4. 为 .small-text 类设置较小的字体<br>
5. 为 body 设置整体字体和背景色
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>我的第一个 CSS 页面</title>
    <style>
        /* 基本页面样式 */
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }
        
        /* 标题样式 */
        h1 {
            color: #2c3e50;
            font-size: 32px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        /* 介绍段落样式 */
        .intro {
            background-color: #e3f2fd;
            padding: 20px;
            border-left: 4px solid #2196f3;
            margin: 20px 0;
            font-size: 18px;
            color: #1565c0;
        }
        
        /* 普通段落样式 */
        p {
            color: #34495e;
            font-size: 16px;
            margin: 15px 0;
        }
        
        /* 重要信息样式 */
        #highlight {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            color: #856404;
            font-weight: bold;
            margin: 20px 0;
        }
        
        /* 小字文本样式 */
        .small-text {
            font-size: 12px;
            color: #6c757d;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1>我的网页</h1>
    <p class="intro">这是介绍段落。</p>
    <p>这是普通段落。</p>
    <div id="highlight">这是重要信息。</div>
    <span class="small-text">这是小字文本。</span>
</body>
</html>
\`\`\`
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>CSS 的定义和作用</li>
<li>CSS 的三种使用方式</li>
<li>CSS 的基本语法结构</li>
<li>常见的 CSS 选择器类型</li>
<li>CSS 注释的写法</li>
</ul>

<p>下一节课我们将学习 CSS 选择器的详细用法。</p>`;

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

export default CSSIntroduction;
