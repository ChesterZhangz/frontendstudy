import React from 'react';


interface MarkdownRendererProps {
  /** Markdown内容 */
  content: string;
  /** 自定义CSS类名 */
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {

  // 渲染Markdown内容
  const renderMarkdown = (text: string) => {
    let html = text
      // 代码块 (必须在其他规则之前处理)
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, language, code) => {
        const lang = language || 'text';
        return `<pre class="code-block" data-language="${lang}">${code.trim()}</pre>`;
      })
      
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4 border-b-2 border-gray-300 dark:border-gray-600 pb-3">$1</h1>')
      
      // 粗体和斜体
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em class="text-gray-900 dark:text-white">$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>')
      
      // 删除线
      .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500 dark:text-gray-400">$1</del>')
      
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 px-2 py-1 rounded text-sm font-mono border">$1</code>')
      
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-4"><img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700" /></div>')
      
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic rounded-r-lg">$1</blockquote>')
      
      // 水平线
      .replace(/^---$/gim, '<hr class="my-6 border-gray-300 dark:border-gray-600" />')
      
      // 无序列表
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>')
      
      // 有序列表
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300">$1</li>')
      
      // 表格 (简单支持)
      .replace(/\|(.+)\|/g, (_, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        if (cells.some((cell: string) => cell.includes('---'))) {
          return ''; // 跳过表格分隔行
        }
        const cellElements = cells.map((cell: string) => 
          `<td class="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">${cell}</td>`
        ).join('');
        return `<tr>${cellElements}</tr>`;
      })
      
      // 换行
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300">')
      .replace(/\n/g, '<br>');

    // 包装段落
    html = '<p class="mb-4 text-gray-700 dark:text-gray-300">' + html + '</p>';

    // 处理列表
    html = html
      .replace(/(<li class="ml-4 list-disc[^>]*>.*?<\/li>)/gs, (match) => {
        return `<ul class="list-disc list-inside my-4 space-y-2 ml-4">${match}</ul>`;
      })
      .replace(/(<li class="ml-4 list-decimal[^>]*>.*?<\/li>)/gs, (match) => {
        return `<ol class="list-decimal list-inside my-4 space-y-2 ml-4">${match}</ol>`;
      })
      .replace(/<\/li><br><(ul|ol)/g, '</li><$1')
      .replace(/<(ul|ol)[^>]*><(ul|ol)/g, '<$1')
      .replace(/<\/(ul|ol)><br><\/(ul|ol)>/g, '</$1></$1>');

    // 处理表格
    html = html
      .replace(/(<tr>.*?<\/tr>)/gs, (_) => {
        return `<table class="w-full border-collapse border border-gray-200 dark:border-gray-700 my-4"><tbody>${_}</tbody></table>`;
      })
      .replace(/<\/tr><br><table/g, '</tr></tbody></table><table')
      .replace(/<table[^>]*><tbody><table/g, '<table');

    return html;
  };

  // 处理代码块
  const processCodeBlocks = (html: string) => {
    const codeBlockRegex = /<pre class="code-block" data-language="([^"]*)">([\s\S]*?)<\/pre>/g;
    return html.replace(codeBlockRegex, (_, language, code) => {
      return `<div class="code-highlight" data-language="${language}" data-code="${encodeURIComponent(code)}"></div>`;
    });
  };

  // 渲染处理后的HTML
  const processedHtml = processCodeBlocks(renderMarkdown(content));

  return (
    <div className={`markdown-content ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      
      {/* 渲染代码高亮 */}
      {processedHtml.includes('code-highlight') && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const codeBlocks = document.querySelectorAll('.code-highlight');
                codeBlocks.forEach(block => {
                  const language = block.getAttribute('data-language');
                  const code = decodeURIComponent(block.getAttribute('data-code'));
                  
                  // 创建语法高亮元素
                  const pre = document.createElement('pre');
                  pre.className = 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4';
                  
                  const codeElement = document.createElement('code');
                  codeElement.className = \`language-\${language}\`;
                  codeElement.textContent = code;
                  
                  pre.appendChild(codeElement);
                  block.parentNode.replaceChild(pre, block);
                  
                  // 添加语言标签
                  if (language && language !== 'text') {
                    const langLabel = document.createElement('div');
                    langLabel.className = 'bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-t-lg -mb-1 inline-block';
                    langLabel.textContent = language.toUpperCase();
                    pre.parentNode.insertBefore(langLabel, pre);
                  }
                });
              });
            `
          }}
        />
      )}
    </div>
  );
};

// 简单的Markdown预览组件
export const SimpleMarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const renderSimpleMarkdown = (text: string) => {
    return text
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">$1</h1>')
      
      // 粗体和斜体
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // 行内代码
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 换行
      .replace(/\n/g, '<br>');
  };

  return (
    <div 
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;
