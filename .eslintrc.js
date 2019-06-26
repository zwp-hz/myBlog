module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: ['@nuxtjs'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'vue/require-prop-types': 'off',
    'vue/attributes-order': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/html-self-closing': 'off',
    'no-console': process.env.NUXT_ENV_PATH ? 'warn' : 'off',
    'no-debugger': process.env.NUXT_ENV_PATH ? 'warn' : 'off'
  }
}
