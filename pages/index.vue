<template>
  <div id="index">
    <loading :load-status="loadStatus"/>
    <header-box :header-data="headerData"/>
    <section class="g-r-center intro" data-0="opacity: 1" data-800="opacity: 0;">
      <i class="iconfont icon-codestore"/>
      <h1>Welcome to visit My Blog</h1>
    </section>
    <div class="u_arrow"/>
    <section class="main" v-if="!device.isMobile">
      <nuxt-link
        class="pc_blog"
        data-1300="transform: translate3d(0, 100vh, 0) scale(1); opacity: 1; display: block;"
        data-2000="transform: translate3d(0, 15vh, 0) scale(1); opacity: 1; display: block;"
        data-2200="transform: translate3d(0, 15vh, 0) scale(1); opacity: 1; display: block;"
        data-3000="transform: translate3d(0, 15vh, 0) scale(0.8); opacity: 0; display: block;"
        data-3001="display: none;"
        :to="{path: '/blog'}"
      >
        <img src="~assets/images/pc_blog.jpg" alt>
      </nuxt-link>
      <div
        class="iphonex"
        data-1300="transform: translate3d(0, 100vh, 0) scale(1) rotate(0deg);"
        data-2000="transform: translate3d(0, 40vh, 0) scale(1) rotate(0deg);"
        data-2200="transform: translate3d(0, 40vh, 0) scale(1) rotate(0deg);"
        data-3000="transform: translate3d(0, 15vh, 0) scale(1.2) rotate(-90deg);"
        data-3800="transform: translate3d(0, 15vh, 0) scale(1.2) rotate(-90deg);"
        data-5000="transform: translate3d(0, 100vh, 0) scale(1.2) rotate(-90deg);"
      >
        <img class="iphone-frame" src="~assets/images/iphoneX.png" alt>
        <div class="iphone-viewport">
          <nuxt-link
            :to="{path: '/blog'}"
            class="medium-profile-iphone"
            data-0="transform: translate3d(0%, 0, 0) scale(1);"
            data-2200="transform: translate3d(0%, 0, 0) scale(1);"
            data-3000="transform: translate3d(100%, 0, 0) scale(0.9);"
          >
            <img src="~assets/images/mobile_blog.jpg" alt>
          </nuxt-link>
          <div
            class="contact g-r-center"
            data-2200="transform: scale(0.5);"
            data-3000="transform: scale(0.9);"
          >
            <div class="box">
              <p>朱为鹏</p>
              <i class="iconfont icon-github" onclick="window.open('https://github.com/zwp-hz')"/>
            </div>
          </div>
        </div>
      </div>
      <p
        class="remind-text1"
        data-1300="transform: translate3d(0, 63vh, 0) scale(0.9); opacity: 0;"
        data-1800="transform: translate3d(0, 53vh, 0) scale(1); opacity: 1;"
        data-2000="transform: translate3d(0, 40vh, 0) scale(1); opacity: 1;"
        data-2200="transform: translate3d(0, 40vh, 0) scale(1); opacity: 1;"
        data-3000="transform: translate3d(0, 40vh, 0) scale(0.5); opacity: 0;"
      >博客效果图，
        <br>不妨点点看~
      </p>
      <p
        class="remind-text2"
        data-2200="transform: translate3d(0, 100vh, 0) scale(0.6); opacity: 0;"
        data-3000="transform: translate3d(0, 80vh, 0) scale(1); opacity: 1;"
        data-3200="transform: translate3d(0, 80vh, 0) scale(1); opacity: 1;"
        data-4000="transform: translate3d(0, 90vh, 0) scale(0.8); opacity: 0;"
        data-5000="transform: translate3d(0, 100vh, 0) scale(0.6); opacity: 0;"
      >跳转github可查看源代码哦~</p>
    </section>
    <section class="else">
      <div class="box box1 g-r-center">
        <div class="weather_box">
          <Weather data-0="left: -150px; opacity: -1;" data-60p="left: 0; opacity: 1;"/>
        </div>
        <div
          v-if="biyingImg.url"
          class="wallpaper"
          :style="'background: url(http://www.bing.com'+biyingImg.url+') #cecec4 no-repeat center bottom'"
        >
          <p ref="p">
            <strong>必应每日壁纸欣赏</strong>
            <span>{{ biyingImg.copyright }}</span>
          </p>
        </div>
      </div>
    </section>
    <footer-box/>
  </div>
</template>

<script>
'use strict'
import { mapState } from 'vuex'
import loading from '~/components/loading.vue'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'
import Weather from '~/components/weather.vue'

export default {
  head: {
    title: '朱为鹏的个人网站'
  },
  components: {
    loading,
    headerBox,
    footerBox,
    Weather
  },
  data() {
    return {
      loadStatus: false, // 加载状态。false：加载中。true：加载完成。
      isWebp: false, // 是否支持webp格式
      headerData: {
        searchStatus: false,
        isStatic: false
      },
      biyingImg: {}
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'device'])
  },
  mounted() {
    let img = new Image()
    this.isWebp = window.isWebp

    this.biyingImg = sessionStorage.biyingImg
      ? JSON.parse(sessionStorage.biyingImg)
      : {}

    // 获取必应图片
    new Promise((resolve, reject) => {
      if (!sessionStorage.biyingImg) {
        this.$axios.post('api/bing').then(res => {
          if (res.code === 0) {
            this.biyingImg = res.data.images[0]
            sessionStorage.biyingImg = JSON.stringify(res.data.images[0])

            resolve()
          }
        })
      } else {
        resolve()
      }
    }).then(() => {
      this.loadStatus = true
      this.$nextTick(() => {
        let p = this.$refs.p,
          height = this.$refs.p.offsetHeight

        p.style.boxShadow = `0 ${height +
          50}px 100px -100px rgba(0, 0, 0, 0.5) inset`
      })
    })
  },
  beforeDestroy() {
    document.onmousemove = null
  },
  methods: {
    searchList(text) {
      let data = {}

      data[text.type] = text.text
      this.$router.push({
        path: '/searchResult',
        query: data
      })
    }
  }
}
</script>

<style lang="scss" src="~/assets/css/index.scss">
</style>
