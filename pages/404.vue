<template>
  <div class="error404">
    <div class="main">
      <i class="iconfont icon-404"></i>
      <p>很抱歉，您访问的页面不在地球上...</p>
      <div class="buttonBox">
        <nuxt-link href="javaScript:void(0);" class="back_index" :to="{path: '/'}">返回首页</nuxt-link>
        <a href="javaScript:void(0);" class="back_next" @click="$router.go(-1);">返回上一页</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: '404-朱为鹏的个人网站'
  }
}
</script>

<style lang="scss" scoped>
.error404 {
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: #f6f6f6;
  i.iconfont {
    font-size: 30em;
  }
  p {
    font-size: 30px;
    text-align: center;
  }
  .buttonBox {
    text-align: center;
    a {
      display: inline-block;
      height: 40px;
      margin: 30px 15px 0;
      padding: 0 30px;
      line-height: 40px;
      color: #fff;
      background-color: #1ed9be;
      border-radius: 5px;
    }
  }
}

@media (max-width: 768px) {
  .error404 {
    i.iconfont {
      font-size: 15em;
    }
    p {
      font-size: 20px;
    }
  }
}
</style>
