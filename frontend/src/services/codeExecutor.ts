// 代码执行引擎
export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  html?: string;
  logs?: string[];
}

export interface CodeExecutor {
  execute(code: string, language: 'javascript' | 'html' | 'css'): Promise<ExecutionResult>;
}

// JavaScript代码执行器
class JavaScriptExecutor implements CodeExecutor {
  async execute(code: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    
    try {


      // 使用 Promise 和 setTimeout 来创建一个安全的执行环境
      await new Promise<void>((resolve, reject) => {
        try {
          // 创建一个隔离的执行环境
          const isolatedCode = `
            // 模拟控制台
            const mockConsole = {
              log: (...args) => {
                self.postMessage({ type: 'log', data: args });
              },
              error: (...args) => {
                self.postMessage({ type: 'error', data: args });
              },
              warn: (...args) => {
                self.postMessage({ type: 'warn', data: args });
              }
            };
            
            // 将 console 指向 mockConsole 以捕获日志
            const console = mockConsole;

            // 提供安全的全局对象（避免重复声明）
            const MathObj = self.Math;
            const DateObj = self.Date;
            const JSONObj = self.JSON;
            const ArrayObj = self.Array;
            const ObjectObj = self.Object;
            const StringObj = self.String;
            const NumberObj = self.Number;
            const BooleanObj = self.Boolean;
            const parseIntFunc = self.parseInt;
            const parseFloatFunc = self.parseFloat;
            const isNaNFunc = self.isNaN;
            const isFiniteFunc = self.isFinite;
            
            // 重新赋值给常用名称
            const Math = MathObj;
            const Date = DateObj;
            const JSON = JSONObj;
            const Array = ArrayObj;
            const Object = ObjectObj;
            const String = StringObj;
            const Number = NumberObj;
            const Boolean = BooleanObj;
            const parseInt = parseIntFunc;
            const parseFloat = parseFloatFunc;
            const isNaN = isNaNFunc;
            const isFinite = isFiniteFunc;
            
            // 执行用户代码
            ${code}
            
            // 执行完成
            self.postMessage({ type: 'complete' });
          `;

          // 创建 Worker
          const workerBlob = new Blob([isolatedCode], { type: 'application/javascript' });
          const workerUrl = URL.createObjectURL(workerBlob);
          const worker = new Worker(workerUrl);

          // 设置超时
          const timeout = setTimeout(() => {
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            reject(new Error('代码执行超时'));
          }, 5000);

          // 监听 Worker 消息
          worker.onmessage = (event) => {
            const { type, data } = event.data;
            
            switch (type) {
              case 'log':
                logs.push(data.join(' '));
                break;
              case 'error':
                logs.push(`ERROR: ${data.join(' ')}`);
                break;
              case 'warn':
                logs.push(`WARN: ${data.join(' ')}`);
                break;
              case 'complete':
                clearTimeout(timeout);
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                resolve();
                break;
            }
          };

          worker.onerror = (error) => {
            clearTimeout(timeout);
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            reject(error);
          };

        } catch (error) {
          reject(error);
        }
      });

      const executionTime = Date.now() - startTime;
      
      return {
        success: true,
        output: logs.join('\n'),
        logs,
        executionTime
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message || '代码执行出错',
        output: logs.join('\n'),
        logs,
        executionTime
      };
    }
  }
}

// HTML/CSS执行器
class HTMLCSSExecutor implements CodeExecutor {
  async execute(code: string, language: 'html' | 'css'): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      let html = '';
      
