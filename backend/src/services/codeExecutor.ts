import { ICodeExecution } from '../types';

// 代码执行结果类型
export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
}

// 语言类型
export type Language = 'javascript' | 'html' | 'css';

// 代码执行引擎接口
export interface CodeExecutor {
  execute(code: string, language: Language): Promise<CodeExecutionResult>;
}

// JavaScript 代码执行器
export class JavaScriptExecutor implements CodeExecutor {
  async execute(code: string, language: Language): Promise<CodeExecutionResult> {
    const startTime = Date.now();
    
    try {
      // 创建一个安全的执行环境
      const vm = require('vm');
      const context = {
        console: {
          log: (...args: any[]) => args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
        },
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        Math: Math,
        Date: Date,
        JSON: JSON,
        Array: Array,
        Object: Object,
        String: String,
        Number: Number,
        Boolean: Boolean,
        parseInt: parseInt,
        parseFloat: parseFloat,
        isNaN: isNaN,
        isFinite: isFinite,
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent
      };

      // 捕获输出
      let output = '';
      const originalLog = context.console.log;
      context.console.log = (...args: any[]) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        output += message + '\n';
        return message;
      };

      // 执行代码
      const script = new vm.Script(code);
      const result = script.runInNewContext(context, {
        timeout: 5000, // 5秒超时
        displayErrors: true
      });

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: true,
        output: output.trim() || '代码执行成功，无输出',
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    } catch (error: any) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: false,
        error: error.message || '代码执行失败',
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    }
  }
}

// HTML 代码执行器
export class HTMLExecutor implements CodeExecutor {
  async execute(code: string, language: Language): Promise<CodeExecutionResult> {
    const startTime = Date.now();
    
    try {
      // 简单的 HTML 验证
      const htmlPattern = /<html[\s\S]*<\/html>|<head[\s\S]*<\/head>|<body[\s\S]*<\/body>|<div[\s\S]*<\/div>|<p[\s\S]*<\/p>|<h[1-6][\s\S]*<\/h[1-6]>|<span[\s\S]*<\/span>|<a[\s\S]*<\/a>|<img[\s\S]*>|<input[\s\S]*>|<button[\s\S]*<\/button>/i;
      
      if (!htmlPattern.test(code)) {
        return {
          success: false,
          error: '无效的 HTML 代码',
          executionTime: Date.now() - startTime
        };
      }

      // 模拟 HTML 渲染结果
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: true,
        output: `HTML 代码验证通过\n渲染结果预览:\n${code.substring(0, 200)}${code.length > 200 ? '...' : ''}`,
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    } catch (error: any) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: false,
        error: error.message || 'HTML 代码执行失败',
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    }
  }
}

// CSS 代码执行器
export class CSSExecutor implements CodeExecutor {
  async execute(code: string, language: Language): Promise<CodeExecutionResult> {
    const startTime = Date.now();
    
    try {
      // 简单的 CSS 验证
      const cssPattern = /[.#]?[a-zA-Z][\w-]*\s*\{[^}]*\}/;
      
      if (!cssPattern.test(code)) {
        return {
          success: false,
          error: '无效的 CSS 代码',
          executionTime: Date.now() - startTime
        };
      }

      // 模拟 CSS 解析结果
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: true,
        output: `CSS 代码验证通过\n样式规则:\n${code.substring(0, 200)}${code.length > 200 ? '...' : ''}`,
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    } catch (error: any) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: false,
        error: error.message || 'CSS 代码执行失败',
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    }
  }
}

// 代码执行器工厂
export class CodeExecutorFactory {
  private static executors: Map<Language, CodeExecutor> = new Map([
    ['javascript', new JavaScriptExecutor()],
    ['html', new HTMLExecutor()],
    ['css', new CSSExecutor()]
  ]);

  static getExecutor(language: Language): CodeExecutor {
    const executor = this.executors.get(language);
    if (!executor) {
      throw new Error(`不支持的语言: ${language}`);
    }
    return executor;
  }

  static async executeCode(code: string, language: Language): Promise<CodeExecutionResult> {
    const executor = this.getExecutor(language);
    return await executor.execute(code, language);
  }
}

// 代码安全检查
export class CodeSecurityChecker {
  private static dangerousPatterns = [
    /require\s*\(/g,
    /import\s+/g,
    /eval\s*\(/g,
    /Function\s*\(/g,
    /process\./g,
    /global\./g,
    /__dirname/g,
    /__filename/g,
    /fs\./g,
    /child_process/g,
    /exec\s*\(/g,
    /spawn\s*\(/g,
    /fork\s*\(/g
  ];

  static isSafe(code: string): { safe: boolean; reason?: string } {
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(code)) {
        return {
          safe: false,
          reason: '代码包含不安全的操作，无法执行'
        };
      }
    }

    // 检查代码长度
    if (code.length > 10000) {
      return {
        safe: false,
        reason: '代码过长，请简化代码'
      };
    }

    return { safe: true };
  }
}

// 代码格式化工具
export class CodeFormatter {
  static formatJavaScript(code: string): string {
    try {
      // 简单的 JavaScript 格式化
      return code
        .replace(/;\s*/g, ';\n')
        .replace(/\{\s*/g, '{\n  ')
        .replace(/\}\s*/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    } catch (error) {
      return code;
    }
  }

  static formatHTML(code: string): string {
    try {
      // 简单的 HTML 格式化
      return code
        .replace(/></g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    } catch (error) {
      return code;
    }
  }

  static formatCSS(code: string): string {
    try {
      // 简单的 CSS 格式化
      return code
        .replace(/\{\s*/g, '{\n  ')
        .replace(/\}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    } catch (error) {
      return code;
    }
  }
}
