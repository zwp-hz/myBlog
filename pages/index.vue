<template>
  <div id="index">
    <loading :load-status="loadStatus"/>
    <header-box :header-data="headerData"/>
    <section id="intro" class="g-r-center" data-0="opacity: 1" data-50p="opacity: 0;">
      <i class="iconfont icon-codestore"/>
      <h1>Welcome to visit My Blog</h1>
    </section>
    <section id="indexMain">
      <div class="u_arrow"/>
      <div class="box box1 g-r-center">
        <div class="weather_box">
          <Weather data-0="left: -150px; opacity: -1;" data-60p="left: 0; opacity: 1;"/>
        </div>
        <div v-if="biyingImg.url" class="wallpaper" :style="'background: url(http://www.bing.com'+biyingImg.url+') #cecec4 no-repeat center bottom'">
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
    ...mapState(['IMGHOST'])
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
