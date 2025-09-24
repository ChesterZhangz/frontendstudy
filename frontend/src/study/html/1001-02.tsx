import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const HTMLTextAndHeadings: React.FC = () => {
  const courseContent = `# HTML 文本和标题

## 标题标签（h1-h6）

HTML 提供了六个级别的标题标签，从 h1 到 h6，它们定义了内容的<b>层次结构</b>和<b>语义重要性</b>。

* <b>h1</b>：页面主标题，最高级别，通常每页只有一个
* <b>h2</b>：主要章节标题，h1的子标题
* <b>h3</b>：次级章节标题，h2的子标题
* <b>h4-h6</b>：更小级别的标题

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>标题层次示例</title>
</head>
<body>
    <h1>网站主标题</h1>
    <p>这是页面的主要内容介绍。</p>
    
    <h2>第一章：HTML基础</h2>
    <p>本章介绍HTML的基本概念。</p>
    
    <h3>1.1 什么是HTML</h3>
    <p>HTML是超文本标记语言。</p>
    
    <h4>1.1.1 HTML的历史</h4>
    <p>HTML由蒂姆·伯纳斯-李发明。</p>
    
    <h2>第二章：HTML标签</h2>
    <p>本章介绍各种HTML标签的使用。</p>
</body>
</html>
\`\`\`

:::hint
注意标题的层次结构！不要跳级使用标题标签，比如直接从h1跳到h3。
:::

:::quiz
<b>问题：关于 HTML 标题标签的使用，以下说法正确的是？</b>

- [x] h1 标签表示最重要的标题
- [x] 标题标签有助于 SEO 优化
- [ ] 一个页面可以有多个 h1 标签
- [x] 标题标签应该按层次使用

:::explanation
h1 是最重要的标题，通常一个页面只应该有一个 h1 标签作为主标题。标题标签确实有助于搜索引擎优化，应该按照逻辑层次使用（不要跳级使用）。
:::
:::

:::quiz
<b>问题：关于标题标签的层次结构，以下做法正确的是？</b>

- [x] h1 → h2 → h3 的顺序使用
- [ ] h1 → h3 → h2 的跳级使用
- [x] 每个页面只有一个 h1 标签
- [ ] 可以随意使用任何级别的标题

:::explanation
标题标签应该按照逻辑层次顺序使用，不要跳级。每个页面通常只有一个h1作为主标题，然后按需使用h2、h3等子标题。
:::
:::

## 段落和文本格式

### 段落标签（p）

段落标签是HTML中最基本的文本容器：

* <b>块级元素</b>：独占一行，前后自动添加空白行
* <b>自动换行</b>：内容超出容器宽度时自动换行
* <b>空白合并</b>：多个空格和换行符会被合并为一个空格

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>段落和文本格式示例</title>
</head>
<body>
    <p>这是第一个段落。注意段落前后会有空白行。</p>
    <p>这是第二个段落。即使在源代码中
    有换行，在页面上也会
    显示为连续的文本。</p>
    
    <p>这个段落包含<strong>重要文本</strong>和<em>强调文本</em>。</p>
    <p>还可以使用<mark>高亮文本</mark>和<small>小号文本</small>。</p>
    <p>代码示例：<code>console.log('Hello World');</code></p>
    <p>数学公式：H<sub>2</sub>O 和 E=mc<sup>2</sup></p>
</body>
</html>
\`\`\`

:::hint
优先使用语义化标签（&lt;strong&gt;、&lt;em&gt;）而不是表现性标签（&lt;b&gt;、&lt;i&gt;），这样有利于SEO和无障碍访问。
:::

:::quiz
<b>问题：关于HTML文本格式化标签，以下说法正确的是？</b>

- [x] strong 标签表示内容的重要性
- [x] em 标签表示内容的强调
- [ ] b 标签和 strong 标签完全相同
- [x] 应该优先使用语义化标签

:::explanation
strong表示重要性，em表示强调，它们都有语义含义。而b只是视觉效果标签，没有语义。应该优先使用有语义的标签。
:::
:::

:::fill-blank
<b>填空题：文本格式标签</b>

{strong} 标签用于表示重要的文本，{em} 标签用于表示强调的文本，{mark} 标签用于高亮显示文本，{code} 标签用于显示计算机代码。
:::

## 换行和分隔

### 换行和分隔标签

* <b>&lt;br&gt;</b>：换行标签，自闭合标签
* <b>&lt;hr&gt;</b>：水平分隔线，表示主题分隔

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>换行和分隔示例</title>
</head>
<body>
    <h2>换行标签示例</h2>
    <p>第一行文本<br>第二行文本<br>第三行文本</p>
    
    <p>地址示例：<br>
    张三<br>
    北京市朝阳区<br>
    某某街道123号</p>
    
    <hr>
    
    <h2>水平分隔线示例</h2>
    <p>这是第一部分内容。</p>
    <hr>
    <p>这是第二部分内容，用水平线分隔。</p>
</body>
</html>
\`\`\`

:::quiz
<b>问题：关于 HTML 中的换行和分隔，以下说法正确的是？</b>

- [x] br 标签用于换行
- [x] hr 标签用于创建水平分隔线
- [ ] 在 HTML 中直接按回车键可以换行
- [x] HTML 会自动合并多个空格为一个

:::explanation
br 是换行标签，hr 是水平线标签。HTML 会忽略源代码中的换行和多余空格，需要使用标签来控制显示效果。
:::
:::

:::quiz
<b>问题：关于br和hr标签的特性，以下说法正确的是？</b>

- [x] br 和 hr 都是自闭合标签
- [x] br 用于文本内换行
- [x] hr 表示主题分隔
- [ ] br 标签可以用来增加段落间距

:::explanation
br和hr都是自闭合标签，不需要结束标签。br用于文本内换行，hr表示主题分隔。不应该用br来增加段落间距，应该用CSS控制。
:::
:::

## 实践练习

:::exercise
<b>练习：创建一篇文章页面</b>

请严格按照以下要求创建一篇关于学习编程的文章：
1. 必须包含完整的HTML5文档结构
2. 使用h1作为文章主标题，h2作为章节标题
3. 每个章节至少包含2个段落
4. 必须使用至少3种不同的文本格式化标签（strong、em、mark等）
5. 使用hr分隔不同章节

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>学习编程指南</title>
</head>
<body>
    <!-- 请按要求创建文章内容 -->
    <!-- 要求：h1主标题 + h2章节标题 + 多种文本格式 + hr分隔 -->
</body>
</html>
\`\`\`

:::hint
1. 文章主标题：如"学习编程指南"
2. 第一章：为什么学习编程（使用strong、em标签）
3. 第二章：如何开始学习（使用mark、code标签）
4. 在每章之间使用hr分隔
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>学习编程指南</title>
</head>
<body>
    <h1>学习编程指南</h1>
    
    <h2>为什么学习编程</h2>
    <p>编程是一项<strong>非常重要</strong>的技能，在当今数字化时代具有<em>不可替代</em>的价值。</p>
    <p>学习编程不仅能够<mark>提升逻辑思维能力</mark>，还能为未来的职业发展打下坚实基础。</p>
    
    <hr>
    
    <h2>如何开始学习</h2>
    <p>对于初学者来说，建议从<code>HTML</code>和<code>CSS</code>开始学习。</p>
    <p>制定一个<em>系统性的学习计划</em>非常重要，每天至少投入<strong>2小时</strong>的学习时间。</p>
    
    <hr>
    
    <h2>学习建议</h2>
    <p>在学习过程中，<strong>实践</strong>比理论更重要。要<em>动手编写代码</em>。</p>
    <p>记住，编程学习是一个<em>长期的过程</em>，需要耐心和毅力。</p>
</body>
</html>
\`\`\`
:::
:::

## 小结

本节课我们学习了：

* <b>标题标签的层次结构</b>：h1-h6的正确使用方法
* <b>段落标签的特性</b>：块级元素、自动换行、空白合并
* <b>文本格式化标签</b>：strong、em、mark、code等标签的用法
* <b>换行和分隔控制</b>：br、hr标签的使用方法

下一节课我们将学习列表和链接的使用。`;

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

export default HTMLTextAndHeadings;
