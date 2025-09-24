import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const HTMLListsAndLinks: React.FC = () => {
  const courseContent = `# HTML 列表和链接

## 无序列表（ul）

无序列表用于显示没有特定顺序的项目列表，通常用圆点标记。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>无序列表示例</title>
</head>
<body>
    <h2>我的爱好</h2>
    <ul>
        <li>阅读</li>
        <li>编程</li>
        <li>音乐</li>
        <li>运动</li>
    </ul>
    <p>试试添加更多爱好到列表中！</p>
</body>
</html>
\`\`\`

:::hint
无序列表的每个项目都用 \`<li>\` 标签包围。你可以添加任意数量的列表项。
:::

## 有序列表（ol）

有序列表用于显示有特定顺序的项目列表，通常用数字标记。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>有序列表示例</title>
</head>
<body>
    <h2>学习步骤</h2>
    <ol>
        <li>了解基础概念</li>
        <li>学习语法规则</li>
        <li>实践编程练习</li>
        <li>构建实际项目</li>
    </ol>
    <p>试试调整步骤的顺序或添加新步骤！</p>
</body>
</html>
\`\`\`

:::hint
有序列表会自动为每个项目编号。即使你重新排列 \`<li>\` 元素，编号也会自动调整。
:::

:::quiz
<h2>问题：关于 HTML 列表，以下说法正确的是？</h2>

- [x] ul 标签创建无序列表
- [x] ol 标签创建有序列表
- [x] li 标签定义列表项
- [ ] 列表不能嵌套使用

:::explanation
ul 创建无序列表（通常显示为圆点），ol 创建有序列表（通常显示为数字），li 定义列表中的每一项。列表是可以嵌套的，可以在 li 元素内包含其他列表。
:::
:::

## 嵌套列表

列表可以嵌套使用，创建多层次的结构。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>嵌套列表示例</title>
</head>
<body>
    <h2>前端技术栈</h2>
    <ul>
        <li>HTML
            <ul>
                <li>语义化标签</li>
                <li>表单元素</li>
                <li>多媒体标签</li>
            </ul>
        </li>
        <li>CSS
            <ul>
                <li>选择器</li>
                <li>布局</li>
                <li>动画</li>
            </ul>
        </li>
        <li>JavaScript
            <ol>
                <li>基础语法</li>
                <li>DOM 操作</li>
                <li>异步编程</li>
            </ol>
        </li>
    </ul>
</body>
</html>
\`\`\`

:::hint
注意嵌套列表的缩进效果。你可以混合使用有序列表和无序列表来创建复杂的层次结构。
:::

## 超链接（a）

超链接是网页的核心特性，允许用户在不同页面或资源之间导航。

<h3>基本链接</h3>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>链接示例</title>
</head>
<body>
    <h2>常用网站</h2>
    <p>访问 <a href="https://www.google.com" target="_blank">Google</a> 进行搜索。</p>
    <p>学习编程可以访问 <a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a>。</p>
    <p>试试点击这些链接！</p>
</body>
</html>
\`\`\`

:::hint
\`target="_blank"\` 属性让链接在新标签页打开，这样用户不会离开当前页面。
:::

<h3>不同类型的链接</h3>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>链接类型示例</title>
</head>
<body>
    <h2>链接类型</h2>
    
    <!-- 外部链接 -->
    <p><a href="https://www.example.com" target="_blank">在新窗口打开外部链接</a></p>
    
    <!-- 邮件链接 -->
    <p><a href="mailto:someone@example.com">发送邮件</a></p>
    
    <!-- 电话链接 -->
    <p><a href="tel:+1234567890">拨打电话</a></p>
    
    <!-- 页面内锚点链接 -->
    <p><a href="#section1">跳转到第一节</a></p>
    
    <br><br><br><br><br>
    <h3 id="section1">第一节内容</h3>
    <p>这里是第一节的内容，你可以通过上面的链接跳转到这里！</p>
</body>
</html>
\`\`\`

:::hint
不同的协议创建不同类型的链接：\`https://\` 用于网页，\`mailto:\` 用于邮件，\`tel:\` 用于电话，\`#\` 用于页面内跳转。
:::

:::fill-blank
<h2>填空题：链接属性</h2>

**{href}** 属性指定链接的目标地址，**{target}** 属性控制链接在哪里打开，**{_blank}** 值表示在新窗口打开链接。

:::

:::quiz
<h2>问题：关于 HTML 链接，以下说法正确的是？</h2>

- [x] href 属性指定链接目标
- [x] target="_blank" 在新窗口打开链接
- [x] mailto: 可以创建邮件链接
- [ ] 链接只能指向其他网页

:::explanation
href 是链接的必需属性，指定目标地址；target="_blank" 让链接在新窗口打开；mailto: 协议可以创建邮件链接；链接不仅可以指向网页，还可以指向文件、邮箱、电话等各种资源。
:::
:::

## 实践练习

:::exercise
<b>练习：创建个人网站导航</b>

创建一个包含导航菜单和内容列表的页面。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>我的个人网站</title>
</head>
<body>
    <!-- 创建一个包含导航和内容的页面 -->
    <!-- 要求：使用列表创建导航菜单，包含多种类型的链接 -->
</body>
</html>
\`\`\`

:::hint
1. 使用 ul 创建导航菜单
2. 在导航中包含页面内锚点链接
3. 添加外部链接（如社交媒体）
4. 使用 ol 创建技能或经历列表
5. 为页面的不同部分添加 id 属性
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>我的个人网站</title>
</head>
<body>
    <h1>欢迎来到我的个人网站</h1>
    
    <!-- 导航菜单 -->
    <nav>
        <ul>
            <li><a href="#about">关于我</a></li>
            <li><a href="#skills">技能</a></li>
            <li><a href="#contact">联系方式</a></li>
            <li><a href="https://github.com" target="_blank">我的 GitHub</a></li>
        </ul>
    </nav>
    
    <!-- 关于我部分 -->
    <section id="about">
        <h2>关于我</h2>
        <p>我是一名前端开发学习者，热爱编程和技术。</p>
    </section>
    
    <!-- 技能部分 -->
    <section id="skills">
        <h2>我的技能</h2>
        <ol>
            <li>HTML - 网页结构</li>
            <li>CSS - 样式设计</li>
            <li>JavaScript - 交互功能</li>
            <li>React - 前端框架</li>
        </ol>
    </section>
    
    <!-- 联系方式部分 -->
    <section id="contact">
        <h2>联系我</h2>
        <ul>
            <li><a href="mailto:me@example.com">发送邮件</a></li>
            <li><a href="tel:+1234567890">拨打电话</a></li>
            <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
        </ul>
    </section>
</body>
</html>
\`\`\`
:::
:::

## 小结

本节课我们学习了：

* 无序列表（ul）和有序列表（ol）的使用
* 列表项（li）的定义
* 嵌套列表的创建方法
* 超链接（a）的基本用法
* 不同类型的链接（外部链接、邮件链接、电话链接、锚点链接）
* 链接的重要属性（href、target）

下一节课我们将学习图片和媒体元素的使用。`;

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

export default HTMLListsAndLinks;