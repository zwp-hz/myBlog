<template>
  <div id="articleList">
    <div class="container">
      <loading :load-status="loadStatus"/>
      <div class="articleList" v-if="articleList.data.list.length >= 1">
        <article
          class="u_transition_300"
          v-for="(item,index) in articleList.data.list"
          :key="index"
        >
          <div class="box">
            <div class="image" @click="toArticleDetail(item)">
              <div
                class="progressive not-loaded"
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
              </div>
            </div>
            <div class="info">
              <h2>
                <a
                  class="u_transition_300 u_hover_active"
                  href="javaScript: void(0);"
                  @click="toArticleDetail(item)"
                >{{ item.title }}</a>
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
                <a
                  class="review u_transition_300 u_hover_active_bg"
                  href="javaScript: void(0);"
                  @click="toArticleDetail(item)"
                >
                  <i class="iconfont icon-huifu"/>
                  <span :id="'sourceId::'+item._id" class="cy_cmt_count"></span>
                </a>
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
          </div>
        </article>
      </div>
      <div class="noParam" v-if="articleList.data.list.length <= 0 && requestStatus">
        <i class="iconfont icon-zanwushuju"/>
        <p>找不到相关 "{{ searchText.text }}" 数据</p>
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
        data: {
          list: []
        }
      }
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'QN_POSTFIX', 'M_QN_POSTFIX', 'article_hots'])
  },
  watch: {
    // 标签切换
    categoriesName() {
      this.getArticlesList(1)
    },
    searchCnt(data) {
      this.getArticlesList(1, data)
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
      let query = this.$route.query,
        _s = query._s,
        Tag = query.Tag,
        Category = query.Category

      this.getArticlesList(
        Number(query.page) || 1,
        _s
          ? { type: '_s', text: _s }
          : Tag
            ? { type: 'Tag', text: Tag }
            : Category
              ? { type: 'Category', text: Category }
              : {},
        'first'
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
      let list = data.data.list

      // 保存热门文章到store
      if (this.article_hots.length === 0) {
        this.$store.commit('setFooterData', {
          type: 'article_hots',
          data: data.data.hots
        })
      }

      for (let item of list) {
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
     * @param {Number}  pagr - 分页
     * @param {String}  searchCnt - 搜索内容
     * @param {String}  type - 请求类型  first：第一次
     */
    getArticlesList(page, searchCnt = '', type) {
      let data = {}

      if (searchCnt) {
        data[searchCnt.type] = searchCnt.text
      } else {
        data['Category'] = this.categoriesName
      }

      this.requestStatus = false
      this.searchText = searchCnt || this.categoriesName

      // 获取对应文章列表
      this.$axios
        .post(
          'api/getArticlesList',
          Object.assign(
            {
              page: page,
              release: true
            },
            data
          )
        )
        .then(res => {
          this.loadStatus = true
          if (res.code == 0) {
            this.listFormat(res.data)

            // 保存热门文章到store
            if (this.article_hots.length === 0) {
              this.$store.commit('setFooterData', {
                type: 'article_hots',
                data: res.data.data.hots
              })
            }

            if (type !== 'first') {
              document.documentElement.scrollTop = document.body.scrollTop = 400
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
            }
          }
        })
    },
    /**
     * 分页
     * @param {num} 分页数值
     */
    pageBtn(num) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          page: num
        })
      })
      this.getArticlesList(num)
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
     * 图片加载
     * @param {Number} index - 图片下标
     * @param {String} type - 加载类型  load: 成功  error: 加载失败
     */
    imgLoad(index, type) {
      this.articleList.data.list[index].image_status = type == 'load' ? 1 : 2
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

<style lang="scss" src="~/assets/css/articleList.scss">
</style>
