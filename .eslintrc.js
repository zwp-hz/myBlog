module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  plugins: ['vue', 'prettier'],
  rules: {
    'vue/require-prop-types': 'off',
    'vue/attributes-order': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/html-self-closing': 'off',
    'no-console': process.env.NUXT_ENV_PATH ? 'warn' : 'off',
    'no-debugger': process.env.NUXT_ENV_PATH ? 'warn' : 'off'
  }
}
