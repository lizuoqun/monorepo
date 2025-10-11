import {defineConfig} from 'vitest/config';

// vitest配置 https://cn.vitest.dev/config/
export default defineConfig({
  test: {
    // 匹配排除测试文件的 glob 规则
    // exclude: ['node_modules'],
    // 匹配包含测试文件的 glob 规则
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'node',
    open: true,
    // 代码覆盖率统计
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html'],
      // 是否显示具有 100% 语句、分支和函数的测试覆盖率的文件
      skipFull: true,
      // 即使测试失败也会生成覆盖率报告
      reportOnFailure: true

    }
  }
});
