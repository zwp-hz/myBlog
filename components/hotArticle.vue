<template>
  <div class="recent_posts g-box">
    <h3>最新动态</h3>
    <div class="article g-r-center" v-for="(item,index) in a_hots" :key="index">
      <a
        v-if="item.image_src"
        ondragstart="return false;"
        class="images"
        href="javaScript: void();"
        :style="`background-image: url('${ARTICLE_IMGHOST+item.image_src+QN_POSTFIX+100}')`"
        @click="toArticleDetail(item)"
      >
        <span class="cy_cmt_count">{{ item.comments.length }}</span>
        <b class="backImg u_transition_300 u_hover_show">
          <i class="iconfont icon-lianjie"/>
        </b>
      </a>
      <a
        v-else
        ondragstart="return false;"
        class="images"
        href="javaScript: void();"
        @click="toArticleDetail(item)"
      >
        <i class="iconfont icon-codestore"/>
        <span>{{ item.review.length }}</span>
        <b class="backImg u_transition_300 u_hover_show">
          <i class="iconfont icon-lianjie"/>
        </b>
      </a>
      <div style="flex: 1;">
        <div class="categories">
          <span v-for="(value,index) in item.categories" :key="index">
            {{ index > 0 ? ', ':'' }}
            <a
              @click="search({type: 'Category', text: value})"
              class="u_transition_300 u_hover_active"
            >{{ value }}</a>
          </span>
        </div>
        <a
          class="title u_transition_300 u_hover_active"
          href="javaScript: void();"
          @click="toArticleDetail(item)"
        >{{ item.title }}</a>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
'use strict'
import { State } from 'vuex-class'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { setTimeout } from 'timers'

@Component
export default class HotArticle extends Vue {
  @Prop(Array)
  readonly hots!: object[]

  @State('article_hots')
  article_hots
  @State('ARTICLE_IMGHOST')
  ARTICLE_IMGHOST
  @State('QN_POSTFIX')
  QN_POSTFIX

  // data
  a_hots: any[]

  @Watch('article_hots')
  hotsArticleChange(data) {
    this.a_hots = data
  }

  created() {
    this.a_hots = this.hots || this.article_hots
  }

  search(data) {
    this.$store.commit('searchChange', data)
    this.$router.push({
      path: '/article/searchResult',
      query: {
        Category: data.text
      }
    })
  }

  toArticleDetail(data) {
    location.href = `/article/articleDetail?id=${data._id}&title=${data.title}`
  }
}
</script>

<style lang="scss" scoped>
.recent_posts {
  flex: 1;
  h3 {
    margin-bottom: 15px;
    font-size: 20px;
    line-height: 30px;
    color: #e3e3e3;
  }
  a {
    color: #fff;
  }
  .article {
    padding-bottom: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #cecec4;
    &:last-child {
      border-bottom: none;
    }
    .images {
      position: relative;
      display: block;
      width: 76px;
      height: 76px;
      margin-right: 19px;
      border-radius: 50% 50%;
      background-repeat: no-repeat;
      background-position: center bottom;
      background-color: #cecec4;
      background-size: cover;
      -webkit-background-size: cover;
      .icon-codestore {
        position: absolute;
        top: 19.5px;
        left: 21px;
        font-size: 34px;
      }
      span {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 100;
        width: 19px;
        height: 19px;
        text-align: center;
        line-height: 19px;
        color: #fff;
        background: #1ed9be;
        border-radius: 50% 50%;
      }
      .backImg {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 50;
        width: 76px;
        height: 76px;
        text-align: center;
        line-height: 76px;
        opacity: 0;
        background: rgba(74, 190, 217, 0.6);
        border-radius: 50%;
      }
    }
    .categories {
      span {
        color: #fff;
      }
    }
    .title {
      display: -webkit-box;
      font-size: 16px;
      font-weight: 700;
      /*! autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      overflow: hidden;
    }
  }
}
</style>
