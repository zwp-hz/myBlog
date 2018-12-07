const pkg = require('./package')

module.exports = {
  mode: 'universal',
  head: {
    title: '🐷的个人网站',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        innerHTML:
          'window.isWebp = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0',
        type: 'text/javascript'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  loading: { color: '#1ed9be' },
  css: ['@/assets/css/base.scss'],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8989/'
  },
  plugins: [
    '~/plugins/axios',
    '~/plugins/filters',
    '~/plugins/directive',
    { src: '~/assets/js/skrollr.min.js', ssr: false }
  ],
  modules: ['@nuxtjs/axios'],
  build: {
    extend(
      config,
      {
        isDev,
        isClient,
        loaders: { imgUrl }
      }
    ) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      imgUrl.limit = 5000
    }
  }
}
