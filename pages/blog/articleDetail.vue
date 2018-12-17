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
          <article id="markDown" ref="markDown" v-html="articleDetail.content"/>
          <div
            class="catalog"
            ref="catalog"
            data-0="position: absolute; top: 0px;"
            data-458="position: fixed; top: 0px;"
            data-538="position: fixed; top: 80px;"
          >
            <ul>
              <li class="catalog-h2" v-for="(h2, i) in markDownCatalog" :key="i">
                <p @click="cagatogSkip(h2.title)">{{ h2.title }}</p>
                <template v-if="h2.list.length > 0">
                  <div class="catalog-h3" v-for="(h3, k) in h2.list" :key="k">
                    <p @click="cagatogSkip(h3.title)">{{ h3.title }}</p>
                    <template v-if="h3.list.length > 0">
                      <div class="catalog-h4">
                        <p
                          v-for="(h4, j) in h3.list"
                          :key="j"
                          @click="cagatogSkip(h4.title)"
                        >{{ h4.title }}</p>
                      </div>
                    </template>
                  </div>
                </template>
              </li>
            </ul>
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
        <comment :comment-list="articleDetail.review"/>
      </div>
    </template>
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
  async asyncData(app) {
    let data = await app.$axios
      .post('api/getArticlesDetail', {
        _id: app.query.id
      })
      .then(res => {
        if (res.code === 0) {
          return res.data
        }
      })
    return {
      articleDetail: data
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  components: {
    loading,
    headerBox,
    footerBox,
    comment
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
      articleDetail: {}, // 文章详情
      markDownCatalog: []
    }
  },
  created() {
    this.getArticleDetail()
  },
  methods: {
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
              if (tag === 'H2') {
                catalog.push({ title: text, list: [] })
              } else if (tag === 'H3') {
                catalog[catalog.length - 1].list.push({ title: text, list: [] })
              } else if (tag === 'H4') {
                catalog[catalog.length - 1].list[
                  catalog[catalog.length - 1].list.length - 1
                ].list.push({ title: text, list: [] })
              }
            }
          }

          this.markDownCatalog = catalog
          // 设置目录位置
          this.$refs.catalog.style.marginLeft = `${markDown.clientWidth / 2 +
            5}px`

          // 如果路由存在标坐标 直接跳到对应位置
          setTimeout(() => {
            let path = this.$route.fullPath,
              index = path.indexOf('#')

            if (index !== -1) {
              this.cagatogSkip(decodeURI(path.slice(index + 1)))
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
     */
    cagatogSkip(title) {
      let head_height = document.getElementsByTagName('header')[0].clientHeight,
        offsetTop = document.getElementById(title).offsetTop

      document.documentElement.scrollTop = document.body.scrollTop =
        head_height + offsetTop

      this.$router.push({
        path: `${this.$route.fullPath.replace(/\#(\S|\s)*/, '')}#${title}`
      })
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
    .articleContent {
      position: relative;
      .catalog {
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 100;
        padding: 5px 10px;
        max-width: 150px;
        border-radius: 4px;
        border: 1px solid #000;
        background: #fff;
        p {
          line-height: 24px;
          cursor: pointer;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .catalog-h3,
        .catalog-h4 {
          padding-left: 10px;
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

@media (max-width: 767px) {
  #articleDetail .header h1 {
    font-size: 25px;
  }
}
</style>
