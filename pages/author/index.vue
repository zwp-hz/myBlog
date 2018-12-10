<template>
  <div id="author">
    <header-box :header-data="headerData"/>
    <p>3十多年富士康的奶粉进口的十年房价可能的师傅你的空间内房价快速的奶粉是你付款时都能付款</p>
    <p>3十多年富士康的奶粉进口的十年房价可能的师傅你的空间内房价快速的奶粉是你付款时都能付款</p>
    <p>3十多年富士康的奶粉进口的十年房价可能的师傅你的空间内房价快速的奶粉是你付款时都能付款</p>
    <p>3十多年富士康的奶粉进口的十年房价可能的师傅你的空间内房价快速的奶粉是你付款时都能付款</p>
    <p>3十多年富士康的奶粉进口的十年房价可能的师傅你的空间内房价快速的奶粉是你付款时都能付款</p>
  </div>
</template>

<script>
'use strict'
import headerBox from '~/components/header.vue'

export default {
  head: {
    title: '作者'
  },
  components: {
    headerBox
  },
  data() {
    return {
      headerData: {
        searchStatus: false,
        isStatic: true,
        type: 'author'
      }
    }
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

<style lang="scss" scoped>
#author {
  position: relative;
  height: 3000px;
  overflow: hidden;
  background-color: #3498db;
  svg {
    position: fixed;
    top: 100px;
  }
}
</style>
