export default {
  input: './scripts/main.ts',
  output: {
    // 单入口打包只需要指定file，不需要指定dir（多入口打包需要指定dir）
    // dir: 'dist',
    file: './dist/bundle.js',
    format: 'iife',
    name: 'modify',
    piugins: []
  },
  plugins: [
    // 插件
  ]
};