      if (language === 'html') {
        html = code;
      } else if (language === 'css') {
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              ${code}
            </style>
          </head>
          <body>
            <h1>CSS样式预览</h1>
            <p>这是一个段落，用于展示CSS样式效果。</p>
            <div class="container">
              <button>按钮</button>
              <input type="text" placeholder="输入框" />
            </div>
          </body>
          </html>
        `;
      }

      const executionTime = Date.now() - startTime;
      
      return {
        success: true,
        html,
        output: `${language.toUpperCase()} 代码已生成预览`,
        executionTime
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message || `${language.toUpperCase()} 代码解析出错`,
        executionTime
      };
    }
  }
}

// 代码执行工厂
export class CodeExecutorFactory {
  private static jsExecutor = new JavaScriptExecutor();
  private static htmlCssExecutor = new HTMLCSSExecutor();

  static async executeCode(code: string, language: 'javascript' | 'html' | 'css'): Promise<ExecutionResult> {
    // 安全检查
    if (!this.isSafeCode(code)) {
      return {
        success: false,
        error: '代码包含不安全的内容，请检查后重试',
        executionTime: 0
      };
    }

    // 超时控制
    const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
      setTimeout(() => {
        reject(new Error('代码执行超时（超过10秒）'));
      }, 10000);
    });

    try {
      let executionPromise: Promise<ExecutionResult>;
      
      if (language === 'javascript') {
        executionPromise = this.jsExecutor.execute(code);
      } else {
        executionPromise = this.htmlCssExecutor.execute(code, language);
      }

      return await Promise.race([executionPromise, timeoutPromise]);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '代码执行失败',
        executionTime: 0
      };
    }
  }

  // 安全检查
  private static isSafeCode(code: string): boolean {
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /document\./,
      /window\./,
      /location\./,
      /history\./,
      /navigator\./,
      /XMLHttpRequest/,
      /fetch\s*\(/,
      /WebSocket/,
      /Worker/,
      /import\s*\(/,
      /require\s*\(/,
      /process\./,
      /__proto__/,
      /constructor/,
      /prototype/,
      /while\s*\(\s*true\s*\)/,
      /for\s*\(\s*;\s*;\s*\)/,
      /setInterval\s*\([^,]*,\s*[0-9]*\s*\)/
    ];

    return !dangerousPatterns.some(pattern => pattern.test(code));
  }

  // 代码美化
  static formatCode(code: string, language: string): string {
    // 简单的代码格式化
    switch (language) {
      case 'javascript':
        return this.formatJavaScript(code);
      case 'html':
        return this.formatHTML(code);
      case 'css':
        return this.formatCSS(code);
      default:
        return code;
    }
  }

  private static formatJavaScript(code: string): string {
    // 简单的JavaScript格式化
    return code
      .replace(/;/g, ';\n')
      .replace(/\{/g, ' {\n  ')
      .replace(/\}/g, '\n}')
      .replace(/,/g, ',\n  ')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  private static formatHTML(code: string): string {
    // 简单的HTML格式化
    let formatted = code;
    let indent = 0;
    const indentSize = 2;
    
    formatted = formatted.replace(/></g, '>\n<');
    
    return formatted
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('</')) {
          indent -= indentSize;
        }
        const result = ' '.repeat(Math.max(0, indent)) + trimmed;
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indent += indentSize;
        }
        return result;
      })
      .join('\n');
  }

  private static formatCSS(code: string): string {
    // 简单的CSS格式化
    return code
      .replace(/\{/g, ' {\n  ')
      .replace(/\}/g, '\n}\n')
      .replace(/;/g, ';\n  ')
      .replace(/,/g, ',\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }
}

// 测试用例验证器
export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

export class TestCaseValidator {
  static async validateCode(code: string, testCases: TestCase[]): Promise<{
    passed: number;
    total: number;
    results: Array<{
      testCase: TestCase;
      passed: boolean;
      actualOutput?: any;
      error?: string;
    }>;
  }> {
    const results = [];
    let passed = 0;

    for (const testCase of testCases) {
      try {
        // 创建测试代码
        const testCode = `
          ${code}
          
          // 测试输入
          const input = ${JSON.stringify(testCase.input)};
          const result = typeof main === 'function' ? main(input) : eval(input);
          console.log(JSON.stringify(result));
        `;

        const executionResult = await CodeExecutorFactory.executeCode(testCode, 'javascript');
        
        if (executionResult.success && executionResult.output) {
          try {
            const actualOutput = JSON.parse(executionResult.output.trim());
            const testPassed = JSON.stringify(actualOutput) === JSON.stringify(testCase.expectedOutput);
            
            results.push({
              testCase,
              passed: testPassed,
              actualOutput
            });
            
            if (testPassed) passed++;
          } catch {
            results.push({
              testCase,
              passed: false,
              error: '输出格式错误'
            });
          }
        } else {
          results.push({
            testCase,
            passed: false,
            error: executionResult.error || '执行失败'
          });
        }
      } catch (error: any) {
        results.push({
          testCase,
          passed: false,
          error: error.message
        });
      }
    }

    return {
      passed,
      total: testCases.length,
      results
    };
  }
}
