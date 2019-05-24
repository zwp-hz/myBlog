<template>
  <div id="photoList">
    <loading :load-status="loadStatus"/>
    <header-box :header-data="headerData"/>
    <div class="main">
      <section class="container" v-for="(m,y_key) in imgList" :key="y_key">
        <h2>{{ y_key.replace(/:/g,'') }}</h2>
        <div class="month_box" v-for="(d,m_key) in m" :key="m_key">
          <h3>{{ m_key.replace(/-/g,'')|number_to_chinese }}</h3>
          <div class="day_box g-r-center" v-for="(list,d_key) in d" :key="d_key">
            <span>
              {{ d_key.replace(/:/g,'') }}
              <i/>
            </span>
            <ul>
              <li v-for="(item, index) in list" :key="index" @click="img_modal($event,item.src)">
                <a
                  href="javaScript:void(0);"
                  data-type="img"
                  :data-url="item.src"
                  class="progressive not-loaded"
                >
                  <img
                    :style="'opacity:'+(item.status === 2 ? 0 : 1)"
                    @load="item.status=1"
                    @error="item.status=2"
                    :src="item.src_small"
                    alt
                  >
                  <i
                    class="iconfont icon-codestore"
                    :style="'display:'+(item.status === 2 ? 'block' : 'none')"
                  />
                  <span class="note u_transition_300">
                    <b class="iconfont icon-time"/>
                    {{ y_key.replace(/:/g,'')+'-'+m_key+d_key.replace(/:/g,'') }}
                    <br>
                    <b class="iconfont icon-dingwei"/>
                    {{ item.city }}
                    <br>
                    <b class="iconfont icon-biaoqian"/>
                    {{ item.title }}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    <div id="modal" v-if="modal.status" @click="img_modal('','','hide')">
      <div class="mask u_transition_500" :class="{show: modal.move_status !== 0}"/>
      <div
        class="centent"
        :class="{active: modal.move_status !== 0,textShow: modal.move_status === 2}"
        :style="modal.style"
      >
        <div class="box" v-html="modal.html"/>
      </div>
      <div class="u_loading" v-if="modal.load_status"/>
    </div>
    <i class="iconfont icon-jiantou" v-if="scrollTopStatus" onclick="window.scrollTo(0, 0)"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import loading from '~/components/loading'
import headerBox from '~/components/header'
import { lazyload } from '~/assets/js/utils'

let timer

