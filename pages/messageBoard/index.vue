<template>
  <div id="message">
    <header-box :header-data="headerData"/>
    <div class="main">
      <div class="head">
        <h2>欢迎留言~</h2>
        <i class="iconfont icon-navicon-hdbk"/>
      </div>
      <div id="SOHUCS" sid="12345678901234567890"></div>
      <div class="board-bg">
        <i class="iconfont icon-fsux_tubiao_qipaotu"/>
        <i class="iconfont icon-qipao"/>
      </div>
    </div>
    <footer-box/>
  </div>
</template>

<script>
'use strict'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'

export default {
  head: {
    title: '留言板-朱为鹏的网站',
    script: [
      {
        src: 'https://changyan.sohu.com/upload/changyan.js'
      }
    ]
  },
  components: {
    headerBox,
    footerBox
  },
  data() {
    return {
      headerData: {
        searchStatus: false,
        isStatic: true,
        type: 'message'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.changyan.api.config({
        appid: 'cytYjVfKw',
        conf: 'prod_b410f9207abb469c925d5a87d0d295dc'
      })
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#message {
  position: relative;
  .main {
    min-height: 100vh;
    margin: 0 auto;
    padding: 150px 30px 100px;
    max-width: 800px;
    .head {
      position: relative;
      text-align: center;
      .icon-navicon-hdbk {
        position: absolute;
        top: -10px;
        right: 0;
        font-size: 30px;
      }
    }
    .board-bg {
      position: fixed;
      top: 180px;
      left: 50%;
      width: 100%;
      min-height: 100vh;
      max-width: 800px;
      transform: translate(-50%, 0);
      .icon-fsux_tubiao_qipaotu {
        position: absolute;
        top: 150px;
        left: -100px;
        font-size: 100px;
        color: #1ed9be;
      }
      .icon-qipao {
        position: absolute;
        top: 400px;
        right: -100px;
        font-size: 100px;
        color: #1ed9be;
      }
    }
  }
}

#footer {
  position: fixed;
  bottom: 0;
}

@media (max-width: 767px) {
  #message .main {
    padding-top: 60px;
  }
}
</style>
