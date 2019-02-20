<template>
  <div class="recent_posts">
    <h3>最新动态</h3>
    <div class="article g-r-center" v-for="(item,index) in a_hots" :key="index">
      <a
        v-if="item.image_src"
        ondragstart="return false;"
        class="images"
        href="javaScript: void();"
        :style="item.image_status == 1 ? 'background: url('+IMGHOST+item.image_src+QN_POSTFIX+100+') no-repeat center bottom' : ''"
        @click="toArticleDetail(item)"
      >
        <img
          v-if="item.image_status == 0"
          style="opacity: 0;"
          @load="imgLoad(index,'load');"
          @error="imgLoad(index,'error');"
          :src="IMGHOST+item.image_src+QN_POSTFIX+100"
          alt
        >
        <i v-if="item.image_status == 2 || !item.image_src" class="iconfont icon-codestore"/>
        <span :id="'sourceId::'+item._id" class="cy_cmt_count"></span>
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

<script>
import { mapState } from 'vuex'
export default {
  props: ['hots'],
  data() {
    return {
      a_hots: []
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'QN_POSTFIX', 'article_hots'])
  },
  watch: {
    article_hots(val) {
      for (let item of val) {
        item.image_status = 0 // 0：图片未加载  1：图片加载成功  2：图片加载失败
      }

      this.a_hots = val
    }
  },
  created() {
    let hots = this.hots || this.article_hots

    if (hots) {
      for (let item of hots) {
        item.image_status = 0 // 0：图片未加载  1：图片加载成功  2：图片加载失败
      }

      this.a_hots = hots
    }
  },
  mounted() {
    this.$nextTick(() => {
      //获取评论数
      if (document.getElementById('cy_cmt_num')) {
        let listCount = document.getElementById('cy_cmt_num'),
          count = listCount.nextSibling
        listCount.parentNode.removeChild(listCount)
        count.parentNode.removeChild(count)
      }

      let head = document.getElementsByTagName('head')[0]
      let script = document.createElement('script')
      script.id = 'cy_cmt_num'
      script.src =
        'http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cytYjVfKw'
      head.appendChild(script)
    })
  },
  methods: {
    /**
     * 图片加载
     * @param {index}   下标
     * @param {type}    'load' 加载成功  'error' 加载失败
     */
    imgLoad(index, type) {
      this.a_hots[index].image_status = type == 'load' ? 1 : 2

      console.log(this.a_hots)
    },
    /**
     * 标签搜索
     * @param {data}    搜索参数
     */
    search(data) {
      this.$store.commit('searchChange', data)
      this.$router.push({
        path: '/blog/searchResult',
        query: {
          Category: data.text
        }
      })
    },
    /**
     * 跳转详情页
     * @param {data}    文章参数
     */
    toArticleDetail(data) {
      location.href = `/blog/articleDetail?id=${data._id}&title=${data.title}`
    }
  }
}
</script>

<style lang="scss" scoped>
.recent_posts {
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
      background-color: #cecec4;
      background-size: cover !important;
      -webkit-background-size: cover !important;
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
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      overflow: hidden;
    }
  }
}
</style>
