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
      { name: 'keywords', content: '朱为鹏, 个人博客' },
      {
        hid: 'description',
        name: 'description',
        content:
          '朱为鹏的个人网站，主要记录博主在开发过程中记录的一些问题和解决方案，以及生活中的图片。'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        innerHTML:
          'window.isWebp = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0;\
          var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?e06aa8a5b02de6f6dfb39cf0a922781d";var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s);})();',
        type: 'text/javascript'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  loading: { color: '#1ed9be' },
  css: ['@/assets/css/base.scss', '@/assets/css/header.scss'],
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
    '~/plugins/axios',
    '~/plugins/filters',
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
