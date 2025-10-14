import {babel} from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';

export default {
  // 单入口打包
  // input: './scripts/main.ts',
  input: {
    index: './scripts/main.ts'
  },
  output: [
    {
      // 单入口用这个指定打包文件名
      // file: './dist/bundle.js',
      // 多入口用这个指定打包目录
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].min.js',
      plugins: [terser()]
    },
    {
      dir: 'dist',
      format: 'iife',
      name: 'modify',
      entryFileNames: '[name].js'
    }
  ],
  plugins: [
    // babel 代码降级插件
    babel({babelHelpers: 'runtime', exclude: 'node_modules/**', extensions: ['.js', '.jsx', 'ts', '.tsx']}),
    // 清除 dist 目录插件
    clear({
      targets: ['dist'],
      watch: true
    }),
    // 根据模版生成 html，自动注入打包结果
    htmlTemplate({
      // 模版文件位置
      template: './scripts/index.html',
      // 和output.dir指定的目录一致
      target: 'index.html',
      attrs: ['type="module"']
    }),
    // 打包第三方依赖
    nodeResolve({browser: true}),
    // 替换打包结果中的关键词（浏览器不兼容）
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __buildDate__: () => JSON.stringify(new Date()),
      __buildVersion: 15,
      // 防止替换字符串后跟单个等号
      preventAssignment: true
    }),
    // 启动一个静态服务器
    serve({
      open: true,
      contentBase: 'dist',
      openPage: '/index.html',
      host: 'localhost',
      port: 10000
    })
  ]
};
