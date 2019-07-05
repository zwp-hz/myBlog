<template>
  <div id="search">
    <header-box :header-data="headerData"/>
    <div class="titlebar">
      <div class="container clear">
        <h1
          v-if="(search.type || routeQuery.type) == '_s'"
        >"{{ search.text || routeQuery.text }}"的搜索结果</h1>
        <h1 v-else>
          {{ (search.type || routeQuery.type) == 'Category' ? '分类' :
          (search.type || routeQuery.type) }}：{{ search.text || routeQuery.text }}
        </h1>
        <p class="breadcrumbs">
          <nuxt-link class="u_transition_300 u_hover_active" :to="{path: '/blog'}">博客</nuxt-link>
          <span>&gt;</span>
          <strong
            v-if="(search.type || routeQuery.type) == '_s'"
          >"{{ search.text || routeQuery.text }}"</strong>
          <strong v-else>{{ search.text || routeQuery.text }}</strong>
        </p>
      </div>
    </div>
    <article-list :init-list="article_info"/>
    <footer-box :hots="article_info.data.hots"/>
  </div>
</template>

<script lang='ts'>
'use strict'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { HeaderData } from '~/types/common'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'
import articleList from '~/components/articleList.vue'

@Component({
  async asyncData(app: any) {
    let query = app.query,
      data = await app.$axios
        .post('api/getArticlesList', {
          page: Number(query.page) || 1,
          release: true,
          ...(query._s && { '_s': query._s }),
          ...(query.Tag && { 'Tag': query.Tag }),
          ...(query.Category && { 'Category': query.Category })
        })
        .then(res => {
          if (res.code === 0) {
            return res.data
          }
        })

    return {
      article_info: data
    }
  },
  head: {
    title: '搜索-朱为鹏的个人网站'
  },
  components: {
    headerBox,
    footerBox,
    articleList
  }
})
export default class SearchResult extends Vue {
  // data
  @State('search')
  search

  headerData: HeaderData = {
    title: 'Search Result',
    searchStatus: true,
    isStatic: true,
    type: 'blog'
  }
  article_info: any = {}
  routeQuery: any = {}

  mounted() {
    // 判断 搜索记录是否存在
    if (!this.search.text) {
      for (var i in this.$route.query) {
        this.routeQuery = {
          type: i,
          text: this.$route.query[i]
        }
      }

      if (!this.routeQuery.type) {
        this.routeQuery = {
          type: 'Category',
          text: '全部'
        }
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
