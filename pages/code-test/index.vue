<template>
  <div class="code-test">
    <span @click="toApp">唤起app</span>
  </div>
</template>

<script>
export default {
  head: {
    title: '代码测试'
  },
  methods: {
    toApp() {
      location.href = 'xuelesy://net.xuele.xuelec2/awake'

      setTimeout(function() {
        location.href =
          'https://sj.qq.com/myapp/detail.htm?apkName=net.xuele.xuelec2'
      }, 1000)
    }
  }
}
</script>
