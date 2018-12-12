<template>
  <div id="articleList">
    <div class="container">
      <loading :load-status="loadStatus"/>
      <div class="articleList" v-if="articleList.data.length >= 1">
        <article class="u_transition_300" v-for="(item,index) in articleList.data" :key="index">
          <div class="image" v-if="item.image_src" @click="toArticleDetail(item)">
            <a
              class="progressive--not-loaded"
              :data-url="IMGHOST+item.image_src+QN_POSTFIX+'500'"
              :style="item.image_status === 2 ? '' : 'background: url('+IMGHOST+item.image_src+QN_POSTFIX+'100)' "
            >
              <img
                v-if="item.image_status == 0"
                style="opacity: 0;"
                @load="imgLoad(index,'load');"
                @error="imgLoad(index,'error');"
                :src="IMGHOST+item.image_src+QN_POSTFIX+'100'"
                alt
              >
              <i
                class="iconfont icon-codestore"
                :style="'opacity:'+(item.image_status == 2 ? 1 : 0)"
              />
            </a>
          </div>
          <div class="info">
            <h2>
              <nuxt-link
                :to="{path: '/blog/articleDetail',query: {id: item._id, title: item.title}}"
                class="u_transition_300 u_hover_active"
              >{{ item.title }}</nuxt-link>
            </h2>
            <strong>{{ item.describe }}</strong>
            <p>
              <b class="article_categories">
                <span v-for="(value,index) in item.categories" :key="index">
                  {{ index == 0 ? '':', ' }}
                  <a
                    @click="search({type: 'Category', text: value})"
                    class="u_transition_300 u_hover_active"
                  >{{ value }}</a>
                </span>
              </b>
              <nuxt-link
                :to="{path: '/blog/articleDetail',query: {id: item._id, title: item.title}}"
                class="review u_transition_300 u_hover_active_bg"
              >
                <i class="iconfont icon-huifu"/>
                <span>{{ item.review.length }}</span>
              </nuxt-link>
              <time class="g-c-center">
                <span class="g-r-center">
                  <i class="iconfont icon-time"/>
                  {{ item.creation_at | dateFormat('YYYY/MM/DD') }}
                </span>
                <span>
                  <i class="iconfont icon-chakan"/>
                  {{ item.browsing }}
                </span>
              </time>
            </p>
          </div>
        </article>
      </div>
      <div class="noParam" v-if="articleList.data.length <= 0 && requestStatus">
        <i class="iconfont icon-zanwushuju"/>
        <p>找不到相关 "{{ searchText }}" 数据</p>
      </div>
      <!-- 分页 -->
      <div v-if="articleList.last_page > 1" class="pagination g-c-center">
        <ul class="page-numbers g-c-center">
          <li
            v-if="articleList.current_page > 1"
            @click="pageBtn(Number(articleList.current_page)-1)"
          >
            <a class="next page-numbers u_transition_300 u_hover_active">上一页</a>
          </li>
          <li v-for="(item,index) in articleList.last_page " :key="index" @click="pageBtn(index+1)">
            <span
              v-if="index + 1 == articleList.current_page"
              class="page-numbers current"
            >{{ index+1 }}</span>
            <a v-else class="page-numbers u_transition_300 u_hover_active">{{ index+1 }}</a>
          </li>
          <li
            v-if="articleList.last_page > articleList.current_page"
            @click="pageBtn(Number(articleList.current_page)+1)"
          >
            <a class="next page-numbers u_transition_300 u_hover_active">下一页</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import loading from '~/components/loading'
import { lazyload } from '~/assets/js/utils'

export default {
  components: {
    loading
  },
  props: ['categoriesName', 'searchCnt', 'initList'],
  data() {
    return {
      loadStatus: false, // 加载状态。false：加载中。true：加载完成。
      searchText: '',
      requestStatus: false,
      articleList: {
        data: []
      }
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'QN_POSTFIX', 'M_QN_POSTFIX'])
  },
  watch: {
    // 标签切换
    categoriesName() {
      this.getArticlesList(1)
    },
    searchCnt(data) {
      this.getArticlesList(1, data.text)
    }
  },
  created() {
    if (this.initList) {
      this.listFormat(this.initList, true)
    }
  },
  mounted() {
    // 如果有初始数据就初始化状态否则请求文章列表
    if (this.initList) {
      this.loadStatus = true
      this.$nextTick(() => {
        new lazyload().init()
      })
    } else {
      let query = this.$route.query

      this.getArticlesList(
        Number(query.page) || 1,
        query._s || query.Tag || queryCategory
      )
    }
  },
  methods: {
    /**
     * 列表格式化
     * @param {data} 数据
     * @param {isFirst} 是否第一次加载
     */
    listFormat(data, isFirst) {
      let src = data.data.image_src

      for (let item of data.data) {
        item.image_status = 0 // 0：图片未加载  1：图片加载成功  2：图片加载失败
      }

      this.articleList = data

      // DOM渲染完成
      this.$nextTick(() => {
        this.requestStatus = true
        if (!isFirst) {
          new lazyload().init()
        }
      })
    },
    /**
     * 获取文章列表
     * @param {page}        分页数值
     * @param {searchCnt}   搜索内容
     */
    getArticlesList(page, searchCnt) {
      this.requestStatus = false
      this.searchText = searchCnt || this.categoriesName

      // 获取对应文章列表
      this.$axios
        .post('api/getArticlesList', {
          page: page,
          release: true,
          categories: this.categoriesName || '',
          searchCnt: searchCnt || ''
        })
        .then(res => {
          this.loadStatus = true
          if (res.code == 0) {
            this.listFormat(res.data)
          }
        })
    },
    /**
     * 分页
     * @param {num} 分页数值
     */
    pageBtn(num) {
      let data = {
        page: num
      }

      if (this.searchText) data._s = this.searchText

      this.$router.push({
        query: data
      })
      this.getArticlesList(num, this.searchText)
    },
    /**
     * 标签搜索
     * @param {data}    搜索参数
     */
    search(data) {
      this.$store.commit('searchChange', data)
      this.$router.push({
        path: '/searchResult',
        query: {
          Category: data.text
        }
      })
    },
    /**
     * 图片加载
     * @param {index}   下标
     * @param {type}    'load' 加载成功  'error' 加载失败
     */
    imgLoad(index, type) {
      this.articleList.data[index].image_status = type == 'load' ? 1 : 2
    },
    /**
     * 跳转详情页
     * @param {data}    文章参数
     */
    toArticleDetail(data) {
      this.$router.push({
        path: '/blog/articleDetail',
        query: {
          id: data._id,
          title: data.title
        }
      })
    }
  }
}
</script>

<style lang="scss" src="~/assets/css/articleList.scss">
</style>
