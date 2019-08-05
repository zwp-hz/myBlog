const pkg = require('./package')

module.exports = {
  mode: 'universal',
  head: {
    title: '朱为鹏的个人网站',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover'
      },
      {
        name: 'keywords',
        content: '朱为鹏, 个人博客, 个人网站, 朱为鹏的个人网站'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          '朱为鹏的个人网站，主要记录博主在开发过程中记录的一些问题和解决方案，以及生活中的图片。'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: 'http://pv.sohu.com/cityjson?ie=utf-8' },
      {
        innerHTML:
          'window.isWebp = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0;',
        type: 'text/javascript'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  loading: { color: '#1ed9be' },
  css: [
    '@/assets/css/base.scss',
    '@/assets/css/font.scss',
    '@/assets/css/header.scss'
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8989/'
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },
  plugins: [
    '@/plugins/axios',
    '@/plugins/filters',
    { src: '@/plugins/base', ssr: false },
    { src: '@/assets/js/statistics.ts', ssr: false },
    { src: '@/assets/js/skrollr.min.js', ssr: false }
  ],
  modules: ['@nuxtjs/axios'],
  build: {
    extractCSS: { allChunks: true },
    extend(config, { isDev, isClient, loaders: { imgUrl } }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules||assets)/
        })
      }
      imgUrl.limit = 5000
    }
  }
}
