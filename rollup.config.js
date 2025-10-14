import {babel} from '@rollup/plugin-babel';
import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import vuePlugin from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

export default {
  // 单入口打包
  // input: './scripts/main.js',
  input: {
    index: './scripts/main.js'
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
    // 处理vue单文件组件（模版）
    vuePlugin(),
    // 处理vue单文件组件（样式）
    postcss({
      // 把样式抽离到单独的文件中
      extract: true,
      // extract: 'dist/my-custom-file-name.css',
      plugins: [cssnano(), autoprefixer()]
    }),
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
