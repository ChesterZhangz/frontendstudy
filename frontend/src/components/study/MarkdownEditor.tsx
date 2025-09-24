import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Download, 
  Maximize2, 
  Minimize2,
  Type,
  Bold,
  Italic,
  List,
  Link,
  Code,
  Image,
  Quote,
  Hash
} from 'lucide-react';

interface MarkdownEditorProps {
  /** 初始Markdown内容 */
  initialContent?: string;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示预览 */
  showPreview?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 内容变化回调 */
  onContentChange?: (content: string) => void;
  /** 保存回调 */
  onSave?: (content: string) => void;
  /** 主题 */
  theme?: 'light' | 'dark';
  /** 高度 */
  height?: string | number;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 全屏切换回调 */
  onFullscreenToggle?: (fullscreen: boolean) => void;
  /** 占位符文本 */
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent = '',
  showToolbar = true,
  showPreview = true,
  editable = true,
  onContentChange,
  onSave,
  height = 500,
  fullscreen = false,
  onFullscreenToggle,
  placeholder = '开始编写你的Markdown内容...'
}) => {
  const [content, setContent] = useState(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(fullscreen);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 监听外部fullscreen变化
  useEffect(() => {
    setIsFullscreenMode(fullscreen);
  }, [fullscreen]);

  // 处理内容变化
  const handleContentChange = (value: string) => {
    setContent(value);
    onContentChange?.(value);
  };

  // 保存内容
  const handleSave = () => {
    onSave?.(content);
  };

  // 复制内容
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // 这里可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 下载内容
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 全屏切换
  const handleFullscreenToggle = () => {
    const newFullscreen = !isFullscreenMode;
    setIsFullscreenMode(newFullscreen);
    onFullscreenToggle?.(newFullscreen);
  };

  // 插入Markdown语法
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea || !editable) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    setContent(newContent);
    onContentChange?.(newContent);
    
    // 设置光标位置
    setTimeout(() => {
      const newStart = start + before.length;
      const newEnd = newStart + textToInsert.length;
      textarea.setSelectionRange(newStart, newEnd);
      textarea.focus();
    }, 0);
  };

  // 工具栏按钮
  const toolbarButtons = [
    {
      icon: Bold,
      label: '粗体',
      action: () => insertMarkdown('**', '**', '粗体文本'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      label: '斜体',
      action: () => insertMarkdown('*', '*', '斜体文本'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: Code,
      label: '行内代码',
      action: () => insertMarkdown('`', '`', '代码'),
      shortcut: 'Ctrl+`'
    },
    {
      icon: Hash,
      label: '标题',
      action: () => insertMarkdown('## ', '', '标题文本'),
      shortcut: 'Ctrl+H'
    },
    {
      icon: List,
      label: '列表',
      action: () => insertMarkdown('- ', '', '列表项'),
      shortcut: 'Ctrl+L'
    },
    {
      icon: Quote,
      label: '引用',
      action: () => insertMarkdown('> ', '', '引用文本'),
      shortcut: 'Ctrl+Q'
    },
    {
      icon: Link,
      label: '链接',
      action: () => insertMarkdown('[', '](url)', '链接文本'),
      shortcut: 'Ctrl+K'
    },
    {
      icon: Image,
      label: '图片',
      action: () => insertMarkdown('![', '](url)', '图片描述'),
      shortcut: 'Ctrl+G'
    }
  ];

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editable) return;
      
      // 检查是否按下了Ctrl或Cmd
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            insertMarkdown('**', '**', '粗体文本');
            break;
          case 'i':
            e.preventDefault();
            insertMarkdown('*', '*', '斜体文本');
            break;
          case '`':
            e.preventDefault();
            insertMarkdown('`', '`', '代码');
            break;
          case 'h':
            e.preventDefault();
            insertMarkdown('## ', '', '标题文本');
            break;
          case 'l':
            e.preventDefault();
            insertMarkdown('- ', '', '列表项');
            break;
          case 'q':
            e.preventDefault();
            insertMarkdown('> ', '', '引用文本');
            break;
          case 'k':
            e.preventDefault();
            insertMarkdown('[', '](url)', '链接文本');
            break;
          case 'g':
            e.preventDefault();
            insertMarkdown('![', '](url)', '图片描述');
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content, editable]);

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
        isFullscreenMode ? 'fixed inset-0 z-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Markdown 编辑器
            </span>
            {editable && (
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                可编辑
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* 格式工具栏 */}
            <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
              {toolbarButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  disabled={!editable}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`${button.label} (${button.shortcut})`}
                >
                  <button.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            {/* 功能按钮 */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title={isPreviewMode ? "编辑模式" : "预览模式"}
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title="复制内容"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
              title="下载文件"
            >
              <Download className="w-4 h-4" />
            </button>
            
            {onFullscreenToggle && (
              <button
                onClick={handleFullscreenToggle}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                title={isFullscreenMode ? "退出全屏" : "全屏"}
              >
                {isFullscreenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 编辑区域 */}
      <div className="flex" style={{ height: isFullscreenMode ? 'calc(100vh - 60px)' : height }}>
        {/* 编辑器 */}
        {(!isPreviewMode || !showPreview) && (
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              readOnly={!editable}
              className="w-full h-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              style={{ 
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                lineHeight: '1.6'
              }}
            />
          </div>
        )}

        {/* 预览区域 */}
        {showPreview && (
          <div className={`${isPreviewMode ? 'w-full' : 'w-1/2'} border-l border-gray-200 dark:border-gray-700`}>
            <MarkdownRenderer 
              content={content} 
              className="h-full p-4 overflow-auto"
            />
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>行数: {content.split('\n').length}</span>
          <span>字符数: {content.length}</span>
          <span>字数: {content.trim().split(/\s+/).length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>快捷键: Ctrl+S 保存</span>
        </div>
      </div>
    </motion.div>
  );
};

// Markdown渲染器组件
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // 简单的Markdown渲染函数
  const renderMarkdown = (text: string) => {
    let html = text
      // 标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">$1</h1>')
      
      // 粗体和斜体
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // 行内代码
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // 代码块
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">$1</code></pre>')
      
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 italic">$1</blockquote>')
      
      // 无序列表
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      
      // 有序列表
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      
      // 换行
      .replace(/\n/g, '<br>');

    // 包装列表项
    html = html
      .replace(/(<li class="ml-4">.*<\/li>)/gs, '<ul class="list-disc list-inside my-2 space-y-1">$1</ul>')
      .replace(/<\/li><br><ul/g, '</li><ul')
      .replace(/<ul class="list-disc list-inside my-2 space-y-1"><ul/g, '<ul class="list-disc list-inside my-2 space-y-1"')
      .replace(/<\/ul><br><\/ul>/g, '</ul></ul>');

    return html;
  };

  return (
    <div 
      className={`prose dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default MarkdownEditor;
export { MarkdownRenderer };
