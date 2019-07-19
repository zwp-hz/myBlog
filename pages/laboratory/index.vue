<template>
  <div id="article">
    <header-box :header-data="headerData"/>
    <div id="laboratory">
      <div class="container">
        <ul class="categories g-r-center">
          <li @click="categoriesName = item" v-for="(item, index) in categories" :key="index">
            <nuxt-link
              class="u_transition_300 u_hover_active_bg"
              :class="{cur: categoriesName === item}"
              :to="{path: '/laboratory', query: {categories: item}}"
            >{{ item }}</nuxt-link>
          </li>
        </ul>
        <div class="list">
          <article class="u_transition_300" v-for="(item,index) in list" :key="index">
            <div class="box">
              <nuxt-link class="image" v-if="item.image_src" :to="{path: item.url}">
                <div
                  class="progressive not-loaded"
                  :data-url="IMGHOST+item.image_src+QN_POSTFIX+'500'"
                  :style="item.image_status === 2 ? '' : 'background: url('+IMGHOST+item.image_src+QN_POSTFIX+'100)' "
                >
                  <img
                    v-if="item.image_status === 0"
                    style="opacity: 0;"
                    @load="imgLoad(index,'load');"
                    @error="imgLoad(index,'error');"
                    :src="IMGHOST+item.image_src+QN_POSTFIX+'100'"
                    alt
                  >
                  <i
                    class="iconfont icon-codestore"
                    :style="'opacity:'+(item.image_status === 2 ? 1 : 0)"
                  />
                </div>
              </nuxt-link>
              <div class="info">
                <h2>
                  <nuxt-link
                    class="u_transition_300 u_hover_active"
                    :to="{path: item.url}"
                  >{{ item.title }}</nuxt-link>
                </h2>
                <strong>{{ item.describe }}</strong>
                <p>
                  <b class="article_categories">
                    <span v-for="(value,index) in item.categories" :key="index">
                      {{ index == 0 ? '':', ' }}
                      <a
                        @click="categoriesName = value"
                        class="u_transition_300 u_hover_active"
                      >{{ value }}</a>
                    </span>
                  </b>
                  <time class="g-c-center">
                    <span class="g-r-center">
                      <i class="iconfont icon-time"/>
                      {{ item.time | dateFormat('YYYY/MM/DD') }}
                    </span>
                  </time>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
    <footer-box/>
  </div>
</template>

<script lang='ts'>
'use strict'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'
import { lazyload } from '~/assets/js/utils'

let list: any = [
  {
    title: '活动大转盘',
    describe: '可自定义转盘速度、数量、方向、角度...',
    categories: ['动画'],
    image_src: '项目图片_大转盘1.png',
    image_status: 0,
    url: '/laboratory/turntable',
    time: '1552906110'
  },
  {
    title: '瀑布流、懒加载效果',
    describe: '实现瀑布流、懒加载、图片模糊到清晰的效果',
    categories: ['页面效果'],
    image_src: '项目图片_瀑布流.png',
    image_status: 0,
    url: '/laboratory/fallsFlow',
    time: '1552906110'
  }
]

@Component({
  head: {
    title: '实验室-朱为鹏的个人网站'
  },
  components: {
    headerBox,
    footerBox
  }
})
export default class Laboratory extends Vue {
  @State('IMGHOST')
  IMGHOST: string
  @State('QN_POSTFIX')
  QN_POSTFIX: string

  // data
  headerData: HeaderData = {
    title: '实验室',
    searchStatus: false,
    isStatic: true
  }
  list: any = []
  categories: string[] = ['全部', '动画', '页面效果']
  categoriesName: string | string[] = ''

  @Watch('categoriesName')
  onChanged(val: string) {
    this.listFilter(val)
  }

  created() {
    this.categoriesName = this.$route.query.categories || '全部'
  }

  listFilter(val: string | string[]) {
    this.$nextTick(() => {
      new lazyload().init()
    })

    this.list =
      val === '全部'
        ? list
        : list.filter(item => {
            if (item.categories.join(',').indexOf(val) != -1) {
              return item
            }
          })
  }

  imgLoad(index: number, type: string) {
    this.list[index].image_status = type == 'load' ? 1 : 2
  }
}
</script>
<style lang="scss" src="~/assets/css/articleList.scss">
</style>
<style lang="scss">
#laboratory {
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
  .image,
  .image .progressive {
    height: 190px !important;
  }
  .list .info {
    height: 182px !important;
    strong {
      margin-bottom: 18px !important;
    }
    p {
      padding: 18px 0 0 10% !important;
      margin: 0 !important;
      time {
        position: static !important;
        width: auto !important;
      }
    }
  }
}
</style>