export default {
  head() {
    return {
      title: this.title + '-朱为鹏的个人网站'
    }
  },
  components: {
    loading,
    headerBox
  },
  data() {
    return {
      title: this.$route.query.prefix,
      loadStatus: false, // 加载状态。false：加载中。true：加载完成。
      headerData: {
        // 头部配置
        searchStatus: false,
        isStatic: true,
        type: 'static'
      },
      qn_resource: {
        // 七牛资源
        list: [],
        number: 0
      },
      scrollTopStatus: false, // 滚动条置顶显示状态
      imgList: {}, // 显示的图片列表
      modal: {
        // 弹出层样式、信息
        html: '',
        status: false,
        move_status: 0,
        load_status: false,
        style: {}
      },
      befoer_modal: {
        // 记录之前的弹出层样式
        top: '',
        height: ''
      }
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'M_QN_POSTFIX'])
  },
  mounted() {
    let prefix = this.$route.query.prefix

    // 获取对应相册列表
    this.$axios
      .post('api/getQiniuList', {
        prefix: prefix + ':'
      })
      .then(res => {
        if (res.code === 0) {
          this.qn_resource.list = res.data.items
          this.laodImgs('first')

          document.addEventListener('scroll', this.seeScroll, false)
        }
      })
  },
  methods: {
    /**
     * 图片弹出层
     * @param {event}   元素属性
     * @param {src}     图片地址
     * @param {type}    显示隐藏状态。 默认：show。 可选 hide
     */
    img_modal(event, src, type) {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop

      if (type === 'hide') {
        if (this.modal.move_status !== 2) return false

        this.modal.move_status = 0
        this.modal.style.top = this.befoer_modal.top
        this.modal.style.height = this.befoer_modal.height

        setTimeout(() => {
          document.body.style.overflow = 'auto'
          this.modal.status = false
        }, 500)
      } else {
        let obj = event.path
            ? event.path[0].tagName === 'A'
              ? event.path[0]
              : event.path[1]
            : event.target,
          src_1080 = src.replace(/w\/(.*)/g, 'w/1080'),
          $img = new Image()

        document.body.style.overflow = 'hidden'

        // 设置modal 样式
        this.modal.status = true
        this.befoer_modal = {
          top: obj.offsetTop - scrollTop + 'px',
          height: obj.clientHeight + 'px'
        }
        this.modal.style = {
          width: obj.clientWidth + 'px',
          height: obj.clientHeight + 'px',
          top: obj.offsetTop - scrollTop + 'px',
          left: obj.offsetLeft + 'px'
        }

        // 根据图片尺寸获取弹出层的top值
        let clientWidth = document.documentElement.clientWidth,
          clientHeight = document.documentElement.clientHeight,
          ratio = clientWidth >= 1110 ? 0.4 : clientWidth <= 700 ? 0.8 : 0.5,
          img_header =
            (clientWidth * ratio) / (obj.clientWidth / obj.clientHeight)

        setTimeout(() => {
          this.modal.html = obj.innerHTML
          setTimeout(() => {
            this.modal.move_status = 1
            this.modal.style.top =
              clientHeight - img_header <= 0
                ? '1vh'
                : (clientHeight - img_header) / 2 + 'px'
            this.modal.style.height = img_header + 'px'
          }, 99)
        }, 1)

        // 加载1080p图片资源
        setTimeout(() => {
          this.modal.move_status = 2
          this.modal.load_status = true
          $img.src = src_1080
          $img.onload = e => {
            if (e.type === 'load') {
              document
                .getElementById('modal')
                .getElementsByTagName('img')[0].src = src_1080
              this.modal.load_status = false
            }
          }
        }, 600)
      }
    },
    /**
     * 滚动侦听
     */
    seeScroll(e) {
      let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
        scrollHeight = document.documentElement.scrollHeight, // 内容高度
        seeHeight = document.documentElement.clientHeight // 可见区域高度

      this.scrollTopStatus = scrollTop > 0

      if (scrollTop >= scrollHeight - seeHeight - 100) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.laodImgs()
        }, 50)
      }
    },
    /**
     * 加载图片
     * @param {type}    判断是否第一次加载
     */
    laodImgs(type) {
      // 初始化数据
      let { IMGHOST, M_QN_POSTFIX } = this,
        { list, number } = this.qn_resource, // 七牛图片数据
        row_size = document.documentElement.clientWidth > 900 ? 4 : 2, // 每行个数
        img_json = {}, // 记录图片数据
        img_time = '',
        img_number = 0,
        time_number = 0

      // 加载完成  中止运行
      if (list.slice(number).length <= 0) {
        document.removeEventListener('scroll', this.seeScroll, false)
      }

      for (let item of list.slice(number)) {
        let img_array = item.img_name.match(/.*?(:|-|\.|，)/g),
          time_string = img_array[0] + img_array[1] + img_array[2],
          clientWidth = document.documentElement.clientWidth,
          img_width = parseInt(
            (clientWidth > 767 ? clientWidth / 3 : clientWidth / 2) * 0.8,
            10
          )

        // 记录数量
        time_number = time_string !== img_time ? ++time_number : time_number

        // 中断数据遍历
        if (type !== 'first') {
          if (time_number > 1 || img_number >= row_size) {
            break
          }
        } else if (img_number >= 15 || time_number > 4) {
          break
        }

        // 数据分割
        img_array.forEach((val, index) => {
          if (index === 0 && !img_json[val]) {
            img_json[val] = {}
          } else if (index === 1 && !img_json[img_array[0]][val]) {
            img_json[img_array[0]][val] = {}
          } else if (
            index === 2 &&
            !img_json[img_array[0]][img_array[1]][val]
          ) {
            img_json[img_array[0]][img_array[1]][val] = []
          } else if (index === 3) {
            img_json[img_array[0]][img_array[1]][img_array[2]].push({
              key: [img_array[0], img_array[1], img_array[2]],
              city:
                img_array[3].replace(/-/g, '') +
                ' ' +
                img_array[4].replace(/，/g, ''),
              title: img_array[5].replace(/\./g, ''),
              src: IMGHOST + item.key + M_QN_POSTFIX + img_width,
              src_small: IMGHOST + item.key + M_QN_POSTFIX + 60,
              status: 0
            })
          }
        })

        // 记录图片信息
        this.qn_resource.number++
        img_number++
        img_time = time_string
      }

      if (type === 'first') {
        this.imgList = img_json
        this.loadStatus = true
      } else {
        // 数据组合
        let factorical = data => {
          if (Array.isArray(data)) {
            for (let i of data) {
              i.key.forEach((key, index) => {
                if (index === 0 && !this.imgList[key]) {
                  this.imgList[key] = {}
                } else if (index === 1 && !this.imgList[i.key[0]][key]) {
                  this.imgList[i.key[0]][key] = {}
                } else if (
                  index === 2 &&
                  !this.imgList[i.key[0]][i.key[1]][key]
                ) {
                  this.imgList[i.key[0]][i.key[1]][key] = []
                }
              })
              this.imgList[i.key[0]][i.key[1]][i.key[2]].push(i)
            }
          } else if (typeof data === 'object') {
            for (let i in data) {
              factorical(data[i])
            }
          }
        }

        factorical(img_json)
      }

      // 重定向数据
      this.imgList = Object.assign({}, this.imgList)
      // DOM渲染完成
      this.$nextTick(() => {
        new lazyload().init()
        document.documentElement.scrollToPositionp = document.body.scrollToPositionp =
          (document.documentElement.scrollToPositionp ||
            document.body.scrollToPositionp) - 1
      })
    }
  }
}
</script>

