<template>
  <div id="lived">
    <loading :load-status="loadStatus"/>
    <header-box :header-data="headerData"/>
    <div class="pc-view" v-if="!device.isMobile">
      <div class="main container">
        <svg width="100%" height="100%">
          <path
            data-0="stroke-dashoffset: 1595;"
            data-3000="stroke-dashoffset: 0;"
            d="M 22.889 -0.081 C 37.105 73.303 95.589 160.569 130.634 199.774 L 143.534 180.315 L 151.408 191.6 L 132.771 219.677 L 140.526 208.145 L 153.074 198.439 L 156.048 203.21 L 132.43 219.477 L 124.991 208.751 L 130.676 199.754 C 174.962 257.544 259.804 310.349 357.546 341.933 L 364.817 321.954 L 376.834 325.991 L 365.088 356.373 L 369.117 345.748 L 382.102 334.924 L 385.668 339.835 L 364.953 356.289 L 353.575 352.629 L 357.564 341.995 C 421.891 364.701 595.217 373.528 650.147 372.534 L 650.147 350.29 L 662.959 350.29 L 662.959 385.151 L 662.959 372.534 L 671.552 354.738 L 676.649 357.993 L 662.959 385.151 L 649.971 385.151 L 650.147 372.534 C 747.145 368.5 861.563 364.793 912.801 346.71 C 912.802 346.71 913.056 386.542 913.153 386.542 L 915.95 386.542 L 910.393 386.542 L 910.426 389.573 L 915.88 389.58 L 915.806 386.542 L 916.313 386.542"
            style="fill: none; stroke: rgba(255,255,255,0.7); stroke-width: 2px; stroke-dasharray: 1595px; stroke-dashoffset: 0;"
          ></path>
          <path
            data-3000="stroke-dashoffset: 500;"
            data-4500="stroke-dashoffset: 0;"
            d="M 913.29 390.379 C 866.296 392.641 863.415 440.568 863.57 440.596 C 865.244 488.683 912.765 490.175 913.025 490.149 C 912.989 490.113 890.445 487.159 880.334 493.665 C 875.036 497.074 874.333 511.367 881.32 513.86 C 891.395 517.454 897.798 505.919 912.805 500.727 L 912.932 491.331 C 912.776 491.019 887.863 497.854 880.475 502.568 C 875.374 505.823 862.699 520.436 862.766 520.453 C 862.766 520.453 833.473 550.607 836.326 584.285 C 836.78 589.643 846.85 593.784 852.159 584.285 C 856.718 576.128 867.034 568.563 873.138 584.285 C 876.822 597.401 885.017 597.794 886.616 597.401 C 899.754 594.17 899.541 581.729 913.29 583.151"
            transform="matrix(1, 0, 0, 1, 0, 0)"
            style="fill: none; stroke: rgba(255,255,255,0.7); stroke-width: 2px; stroke-dasharray: 500px; stroke-dashoffset: 0;"
          ></path>
          <path
            data-3000="stroke-dashoffset: 500;"
            data-4500="stroke-dashoffset: 0;"
            d="M 913.29 390.385 C 914.947 390.385 959.62 388.665 964.153 441.415 C 964.508 440.648 963.365 487.829 913.303 490.546 C 913.172 490.152 940.198 486.421 945.174 494.984 C 948.094 498.949 948.703 522.591 934.451 512.705 C 927.282 507.733 922.663 503.692 913.303 500.851 C 913.303 496.774 913.45 493.726 913.45 491.567 C 925.44 492.237 948.026 504.36 947.141 505.694 C 957.225 513.16 963.754 520.851 964.153 520.851 C 971.23 528.138 994.836 556.562 986.452 583.078 C 983.774 591.547 973.361 586.977 970.132 585.145 C 963.362 581.305 963.365 579.399 955.771 579.13 C 948.222 579.317 946.333 588.018 945.195 592.841 C 944.065 597.627 936.39 599.83 928.403 590.485 C 924.452 585.864 914.78 583.245 913.29 583.17"
            transform="matrix(1, 0, 0, 1, 0, 0)"
            style="fill: none; stroke: rgba(255,255,255,0.7); stroke-width: 2px; stroke-dasharray: 500px; stroke-dashoffset: 0;"
          ></path>
        </svg>
        <div
          class="wrap box1"
          data-0="display: none;"
          data-500="left: -75px; opacity: 0;display: block;"
          data-1250="left: -55px; opacity: 1;"
        >
          <div class="row">
            <nuxt-link class="set" :to="{path: '/photos/list',query: {prefix: imgs[0].prefix}}">
              <span
                v-for="(item,index) in imgs[0].list"
                :key="index"
                :class="{layer: index!=2,one: index==0,two: index==1}"
              >
                <img :src="item.key+'200'">
              </span>
              <span class="layer three">{{ imgs[0].prefix }}</span>
            </nuxt-link>
          </div>
        </div>
        <div
          class="wrap box2"
          data-0="display: none;"
          data-1350="left: 193px; opacity: 0; display: block;"
          data-2100="left: 213px; opacity: 1;"
        >
          <div class="row">
            <nuxt-link class="set" :to="{path: '/photos/list',query: {prefix: imgs[1].prefix}}">
              <span
                v-for="(item,index) in imgs[1].list"
                :key="index"
                :class="{layer: index!=2,one: index==0,two: index==1}"
              >
                <img :src="item.key+'200'">
              </span>
              <span class="layer three">{{ imgs[1].prefix }}</span>
            </nuxt-link>
          </div>
        </div>
        <div
          class="wrap box3"
          data-0="display: none;"
          data-2150="top: 403px; opacity: 0; display: block;"
          data-3000="top: 383px; opacity: 1;"
        >
          <div class="row">
            <nuxt-link class="set" :to="{path: '/photos/list',query: {prefix: imgs[2].prefix}}">
              <span
                v-for="(item,index) in imgs[2].list"
                :key="index"
                :class="{layer: index!=2,one: index==0,two: index==1}"
              >
                <img :src="item.key+'200'">
              </span>
              <span class="layer three">{{ imgs[2].prefix }}</span>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="u_arrow"/>
    </div>
    <div v-else>
      <section v-for="(item, index) in imgs" :key="index" v-if="item.list[1]">
        <nuxt-link
          class="g-c-center"
          :to="{path: '/photos/list',query: {prefix: item.prefix}}"
          :style="'background: url('+item.list[1].key+'750)'"
        >{{ item.prefix.replace(/:/g,'') }}</nuxt-link>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import loading from '~/components/loading.vue'
