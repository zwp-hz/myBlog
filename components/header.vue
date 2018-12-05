<template>
  <header>
    <div
      id="header"
      class="u_transition_300"
      :class="[ headerData.type, scrollStatus ]"
      data-0="background-color: rgba(255,255,255,0);"
      data-50p="background-color: rgba(255,255,255,0);"
      data-76p="background-color: rgba(255,255,255,1);"
    >
      <div
        class="container headerBox g-r-center"
        data-0="color: rgba(206,206,196,1);"
        data-50p="color: rgba(206,206,196,1);"
        data-76p="color: rgba(53, 58, 64,1);"
      >
        <nav class="g-r-center" style="justify-content: flex-end;">
          <div class="menuList">
            <ul class="g-r-center">
              <li
                v-for="(item, index) in navArray"
                :key="index"
                :class="{active: curRoute.indexOf(item.name) != -1 }"
              >
                <nuxt-link class="u_transition_300" :to="{path: item.route}">{{ item.title }}</nuxt-link>
              </li>
            </ul>
            <div
              class="hamburger-menu"
              :class="{active: menuSwitch}"
              @click="menuSwitch = !menuSwitch"
            >
              <div class="bar"/>
              <nuxt-link
                class="u_transition_300 iconfont"
                :class="[item.icon,{active: curRoute.indexOf(item.name) != -1 }]"
                v-for="(item, index) in navArray"
                :key="index"
                :to="{path: item.route}"
              />
            </div>
          </div>
          <div v-if="headerData.searchStatus" class="searchBox u_transition_300">
            <input
              @keyup.enter="searchFn"
              ref="search"
              v-model="searchCnt"
              class="fl u_transition_300"
              type="text"
              name="search"
              placeholder="search"
            >
            <span class="fl g-c-center" @click="searchFn">
              <i class="fr iconfont icon-search"/>
            </span>
          </div>
          <!--<button class="u_button u_transition_300" href="javaScript: void(0);" data-0="background-color: rgba(206,206,196,1); border: 1px solid rgb(206,206,196);" data-50p="background-color: rgba(206,206,196,1); border: 1px solid rgb(206,206,196);" data-76p="background-color: rgba(30,217,190,1); border: 1px solid rgb(30,217,190);">
              登录
          </button>-->
          <i style="margin-left: 10px;">Hi 你好</i>
        </nav>
        <i v-if="headerData.isStatic" class="iconfont icon-codestore u_transition_300"/>
        <i
          v-else
          class="iconfont icon-codestore active"
          data-0="top: 30%; font-size: 80px;"
          data-30p="top: 30%; font-size: 80px;"
          data-76p="top: 1%; font-size: 50px;"
        />
      </div>
    </div>
    <div id="blogHeader" v-if="headerData.type === 'blog'">
      <div class="g-bolang">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 54 14"
          height="70"
          preserveAspectRatio="none"
        >
          <path
            class="g-bolang-svg"
            d="M 27 10C 21 12 14 14 0 14L 0 0L 54 0L 54 3C 40 3 33 8 27 10Z"
          ></path>
        </svg>
      </div>
      <h1>{{ headerData.title }}</h1>
    </div>
    <div
      v-if="headerData.images_src"
      class="detail_bg u_transition_300"
      :class="[{'img-progressive--not-loaded': headerData.images_src.status == 0},{'img-progressive--is-loaded': headerData.images_src.status == 1}]"
    >
      <img
        v-if="headerData.images_src.status == 0"
        @load="imgLoad('load');"
        @error="imgLoad('error');"
        :src="headerData.images_src.src+'100'"
        alt
      >
      <img v-if="headerData.images_src.status == 1" :src="headerData.images_src.src+'500'" alt>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['headerData'],
  data() {
    return {
      menuSwitch: false,
      navArray: [
        {
          route: '/',
          name: 'index',
          title: '首页',
          icon: 'icon-ai-home'
        },
        {
          route: '/blog',
          name: 'blog',
          title: '博客',
          icon: 'icon-bokeyuan'
        },
        {
          route: '/photos',
          name: 'photos',
          title: '照片墙',
          icon: 'icon-zhaopianqiang'
        },
        {
          route: '/author',
          name: 'author',
          title: '作者',
          icon: 'icon-zuozhe'
        }
      ],
      scrollStatus: '',
      curRoute: this.$route.name,
      searchCnt: ''
    }
  },
  computed: {
    ...mapState(['device', 'search'])
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.device.isMobile) {
        skrollr.init({
          smoothScrollingDuration: 200
        })
      }
    })

    if (this.headerData.type === 'blog') {
      this.handleScroll()
    }

    this.scrollStatus =
      document.documentElement.scrollTop || document.body.scrollTop > 50
        ? 'down'
        : ''
  },
  methods: {
    // 搜索
    searchFn() {
      if (this.searchCnt && this.searchCnt != this.search.text) {
        let data = {
          type: '_s',
          text: this.searchCnt
        }

        this.$store.commit('searchChange', data)
        this.$router.push({
          path: '/blog/searchResult',
          query: {
            _s: this.searchCnt
          }
        })
      }
    },
    handleScroll(e) {
      let beforeScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop

      window.addEventListener(
        'scroll',
        () => {
          let afterScrollTop =
              document.documentElement.scrollTop || document.body.scrollTop,
            delta = afterScrollTop - beforeScrollTop

          if (this.menuSwitch) this.menuSwitch = false

          beforeScrollTop = afterScrollTop

          if (afterScrollTop <= 50) {
            this.scrollStatus = ''
            return false
          }

          if (delta <= 0 && delta > -3) {
            return false
          } else {
            let type = delta > 0 ? 'down' : 'up'

            if (this.scrollStatus === type) {
              return false
            } else {
              this.scrollStatus = type
            }
          }
        },
        false
      )
    },
    /**
     * 图片加载
     * @param {type}    load：加载成功  error：加载失败
     */
    imgLoad(type) {
      this.headerData.images_src.status = type == 'load' ? 1 : 0
    }
  }
}
</script>

<style lang="scss" src="~/assets/css/header.scss">
</style>
