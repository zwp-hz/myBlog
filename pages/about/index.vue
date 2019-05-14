<template>
  <div id="about">
    <header-box :header-data="headerData"/>
    <section class="content">
      <div class="main"></div>
      <div class="guestbook">
        <h3>一直留言，一直爽</h3>
        <comment :list="guestbook_list" :type="'guestbook'"></comment>
      </div>
    </section>
    <footer-box/>
  </div>
</template>

<script>
'use strict'
import headerBox from '~/components/header.vue'
import comment from '~/components/comment.vue'
import footerBox from '~/components/footer.vue'

export default {
  async asyncData(app) {
    let data = await app.$axios.post('api/getGuestbookList').then(res => {
      if (res.code === 0) {
        return res.data
      }
    })
    return {
      guestbook_list: data
    }
  },
  head: {
    title: '关于我-朱为鹏的网站'
  },
  components: {
    headerBox,
    comment,
    footerBox
  },
  data() {
    return {
      headerData: {
        title: '关于我',
        searchStatus: false,
        isStatic: true
      },
      guestbook_list: []
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#about {
  .content {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 30px;
    h3 {
      font-size: 18px;
      line-height: 40px;
      text-align: center;
    }
  }
}

@media (max-width: 1300px) {
  .content {
    max-width: 800px !important;
  }
}
</style>
