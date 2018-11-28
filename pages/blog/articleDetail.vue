<template>
  <div id="articleDetail" v-title="$route.query.title">
    <loading :load-status="loadStatus"/>
    <header-box :header-data="headerData"/>
    <div class="header">
      <h1 class="u_transition_700" :class="{active: articleParam.title}">{{ articleParam.title }}</h1>
      <h3/>
      <section class="u_transition_700" :class="{active: articleParam.creation_at}">
        <p>
          <span>{{ articleParam.creation_at | dateFormat('YYYY年MM月DD日') }}</span>
          <span style="padding-left: 13px;">访问数：{{ articleParam.browsing }}</span>
        </p>
        <div>
          <span v-for="(categories,index) in articleParam.categories" :key="index">
            {{ index == 0 ? '':', ' }}
            <a class="u_transition_300 u_hover_active" @click="search({type: 'Category', text: categories})">
              {{ categories }}
            </a>
          </span>
        </div>
      </section>
    </div>
    <div class="content">
      <div class="articleContent">
        <article id="markDown" v-html="articleParam.content"/>
        <div class="blog-tags">
          <h5>Tags In</h5>
          <div class="blog-tags-list clear">
            <a
              v-for="tag in articleParam.tags"
              :key="tag"
              class="fl u_transition_300 u_hover_active_bg"
              @click="search({type: 'Tag', text: tag})"
            >
              {{ tag }}
            </a>
          </div>
        </div>
      </div>
      <comment :comment-list="articleParam.review"/>
    </div>
    <footer-box :blog-page="true"/>
  </div>
</template>

<script>
import loading from '~/components/loading'
import headerBox from '~/components/header'
import footerBox from '~/components/footer'
import comment from '~/components/comment'

const Remarkable = require('remarkable')
const md = new Remarkable()

export default {
  components: {
    loading,
    headerBox,
    footerBox,
    comment
  },
  data() {
    return {
      loadStatus: false, // 加载状态。false：加载中。true：加载完成。
      headerData: {
        title: '',
        searchStatus: true,
        isStatic: true,
        type: 'blog',
        images_src: {}
      },
      articleInfo: {}, // 文章信息
      articleParam: {
        // 文章内容
        categories: [],
        review: []
      }
    }
  },
  mounted() {
    this.articleInfo = {
      _id: this.$route.query.id
    }

    this.getArticleDetail()
  },
  methods: {
    /**
     * 获取文章详情
     */
    getArticleDetail() {
      let { IMGHOST, M_QN_POSTFIX, first_load } = this.$store.state

      this.articleParam = {
        categories: []
      }

      this.$axios
        .post('api/getArticlesDetail', {
          _id: this.articleInfo._id
        })
        .then(res => {
          if (res.code === 0) {
            let param = res.data
            this.loadStatus = true
            this.headerData.images_src = {
              src: IMGHOST + param.images_src + M_QN_POSTFIX,
              status: 0 // 0：图片未加载  1：图片加载成功  2：图片加载失败
            }

            param.content = md.render(param.content)
            setTimeout(() => {
              this.articleParam = param
            }, first_load ? 500 : 0)
          }
        })
    },
    /** 标签搜索
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
    }
  }
}
</script>

<style lang="scss" src="~/assets/css/markDown.scss">
</style>
<style lang="scss" scoped>
#articleDetail {
  position: relative;
  .header {
    position: absolute;
    top: 25vh;
    left: 50%;
    width: 100%;
    max-width: 800px;
    padding: 50px 30px;
    color: #fff;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    h1 {
      position: relative;
      top: -50px;
      padding: 0 15px 15px;
      font-size: 30px;
      font-weight: bold;
      opacity: 0;
      &.active {
        top: 0;
        opacity: 1;
      }
    }
    h3 {
      margin-bottom: 15px;
      border-bottom: 1px solid #ebebeb;
    }
    section {
      display: flex;
      position: relative;
      bottom: -50px;
      padding: 0 15px;
      opacity: 0;
      &.active {
        bottom: 0;
        opacity: 1;
      }
      p {
        flex: 1;
        padding-right: 5px;
        text-align: left;
      }
      div {
        flex: 1;
        padding-left: 5px;
        text-align: right;
      }
      a {
        color: #fff;
      }
    }
  }
  .content {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 30px;
  }
  .blog-tags {
    padding: 32px 0;
    h5 {
      margin-bottom: 22px;
      color: #3f3f3f;
      font-size: 16px;
      font-weight: bold;
    }
    a {
      display: block;
      padding: 0 12px;
      margin: 0 10px 12px 0;
      font-weight: bold;
      border-radius: 5px;
      line-height: 32px;
      color: #8d8d8d;
      background-color: #f0f0f0;
    }
  }
}

@media (max-width: 767px) {
  #articleDetail .header h1 {
    font-size: 25px;
  }
}
</style>
