import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const CSSResponsiveDesign: React.FC = () => {
  const courseContent = `<h1>CSS 响应式设计</h1>

<h2>什么是响应式设计</h2>

<p>响应式设计让网页能够适应不同设备的屏幕尺寸，提供最佳的用户体验。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>响应式设计介绍</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        .responsive-demo {
            background: linear-gradient(45deg, #3498db, #e74c3c);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .grid-item {
            background-color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #bdc3c7;
        }
        
        .flexible-text {
            font-size: clamp(16px, 4vw, 32px);
            color: #2c3e50;
            text-align: center;
            margin: 20px 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="responsive-demo">
            <h2>响应式设计示例</h2>
            <p>这个页面会根据屏幕大小自动调整布局</p>
        </div>
        
        <div class="flexible-text">
            这段文字的大小会根据屏幕宽度自动调整
        </div>
        
        <div class="grid-container">
            <div class="grid-item">
                <h3>卡片 1</h3>
                <p>这些卡片会自动调整列数</p>
            </div>
            <div class="grid-item">
                <h3>卡片 2</h3>
                <p>在小屏幕上变成单列</p>
            </div>
            <div class="grid-item">
                <h3>卡片 3</h3>
                <p>在大屏幕上显示多列</p>
            </div>
        </div>
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
viewport meta 标签告诉浏览器如何控制页面缩放。clamp() 函数可以设置响应式字体大小。
</div>

:::fill-blank
<h2>填空题：响应式设计</h2>

响应式设计使用 **{媒体查询}** 来检测屏幕尺寸，**{viewport}** meta标签控制页面缩放，**{弹性}** 布局让元素自动调整大小。
:::

<h2>媒体查询</h2>

<p>媒体查询是响应式设计的核心，可以根据设备特征应用不同的CSS规则。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>媒体查询示例</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        .responsive-box {
            background-color: #3498db;
            color: white;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 10px;
        }
        
        .layout-demo {
            display: flex;
            gap: 20px;
            margin: 20px 0;
        }
        
        .sidebar {
            background-color: #e74c3c;
            color: white;
            padding: 20px;
            flex: 0 0 250px;
            border-radius: 8px;
        }
        
        .main-content {
            background-color: #27ae60;
            color: white;
            padding: 20px;
            flex: 1;
            border-radius: 8px;
        }
        
        /* 平板设备 */
        @media screen and (max-width: 768px) {
            .responsive-box {
                background-color: #e67e22;
                font-size: 18px;
            }
            
            .layout-demo {
                flex-direction: column;
            }
            
            .sidebar {
                flex: none;
            }
        }
        
        /* 手机设备 */
        @media screen and (max-width: 480px) {
            .responsive-box {
                background-color: #9b59b6;
                font-size: 16px;
                padding: 15px;
            }
            
            .sidebar, .main-content {
                padding: 15px;
            }
        }
        
        /* 大屏幕 */
        @media screen and (min-width: 1200px) {
            .responsive-box {
                background-color: #1abc9c;
                font-size: 24px;
                max-width: 800px;
                margin: 20px auto;
            }
        }
        
        /* 打印样式 */
        @media print {
            .responsive-box {
                background-color: white !important;
                color: black !important;
                border: 1px solid black;
            }
        }
    </style>
</head>
<body>
    <div class="responsive-box">
        <h2>媒体查询演示</h2>
        <p>调整浏览器窗口大小，看看颜色如何变化：</p>
        <ul style="text-align: left; display: inline-block;">
            <li>大屏幕 (>1200px): 青色</li>
            <li>桌面 (769-1200px): 蓝色</li>
            <li>平板 (481-768px): 橙色</li>
            <li>手机 (≤480px): 紫色</li>
        </ul>
    </div>
    
    <div class="layout-demo">
        <div class="sidebar">
            <h3>侧边栏</h3>
            <p>在小屏幕上会移到主内容下方</p>
        </div>
        <div class="main-content">
            <h3>主要内容</h3>
            <p>这是主要内容区域，会自动调整宽度</p>
        </div>
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
常用断点：手机 ≤480px，平板 481-768px，桌面 769-1200px，大屏幕 >1200px。使用 min-width 采用移动优先策略。
</div>

:::quiz
<h2>问题：关于媒体查询，以下说法正确的是？</h2>

- [x] @media 用于定义媒体查询
- [x] max-width 表示最大宽度
- [x] 可以为不同设备设置不同样式
- [ ] 媒体查询只能检测屏幕宽度
:::

<h2>弹性布局 Flexbox</h2>

<p>Flexbox 是现代CSS布局的重要工具，可以轻松创建响应式布局。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>Flexbox 响应式布局</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        .flex-container {
            display: flex;
            gap: 20px;
            margin: 20px 0;
            padding: 20px;
            background-color: #ecf0f1;
            border-radius: 10px;
        }
        
        .flex-item {
            background-color: #3498db;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            flex: 1;
        }
        
        .flex-wrap {
            flex-wrap: wrap;
        }
        
        .flex-item-fixed {
            flex: 0 0 200px;
            background-color: #e74c3c;
        }
        
        .flex-item-grow {
            flex: 2;
            background-color: #27ae60;
        }
        
        .justify-center {
            justify-content: center;
        }
        
        .justify-between {
            justify-content: space-between;
        }
        
        .align-center {
            align-items: center;
            height: 120px;
        }
        
        .flex-column {
            flex-direction: column;
        }
        
        @media screen and (max-width: 768px) {
            .flex-container {
                flex-direction: column;
            }
            
            .flex-item-fixed {
                flex: none;
            }
        }
    </style>
</head>
<body>
    <h2>基本 Flex 布局</h2>
    <div class="flex-container">
        <div class="flex-item">项目 1</div>
        <div class="flex-item">项目 2</div>
        <div class="flex-item">项目 3</div>
    </div>
    
    <h2>不同 flex 值</h2>
    <div class="flex-container">
        <div class="flex-item-fixed">固定宽度 (200px)</div>
        <div class="flex-item">普通弹性</div>
        <div class="flex-item-grow">2倍增长</div>
    </div>
    
    <h2>居中对齐</h2>
    <div class="flex-container justify-center align-center">
        <div class="flex-item" style="flex: none;">居中内容</div>
    </div>
    
    <h2>两端对齐</h2>
    <div class="flex-container justify-between">
        <div class="flex-item" style="flex: none;">左侧</div>
        <div class="flex-item" style="flex: none;">右侧</div>
    </div>
    
    <h2>换行布局</h2>
    <div class="flex-container flex-wrap">
        <div class="flex-item" style="flex: 0 0 200px;">卡片 1</div>
        <div class="flex-item" style="flex: 0 0 200px;">卡片 2</div>
        <div class="flex-item" style="flex: 0 0 200px;">卡片 3</div>
        <div class="flex-item" style="flex: 0 0 200px;">卡片 4</div>
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
flex: 1 表示等分剩余空间，flex: 0 0 200px 表示固定200px宽度。justify-content 控制主轴对齐，align-items 控制交叉轴对齐。
</div>

:::quiz
<h2>问题：关于 Flexbox，以下说法正确的是？</h2>

- [x] display: flex 创建弹性容器
- [x] flex: 1 让项目等分空间
- [x] justify-content 控制主轴对齐
- [ ] Flexbox 不支持换行
:::

<h2>网格布局 Grid</h2>

<p>CSS Grid 提供了强大的二维布局能力，特别适合响应式设计。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>Grid 响应式布局</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        .grid-container {
            display: grid;
            gap: 20px;
            margin: 20px 0;
            padding: 20px;
            background-color: #ecf0f1;
            border-radius: 10px;
        }
        
        .grid-item {
            background-color: #3498db;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .grid-basic {
            grid-template-columns: repeat(3, 1fr);
        }
        
        .grid-responsive {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        
        .grid-layout {
            grid-template-areas: 
                "header header header"
                "sidebar main main"
                "footer footer footer";
            grid-template-columns: 200px 1fr 1fr;
            grid-template-rows: auto 1fr auto;
            min-height: 300px;
        }
        
        .header { 
            grid-area: header; 
            background-color: #e74c3c;
        }
        
        .sidebar { 
            grid-area: sidebar; 
            background-color: #f39c12;
        }
        
        .main { 
            grid-area: main; 
            background-color: #27ae60;
        }
        
        .footer { 
            grid-area: footer; 
            background-color: #9b59b6;
        }
        
        @media screen and (max-width: 768px) {
            .grid-basic {
                grid-template-columns: 1fr;
            }
            
            .grid-layout {
                grid-template-areas: 
                    "header"
                    "main"
                    "sidebar"
                    "footer";
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <h2>基本网格布局</h2>
    <div class="grid-container grid-basic">
        <div class="grid-item">项目 1</div>
        <div class="grid-item">项目 2</div>
        <div class="grid-item">项目 3</div>
        <div class="grid-item">项目 4</div>
        <div class="grid-item">项目 5</div>
        <div class="grid-item">项目 6</div>
    </div>
    
    <h2>自适应网格</h2>
    <div class="grid-container grid-responsive">
        <div class="grid-item">自适应 1</div>
        <div class="grid-item">自适应 2</div>
        <div class="grid-item">自适应 3</div>
        <div class="grid-item">自适应 4</div>
    </div>
    
    <h2>网格区域布局</h2>
    <div class="grid-container grid-layout">
        <div class="grid-item header">页头</div>
        <div class="grid-item sidebar">侧边栏</div>
        <div class="grid-item main">主要内容</div>
        <div class="grid-item footer">页脚</div>
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
repeat(auto-fit, minmax(200px, 1fr)) 创建自适应网格。grid-template-areas 可以用名称定义布局区域。
</div>

:::quiz
<h2>问题：关于 CSS Grid，以下说法正确的是？</h2>

- [x] Grid 支持二维布局
- [x] auto-fit 可以自动调整列数
- [x] grid-template-areas 定义布局区域
- [ ] Grid 不如 Flexbox 灵活
:::

<h2>实践练习</h2>

:::exercise
<b>练习：创建响应式网页</b>

创建一个完整的响应式网页布局。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>响应式网页练习</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        /* 在这里添加你的 CSS 样式 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        
        /* 添加响应式样式 */
        
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>我的网站</h1>
            <nav class="nav">
                <a href="#" class="nav-link">首页</a>
                <a href="#" class="nav-link">关于</a>
                <a href="#" class="nav-link">服务</a>
                <a href="#" class="nav-link">联系</a>
            </nav>
        </div>
    </header>
    
    <main class="main">
        <section class="hero">
            <div class="container">
                <h2>欢迎来到我的网站</h2>
                <p>这是一个响应式设计的示例页面</p>
            </div>
        </section>
        
        <section class="features">
            <div class="container">
                <h2>特色功能</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>功能 1</h3>
                        <p>这是第一个功能的描述</p>
                    </div>
                    <div class="feature-card">
                        <h3>功能 2</h3>
                        <p>这是第二个功能的描述</p>
                    </div>
                    <div class="feature-card">
                        <h3>功能 3</h3>
                        <p>这是第三个功能的描述</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 我的网站. 保留所有权利.</p>
        </div>
    </footer>
</body>
</html>
\`\`\`

:::starter-code
提供完整的HTML5语义化结构，包含头部导航、英雄区域、特色功能网格和页脚。学生需要添加响应式CSS样式和媒体查询。
:::

:::hint
1. 设置基本的页面布局和容器样式<br>
2. 为导航添加 Flexbox 布局<br>
3. 使用 Grid 创建特色功能的卡片布局<br>
4. 添加媒体查询适配移动设备<br>
5. 在小屏幕上调整导航和卡片布局
:::

:::solution
完整的响应式网页解决方案，包含：
1. 头部：Flexbox布局，渐变背景，响应式导航
2. 英雄区域：全宽背景，居中文字，响应式字体
3. 特色功能：CSS Grid自适应布局，卡片悬停效果
4. 页脚：简洁设计，版权信息
5. 媒体查询：平板(768px)和手机(480px)断点
6. 移动优先：导航垂直排列，网格单列显示
7. 现代CSS：Flexbox + Grid + 渐变 + 动画
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>响应式设计的概念和重要性</li>
<li>viewport meta 标签的作用</li>
<li>媒体查询的语法和常用断点</li>
<li>Flexbox 弹性布局的响应式应用</li>
<li>CSS Grid 网格布局的强大功能</li>
<li>移动优先的设计策略</li>
</ul>

<p>恭喜你完成了 CSS 基础课程！现在你已经掌握了现代 CSS 的核心技能。</p>`;

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

export default CSSResponsiveDesign;