<style lang="scss">
#photoList {
  min-height: 100vh;
  padding-bottom: 40px;
  box-shadow: inset 0 0 100px hsla(0, 0, 0, 0.3);
  background-image: linear-gradient(
      45deg,
      rgba(194, 233, 221, 0.5) 1%,
      rgba(104, 119, 132, 0.5) 100%
    ),
    linear-gradient(-45deg, #494d71 0%, rgba(217, 230, 185, 0.5) 80%);
  img {
    vertical-align: bottom;
  }
  .main {
    section {
      margin: 50px auto 0;
      h2 {
        display: inline-block;
        padding: 2px 10px;
        font-size: 30px;
        border-top: 2px solid #333;
        border-bottom: 2px solid #333;
        transform: rotate(-40deg);
      }
      .month_box {
        padding: 20px 0 0 40px;
        h3 {
          font-size: 25px;
        }
        .day_box {
          align-items: flex-start;
          > span {
            position: relative;
            display: block;
            height: 20px;
            width: 40px;
            line-height: 20px;
            text-align: center;
            font-size: 18px;
            i {
              position: absolute;
              top: 5px;
              right: -6px;
              width: 10px;
              height: 10px;
              background-color: #1ed9be;
              border-radius: 50%;
            }
          }
          ul {
            flex: 1;
            padding: 10px 10px 0 10px;
            border-left: 2px solid #fff;
            column-count: 4;
            column-gap: 10px;
            overflow: hidden;
            li {
              width: 100%;
              min-height: 50px;
              margin-bottom: 10px;
              overflow: hidden;
              -webkit-column-break-inside: avoid;
              break-inside: avoid;
              a {
                position: relative;
                background-color: #cecec4;
                display: flex;
                flex-direction: column;
                flex: 1;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                img {
                  width: 100%;
                  border-radius: 6px;
                  background-image: inherit;
                }
                .icon-codestore {
                  position: absolute;
                  font-size: 80px;
                  color: #fff;
                  z-index: 100;
                }
                &:after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  transition: 0.3s all ease-in-out;
                }
                &:hover {
                  &:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 -100px 100px -60px hsla(0, 0, 0, 0.5) inset;
                  }
                  span {
                    z-index: 10;
                    opacity: 1;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .note {
    position: absolute;
    bottom: 5px;
    z-index: -1;
    width: 100%;
    height: 48px;
    padding-left: 10px;
    text-align: left;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    opacity: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    b {
      font-size: 12px;
      padding-right: 5px;
    }
  }
  #modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.65);
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
    .centent {
      position: fixed;
      max-height: 98vh;
      z-index: 100;
      transition: 0.5s all ease;
      -webkit-transition: 0.5s all ease;
      border-radius: 10px;
      .box {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 1;
          box-shadow: 0 -120px 100px -60px hsla(0, 0, 0, 0.8) inset;
          border-radius: 0 0 10px 10px;
        }
        img {
          width: 100%;
          border-radius: 10px;
        }
        span {
          z-index: 10;
          width: 100%;
        }
      }
      &.active {
        left: 25% !important;
        width: 50% !important;
      }
      &.textShow span {
        opacity: 1;
      }
    }
    .u_loading {
      z-index: 1000;
    }
  }
}

.icon-jiantou {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #000;
  font-size: 20px;
  text-align: center;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
}

@media (min-width: 1110px) {
  #photoList #modal {
    .centent {
      overflow: auto;
      &.active {
        left: 32% !important;
        width: 36% !important;
      }
    }
  }
}

@media (max-width: 900px) {
  ul {
    column-count: 2 !important;
    padding: 10px 3px 0 6px !important;
    column-gap: 6px !important;
    li {
      margin-bottom: 6px !important;
    }
  }
}

@media (max-width: 767px) {
  #photoList .main section {
    h2 {
      font-size: 20px;
    }
    .month_box {
      padding: 20px 0 0 10px;
    }
  }
}

@media (max-width: 700px) {
  #photoList #modal {
    .centent {
      &.active {
        left: 10% !important;
        width: 80% !important;
      }
    }
  }
}
@media (max-width: 550px) {
  section.container {
    max-width: 380px !important;
  }
}
</style>
