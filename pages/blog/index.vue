<template>
  <div id="blog">
    <header-box :header-data="headerData"/>
    <div id="blogMain" class="g-r-center">
      <div class="container">
        <ul class="categories g-r-center">
          <li @click="categoriesName = '全部'">
            <nuxt-link
              class="u_transition_300 u_hover_active_bg"
              :class="{cur: categoriesName === '全部'}"
              :to="{path: '/blog'}"
            >全部</nuxt-link>
          </li>
          <li @click="categoriesName = item.name" v-for="(item, index) in categories" :key="index">
            <nuxt-link
              class="u_transition_300 u_hover_active_bg"
              :class="{cur: categoriesName === item.name}"
              :to="{path: '/blog', query: {categories: item.name}}"
            >{{ item.name }}</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <article-list :categories-name="categoriesName" :init-list="list"/>
    <footer-box :blog-page="true"/>
  </div>
</template>

<script>
import headerBox from '~/components/header'
import footerBox from '~/components/footer'
import articleList from '~/components/articleList'

export default {
  async asyncData(app) {
    let data = await app.$axios
      .post('api/getArticlesList', {
        page: Number(app.query.page) || 1,
        release: true,
        searchCnt: app.query._s || app.query.Tag || app.queryCategory,
        categories: app.query.categories || '全部'
      })
      .then(res => {
        if (res.code === 0) {
          return res.data
        }
      })

    return {
      list: data
    }
  },
  head: {
    title: '朱为鹏的博客'
  },
  components: {
    headerBox,
    footerBox,
    articleList
  },
  data() {
    return {
      headerData: {
        title: 'Blog',
        searchStatus: true,
        isStatic: true,
        type: 'blog'
      },
      list: [],
      categories: [],
      categoriesName: this.$route.query.categories || '全部'
    }
  },
  mounted() {
    // 获取分类列表
    this.$axios.post('api/getCategoryList').then(res => {
      if (res.code === 0) {
        this.categories = res.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#blogMain {
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