import headerBox from '~/components/header.vue'

export default {
  head: {
    title: '照片墙'
  },
  components: {
    loading,
    headerBox
  },
  data() {
    return {
      loadStatus: false, // 加载状态。false：加载中。true：加载完成。
      headerData: {
        searchStatus: false,
        isStatic: true,
        type: 'photoWall'
      },
      imgs: [
        {
          prefix: '点滴',
          list: []
        },
        {
          prefix: '风景',
          list: []
        },
        {
          prefix: '猫咪',
          list: []
        }
      ]
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'M_QN_POSTFIX', 'device'])
  },
  mounted() {
    this.$nextTick(() => {
      document.body.style.cssText = `height: ${
        document.body.style.height
      } !important`
    })

    // 获取对应相册3条数据
    this.imgs.forEach((item, index) => {
      this.$axios
        .post('api/getQiniuList', {
          prefix: item.prefix + ':',
          limit: 3
        })
        .then(res => {
          if (res.code === 0) {
            let items = res.data.items

            for (let item of items) {
              item.key = this.IMGHOST + item.key + this.M_QN_POSTFIX
            }

            this.imgs[index].list = items
            this.loadStatus = true
          }
        })
    })
  }
}
</script>

<style lang="scss" scoped>
#lived {
  position: fixed;
  top: 0;
  left: 0;
  height: 5280px;
  width: 100vw;
  background: #363638;
  min-width: 1200px;
  .pc-view {
    position: relative;
    z-index: -11;
    min-height: 100vh;
    background-image: url('http://image.zhuweipeng.top/photoBg.jpeg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -10;
      background-image: linear-gradient(to bottom right, #002f4b, #dc4225);
      opacity: 0.6;
    }
  }
  .main {
    position: fixed;
    left: 50%;
    top: 100px;
    height: 100%;
    min-width: 1000px;
    transform: translate(-50%, 0);
    .wrap {
      position: absolute;
      display: block;
      overflow-x: hidden;
      opacity: 0;
      &.box1 {
        top: 190px;
        left: -75px;
        transform: rotate(48deg);
        .set {
          transform: rotateX(25deg);
        }
      }
      &.box2 {
        top: 351px;
        left: 193px;
        transform: rotate(16deg);
      }
      &.box3 {
        top: 403px;
        left: 532px;
        transform: rotate(-1deg);
      }
      .row {
        width: 100%;
        margin: 0;
        padding: 0;
        display: block;
        text-align: center;
        perspective: 1000px;
        .set {
          background: #000;
          width: 220px;
          height: 220px;
          margin: -60px 17px 0;
          display: inline-block;
          outline: 1px solid transparent;
          box-shadow: 0 0 1px 0 rgba(0, 0, 0, 1);
          position: relative;
          transform: rotateX(35deg);
          transform-style: preserve-3d;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          img {
            width: 100%;
            height: 100%;
            display: block;
            opacity: 0.5;
            transition: opacity 0.5s;
          }
          &:hover {
            img {
              opacity: 1;
            }
            .layer:not(.three) {
              box-shadow: 0 0 8px 0 #000;
            }
            .layer.one {
              transform: translateZ(12px);
            }
            .layer.two {
              transform: translateZ(24px);
            }
            .layer.three {
              transform: translateZ(32px);
              text-shadow: 0 0 4px #000;
            }
          }
          .layer {
            background: #000;
            display: block;
            outline: 1px solid transparent;
            box-shadow: 0 0 4px 0 #000;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            transition: box-shadow 0.5s, transform 0.5s, text-shadow 0.5s;
            text-align: left;
            &.one {
              transform: translateZ(4px);
            }
            &.two {
              transform: translateZ(8px);
            }
            &.three {
              background: none;
              padding: 16px;
              box-shadow: none;
              top: auto;
              right: auto;
              transform: translateZ(8px);
            }
          }
        }
      }
    }
  }
  .u_arrow {
    bottom: 20px;
  }
  #col-sm {
    display: none;
    padding-top: 70px;
    section {
      width: 92%;
      height: 50vh;
      margin: 0 auto;
      padding-bottom: 20px;
      a {
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 25px;
        text-shadow: 1px 1px 0 #ccc, 2px 2px 0 #ccc;
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: cover !important;
        -webkit-background-size: cover !important;
        border-radius: 6px;
      }
    }
  }
}

@media (max-width: 767px) {
  #lived {
    position: static;
    height: auto;
    min-height: 100vh;
    min-width: auto;
  }
}
</style>
