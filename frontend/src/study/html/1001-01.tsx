import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const HTMLBasics: React.FC = () => {
  const courseContent = `# HTML 基础入门

## 什么是 HTML？

HTML（HyperText Markup Language）是超文本标记语言，是构建网页的基础语言。HTML 于1990年由蒂姆·伯纳斯-李（Tim Berners-Lee）发明，是万维网的核心技术之一。

### HTML 的发展历史

* <b>HTML 1.0</b>（1993年）：最初版本，只有基本标签
* <b>HTML 2.0</b>（1995年）：第一个正式标准
* <b>HTML 3.2</b>（1997年）：增加了表格、脚本等功能
* <b>HTML 4.01</b>（1999年）：引入了CSS支持和更好的结构化
* <b>XHTML 1.0</b>（2000年）：基于XML的HTML版本
* <b>HTML5</b>（2014年）：现代标准，增加了语义化标签、多媒体支持等

### HTML 的核心概念

HTML 使用<b>标记</b>（markup）来描述文档的结构。这些标记告诉浏览器如何显示内容，以及内容的含义和重要性。

### HTML 的作用和重要性

* <b>结构化内容</b>：定义网页的逻辑结构，如标题、段落、列表等
* <b>语义化标记</b>：为内容提供含义，帮助搜索引擎和辅助技术理解页面
* <b>跨平台兼容</b>：在不同设备和浏览器上都能正确显示
* <b>无障碍访问</b>：支持屏幕阅读器等辅助技术
* <b>SEO优化</b>：搜索引擎通过HTML结构理解页面内容
* <b>技术基础</b>：为CSS样式和JavaScript交互提供基础框架

:::quiz
<b>问题：关于HTML的历史和发展，以下说法正确的是？</b>

- [x] HTML由蒂姆·伯纳斯-李发明
- [x] HTML5是目前的现代标准
- [ ] HTML最初就支持CSS样式
- [x] XHTML是基于XML的HTML版本

:::explanation
HTML确实由蒂姆·伯纳斯-李在1990年发明，HTML5是目前广泛使用的现代标准。CSS支持是在HTML 4.01中引入的，不是最初就有的。XHTML 1.0是基于XML语法的HTML版本。
:::
:::

## HTML 标签基础

### 标签的基本概念

HTML 标签是用尖括号包围的关键词，它们告诉浏览器如何处理内容。大多数标签都是成对出现的，包含<b>开始标签</b>和<b>结束标签</b>。

<b>基本语法：</b> \`<标签名>内容</标签名>\`

### 标签的分类

1. <b>容器标签</b>：需要开始和结束标签，如 \`&lt;p&gt;&lt;/p&gt;\`、\`&lt;div&gt;&lt;/div&gt;\`
2. <b>自闭合标签</b>：只有一个标签，如 \`&lt;br&gt;\`、\`&lt;img&gt;\`、\`&lt;hr&gt;\`
3. <b>块级标签</b>：独占一行，如 \`&lt;h1&gt;\`、\`&lt;p&gt;\`、\`&lt;div&gt;\`
4. <b>内联标签</b>：在同一行内显示，如 \`&lt;span&gt;\`、\`&lt;a&gt;\`、\`&lt;strong&gt;\`

### 标签的属性

标签可以包含属性，属性提供关于元素的额外信息：

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>标签属性示例</title>
</head>
<body>
    <h1>标签属性演示</h1>
    
    <!-- id属性：唯一标识符 -->
    <p id="intro">这个段落有一个唯一的ID</p>
    
    <!-- class属性：CSS类名 -->
    <p class="highlight">这个段落有一个CSS类</p>
    
    <!-- style属性：内联样式 -->
    <p style="color: blue; font-size: 18px;">这个段落有内联样式</p>
    
    <!-- title属性：鼠标悬停提示 -->
    <p title="这是提示文本">鼠标悬停在这里看提示</p>
    
    <!-- 多个属性组合使用 -->
    <p id="special" class="important" style="background-color: yellow;" title="重要段落">
        这个段落使用了多个属性
    </p>
</body>
</html>
\`\`\`

:::hint
属性总是在开始标签中定义，格式为 属性名="属性值"。多个属性用空格分隔。
:::

:::quiz
<b>问题：关于HTML标签的分类，以下说法正确的是？</b>

- [x] 容器标签需要开始和结束标签
- [x] 自闭合标签只有一个标签
- [x] 块级标签独占一行显示
- [ ] 所有标签都必须有属性

:::explanation
容器标签确实需要成对出现，自闭合标签如br、img只需要一个标签，块级标签会独占一行。但并不是所有标签都必须有属性，属性是可选的。
:::
:::

## HTML 文档结构详解

### 完整的 HTML5 文档结构

\`\`\`executable:html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="这是页面描述">
    <meta name="keywords" content="HTML, 教程, 学习">
    <meta name="author" content="作者姓名">
    <title>完整的HTML文档结构</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <header>
        <h1>网站标题</h1>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <h2>文章标题</h2>
            <p>这是文章内容...</p>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 版权所有</p>
    </footer>
</body>
</html>
\`\`\`

:::hint
这是一个完整的HTML5文档结构，包含了现代网页开发的最佳实践。注意语义化标签的使用。
:::

<h3>各部分详细解释</h3>

<h4>1. DOCTYPE 声明</h4>
\`&lt;!DOCTYPE html&gt;\` 告诉浏览器这是一个HTML5文档。它必须是文档的第一行，不区分大小写。

<h4>2. html 根元素</h4>
\`&lt;html&gt;\` 是所有HTML元素的容器。\`lang="zh-CN"\` 属性指定页面语言，有助于搜索引擎和辅助技术。

<h4>3. head 头部区域</h4>
包含页面的元数据，不会在页面上显示：

* <b>meta charset</b>：指定字符编码，UTF-8支持所有语言字符
* <b>meta viewport</b>：控制移动设备上的显示
* <b>meta description</b>：页面描述，显示在搜索结果中
* <b>title</b>：页面标题，显示在浏览器标签页上
* <b>link</b>：链接外部资源，如CSS文件、图标等

<h4>4. body 主体区域</h4>
包含页面的可见内容，使用语义化标签：

* <b>header</b>：页面或章节的头部
* <b>nav</b>：导航链接
* <b>main</b>：主要内容区域
* <b>article</b>：独立的文章内容
* <b>section</b>：文档的章节
* <b>aside</b>：侧边栏内容
* <b>footer</b>：页面或章节的底部

:::quiz
<b>问题：HTML 文档的基本结构包含哪些主要部分？</b>

- [x] DOCTYPE 声明
- [x] html 根元素  
- [x] head 头部区域
- [x] body 主体区域
- [ ] footer 页脚区域

:::explanation
HTML 文档的基本结构包含：DOCTYPE 声明（告诉浏览器这是 HTML5 文档）、html 根元素（包含整个页面）、head 头部区域（包含页面信息）、body 主体区域（包含页面内容）。footer 是 body 内的一个语义化标签，不是基本结构的必需部分。
:::
:::

:::quiz
<b>问题：关于HTML文档的head部分，以下说法正确的是？</b>

- [x] meta charset指定字符编码
- [x] title标签内容显示在浏览器标签页
- [ ] head部分的内容会在页面上显示
- [x] meta description用于搜索引擎优化

:::explanation
meta charset确实指定字符编码，title内容显示在浏览器标签页，meta description用于SEO优化。但head部分的内容不会在页面上直接显示给用户。
:::
:::

## 常用的 HTML 标签详解

### 文本相关标签

HTML 提供了丰富的文本标签来标记不同类型的内容：

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>文本标签示例</title>
</head>
<body>
    <h1>一级标题 - 页面主标题</h1>
    <h2>二级标题 - 章节标题</h2>
    <h3>三级标题 - 小节标题</h3>
    
    <p>这是一个普通段落。段落标签会自动在前后添加空白行。</p>
    
    <p>这个段落包含<strong>重要文本</strong>和<em>强调文本</em>。</p>
    
    <p>还可以使用<b>粗体</b>、<i>斜体</i>、<u>下划线</u>和<s>删除线</s>。</p>
    
    <p>代码示例：<code>console.log('Hello World');</code></p>
    
    <p>这是<mark>高亮文本</mark>，这是<small>小号文本</small>。</p>
    
    <p>数学公式：H<sub>2</sub>O 和 E=mc<sup>2</sup></p>
    
    <blockquote>
        这是一个引用块，用于引用其他来源的内容。
    </blockquote>
    
    <pre>
这是预格式化文本，
    保持原有的空格和换行。
        适合显示代码或诗歌。
    </pre>
</body>
</html>
\`\`\`

:::hint
注意 \`&lt;strong&gt;\` 和 \`&lt;b&gt;\` 的区别：\`&lt;strong&gt;\` 表示重要性，\`&lt;b&gt;\` 只是视觉上的粗体。同样，\`&lt;em&gt;\` 表示强调，\`&lt;i&gt;\` 只是视觉上的斜体。
:::

### 标签的语义化重要性

使用正确的语义化标签有以下好处：

1. <b>搜索引擎优化</b>：搜索引擎能更好地理解内容结构
2. <b>无障碍访问</b>：屏幕阅读器能正确解读内容
3. <b>代码维护</b>：代码更易读、更易维护
4. <b>样式控制</b>：CSS可以更精确地控制样式

:::fill-blank
<b>填空题：HTML 标签用途</b>

**{h1}** 标签用于定义最重要的标题，**{p}** 标签用于定义段落，**{a}** 标签用于创建链接，**{img}** 标签用于插入图片。
:::

:::quiz
<b>问题：关于HTML标签的语义化，以下说法正确的是？</b>

- [x] strong 标签表示内容的重要性
- [x] em 标签表示内容的强调
- [ ] b 标签和 strong 标签完全相同
- [x] 语义化标签有助于SEO优化

:::explanation
strong 表示内容的重要性，em 表示强调，它们都有语义含义。而 b 和 i 只是视觉效果标签。语义化标签确实有助于搜索引擎理解内容，从而提高SEO效果。
:::
:::

:::quiz
<b>问题：关于HTML文本标签，以下说法正确的是？</b>

- [x] blockquote 用于引用内容
- [x] code 标签用于显示代码
- [x] pre 标签保持原有格式
- [ ] mark 标签只能用于重要内容

:::explanation
blockquote确实用于引用，code用于显示代码，pre保持原有的空格和换行格式。mark标签用于高亮显示，不仅限于重要内容，也可以用于搜索结果高亮等。
:::
:::

## HTML 注释和最佳实践

### HTML 注释

注释用于在代码中添加说明，不会在页面上显示：

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>HTML注释示例</title>
</head>
<body>
    <!-- 这是一个单行注释 -->
    <h1>页面标题</h1>
    
    <!--
        这是一个多行注释
        可以包含多行内容
        用于详细说明
    -->
    <p>这是页面内容。</p>
    
    <!-- TODO: 添加更多内容 -->
    <!-- FIXME: 修复样式问题 -->
    
    <div>
        <!-- 开始：导航区域 -->
        <nav>
            <a href="#home">首页</a>
            <a href="#about">关于</a>
        </nav>
        <!-- 结束：导航区域 -->
    </div>
</body>
</html>
\`\`\`

:::hint
合理使用注释可以让代码更易理解和维护。但不要过度注释，代码本身应该是自解释的。
:::

### HTML 编写最佳实践

1. <b>使用语义化标签</b>：选择最合适的标签来表达内容的含义
2. <b>保持结构清晰</b>：合理使用缩进，保持代码整洁
3. <b>属性值加引号</b>：所有属性值都应该用引号包围
4. <b>小写标签名</b>：虽然HTML不区分大小写，但建议使用小写
5. <b>关闭所有标签</b>：确保所有容器标签都有对应的结束标签
6. <b>验证HTML</b>：使用HTML验证工具检查代码正确性

:::quiz
<b>问题：关于HTML编写最佳实践，以下说法正确的是？</b>

- [x] 应该使用语义化标签
- [x] 属性值应该用引号包围
- [ ] HTML标签必须使用大写
- [x] 所有容器标签都应该有结束标签

:::explanation
确实应该使用语义化标签和给属性值加引号，所有容器标签都需要结束标签。但HTML标签建议使用小写，不是必须大写。
:::
:::

## 实践练习

:::exercise
<b>练习：创建一个完整的个人介绍页面</b>

请严格按照以下要求创建个人介绍页面：

1. 必须包含完整的HTML5文档结构（DOCTYPE、html、head、body） <br />
2. 在head中必须包含title标签 <br />
3. 在body中必须包含：一个h1主标题、至少三个p段落、一个包含至少3项的无序列表 <br />
4. 不允许使用任何CSS样式或JavaScript代码 <br />
5. 必须使用HTML注释标记各个部分 <br />

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>我的个人介绍</title>
</head>
<body>
    <!-- 请在这里按要求添加内容 -->
    <!-- 要求：h1标题 + 3个p段落 + 1个ul列表（至少3项） -->
</body>
</html>
\`\`\`

:::hint
1. 使用 h1 标签作为页面主标题（如"关于我"）
2. 第一个 p 段落：介绍你的姓名和身份
3. 第二个 p 段落：介绍你的兴趣爱好
4. 第三个 p 段落：介绍你的学习目标
5. 使用 ul 和 li 标签创建技能列表
6. 在每个主要部分前添加HTML注释
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>我的个人介绍</title>
</head>
<body>
    <!-- 页面主标题 -->
    <h1>关于我</h1>
    
    <!-- 个人基本信息 -->
    <p>大家好，我是张三，一名正在学习前端开发的学生。</p>
    
    <!-- 兴趣爱好介绍 -->
    <p>我对网页设计和编程有着浓厚的兴趣，喜欢创造美观实用的网站。</p>
    
    <!-- 学习目标 -->
    <p>我的目标是成为一名优秀的前端开发工程师，能够开发出用户体验良好的网站。</p>
    
    <!-- 技能列表 -->
    <ul>
        <li>HTML - 网页结构</li>
        <li>CSS - 样式设计</li>
        <li>JavaScript - 交互功能</li>
    </ul>
</body>
</html>
\`\`\`
:::
:::

## 小结

在这节课中，我们深入学习了：

* <b>HTML的历史和发展</b>：从HTML 1.0到HTML5的演进过程
* <b>HTML的核心概念</b>：标记语言的基本原理和重要性
* <b>标签的分类和属性</b>：容器标签、自闭合标签、块级和内联标签
* <b>完整的文档结构</b>：DOCTYPE、html、head、body的详细作用
* <b>语义化标签</b>：header、nav、main、article、section、footer等
* <b>文本格式标签</b>：各种文本标记的正确使用方法
* <b>HTML注释</b>：如何添加代码注释和最佳实践
* <b>编写规范</b>：HTML代码的最佳实践和规范

掌握这些基础知识后，你就可以创建结构良好、语义清晰的HTML文档了。下一节课我们将学习更多的HTML标签和元素。`;

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

export default HTMLBasics;
