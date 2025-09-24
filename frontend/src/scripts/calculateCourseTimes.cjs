// 计算课程预计时间的脚本
// 运行方式：node src/scripts/calculateCourseTimes.js

const fs = require('fs');
const path = require('path');

// 时间因子（单位：分钟）
const TIME_FACTORS = {
  readingTimePerKChar: 2,    // 每1000字符2分钟
  executableTime: 3,         // 每个代码示例3分钟
  exerciseTime: 8,           // 每个练习8分钟
  quizTime: 2,              // 每个测验2分钟
  fillBlankTime: 1.5,       // 每个填空题1.5分钟
  dragDropTime: 4,          // 每个拖拽题4分钟
  challengeTime: 15,        // 每个挑战题15分钟
};

// 计算课程时间
function calculateCourseTime(courseContent) {
  // 计算文本阅读时间
  const textContent = courseContent
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/:::[^:]*[\s\S]*?:::/g, '') // 移除交互组件
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/[#*`\-\[\]]/g, '') // 移除Markdown标记
    .trim();
  
  const readingTime = (textContent.length / 1000) * TIME_FACTORS.readingTimePerKChar;
  
  // 计算各种交互组件的时间（支持转义的反引号）
  const executableCount = (courseContent.match(/\\?```executable:/g) || []).length;
  const exerciseCount = (courseContent.match(/:::exercise/g) || []).length;
  const quizCount = (courseContent.match(/:::quiz/g) || []).length;
  const fillBlankCount = (courseContent.match(/:::fill-blank/g) || []).length;
  const dragDropCount = (courseContent.match(/:::drag-drop/g) || []).length;
  const challengeCount = (courseContent.match(/:::challenge/g) || []).length;
  
  const interactiveTime = 
    executableCount * TIME_FACTORS.executableTime +
    exerciseCount * TIME_FACTORS.exerciseTime +
    quizCount * TIME_FACTORS.quizTime +
    fillBlankCount * TIME_FACTORS.fillBlankTime +
    dragDropCount * TIME_FACTORS.dragDropTime +
    challengeCount * TIME_FACTORS.challengeTime;
  
  // 总时间（向上取整到最近的5分钟）
  const totalTime = readingTime + interactiveTime;
  return Math.ceil(totalTime / 5) * 5;
}

// 分析课程内容
function analyzeCourseContent(courseContent) {
  const textLength = courseContent
    .replace(/```[\s\S]*?```/g, '')
    .replace(/:::[^:]*[\s\S]*?:::/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`\-\[\]]/g, '')
    .trim().length;
  
  return {
    textLength,
    executableCount: (courseContent.match(/\\?```executable:/g) || []).length,
    exerciseCount: (courseContent.match(/:::exercise/g) || []).length,
    quizCount: (courseContent.match(/:::quiz/g) || []).length,
    fillBlankCount: (courseContent.match(/:::fill-blank/g) || []).length,
    dragDropCount: (courseContent.match(/:::drag-drop/g) || []).length,
    challengeCount: (courseContent.match(/:::challenge/g) || []).length,
  };
}

// 提取课程内容
function extractCourseContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 提取 courseContent 变量的内容
    const match = content.match(/const courseContent = \`([\s\S]*?)\`;/);
    if (match) {
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error.message);
    return null;
  }
}

// 主函数
function main() {
  const courseDirs = [
    'src/study/html',
    'src/study/css', 
    'src/study/javascript'
  ];
  
  const results = [];
  
  courseDirs.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullDir)) {
      console.log(`目录不存在: ${dir}`);
      return;
    }
    
    const files = fs.readdirSync(fullDir).filter(file => file.endsWith('.tsx'));
    
    files.forEach(file => {
      const filePath = path.join(fullDir, file);
      const courseContent = extractCourseContent(filePath);
      
      if (courseContent) {
        const estimatedTime = calculateCourseTime(courseContent);
        const analysis = analyzeCourseContent(courseContent);
        
        results.push({
          file: `${dir}/${file}`,
          courseId: file.replace('.tsx', ''),
          estimatedTime,
          analysis
        });
      }
    });
  });
  
  // 输出结果
  console.log('\\n=== 课程时间计算结果 ===\\n');
  
  results.forEach(result => {
    console.log(`📚 ${result.courseId} (${result.file})`);
    console.log(`   预计时间: ${result.estimatedTime} 分钟`);
    console.log(`   文本长度: ${result.analysis.textLength} 字符`);
    console.log(`   代码示例: ${result.analysis.executableCount} 个`);
    console.log(`   练习题: ${result.analysis.exerciseCount} 个`);
    console.log(`   测验题: ${result.analysis.quizCount} 个`);
    console.log(`   填空题: ${result.analysis.fillBlankCount} 个`);
    console.log('');
  });
  
  // 统计信息
  const totalTime = results.reduce((sum, r) => sum + r.estimatedTime, 0);
  const avgTime = Math.round(totalTime / results.length);
  
  console.log('=== 统计信息 ===');
  console.log(`总课程数: ${results.length}`);
  console.log(`总学习时间: ${totalTime} 分钟 (${Math.round(totalTime / 60)} 小时)`);
  console.log(`平均时间: ${avgTime} 分钟`);
  
  // 生成更新建议
  console.log('\\n=== 建议的课程时间配置 ===\\n');
  
  results.forEach(result => {
    const difficulty = result.estimatedTime <= 30 ? 'beginner' : 
                      result.estimatedTime <= 60 ? 'intermediate' : 'advanced';
    
    console.log(`  {`);
    console.log(`    id: '${result.courseId}',`);
    console.log(`    estimatedTime: ${result.estimatedTime}, // 计算得出`);
    console.log(`    difficulty: '${difficulty}', // 基于时间建议`);
    console.log(`  },`);
  });
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { calculateCourseTime, analyzeCourseContent };
