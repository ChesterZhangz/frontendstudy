import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Save,
  Upload,
  Code,
  HelpCircle,
  Target,
  Move,
  Edit3
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import InteractiveRenderer from './InteractiveRenderer';
import { RendererState, ComponentEvent, EditorState } from '@/types/interactive';

interface InteractiveMarkdownEditorProps {
  /** 初始内容 */
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
  /** 组件完成回调 */
  onComponentComplete?: (event: ComponentEvent) => void;
  /** 组件进度回调 */
  onComponentProgress?: (event: ComponentEvent) => void;
  /** 渲染器状态变化回调 */
  onRendererStateChange?: (state: RendererState) => void;
  /** 高度 */
  height?: string | number;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 全屏切换回调 */
  onFullscreenToggle?: (fullscreen: boolean) => void;
  /** 自定义类名 */
  className?: string;
}

const InteractiveMarkdownEditor: React.FC<InteractiveMarkdownEditorProps> = ({
  initialContent = '',
  showToolbar = true,
  showPreview = true,
  editable = true,
  onContentChange,
  onSave,
  onComponentComplete,
  onComponentProgress,
  onRendererStateChange,
  height = 600,
  fullscreen = false,
  onFullscreenToggle,
  className = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [showRenderedPreview, setShowRenderedPreview] = useState(showPreview);
  const [editorState, setEditorState] = useState<EditorState>({
    content: initialContent,
    cursorPosition: 0,
    selectedText: '',
    isPreviewMode: showPreview,
    isFullscreen: fullscreen,
    isDirty: false
  });
  const [showHelp, setShowHelp] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setContent(initialContent);
    setEditorState(prev => ({ ...prev, content: initialContent }));
  }, [initialContent]);

  // 处理内容变化
  const handleContentChange = (value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);
    setEditorState(prev => ({
      ...prev,
      content: newContent,
      isDirty: newContent !== initialContent
    }));
    onContentChange?.(newContent);
  };

  // 保存内容
  const handleSave = () => {
    onSave?.(content);
    setEditorState(prev => ({ ...prev, isDirty: false }));
  };

  // 复制内容
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // TODO: 添加成功提示
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
    a.download = 'interactive-course.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 上传文件
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setContent(content);
          handleContentChange(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // 插入模板
  const insertTemplate = (template: string) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const selection = editor.getSelection();
    const range = selection || {
      startLineNumber: editor.getPosition().lineNumber,
      startColumn: editor.getPosition().column,
      endLineNumber: editor.getPosition().lineNumber,
      endColumn: editor.getPosition().column
    };

    editor.executeEdits('insert-template', [{
      range,
      text: template
    }]);

    editor.focus();
  };

  // 模板定义
  const templates = {
    exercise: `:::exercise
**练习：JavaScript变量**
请创建一个名为 \`message\` 的变量，并赋值为 "Hello, World!"。

\`\`\`executable:javascript
// 在这里编写你的代码
\`\`\`

:::hint
使用 \`let\` 或 \`const\` 关键字来声明变量
:::

:::solution
\`\`\`javascript
let message = "Hello, World!";
console.log(message);
\`\`\`
:::
:::`,

    quiz: `:::quiz
**问题：以下哪个是JavaScript中的数据类型？**

- [ ] string
- [ ] number  
- [ ] boolean
- [x] 以上都是

:::explanation
JavaScript包含多种数据类型，包括string（字符串）、number（数字）和boolean（布尔值）等。
:::
:::`,

    fillBlank: `:::fill-blank
**填空题：**
HTML中，\`<h1>\` 标签用于创建**{标题|heading|header}**。

在JavaScript中，\`console.log()\` 用于**{输出|打印|显示}**信息到控制台。
:::`,

    dragDrop: `:::drag-drop
**拖拽题：请将HTML标签拖到正确的位置**

:::source
- \`<div>\` - 容器标签
- \`<p>\` - 段落标签  
- \`<img>\` - 图片标签
- \`<a>\` - 链接标签
:::

:::target
:::html-structure
<!DOCTYPE html>
<html>
<head>
    <title>网页标题</title>
</head>
<body>
    {drop-zone:container}
    {drop-zone:paragraph}
    {drop-zone:image}
    {drop-zone:link}
</body>
</html>
:::
:::
:::`,

    challenge: `:::challenge
**挑战：创建一个简单的计算器**

要求：
1. 创建两个输入框用于输入数字
2. 创建四个按钮：加、减、乘、除
3. 显示计算结果

:::starter-code
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>计算器</title>
</head>
<body>
    <!-- 在这里添加你的代码 -->
</body>
</html>
\`\`\`

\`\`\`css
/* 在这里添加样式 */
\`\`\`

\`\`\`javascript
// 在这里添加交互逻辑
\`\`\`
:::

:::test-cases
测试用例1：输入 5 + 3，期望输出 8
测试用例2：输入 10 - 4，期望输出 6
测试用例3：输入 6 * 7，期望输出 42
测试用例4：输入 15 / 3，期望输出 5
:::
:::`
  };

  // 编辑器配置
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // 添加快捷键
    editor.addAction({
      id: 'save-content',
      label: '保存内容',
      keybindings: [2048 | 83], // Ctrl+S
      run: handleSave
    });

    editor.addAction({
      id: 'toggle-preview',
      label: '切换预览',
      keybindings: [2048 | 80], // Ctrl+P
      run: () => setShowRenderedPreview(!showRenderedPreview)
    });

    // 监听光标位置变化
    editor.onDidChangeCursorPosition((e: any) => {
      const lineNumber = e?.position?.lineNumber ?? 1;
      setEditorState(prev => ({
        ...prev,
        cursorPosition: lineNumber
      }));
    });

    // 监听选择变化
    editor.onDidChangeCursorSelection((e: any) => {
      const selectedText = editor.getModel()?.getValueInRange(e.selection) || '';
      setEditorState(prev => ({
        ...prev,
        selectedText
      }));
    });
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: fullscreen ? '100vh' : height }}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            {/* 模板按钮 */}
            <div className="flex items-center space-x-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <button
                onClick={() => insertTemplate(templates.exercise)}
                className="toolbar-button"
                title="插入练习"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTemplate(templates.quiz)}
                className="toolbar-button"
                title="插入选择题"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTemplate(templates.fillBlank)}
                className="toolbar-button"
                title="插入填空题"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTemplate(templates.dragDrop)}
                className="toolbar-button"
                title="插入拖拽题"
              >
                <Move className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertTemplate(templates.challenge)}
                className="toolbar-button"
                title="插入挑战"
              >
                <Target className="w-4 h-4" />
              </button>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowRenderedPreview(!showRenderedPreview)}
                className="toolbar-button"
                title={showRenderedPreview ? "隐藏预览" : "显示预览"}
              >
                {showRenderedPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopy}
                className="toolbar-button"
                title="复制内容"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="toolbar-button"
                title="下载文件"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleUpload}
                className="toolbar-button"
                title="上传文件"
              >
                <Upload className="w-4 h-4" />
              </button>
              {onSave && (
                <button
                  onClick={handleSave}
                  className={`toolbar-button ${editorState.isDirty ? 'text-blue-600 dark:text-blue-400' : ''}`}
                  title="保存内容"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="toolbar-button"
              title="显示帮助"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {onFullscreenToggle && (
              <button
                onClick={() => onFullscreenToggle(!fullscreen)}
                className="toolbar-button"
                title={fullscreen ? "退出全屏" : "全屏"}
              >
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className={`flex ${showRenderedPreview ? 'flex-row' : 'flex-col'} h-[calc(100%-44px)]`}>
        {/* 编辑器 */}
        {editable && (
          <div className={`${showRenderedPreview ? 'w-1/2 border-r border-gray-200 dark:border-gray-700' : 'w-full'}`}>
            <Editor
              height="100%"
              language="markdown"
              value={content}
              onChange={handleContentChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                folding: true,
                lineNumbers: 'on',
                renderWhitespace: 'boundary',
                bracketPairColorization: { enabled: true }
              }}
            />
          </div>
        )}

        {/* 预览区域 */}
        {showRenderedPreview && (
          <div className={`${editable ? 'w-1/2' : 'w-full'} overflow-y-auto`}>
            <div className="p-6">
              <InteractiveRenderer
                content={content}
                onComponentComplete={onComponentComplete}
                onComponentProgress={onComponentProgress}
                onStateChange={onRendererStateChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* 帮助面板 */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                📚 交互式Markdown语法帮助
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">可执行代码块</h5>
                  <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    ```executable:javascript<br/>
                    console.log("Hello!");<br/>
                    ```
                  </code>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">练习</h5>
                  <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    :::exercise<br/>
                    **标题**<br/>
                    描述内容<br/>
                    :::
                  </code>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">选择题</h5>
                  <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    :::quiz<br/>
                    **问题**<br/>
                    - [x] 正确答案<br/>
                    :::
                  </code>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">填空题</h5>
                  <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    :::fill-blank<br/>
                    文本**{`{答案1|答案2}`}**<br/>
                    :::
                  </code>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">拖拽题</h5>
                  <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    :::drag-drop<br/>
                    :::source<br/>
                    - 项目1<br/>
                    :::
                  </code>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">挑战</h5>
                  <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    :::challenge<br/>
                    **标题**<br/>
                    要求列表<br/>
                    :::
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 状态栏 */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>行 {editorState.cursorPosition || 1}</span>
            <span>字符 {content.length}</span>
            {editorState.isDirty && (
              <span className="text-blue-600 dark:text-blue-400">● 未保存</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>交互式Markdown编辑器</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMarkdownEditor;
