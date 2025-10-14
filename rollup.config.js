import {babel} from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';

export default {
  // 单入口打包
  // input: './scripts/main.ts',
  input: {
    index: './scripts/main.ts'
  },
  output: [{
    // 单入口用这个指定打包文件名
    // file: './dist/bundle.js',
    // 多入口用这个指定打包目录
    dir: 'dist',
    format: 'iife',
    entryFileNames: '[name].min.js',
    plugins: [terser()]
  }, {
    dir: 'dist',
    format: 'iife',
    entryFileNames: '[name].js'
  }],
  plugins: [
    // babel 代码降级插件
    babel({babelHelpers: 'runtime', exclude: 'node_modules/**', extensions: ['.js', '.jsx', 'ts', '.tsx']}),
    // 清除 dist 目录插件
    clear({
      targets: ['dist'],
      watch: true
    })
  ]
};
