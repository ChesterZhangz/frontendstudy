import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const CSSTextAndFonts: React.FC = () => {
  const courseContent = `<h1>CSS 文本和字体</h1>

<h2>文本样式</h2>

<p>CSS 提供了丰富的文本样式属性，可以控制文字的颜色、大小、对齐方式等。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>文本样式</title>
    <style>
        .text-color { color: #e74c3c; }
        .text-size { font-size: 24px; }
        .text-weight { font-weight: bold; }
        .text-style { font-style: italic; }
        .text-decoration { text-decoration: underline; }
        .text-transform { text-transform: uppercase; }
        .text-align-center { text-align: center; }
        .text-align-right { text-align: right; }
        .line-height { line-height: 2; }
        .letter-spacing { letter-spacing: 2px; }
        .word-spacing { word-spacing: 5px; }
    </style>
</head>
<body>
    <h2>文本样式示例</h2>
    
    <p class="text-color">这是红色文字</p>
    <p class="text-size">这是大号文字</p>
    <p class="text-weight">这是粗体文字</p>
    <p class="text-style">这是斜体文字</p>
    <p class="text-decoration">这是带下划线的文字</p>
    <p class="text-transform">这是大写文字</p>
    <p class="text-align-center">这是居中对齐的文字</p>
    <p class="text-align-right">这是右对齐的文字</p>
    <p class="line-height">这是行高为2的文字。行高控制行与行之间的距离，让文字更易读。</p>
    <p class="letter-spacing">这是字母间距为2px的文字</p>
    <p class="word-spacing">这是 单词 间距 为5px 的 文字</p>
</body>
</html>
\`\`\`

<div class="hint-box">
常用文本属性：color（颜色）、font-size（字体大小）、font-weight（字体粗细）、text-align（对齐方式）、line-height（行高）。
</div>

:::fill-blank
<h2>填空题：文本属性</h2>

**{color}** 属性控制文字颜色，**{font-size}** 属性控制字体大小，**{text-align}** 属性控制文字对齐方式，**{line-height}** 属性控制行高。
:::

<h2>字体属性</h2>

<p>字体属性控制文字的字体族、大小、样式等外观特征。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>字体属性</title>
    <style>
        .font-family-serif {
            font-family: "Times New Roman", serif;
        }
        
        .font-family-sans {
            font-family: Arial, Helvetica, sans-serif;
        }
        
        .font-family-mono {
            font-family: "Courier New", monospace;
        }
        
        .font-sizes {
            margin: 10px 0;
        }
        
        .size-small { font-size: 12px; }
        .size-medium { font-size: 16px; }
        .size-large { font-size: 20px; }
        .size-xlarge { font-size: 24px; }
        
        .weight-light { font-weight: 300; }
        .weight-normal { font-weight: 400; }
        .weight-bold { font-weight: 700; }
        .weight-bolder { font-weight: 900; }
        
        .combined-style {
            font: italic bold 18px/1.5 Arial, sans-serif;
            color: #2c3e50;
            text-shadow: 1px 1px 2px #bdc3c7;
        }
    </style>
</head>
<body>
    <h2>字体族示例</h2>
    <p class="font-family-serif">这是衬线字体（Serif）- 适合正文阅读</p>
    <p class="font-family-sans">这是无衬线字体（Sans-serif）- 适合标题和屏幕显示</p>
    <p class="font-family-mono">这是等宽字体（Monospace）- 适合代码显示</p>
    
    <h2>字体大小示例</h2>
    <div class="font-sizes">
        <p class="size-small">小号字体 (12px)</p>
        <p class="size-medium">中号字体 (16px)</p>
        <p class="size-large">大号字体 (20px)</p>
        <p class="size-xlarge">特大号字体 (24px)</p>
    </div>
    
    <h2>字体粗细示例</h2>
    <p class="weight-light">细体 (300)</p>
    <p class="weight-normal">正常 (400)</p>
    <p class="weight-bold">粗体 (700)</p>
    <p class="weight-bolder">特粗 (900)</p>
    
    <h2>组合样式</h2>
    <p class="combined-style">这是组合了多种字体属性的文字，包括斜体、粗体、大小、行高和字体族。</p>
</body>
</html>
\`\`\`

<div class="hint-box">
font-family 设置字体族，建议提供多个备选字体。font 属性可以一次性设置多个字体相关属性。
</div>

:::quiz
<h2>问题：关于 CSS 字体，以下说法正确的是？</h2>

- [x] serif 是衬线字体
- [x] sans-serif 是无衬线字体  
- [x] monospace 是等宽字体
- [ ] 字体大小只能用像素单位
:::

<h2>文本装饰和效果</h2>

<p>CSS 可以为文字添加各种装饰效果，如阴影、轮廓等。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>文本装饰</title>
    <style>
        .text-shadow-simple {
            text-shadow: 2px 2px 4px #888888;
            font-size: 24px;
            color: #2c3e50;
        }
        
        .text-shadow-colorful {
            text-shadow: 
                1px 1px 0px #e74c3c,
                2px 2px 0px #f39c12,
                3px 3px 0px #f1c40f,
                4px 4px 0px #27ae60;
            font-size: 28px;
            font-weight: bold;
            color: #3498db;
        }
        
        .text-glow {
            text-shadow: 0 0 10px #3498db;
            color: #2980b9;
            font-size: 20px;
        }
        
        .underline-custom {
            text-decoration: underline;
            text-decoration-color: #e74c3c;
            text-decoration-style: wavy;
            text-decoration-thickness: 2px;
        }
        
        .strikethrough {
            text-decoration: line-through;
            text-decoration-color: #95a5a6;
        }
        
        .overline {
            text-decoration: overline;
            text-decoration-color: #27ae60;
        }
        
        .gradient-text {
            background: linear-gradient(45deg, #3498db, #e74c3c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 32px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h2>文本阴影效果</h2>
    <p class="text-shadow-simple">简单的文字阴影效果</p>
    <p class="text-shadow-colorful">彩色层叠阴影效果</p>
    <p class="text-glow">发光效果文字</p>
    
    <h2>文本装饰线</h2>
    <p class="underline-custom">自定义下划线样式</p>
    <p class="strikethrough">删除线效果</p>
    <p class="overline">上划线效果</p>
    
    <h2>高级效果</h2>
    <p class="gradient-text">渐变色文字效果</p>
</body>
</html>
\`\`\`

<div class="hint-box">
text-shadow 可以创建阴影效果，支持多重阴影。text-decoration 控制装饰线的样式、颜色和粗细。
</div>

:::quiz
<h2>问题：关于文本装饰，以下说法正确的是？</h2>

- [x] text-shadow 可以创建文字阴影
- [x] 可以设置多重文字阴影
- [x] text-decoration 可以添加下划线
- [ ] 文字阴影只能是黑色
:::

<h2>实践练习</h2>

:::exercise
<b>练习：设计文字样式</b>

创建一个包含各种文字样式的页面。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>文字样式练习</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        
    </style>
</head>
<body>
    <h1 class="main-title">网站主标题</h1>
    
    <article>
        <h2 class="article-title">文章标题</h2>
        <p class="intro">这是文章的介绍段落，应该突出显示。</p>
        <p class="content">这是文章的正文内容，需要良好的可读性。文字应该有合适的行高和字体大小。</p>
        <p class="quote">这是一段引用文字，应该有特殊的样式。</p>
        <p class="highlight">这是需要强调的重要信息。</p>
    </article>
    
    <footer>
        <p class="copyright">版权信息 © 2024</p>
    </footer>
</body>
</html>
\`\`\`

:::starter-code
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>文字样式练习</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        
    </style>
</head>
<body>
    <h1 class="main-title">网站主标题</h1>
    
    <article>
        <h2 class="article-title">文章标题</h2>
        <p class="intro">这是文章的介绍段落，应该突出显示。</p>
        <p class="content">这是文章的正文内容，需要良好的可读性。文字应该有合适的行高和字体大小。</p>
        <p class="quote">这是一段引用文字，应该有特殊的样式。</p>
        <p class="highlight">这是需要强调的重要信息。</p>
    </article>
    
    <footer>
        <p class="copyright">版权信息 © 2024</p>
    </footer>
</body>
</html>
\`\`\`
:::

:::hint
1. 为主标题设置大字体和阴影效果<br>
2. 为介绍段落设置不同的颜色和字体粗细<br>
3. 为正文设置合适的行高和字体<br>
4. 为引用文字设置斜体和特殊颜色<br>
5. 为重要信息设置背景色和边框
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>文字样式练习</title>
    <style>
        /* 基本页面样式 */
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
        }
        
        /* 主标题样式 */
        .main-title {
            color: white;
            font-size: 48px;
            text-align: center;
            margin-bottom: 40px;
            text-shadow: 
                2px 2px 4px rgba(0,0,0,0.5),
                0 0 20px rgba(255,255,255,0.3);
            font-weight: bold;
            letter-spacing: 2px;
        }
        
        /* 文章容器 */
        article {
            background: white;
            max-width: 800px;
            margin: 0 auto 40px;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        /* 文章标题 */
        .article-title {
            color: #2c3e50;
            font-size: 32px;
            margin-bottom: 25px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            font-weight: 600;
        }
        
        /* 介绍段落 */
        .intro {
            color: #2980b9;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.6;
            margin: 25px 0;
            padding: 20px;
            background: linear-gradient(90deg, #e3f2fd, #f8f9fa);
            border-left: 5px solid #2980b9;
            border-radius: 0 8px 8px 0;
        }
        
        /* 正文内容 */
        .content {
            color: #34495e;
            font-size: 16px;
            line-height: 1.8;
            margin: 20px 0;
            text-align: justify;
            font-family: 'Arial', sans-serif;
        }
        
        /* 引用文字 */
        .quote {
            color: #8e44ad;
            font-style: italic;
            font-size: 18px;
            line-height: 1.7;
            margin: 25px 0;
            padding: 20px 30px;
            background: #f8f4ff;
            border-left: 4px solid #8e44ad;
            position: relative;
        }
        
        .quote::before {
            content: '"';
            font-size: 60px;
            color: #d1c4e9;
            position: absolute;
            left: 10px;
            top: -10px;
            font-family: serif;
        }
        
        /* 重要信息 */
        .highlight {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #f39c12;
            color: #d68910;
            padding: 20px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 17px;
            margin: 25px 0;
            box-shadow: 0 4px 8px rgba(243, 156, 18, 0.2);
        }
        
        /* 页脚 */
        footer {
            text-align: center;
        }
        
        .copyright {
            color: white;
            font-size: 14px;
            margin: 0;
            opacity: 0.8;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <h1 class="main-title">网站主标题</h1>
    
    <article>
        <h2 class="article-title">文章标题</h2>
        <p class="intro">这是文章的介绍段落，应该突出显示。</p>
        <p class="content">这是文章的正文内容，需要良好的可读性。文字应该有合适的行高和字体大小。</p>
        <p class="quote">这是一段引用文字，应该有特殊的样式。</p>
        <p class="highlight">这是需要强调的重要信息。</p>
    </article>
    
    <footer>
        <p class="copyright">版权信息 © 2024</p>
    </footer>
</body>
</html>
\`\`\`
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>基本文本属性：颜色、大小、粗细、样式</li>
<li>字体属性：字体族、大小、粗细的设置</li>
<li>文本对齐和间距：text-align、line-height、letter-spacing</li>
<li>文本装饰：下划线、删除线、阴影效果</li>
<li>高级文本效果：渐变文字、发光效果</li>
</ul>

<p>下一节课我们将学习 CSS 的颜色和背景。</p>`;

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

export default CSSTextAndFonts;
