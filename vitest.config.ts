import {defineConfig} from 'vitest/config';

// vitest配置 https://cn.vitest.dev/config/
export default defineConfig({
  test: {
    // 匹配排除测试文件的 glob 规则
    // exclude: ['node_modules'],
    // 匹配包含测试文件的 glob 规则
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'node'
  }
});
