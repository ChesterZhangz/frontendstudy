import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const CSSColorsAndBackgrounds: React.FC = () => {
  const courseContent = `<h1>CSS 颜色和背景</h1>

<h2>颜色表示方法</h2>

<p>CSS 提供了多种表示颜色的方法，包括颜色名称、十六进制、RGB、HSL 等。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>颜色表示方法</title>
    <style>
        .color-examples {
            padding: 15px;
            margin: 10px 0;
            color: white;
            font-weight: bold;
            text-align: center;
        }
        
        .color-name { background-color: red; }
        .color-hex { background-color: #3498db; }
        .color-hex-short { background-color: #f39; }
        .color-rgb { background-color: rgb(46, 204, 113); }
        .color-rgba { background-color: rgba(231, 76, 60, 0.8); }
        .color-hsl { background-color: hsl(291, 64%, 42%); }
        .color-hsla { background-color: hsla(48, 89%, 60%, 0.7); }
        
        .transparent-bg {
            background-color: transparent;
            border: 2px solid #34495e;
            color: #34495e;
        }
    </style>
</head>
<body>
    <h2>不同的颜色表示方法</h2>
    
    <div class="color-examples color-name">颜色名称: red</div>
    <div class="color-examples color-hex">十六进制: #3498db</div>
    <div class="color-examples color-hex-short">短十六进制: #f39</div>
    <div class="color-examples color-rgb">RGB: rgb(46, 204, 113)</div>
    <div class="color-examples color-rgba">RGBA (透明): rgba(231, 76, 60, 0.8)</div>
    <div class="color-examples color-hsl">HSL: hsl(291, 64%, 42%)</div>
    <div class="color-examples color-hsla">HSLA (透明): hsla(48, 89%, 60%, 0.7)</div>
    <div class="color-examples transparent-bg">透明背景: transparent</div>
</body>
</html>
\`\`\`

<div class="hint-box">
RGB 表示红绿蓝三原色，HSL 表示色相、饱和度、亮度。RGBA 和 HSLA 中的 A 表示透明度（0-1）。
</div>

:::fill-blank
<h2>填空题：颜色表示</h2>

**{RGB}** 表示红绿蓝三原色，**{HSL}** 表示色相饱和度亮度，**{十六进制}** 颜色以井号开头，**{透明度}** 的取值范围是0到1。
:::

<h2>背景属性</h2>

<p>CSS 背景属性可以设置元素的背景颜色、图片、重复方式、位置等。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>背景属性</title>
    <style>
        .bg-examples {
            width: 300px;
            height: 150px;
            margin: 15px 0;
            padding: 20px;
            border: 2px solid #bdc3c7;
            color: white;
            font-weight: bold;
        }
        
        .bg-color {
            background-color: #e74c3c;
        }
        
        .bg-gradient-linear {
            background: linear-gradient(45deg, #3498db, #e74c3c);
        }
        
        .bg-gradient-radial {
            background: radial-gradient(circle, #f1c40f, #e67e22);
        }
        
        .bg-image {
            background-image: url('https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_auto+ret_img/independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        
        .bg-pattern {
            background-image: 
                linear-gradient(45deg, #ecf0f1 25%, transparent 25%), 
                linear-gradient(-45deg, #ecf0f1 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #ecf0f1 75%), 
                linear-gradient(-45deg, transparent 75%, #ecf0f1 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            background-color: #bdc3c7;
            color: #2c3e50;
        }
        
        .bg-multiple {
            background: 
                linear-gradient(rgba(52, 152, 219, 0.8), rgba(52, 152, 219, 0.8)),
                url('https://img.freepik.com/free-photo/portrait-woman-holding-device-taking-photos-world-photography-day_23-2151704402.jpg');
            background-size: cover;
            background-position: center;
        }
    </style>
</head>
<body>
    <h2>背景效果示例</h2>
    
    <div class="bg-examples bg-color">
        纯色背景
    </div>
    
    <div class="bg-examples bg-gradient-linear">
        线性渐变背景
    </div>
    
    <div class="bg-examples bg-gradient-radial">
        径向渐变背景
    </div>
    
    <div class="bg-examples bg-image">
        图片背景
    </div>
    
    <div class="bg-examples bg-pattern">
        图案背景
    </div>
    
    <div class="bg-examples bg-multiple">
        多层背景组合
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
background 是复合属性，可以同时设置颜色、图片、重复、位置等。linear-gradient 创建线性渐变，radial-gradient 创建径向渐变。
</div>

:::quiz
<h2>问题：关于 CSS 背景，以下说法正确的是？</h2>

- [x] background-size: cover 会覆盖整个容器
- [x] linear-gradient 可以创建渐变效果
- [x] 可以同时使用多个背景图片
- [ ] 背景图片默认不会重复
:::

<h2>渐变效果</h2>

<p>CSS 渐变可以在两个或多个颜色之间创建平滑过渡效果。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>渐变效果</title>
    <style>
        .gradient-box {
            width: 200px;
            height: 100px;
            margin: 10px;
            display: inline-block;
            color: white;
            text-align: center;
            line-height: 100px;
            font-weight: bold;
            border-radius: 8px;
        }
        
        .linear-basic {
            background: linear-gradient(to right, #3498db, #e74c3c);
        }
        
        .linear-diagonal {
            background: linear-gradient(45deg, #9b59b6, #f1c40f);
        }
        
        .linear-multi {
            background: linear-gradient(to bottom, #e74c3c, #f39c12, #f1c40f, #27ae60);
        }
        
        .radial-basic {
            background: radial-gradient(circle, #3498db, #2c3e50);
        }
        
        .radial-ellipse {
            background: radial-gradient(ellipse at top, #e67e22, #d35400);
        }
        
        .conic-gradient {
            background: conic-gradient(from 0deg, #e74c3c, #f39c12, #f1c40f, #27ae60, #3498db, #9b59b6, #e74c3c);
        }
        
        .gradient-text {
            background: linear-gradient(45deg, #3498db, #e74c3c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 24px;
            font-weight: bold;
            line-height: 1.2;
            text-align: center;
            padding: 20px;
        }
        
        .gradient-border {
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(45deg, #3498db, #e74c3c) border-box;
            border: 3px solid transparent;
            padding: 20px;
            text-align: center;
            color: #2c3e50;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <h2>线性渐变</h2>
    <div class="gradient-box linear-basic">水平渐变</div>
    <div class="gradient-box linear-diagonal">对角渐变</div>
    <div class="gradient-box linear-multi">多色渐变</div>
    
    <h2>径向渐变</h2>
    <div class="gradient-box radial-basic">圆形渐变</div>
    <div class="gradient-box radial-ellipse">椭圆渐变</div>
    <div class="gradient-box conic-gradient">圆锥渐变</div>
    
    <h2>渐变文字</h2>
    <div class="gradient-text">
        渐变色文字效果
    </div>
    
    <h2>渐变边框</h2>
    <div class="gradient-border">
        这是一个渐变边框的盒子
    </div>
</body>
</html>
\`\`\`

<div class="hint-box">
渐变方向可以用角度（如45deg）或关键词（如to right）指定。conic-gradient 创建圆锥渐变，适合制作色轮效果。
</div>

:::quiz
<h2>问题：关于 CSS 渐变，以下说法正确的是？</h2>

- [x] linear-gradient 创建线性渐变
- [x] radial-gradient 创建径向渐变
- [x] 渐变可以包含多个颜色
- [ ] 渐变只能是水平或垂直方向
:::

<h2>实践练习</h2>

:::exercise
<b>练习：创建彩色卡片</b>

使用各种颜色和背景技术创建美观的卡片。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>彩色卡片练习</title>
    <style>
        /* 在这里添加你的 CSS 样式 */
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            margin: 0;
        }
        
        .card {
            width: 250px;
            height: 150px;
            margin: 15px;
            padding: 20px;
            border-radius: 12px;
            display: inline-block;
            color: white;
            font-weight: bold;
            text-align: center;
            line-height: 1.4;
        }
        
        /* 为每个卡片添加不同的背景效果 */
        
    </style>
</head>
<body>
    <h1 style="color: white; text-align: center;">彩色卡片展示</h1>
    
    <div class="card card1">
        <h3>卡片 1</h3>
        <p>纯色背景</p>
    </div>
    
    <div class="card card2">
        <h3>卡片 2</h3>
        <p>线性渐变</p>
    </div>
    
    <div class="card card3">
        <h3>卡片 3</h3>
        <p>径向渐变</p>
    </div>
    
    <div class="card card4">
        <h3>卡片 4</h3>
        <p>图片背景</p>
    </div>
    
    <div class="card card5">
        <h3>卡片 5</h3>
        <p>多层背景</p>
    </div>
    
    <div class="card card6">
        <h3>卡片 6</h3>
        <p>创意效果</p>
    </div>
</body>
</html>
\`\`\`

:::starter-code
提供基础的HTML结构和CSS框架，学生需要为每个卡片类（card1-card6）添加不同的背景效果。
:::

:::hint
1. 为 .card1 设置纯色背景<br>
2. 为 .card2 设置线性渐变背景<br>
3. 为 .card3 设置径向渐变背景<br>
4. 为 .card4 设置图片背景<br>
5. 为 .card5 设置多层背景效果<br>
6. 为 .card6 创建你自己的创意效果
:::

:::solution
完整的彩色卡片解决方案，包含六种不同的背景效果：
1. 卡片1：纯色背景 (background-color: #e74c3c)
2. 卡片2：线性渐变 (linear-gradient(45deg, #3498db, #9b59b6))
3. 卡片3：径向渐变 (radial-gradient(circle at center, #f39c12, #e67e22))
4. 卡片4：图片背景 + 遮罩层
5. 卡片5：多层背景 + 条纹图案
6. 卡片6：圆锥渐变 + 旋转动画
每个卡片都有悬停动画和阴影效果。
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>颜色的多种表示方法：颜色名称、十六进制、RGB、HSL</li>
<li>透明度的使用：RGBA 和 HSLA</li>
<li>背景属性：颜色、图片、重复、位置、大小</li>
<li>渐变效果：线性渐变、径向渐变、圆锥渐变</li>
<li>高级背景技术：多层背景、渐变文字、渐变边框</li>
</ul>

<p>下一节课我们将学习 CSS 的盒模型和布局。</p>`;

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

export default CSSColorsAndBackgrounds;
