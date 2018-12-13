<template>
  <div id="search">
    <header-box :header-data="headerData"/>
    <div class="titlebar">
      <div class="container clear">
        <h1 v-if="(search.type || routeQuery.type) == '_s'">
          "{{ search.text || routeQuery.text }}"的搜索结果
        </h1>
        <h1 v-else>
          {{ (search.type || routeQuery.type) == 'Category' ? '分类' :
          (search.type || routeQuery.type) }}：{{ search.text || routeQuery.text }}
        </h1>
        <p class="breadcrumbs">
          <nuxt-link class="u_transition_300 u_hover_active" :to="{path: '/blog'}">博客</nuxt-link>
          <span>&gt;</span>
          <strong v-if="(search.type || routeQuery.type) == '_s'">
            "{{ search.text || routeQuery.text }}"
          </strong>
          <strong v-else>{{ search.text || routeQuery.text }}</strong>
        </p>
      </div>
    </div>
    <article-list :search-cnt="search"/>
    <footer-box :blog-page="true"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import headerBox from '~/components/header'
import footerBox from '~/components/footer'
import articleList from '~/components/articleList'

export default {
  head: {
    title: '搜索-朱为鹏的网站'
  },
  components: {
    headerBox,
    footerBox,
    articleList
  },
  data() {
    return {
      headerData: {
        title: 'Search Result',
        searchStatus: true,
        isStatic: true,
        type: 'blog'
      },
      routeQuery: {}
    }
  },
  computed: {
    ...mapState(['search'])
  },
  mounted() {
    // 判断 搜索记录是否存在
    if (!this.search.text) {
      for (var i in this.$route.query) {
        this.routeQuery = {
          type: i,
          text: this.$route.query[i]
        }
      }

      if (!this.routeQuery.type)
        this.routeQuery = {
          type: 'Category',
          text: '全部'
        }
    }
  }
}
</script>

<style lang="scss" scoped>
#search {
  .titlebar {
    position: relative;
    top: -1px;
    background-color: #fff;
    .container {
      margin: 0 auto;
    }
    h1 {
      float: left;
      font-size: 24px;
      line-height: 30px;
      font-weight: normal;
    }
  }
  .breadcrumbs {
    float: right;
    line-height: 30px;
    a,
    strong {
      color: #8d8d8d;
    }
    span {
      padding: 0 10px;
    }
  }
}

#rightBox .box {
  background-color: null;
}
</style>
