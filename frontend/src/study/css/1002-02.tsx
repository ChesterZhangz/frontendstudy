import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const CSSSelectors: React.FC = () => {
  const courseContent = `<h1>CSS 选择器</h1>

<h2>基本选择器</h2>

<p>CSS 选择器用于选择要应用样式的 HTML 元素。掌握选择器是学习 CSS 的关键。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>CSS 选择器</title>
    <style>
        /* 元素选择器 */
        h2 {
            color: #2980b9;
            border-bottom: 2px solid #3498db;
        }
        
        /* 类选择器 */
        .highlight {
            background-color: #f1c40f;
            padding: 5px;
            border-radius: 3px;
        }
        
        .box {
            border: 2px solid #e74c3c;
            padding: 10px;
            margin: 10px 0;
        }
        
        /* ID 选择器 */
        #special {
            color: #e74c3c;
            font-weight: bold;
            font-size: 18px;
        }
        
        /* 通用选择器 */
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <h2>选择器示例</h2>
    
    <p>这是普通段落文字。</p>
    <p class="highlight">这是使用类选择器的高亮文字。</p>
    
    <div class="box">
        <p>这是在盒子内的段落。</p>
        <p id="special">这是使用 ID 选择器的特殊文字。</p>
    </div>
    
    <span class="highlight">span 元素也可以使用相同的类。</span>
</body>
</html>
\`\`\`

<div class="hint-box">
元素选择器选择所有指定的 HTML 元素，类选择器选择具有特定 class 属性的元素，ID选择器选择具有特定 id 属性的元素。
</div>

:::fill-blank
<h2>填空题：选择器类型</h2>

**{元素}** 选择器直接使用标签名，**{类}** 选择器使用点号加类名，**{ID}** 选择器使用井号加ID名，**{通用}** 选择器使用星号选择所有元素。
:::

<h2>组合选择器</h2>

<p>组合选择器可以更精确地选择元素，包括后代选择器、子选择器、相邻兄弟选择器等。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>组合选择器</title>
    <style>
        /* 后代选择器 */
        .container p {
            color: #27ae60;
            margin-left: 20px;
        }
        
        /* 子选择器 */
        .parent > span {
            background-color: #3498db;
            color: white;
            padding: 3px 6px;
            border-radius: 3px;
        }
        
        /* 相邻兄弟选择器 */
        h3 + p {
            font-style: italic;
            color: #8e44ad;
        }
        
        /* 通用兄弟选择器 */
        h3 ~ div {
            border-left: 3px solid #e74c3c;
            padding-left: 10px;
        }
        
        /* 多个类选择器 */
        .red.bold {
            color: #e74c3c;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h3>标题</h3>
        <p>这是紧跟标题的段落（相邻兄弟选择器）。</p>
        <p>这是容器内的段落（后代选择器）。</p>
        
        <div class="parent">
            <span>直接子元素 span</span>
            <div>
                <span>嵌套的 span</span>
            </div>
        </div>
        
        <div>这是兄弟元素 div（通用兄弟选择器）。</div>
        
        <p class="red bold">这个段落同时有两个类。</p>
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
后代选择器用空格分隔，子选择器用 &gt; 分隔，相邻兄弟选择器用 + 分隔，通用兄弟选择器用 ~ 分隔。
</div>

:::quiz
<h2>问题：关于 CSS 组合选择器，以下说法正确的是？</h2>

- [x] 后代选择器选择所有后代元素
- [x] 子选择器只选择直接子元素
- [x] 相邻兄弟选择器选择紧邻的下一个兄弟元素
- [ ] 组合选择器不能同时使用多个类
:::

<h2>伪类和伪元素</h2>

<p>伪类用于选择元素的特定状态，伪元素用于选择元素的特定部分。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>伪类和伪元素</title>
    <style>
        /* 链接伪类 */
        a:link { color: #3498db; }
        a:visited { color: #9b59b6; }
        a:hover { 
            color: #e74c3c; 
            text-decoration: none;
            background-color: #ecf0f1;
            padding: 2px 4px;
            border-radius: 3px;
        }
        a:active { color: #f39c12; }
        
        /* 结构伪类 */
        li:first-child {
            font-weight: bold;
            color: #27ae60;
        }
        
        li:last-child {
            font-style: italic;
            color: #e74c3c;
        }
        
        li:nth-child(even) {
            background-color: #ecf0f1;
            padding: 5px;
        }
        
        /* 伪元素 */
        p::first-line {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .quote::before {
            content: """;
            font-size: 20px;
            color: #95a5a6;
        }
        
        .quote::after {
            content: """;
            font-size: 20px;
            color: #95a5a6;
        }
    </style>
</head>
<body>
    <h3>伪类示例</h3>
    <p>鼠标悬停在链接上试试：<a href="#">这是一个链接</a></p>
    
    <ul>
        <li>第一个列表项（first-child）</li>
        <li>第二个列表项（偶数项有背景色）</li>
        <li>第三个列表项</li>
        <li>第四个列表项（偶数项有背景色）</li>
        <li>最后一个列表项（last-child）</li>
    </ul>
    
    <h3>伪元素示例</h3>
    <p>这个段落的第一行会被加粗显示。这是 ::first-line 伪元素的效果。你可以看到只有第一行的文字样式发生了变化。</p>
    
    <p class="quote">这是一个使用伪元素添加引号的段落。</p>
</body>
</html>
\`\`\`

<div class="hint-box">
伪类使用单冒号（如 :hover），伪元素使用双冒号（如 ::before）。伪元素可以创建不存在于 HTML 中的元素。
</div>

:::quiz
<h2>问题：关于伪类和伪元素，以下说法正确的是？</h2>

- [x] :hover 是鼠标悬停伪类
- [x] ::before 可以在元素前插入内容
- [x] :first-child 选择第一个子元素
- [ ] 伪元素必须有实际的 HTML 标签
:::

<h2>实践练习</h2>

:::exercise
<b>练习：使用各种选择器</b>

创建一个使用多种选择器的页面。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>选择器练习</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        
    </style>
</head>
<body>
    <div class="container">
        <h1 id="title">网页标题</h1>
        <nav>
            <a href="#" class="nav-link">首页</a>
            <a href="#" class="nav-link">关于</a>
            <a href="#" class="nav-link">联系</a>
        </nav>
        
        <article>
            <h2>文章标题</h2>
            <p class="intro">这是文章的介绍段落。</p>
            <p>这是文章的正文内容。</p>
            
            <ul class="list">
                <li>列表项 1</li>
                <li>列表项 2</li>
                <li>列表项 3</li>
            </ul>
        </article>
    </div>
</body>
</html>
\`\`\`

:::starter-code
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>选择器练习</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        
    </style>
</head>
<body>
    <div class="container">
        <h1 id="title">网页标题</h1>
        <nav>
            <a href="#" class="nav-link">首页</a>
            <a href="#" class="nav-link">关于</a>
            <a href="#" class="nav-link">联系</a>
        </nav>
        
        <article>
            <h2>文章标题</h2>
            <p class="intro">这是文章的介绍段落。</p>
            <p>这是文章的正文内容。</p>
            
            <ul class="list">
                <li>列表项 1</li>
                <li>列表项 2</li>
                <li>列表项 3</li>
            </ul>
        </article>
    </div>
</body>
</html>
\`\`\`
:::

:::hint
1. 为 #title 设置颜色和字体大小<br>
2. 为 .nav-link 设置悬停效果<br>
3. 为 .intro 设置特殊样式<br>
4. 为列表的第一项和最后一项设置不同样式<br>
5. 使用后代选择器为 article 内的 p 设置样式
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>选择器练习</title>
    <style>
        /* 基本样式 */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        /* ID选择器 - 标题样式 */
        #title {
            color: #2c3e50;
            font-size: 36px;
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
        }
        
        /* 导航样式 */
        nav {
            text-align: center;
            margin-bottom: 40px;
        }
        
        /* 类选择器 - 导航链接 */
        .nav-link {
            color: #3498db;
            text-decoration: none;
            margin: 0 20px;
            padding: 10px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        /* 伪类选择器 - 悬停效果 */
        .nav-link:hover {
            background-color: #3498db;
            color: white;
            transform: translateY(-2px);
        }
        
        /* 文章区域 */
        article {
            margin-top: 30px;
        }
        
        article h2 {
            color: #34495e;
            border-left: 4px solid #e74c3c;
            padding-left: 15px;
        }
        
        /* 后代选择器 - article 内的段落 */
        article p {
            line-height: 1.8;
            color: #2c3e50;
            margin: 15px 0;
        }
        
        /* 类选择器 - 介绍段落特殊样式 */
        .intro {
            background-color: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #27ae60 !important;
        }
        
        /* 列表样式 */
        .list {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        
        .list li {
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        /* 结构伪类选择器 - 第一项 */
        .list li:first-child {
            color: #e74c3c;
            font-weight: bold;
            background-color: #ffeaa7;
            padding: 12px;
            border-radius: 5px;
        }
        
        /* 结构伪类选择器 - 最后一项 */
        .list li:last-child {
            color: #8e44ad;
            font-style: italic;
            background-color: #f8d7da;
            padding: 12px;
            border-radius: 5px;
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 id="title">网页标题</h1>
        <nav>
            <a href="#" class="nav-link">首页</a>
            <a href="#" class="nav-link">关于</a>
            <a href="#" class="nav-link">联系</a>
        </nav>
        
        <article>
            <h2>文章标题</h2>
            <p class="intro">这是文章的介绍段落。</p>
            <p>这是文章的正文内容。</p>
            
            <ul class="list">
                <li>列表项 1</li>
                <li>列表项 2</li>
                <li>列表项 3</li>
            </ul>
        </article>
    </div>
</body>
</html>
\`\`\`
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>基本选择器：元素、类、ID、通用选择器</li>
<li>组合选择器：后代、子、兄弟选择器</li>
<li>伪类：:hover、:first-child、:nth-child 等</li>
<li>伪元素：::before、::after、::first-line 等</li>
<li>选择器的优先级和特异性</li>
</ul>

<p>下一节课我们将学习 CSS 的文本和字体样式。</p>`;

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

export default CSSSelectors;
