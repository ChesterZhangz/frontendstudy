import React from 'react';
import InteractiveRenderer from '@/components/interactive/InteractiveRenderer';

const HTMLImagesAndMedia: React.FC = () => {
  const courseContent = `<h1>HTML 图片和媒体</h1>

<h2>图片标签（img）</h2>

<p>图片是网页内容的重要组成部分，HTML 使用 <code>&lt;img&gt;</code> 标签来显示图片。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>图片示例</title>
</head>
<body>
    <h2>我的照片</h2>
    <img src="https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_auto+ret_img/independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled.jpeg" 
         alt="美丽的风景照片" 
         width="400" 
         height="300">
    
    <p>这是一张真实的风景照片。试试修改图片的宽度和高度属性！</p>
    
    <h3>不同类型的图片</h3>
    <img src="https://img.freepik.com/free-photo/portrait-woman-holding-device-taking-photos-world-photography-day_23-2151704402.jpg" 
         alt="人物摄影照片" 
         width="300" 
         height="200">
    
    <p>这是一张人物摄影照片。</p>
</body>
</html>
\`\`\`

<div class="hint-box">
<code>src</code> 属性指定图片的地址，<code>alt</code> 属性提供图片的替代文本，<code>width</code> 和 <code>height</code> 属性控制图片的显示尺寸。
</div>

<h3>图片的重要属性</h3>

:::fill-blank
<h2>填空题：图片属性</h2>

**{src}** 属性指定图片的源地址，**{alt}** 属性提供图片的替代文本，**{width}** 和 **{height}** 属性控制图片的显示尺寸。
:::

:::quiz
<h2>问题：关于 HTML 图片标签，以下说法正确的是？</h2>

- [x] img 标签是自闭合标签
- [x] alt 属性对无障碍访问很重要
- [x] src 属性是必需的
- [ ] 图片必须设置 width 和 height 属性
:::

<h2>音频标签（audio）</h2>

<p>HTML5 引入了 <code>&lt;audio&gt;</code> 标签来播放音频文件。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>音频示例</title>
</head>
<body>
    <h2>音频播放器</h2>
    
    <audio controls>
        <source src="http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3" type="audio/mpeg">
        <source src="http://downsc.chinaz.net/files/download/sound1/201206/1638.mp3" type="audio/mpeg">
        您的浏览器不支持音频播放。
    </audio>
    
    <p>上面是一个音频播放器，包含播放控制按钮。</p>
    
    <h3>不同的音频设置</h3>
    <audio controls muted loop>
        <source src="http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3" type="audio/mpeg">
        您的浏览器不支持音频播放。
    </audio>
    <p>这个音频设置了静音和循环播放。</p>
</body>
</html>
\`\`\`

<div class="hint-box">
<code>controls</code> 属性显示播放控制界面，<code>autoplay</code> 自动播放，<code>muted</code> 静音，<code>loop</code> 循环播放。使用多个 <code>&lt;source&gt;</code> 标签提供不同格式的音频文件。
</div>

<h2>视频标签（video）</h2>

<p><code>&lt;video&gt;</code> 标签用于在网页中嵌入视频内容。</p>

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>视频示例</title>
</head>
<body>
    <h2>视频播放器</h2>
    
    <video width="400" height="300" controls>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
        您的浏览器不支持视频播放。
    </video>
    
    <p>这是一个视频播放器，支持多种视频格式。</p>
    
    <h3>带预览图的视频</h3>
    <video width="300" height="200" controls poster="https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_auto+ret_img/independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled.jpeg">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
    </video>
    <p>这个视频设置了预览图（poster）。</p>
</body>
</html>
\`\`\`

<div class="hint-box">
<code>poster</code> 属性设置视频的预览图，在视频加载或播放前显示。视频标签支持与音频标签相同的属性。
</div>

:::quiz
<h2>问题：关于 HTML 媒体标签，以下说法正确的是？</h2>

- [x] audio 标签用于播放音频
- [x] video 标签用于播放视频
- [x] 可以为视频设置预览图
- [ ] 所有浏览器都支持相同的媒体格式
:::

<h2>实践练习</h2>

:::exercise
<b>练习：创建多媒体展示页面</b>

创建一个包含图片、音频、视频的多媒体展示页面。

\`\`\`executable:html
<!DOCTYPE html>
<html>
<head>
    <title>我的多媒体页面</title>
</head>
<body>
    <!-- 创建一个多媒体展示页面 -->
    <!-- 要求：包含风景图片、人物图片、音频播放器、视频播放器 -->
    <!-- 使用真实的图片和音频链接 -->
</body>
</html>
\`\`\`

:::hint
1. 添加风景照片和人物照片<br>
2. 添加音频播放器，设置适当的控制选项<br>
3. 添加视频播放器，包含预览图<br>
4. 使用适当的标题和描述文本<br>
5. 确保所有媒体元素都有替代文本或后备内容
:::

:::solution
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>我的多媒体页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        h1 { color: #2c3e50; text-align: center; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
        .gallery { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
        .gallery img { border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .media-section { margin: 30px 0; padding: 20px; background: white; border-radius: 10px; }
        audio, video { width: 100%; max-width: 500px; }
    </style>
</head>
<body>
    <!-- 页面标题 -->
    <h1>我的多媒体展示页面</h1>
    
    <!-- 图片画廊 -->
    <div class="media-section">
        <h2>图片画廊</h2>
        <div class="gallery">
            <img src="https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_auto+ret_img/independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled.jpeg" 
                 alt="美丽的风景照片" 
                 width="300" 
                 height="200">
            
            <img src="https://img.freepik.com/free-photo/portrait-woman-holding-device-taking-photos-world-photography-day_23-2151704402.jpg" 
                 alt="人物摄影照片" 
                 width="300" 
                 height="200">
        </div>
        <p>这些是精选的摄影作品，展示了自然风光和人物肖像。</p>
    </div>
    
    <!-- 音频播放器 -->
    <div class="media-section">
        <h2>音频播放</h2>
        <audio controls>
            <source src="http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3" type="audio/mpeg">
            <source src="http://downsc.chinaz.net/files/download/sound1/201206/1638.mp3" type="audio/mpeg">
            您的浏览器不支持音频播放功能。
        </audio>
        <p>这是一段优美的背景音乐，适合放松心情。</p>
    </div>
    
    <!-- 视频播放器 -->
    <div class="media-section">
        <h2>视频展示</h2>
        <video width="500" height="300" controls poster="https://cdn.shortpixel.ai/spai/q_lossless+w_1082+to_auto+ret_img/independent-photo.com/wp-content/uploads/2022/02/Yifeng-Ding-scaled.jpeg">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">
            您的浏览器不支持视频播放功能。
        </video>
        <p>这是一个演示视频，展示了多媒体内容的使用方法。</p>
    </div>
</body>
</html>
\`\`\`
:::
:::

<h2>小结</h2>

<p>本节课我们学习了：</p>

<ul>
<li>图片标签（img）的使用和重要属性</li>
<li>音频标签（audio）的基本用法和控制选项</li>
<li>视频标签（video）的使用和预览图设置</li>
<li>多媒体内容的无障碍访问考虑</li>
<li>不同浏览器的媒体格式兼容性</li>
</ul>

<p>下一节课我们将学习表格和表单的创建与使用。</p>`;

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

export default HTMLImagesAndMedia;