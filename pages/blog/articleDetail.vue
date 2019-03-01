<template>
  <div id="articleDetail">
    <loading :load-status="loadStatus"/>
    <header-box :header-data="headerData"/>
    <template>
      <div class="header">
        <h1 class="u_transition_700" :class="{active: showStatus}">{{ articleDetail.title }}</h1>
        <h3/>
        <section class="u_transition_700" :class="{active: showStatus}">
          <p>
            <span>{{ articleDetail.creation_at | dateFormat('YYYY年MM月DD日') }}</span>
            <span style="padding-left: 13px;">访问：{{ articleDetail.browsing }}</span>
          </p>
          <div>
            <span v-for="(categories,index) in articleDetail.categories" :key="index">
              {{ index == 0 ? '':', ' }}
              <a
                class="u_transition_300 u_hover_active"
                @click="search({type: 'Category', text: categories})"
              >{{ categories }}</a>
            </span>
          </div>
        </section>
      </div>
      <div class="content">
        <div class="articleContent">
          <div id="markDown" ref="markDown" v-html="articleDetail.content"/>
          <div class="catalog" :class="{fixed: catalog_fixed}" ref="catalog">
            <ul>
              <li
                :class="['catalog-' + item.tag, {active: catalog_index === i}]"
                v-for="(item, i) in markDownCatalog"
                :key="i"
              >
                <p @click="cagatogSkip(item.text)">{{ item.text }}</p>
              </li>
            </ul>
            <i class="iconfont icon-jiantou" v-if="scrollTopStatus" @click="runToTop"></i>
          </div>
          <div class="blog-tags">
            <h5>Tags In</h5>
            <div class="blog-tags-list clear">
              <a
                v-for="tag in articleDetail.tags"
                :key="tag"
                class="fl u_transition_300 u_hover_active_bg"
                @click="search({type: 'Tag', text: tag})"
              >{{ tag }}</a>
            </div>
          </div>
        </div>
        <div id="SOHUCS" :sid="$route.query.id"></div>
      </div>
    </template>
    <footer-box :blog-page="true" :hots="hots"/>
  </div>
</template>

<script>
import loading from '~/components/loading'
import headerBox from '~/components/header'
import footerBox from '~/components/footer'
import { runToTop } from '~/assets/js/utils'
// import comment from '~/components/comment'

const Remarkable = require('remarkable')
const md = new Remarkable()

