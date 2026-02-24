export default {
  input: {
    index: './src/index1.ts'
  },
  output: [
    {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].min.js',
      sourcemap: true
    }
  ]
};
