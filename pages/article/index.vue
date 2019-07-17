<template>
  <div id="article">
    <header-box :header-data="headerData"/>
    <div id="main" class="g-r-center">
      <div class="container">
        <ul class="categories g-r-center">
          <li @click="categoriesName = '全部'">
            <nuxt-link
              class="u_transition_300 u_hover_active_bg"
              :class="{cur: categoriesName === '全部'}"
              :to="{path: '/article'}"
            >全部</nuxt-link>
          </li>
          <li @click="categoriesName = item.name" v-for="(item, index) in categories" :key="index">
            <nuxt-link
              class="u_transition_300 u_hover_active_bg"
              :class="{cur: categoriesName === item.name}"
              :to="{path: '/article', query: {categories: item.name}}"
            >{{ item.name }}</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <article-list :categories-name="categoriesName" :init-list="article_info"/>
    <footer-box :hots="article_info.data.hots"/>
  </div>
</template>

<script lang='ts'>
'use strict'
import { Vue, Component } from 'vue-property-decorator'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'
import articleList from '~/components/articleList.vue'

@Component({
  async asyncData(app: any) {
    let data = await app.$axios
      .post('api/getArticlesList', {
        page: Number(app.query.page) || 1,
        release: true,
        Category: app.query.categories || '全部'
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
    title: '博客-朱为鹏的个人网站'
  },
  components: {
    headerBox,
    footerBox,
    articleList
  }
})
export default class Article extends Vue {
  // data
  headerData: HeaderData = {
    title: '文章',
    searchStatus: true,
    isStatic: true
  }
  article_info: any = {}
  categories: string[] = []
  categoriesName: string | string[] = ''

  created() {
    this.categoriesName = this.$route.query.categories || '全部'
  }

  mounted() {
    ;(<any>this).$axios.post('api/getCategoryList').then((res: any) => {
      if (res.code === 0) {
        this.categories = res.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#main {
  position: relative;
  top: -1px;
  background: #fff;
  .categories {
    flex-wrap: wrap;
    li {
      margin: 1px 8px 8px 8px;
      a {
        display: block;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        background-color: #fff;
        border-radius: 4px;
        color: #8d8d8d;
        border: 1px solid #e6e6e6;
        &.cur {
          color: #fff;
          background-color: #1ed9be;
          border: 1px solid #1ed9be;
        }
        &.u_hover_active_bg:hover {
          color: #fff;
          border: 1px solid #1ed9be;
        }
      }
    }
  }
}
</style>
