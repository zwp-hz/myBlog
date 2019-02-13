<template>
  <div id="message">
    <header-box :header-data="headerData"/>
    <div class="main">
      <div id="SOHUCS" sid="12345678901234567890"></div>
    </div>
  </div>
</template>

<script>
'use strict'
import headerBox from '~/components/header.vue'

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
    headerBox
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
  height: 100vh;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
  &:before {
    content: ' ';
    position: fixed;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('~assets/images/blog_index_bg.jpg');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .main {
    margin: 0 auto;
    padding: 200px 30px 0;
    max-width: 800px;
  }
}

@media (max-width: 767px) {
  #message .main {
    padding-top: 100px;
  }
}
</style>
