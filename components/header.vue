<template>
  <header>
    <div
      id="header"
      class="u_transition_300"
      :class="[ headerData.type, scrollStatus, {title: headerData.title} ]"
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
    <div id="blogHeader" v-if="headerData.title || headerData.type === 'article'">
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
        :src="IMGHOST + headerData.image.src + QN_POSTFIX + '100'"
        alt
      >
      <img
        v-if="headerData.image.status == 1"
        :src="IMGHOST + headerData.image.src + QN_POSTFIX + '500'"
        alt
      >
    </div>
  </header>
</template>

<script lang='ts'>
'use strict'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { HeaderData, Device } from '~/types/common'
import { State } from 'vuex-class'

@Component
export default class Header extends Vue {
  @Prop({})
  readonly headerData!: HeaderData

  @State('device')
  device: Device
  @State('search')
  search: any
  @State('IMGHOST')
  IMGHOST: string
  @State('QN_POSTFIX')
  QN_POSTFIX: string

  // data
  menuSwitch: boolean = false
  scrollStatus: string = ''
  curRoute: string = ''
  searchCnt: string = ''
  navArray: object[] = [
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
      route: '/laboratory',
      name: 'laboratory',
      title: '实验室'
    },
    {
      route: '/photos',
      name: 'photos',
      title: '照片墙'
    },
    {
      route: '/messageBoard',
      name: 'messageBoard',
      title: '留言板'
    }
  ]

  created() {
    this.curRoute = this.$route.name
  }

  mounted() {
    this.$nextTick(() => {
      if (!this.device.isMobile) {
        ;(<any>window).skrollr.init({
          smoothScrollingDuration: 200
        })
      }
    })

    if (this.headerData.type === 'article') {
      this.handleScroll()
    }

    this.scrollStatus =
      document.documentElement.scrollTop || document.body.scrollTop > 50
        ? 'down'
        : ''
  }

  navJump(route) {
    if (route !== this.$route.path) {
      this.$router.push({
        path: route
      })
    }
  }

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
  }

  handleScroll() {
    let beforeScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    window.addEventListener(
      'scroll',
      () => {
        // h5滚动的时候隐藏菜单
        if (this.menuSwitch) this.menuSwitch = false

        let afterScrollTop =
            document.documentElement.scrollTop || document.body.scrollTop,
          delta = afterScrollTop - beforeScrollTop

        beforeScrollTop = afterScrollTop

        if (afterScrollTop <= 50) {
          this.scrollStatus = ''
        } else {
          if (delta > 0 || delta <= -3) {
            if (!(<any>window).scrollSkip) {
              let type = delta > 0 ? 'down' : 'up'

              if (this.scrollStatus !== type) {
                this.scrollStatus = type
              }
            } else {
              this.scrollStatus = 'down'
            }
          }
        }
      },
      false
    )
  }

  imgLoad(type) {
    this.headerData.image.status = type == 'load' ? 1 : 0
  }
}
</script>
