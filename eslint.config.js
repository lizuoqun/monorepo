import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';

// 忽略的文件
const ignores = ['**/dist/**', '**/node_modules/**', '.*', 'scripts/**', '**/*.d.ts'];

export default defineConfig(
  // 通用配置
  {
    ignores,
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    plugins: { prettier: eslintPluginPrettier },
    languageOptions: {
      ecmaVersion: 'latest', // ECMAScript 版本
      sourceType: 'module', // 模块化类型
      parser: tseslint.parser // 解析器
    },
    rules: {
      // 自定义规则
      // 禁止使用 var
      'no-var': 'error'
    }
  },
  // 前端配置
  {
    ignores,
    files: ['app/frontend/**/*.{js,jsx,ts,tsx,vue}', 'packages/components/**/*.{js,jsx,ts,tsx,vue}'],
    extends: [...eslintPluginVue.configs['flat/recommended'], eslintConfigPrettier],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  // 后端配置
  {
    ignores,
    files: ['apps/backend/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
);