export default {
  async asyncData(app) {
    let data = await app.$axios
      .post('api/getArticlesDetail', {
        _id: app.query.id,
        release: true
      })
      .then(res => {
        if (res.code === 0) {
          return res.data
        }
      })
    return {
      articleDetail: data.data,
      hots: data.hots
    }
  },
  head() {
    return {
      title: this.title,
      script: [
        {
          src: 'https://changyan.sohu.com/upload/changyan.js'
        }
      ]
    }
  },
  components: {
    loading,
    headerBox,
    footerBox
  },
  data() {
    return {
      title: this.$route.query.title,
      loadStatus: false, // 加载状态。false：加载中。true：加载完成。
      showStatus: false, // 判断动画是否执行
      headerData: {
        title: '',
        searchStatus: true,
        isStatic: true,
        type: 'blog',
        image: {}
      },
      scrollTopStatus: false, // 滚动条置顶显示状态
      articleDetail: {}, // 文章详情
      hots: [], // 热门文章列表
      catalog_fixed: true, // 固定浮动状态
      markDownCatalog: [], // 文章标题目录
      catalog_index: 0 // 当前目录下标
    }
  },
  created() {
    this.getArticleDetail()
  },
  mounted() {
    this.$nextTick(() => {
      window.changyan.api.config({
        appid: 'cytYjVfKw',
        conf: 'prod_b410f9207abb469c925d5a87d0d295dc'
      })
    })

    setTimeout(() => {
      document.addEventListener('scroll', this.seeScroll, false)
    }, 1000)
  },
  methods: {
    runToTop() {
      runToTop()
    },
    /**
     * 获取文章详情
     */
    getArticleDetail() {
      let param = this.articleDetail

      this.headerData.image = {
        src: param.image_src,
        status: 0 // 0：图片未加载  1：图片加载成功  2：图片加载失败
      }

      setTimeout(() => {
        this.loadStatus = true
        param.content = md.render(param.content)

        this.$nextTick(() => {
          // 生成文章目录
          let catalog = [],
            markDown = this.$refs.markDown

          for (let i of markDown.getElementsByTagName('*')) {
            let tag = i.tagName,
              text = i.innerHTML

            if (/h2|h3|h4/i.test(i.tagName)) {
              i.setAttribute('id', text)
              catalog.push({ tag: tag, text: text })
            }
          }

          this.markDownCatalog = catalog

          // 如果路由存在标坐标 直接跳到对应位置
          setTimeout(() => {
            let path = this.$route.fullPath,
              index = path.indexOf('#')

            if (index !== -1) {
              this.cagatogSkip(decodeURI(path.slice(index + 1)), 'init')
            }
          }, 0)
        })
      }, 0)
      setTimeout(() => {
        this.showStatus = true
      }, this.$store.state.first_load ? 500 : 0)
    },
    /**
     * 目录跳转
     * @param {title} 标题
     * @param {String} type - 跳转类型  init：初始化
     */
    cagatogSkip(title, type) {
      let parent_top = 458,
        offsetTop = document.getElementById(title).offsetTop

      document.documentElement.scrollTop = document.body.scrollTop =
        parent_top + offsetTop

      for (let i = 0, list = this.markDownCatalog; list.length > i; i++) {
        if (list[i].text === title) {
          this.catalog_index = i
          break
        }
      }

      this.$router.push({
        path: `${this.$route.fullPath.replace(/\#(\S|\s)*/, '')}#${title}`
      })

      // 文章目录列表 初始化
      if (type === 'init') {
        setTimeout(() => {
          let offsetHeight = document.documentElement.offsetHeight,
            clientHeight = document.documentElement.clientHeight,
            footer_height = document.getElementById('footer').offsetHeight,
            scrollTop =
              document.documentElement.scrollTop || document.body.scrollTop

          this.catalog_fixed = !(
            offsetHeight - clientHeight - footer_height <
            scrollTop
          )
          this.scrollTopStatus = true
        }, 500)
      }
    },
    /**
     * 滚动侦听
     */
    seeScroll() {
      if (document.documentElement.clientWidth < 1100) {
        return false
      }

      let index = this.catalog_index,
        text = this.markDownCatalog[this.catalog_index].text,
        footer_height = document.getElementById('footer').offsetHeight,
        ref_top = document.getElementById(text).offsetTop,
        offsetHeight = document.documentElement.offsetHeight,
        clientHeight = document.documentElement.clientHeight,
        parent_top = 458,
        scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop

      this.scrollTopStatus = scrollTop > 0

      this.catalog_fixed = !(
        offsetHeight - clientHeight - footer_height <
        scrollTop
      )

      // 滚动条大于当前目录位置 且 大于下一个目录位置
      if (scrollTop >= parent_top + ref_top) {
        if (index < this.markDownCatalog.length - 1) {
          let after_top = document.getElementById(
            this.markDownCatalog[index + 1].text
          ).offsetTop

          if (scrollTop >= parent_top + after_top) {
            this.catalog_index = ++index
          }
        }
      } else if (index >= 1 && scrollTop < parent_top + ref_top) {
        this.catalog_index = --index
      }
    },
    /** 标签搜索
     * @param {data}  搜索参数
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
    max-width: 1024px;
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
    position: relative;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 30px;
    .articleContent {
      .catalog {
        position: absolute;
        bottom: 100px;
        left: 50%;
        z-index: 100;
        padding: 0 10px;
        max-width: 160px;
        margin-left: 492px;
        color: #8590a6;
        border-left: 3px #eee solid;
        background: #fff;
        &.fixed {
          position: fixed;
          bottom: 100px;
        }
        li.active {
          position: relative;
          p {
            color: #1ed9be;
          }
          &::before {
            content: '';
            position: absolute;
            top: 6px;
            left: -17.5px;
            width: 12px;
            height: 12px;
            background-color: #9e9e9e;
            border-radius: 50%;
          }
        }
        p {
          line-height: 24px;
          cursor: pointer;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .catalog-H3 {
          padding-left: 10px;
        }
        .catalog-H4 {
          padding-left: 20px;
        }
        .icon-jiantou {
          position: absolute;
          bottom: -50px;
          left: 0;
          width: 40px;
          height: 40px;
          line-height: 40px;
          color: #8590a6;
          font-size: 20px;
          text-align: center;
          border-radius: 50%;
          background-color: #eee;
          cursor: pointer;
        }
      }
    }
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

@media (max-width: 1300px) {
  .header,
  .content {
    max-width: 800px !important;
  }

  .catalog {
    margin-left: 380px !important;
  }
}

@media (max-width: 1100px) {
  .catalog {
    display: none !important;
  }
}

@media (max-width: 767px) {
  #articleDetail .header h1 {
    font-size: 25px;
  }
}
</style>
