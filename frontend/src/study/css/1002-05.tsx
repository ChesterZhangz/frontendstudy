import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const CSSBoxModelAndLayout: React.FC = () => {
  const courseContent = `<h1>CSS 盒模型和布局</h1>

<h2>盒模型基础</h2>

<p>CSS 盒模型是理解布局的基础。每个元素都是一个矩形盒子，包含内容、内边距、边框和外边距。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>盒模型示例</title>
    <style>
        .box-model-demo {
            width: 200px;
            height: 100px;
            padding: 20px;
            border: 5px solid #3498db;
            margin: 30px;
            background-color: #ecf0f1;
            color: #2c3e50;
            text-align: center;
            line-height: 100px;
        }
        
        .content-box {
            box-sizing: content-box;
            background-color: #e74c3c;
            color: white;
        }
        
        .border-box {
            box-sizing: border-box;
            background-color: #27ae60;
            color: white;
        }
        
        .visual-demo {
            position: relative;
            display: inline-block;
        }
        
        .visual-demo::before {
            content: "margin";
            position: absolute;
            top: -25px;
            left: 0;
            right: 0;
            text-align: center;
            color: #e67e22;
            font-size: 12px;
        }
        
        .visual-demo::after {
            content: "";
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border: 2px dashed #e67e22;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <h2>盒模型组成</h2>
    <p>每个元素包含：内容(content) + 内边距(padding) + 边框(border) + 外边距(margin)</p>
    
    <div class="visual-demo">
        <div class="box-model-demo">
            内容区域
        </div>
    </div>
    
    <h2>box-sizing 属性</h2>
    <p>content-box（默认）：宽度只包含内容</p>
    <div class="box-model-demo content-box">content-box</div>
    
    <p>border-box：宽度包含内容+内边距+边框</p>
    <div class="box-model-demo border-box">border-box</div>
</body>
</html>
\`\`\`

<div class="hint-box">
box-sizing: border-box 让元素的宽高包含 padding 和 border，更容易控制布局。这是现代 CSS 的推荐做法。
</div>

:::fill-blank
<h2>填空题：盒模型</h2>

CSS 盒模型从内到外依次是：**{content}**（内容）、**{padding}**（内边距）、**{border}**（边框）、**{margin}**（外边距）。**{box-sizing}** 属性控制宽高的计算方式。
:::

<h2>内边距和外边距</h2>

<p>padding 控制内边距，margin 控制外边距。它们可以分别设置四个方向的值。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>内边距和外边距</title>
    <style>
        .spacing-demo {
            background-color: #3498db;
            color: white;
            margin: 20px 0;
            text-align: center;
        }
        
        .padding-demo1 {
            padding: 20px;
        }
        
        .padding-demo2 {
            padding: 10px 20px;
        }
        
        .padding-demo3 {
            padding: 10px 20px 30px;
        }
        
        .padding-demo4 {
            padding: 10px 15px 20px 25px;
        }
        
        .margin-demo {
            background-color: #e74c3c;
            width: 200px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: white;
        }
        
        .margin-auto {
            margin: 20px auto;
        }
        
        .margin-negative {
            margin-top: -10px;
            background-color: #f39c12;
        }
        
        .container {
            background-color: #ecf0f1;
            padding: 20px;
            margin: 20px 0;
        }
        
        .collapse-demo {
            background-color: #9b59b6;
            color: white;
            margin: 30px 0;
            padding: 15px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h2>内边距 (padding) 示例</h2>
    
    <div class="spacing-demo padding-demo1">
        padding: 20px (四个方向相同)
    </div>
    
    <div class="spacing-demo padding-demo2">
        padding: 10px 20px (上下10px，左右20px)
    </div>
    
    <div class="spacing-demo padding-demo3">
        padding: 10px 20px 30px (上10px，左右20px，下30px)
    </div>
    
    <div class="spacing-demo padding-demo4">
        padding: 10px 15px 20px 25px (上右下左)
    </div>
    
    <h2>外边距 (margin) 示例</h2>
    
    <div class="container">
        <div class="margin-demo">普通外边距</div>
        <div class="margin-demo margin-auto">margin: 20px auto (水平居中)</div>
        <div class="margin-demo margin-negative">负外边距 (margin-top: -10px)</div>
    </div>
    
    <h2>外边距合并</h2>
    <div class="collapse-demo">上边距 30px</div>
    <div class="collapse-demo">下边距 30px (会与上面的边距合并)</div>
</body>
</html>
\`\`\`

<div class="hint-box">
margin: auto 可以实现水平居中。相邻元素的垂直外边距会合并，取较大值。负边距可以让元素重叠。
</div>

:::quiz
<h2>问题：关于内边距和外边距，以下说法正确的是？</h2>

- [x] padding 在边框内部
- [x] margin: auto 可以水平居中
- [x] 相邻元素的垂直边距会合并
- [ ] padding 可以使用负值
:::

<h2>边框样式</h2>

<p>border 属性可以设置边框的宽度、样式和颜色。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>边框样式</title>
    <style>
        .border-demo {
            width: 150px;
            height: 80px;
            margin: 15px;
            padding: 10px;
            display: inline-block;
            text-align: center;
            line-height: 60px;
            background-color: #ecf0f1;
        }
        
        .border-solid { border: 3px solid #3498db; }
        .border-dashed { border: 3px dashed #e74c3c; }
        .border-dotted { border: 3px dotted #27ae60; }
        .border-double { border: 5px double #9b59b6; }
        .border-groove { border: 5px groove #f39c12; }
        .border-ridge { border: 5px ridge #e67e22; }
        
        .border-individual {
            border-top: 3px solid #e74c3c;
            border-right: 3px dashed #f39c12;
            border-bottom: 3px dotted #27ae60;
            border-left: 3px double #3498db;
        }
        
        .border-radius {
            border: 3px solid #9b59b6;
            border-radius: 15px;
        }
        
        .border-radius-individual {
            border: 3px solid #e67e22;
            border-radius: 20px 5px 15px 10px;
        }
        
        .border-circle {
            width: 80px;
            height: 80px;
            border: 3px solid #2c3e50;
            border-radius: 50%;
            line-height: 74px;
        }
        
        .border-image {
            border: 10px solid transparent;
            border-image: linear-gradient(45deg, #3498db, #e74c3c) 1;
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(45deg, #3498db, #e74c3c) border-box;
        }
    </style>
</head>
<body>
    <h2>边框样式</h2>
    
    <div class="border-demo border-solid">solid</div>
    <div class="border-demo border-dashed">dashed</div>
    <div class="border-demo border-dotted">dotted</div>
    <div class="border-demo border-double">double</div>
    <div class="border-demo border-groove">groove</div>
    <div class="border-demo border-ridge">ridge</div>
    
    <h2>不同方向的边框</h2>
    <div class="border-demo border-individual">各边不同</div>
    
    <h2>圆角边框</h2>
    <div class="border-demo border-radius">圆角</div>
    <div class="border-demo border-radius-individual">不同圆角</div>
    <div class="border-demo border-circle">圆形</div>
    
    <h2>渐变边框</h2>
    <div class="border-demo border-image">渐变边框</div>
</body>
</html>
\`\`\`

<div class="hint-box">
border-radius: 50% 可以创建圆形。border-radius 可以分别设置四个角的圆角大小。
</div>

:::quiz
<h2>问题：关于边框，以下说法正确的是？</h2>

- [x] border-radius 可以创建圆角
- [x] 可以为不同方向设置不同边框
- [x] border-radius: 50% 创建圆形
- [ ] 边框样式只有 solid 一种
:::

<h2>实践练习</h2>

:::exercise
<b>练习：创建卡片布局</b>

使用盒模型知识创建美观的卡片布局。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>卡片布局练习</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        /* 为卡片添加样式 */
        
    </style>
</head>
<body>
    <div class="container">
        <h1>产品展示</h1>
        
        <div class="card">
            <div class="card-header">
                <h3>产品 A</h3>
            </div>
            <div class="card-body">
                <p>这是产品 A 的详细描述。它具有优秀的性能和美观的外观。</p>
                <div class="price">￥299</div>
            </div>
            <div class="card-footer">
                <button class="btn">立即购买</button>
            </div>
        </div>
        
        <div class="card featured">
            <div class="card-header">
                <h3>特色产品 B</h3>
            </div>
            <div class="card-body">
                <p>这是我们的特色产品，具有独特的功能和设计。</p>
                <div class="price">￥599</div>
            </div>
            <div class="card-footer">
                <button class="btn">立即购买</button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>产品 C</h3>
            </div>
            <div class="card-body">
                <p>经济实惠的选择，适合预算有限的用户。</p>
                <div class="price">￥199</div>
            </div>
            <div class="card-footer">
                <button class="btn">立即购买</button>
            </div>
        </div>
    </div>
</body>
</html>
\`\`\`

:::starter-code
提供完整的HTML结构，包含三个产品卡片。学生需要添加CSS样式来美化卡片外观、设置边框圆角、阴影效果和按钮样式。
:::

:::hint
1. 为 .card 设置边框、圆角、阴影和间距<br>
2. 为 .featured 卡片设置特殊的边框颜色<br>
3. 为 .price 设置突出的样式<br>
4. 为 .btn 按钮设置内边距和圆角<br>
5. 使用 margin 控制卡片之间的间距
:::

:::solution
完整的卡片布局解决方案，包含：
1. 使用 box-sizing: border-box 统一盒模型
2. 卡片基本样式：白色背景、圆角边框、阴影效果
3. 特色卡片：橙色边框、右上角标签
4. 卡片头部：渐变背景、白色文字
5. 价格区域：红色边框、居中显示
6. 按钮样式：绿色渐变、悬停效果
7. 响应式布局和动画过渡
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>CSS 盒模型的组成：内容、内边距、边框、外边距</li>
<li>box-sizing 属性的作用和使用</li>
<li>padding 和 margin 的设置方法</li>
<li>边框的样式、宽度、颜色设置</li>
<li>圆角边框和特殊边框效果</li>
<li>外边距合并和负边距的应用</li>
</ul>

<p>下一节课我们将学习 CSS 的响应式设计。</p>`;

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

export default CSSBoxModelAndLayout;
