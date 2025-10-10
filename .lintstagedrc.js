export default {
  '**/*.{js,jsx,ts,tsx,vue,html,css,scss,md}': ['cspell lint'],
  '*.{js,ts,vue,md}': ['prettier --write', 'eslint']
};
