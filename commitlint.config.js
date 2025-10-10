export default {
  extends: ['@commitlint/config-conventional'],
  // https://commitlint.js.org/reference/rules.html 所有的规则
  rules: {
    // 正文以空行开头
    'body-leading-blank': [2, 'always'],
    // 页脚以空行开头
    'footer-leading-blank': [1, 'always'],
    // 标题最大长度为 100 个字符
    'header-max-length': [2, 'always', 100],
    // 标题不能为空
    'subject-empty': [2, 'never'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 标题必须为小写
    'subject-case': [0],
    // 类型必须为以下值之一
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修复 bug 的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert' // 回退到上一个版本
      ]
    ]
  },
  prompt: {
    // 禁用提交时自动打开浏览器
    enableBrowser: false,
    types: [
      {value: 'feat', name: '新功能✨'},
      {value: 'fix', name: '修复bug🐛'},
      {value: 'docs', name: '文档变更📚'},
      {value: 'style', name: '代码格式💄'},
      {value: 'refactor', name: '重构♻️'},
      {value: 'perf', name: '性能优化⚡️'},
      {value: 'test', name: '增加测试✅'},
      {value: 'build', name: '构建系统📦'},
      {value: 'ci', name: '持续集成🔧'},
      {value: 'chore', name: '构建过程或辅助工具的变动'},
      {value: 'revert', name: '回退⏪'}
    ],
    scopes: ['root', 'backend', 'frontend', 'components', 'utils'],
    allowCustomScopes: true,
    skipQuestions: ['body', 'footerPrefix', 'footer', 'breaking'],
    message: {
      type: '请选择提交类型:',
      scope: '请选择本次提交所影响的范围:',
      subject: '请输入本次提交的描述:',
      body: '请输入本次提交的详细描述（可选）:',
      footerPrefix: '请输入本次提交所关联的issue前缀（可选）:',
      footer: '请输入本次提交所关联的issue（可选）:',
      confirmCommit: '确认提交?'
    }
  }
};
