<template>
  <header>
    <div
      id="header"
      class="u_transition_300"
      :class="[ headerData.type, scrollStatus ]"
      data-0="background-color: rgba(255,255,255,0);"
      data-300="background-color: rgba(255,255,255,0);"
      data-1200="background-color: rgba(255,255,255,1);"
    >
      <div
        class="container headerBox g-r-center"
        data-0="color: rgba(206,206,196,1);"
        data-300="color: rgba(206,206,196,1);"
        data-1200="color: rgba(53, 58, 64,1);"
      >
        <nav class="g-r-center" style="justify-content: flex-end;">
          <div class="menuList">
            <ul class="g-r-center">
              <li
                v-for="(item, index) in navArray"
                :key="index"
                :class="{active: curRoute.indexOf(item.name) != -1 }"
              >
                <a
                  href="javaScript: void(0);"
                  class="u_transition_300"
                  @click="navJump(item.route)"
                >{{ item.title }}</a>
              </li>
            </ul>
            <!-- 菜单 屏幕小于767px显示 -->
            <div
              class="hamburger-menu"
              :class="{active: menuSwitch}"
              @click="menuSwitch = !menuSwitch"
            >
              <div class="bar"/>
              <div class="m-menu u_transition_300">
                <nuxt-link
                  v-for="(item, index) in navArray"
                  :key="index"
                  :to="{path: item.route}"
                  :class="{active: curRoute.indexOf(item.name) != -1 }"
                >{{ item.title }}</nuxt-link>
              </div>
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
          <i style="margin-left: 10px;">Hi 你好</i>
        </nav>
        <i v-if="headerData.isStatic" class="iconfont icon-codestore u_transition_300"/>
        <i
          v-else
          class="iconfont icon-codestore active"
          data-0="top: 30%; font-size: 80px;"
          data-300="top: 30%; font-size: 80px;"
          data-1200="top: 1%; font-size: 50px;"
        />
      </div>
    </div>
    <!-- 博客头部菜单 -->
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
      v-if="headerData.image && headerData.image.src"
      class="detail_bg u_transition_300"
      :class="[{'img-progressive--not-loaded': headerData.image.status == 0},{'img-progressive--is-loaded': headerData.image.status == 1}]"
    >
      <img
        v-if="headerData.image.status == 0"
        @load="imgLoad('load');"
        @error="imgLoad('error');"
        :src="IMGHOST+headerData.image.src+QN_POSTFIX+'100'"
        alt
      >
      <img
        v-if="headerData.image.status == 1"
        :src="IMGHOST+headerData.image.src+QN_POSTFIX+'500'"
        alt
      >
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
          title: '首页'
        },
        {
          route: '/blog',
          name: 'blog',
          title: '博客'
        },
        {
          route: '/photos',
          name: 'photos',
          title: '照片墙'
        },
        {
          route: '/about',
          name: 'about',
          title: '关于'
        },
        {
          route: '/messageBoard',
          name: 'message',
          title: '留言板'
        }
      ],
      scrollStatus: '',
      curRoute: this.$route.name,
      searchCnt: ''
    }
  },
  computed: {
    ...mapState(['device', 'search', 'IMGHOST', 'QN_POSTFIX'])
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.device.isMobile) {
        skrollr.init({
          smoothScrollingDuration: 200
        })
      }
    })

    this.handleScroll()

    this.scrollStatus =
      document.documentElement.scrollTop || document.body.scrollTop > 50
        ? 'down'
        : ''
  },
  methods: {
    /**
     * 导航跳转
     * @param {route} 路由地址
     */
    navJump(route) {
      if (route !== this.$route.path) {
        if (route === '/messageBoard') {
          window.location.href = '/messageBoard'
        } else {
          this.$router.push({
            path: route
          })
        }
      }
    },
    /**
     * 搜索
     */
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
    /**
     * 滚动侦听
     */
    handleScroll(e) {
      let beforeScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop

      window.addEventListener(
        'scroll',
        () => {
          // 滚动的时候隐藏菜单
          if (this.menuSwitch) this.menuSwitch = false

          if (this.headerData.type === 'blog') {
            let afterScrollTop =
                document.documentElement.scrollTop || document.body.scrollTop,
              delta = afterScrollTop - beforeScrollTop

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
      this.headerData.image.status = type == 'load' ? 1 : 0
    }
  }
}
</script>
