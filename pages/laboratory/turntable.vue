<template>
  <div id="turntable">
    <header-box :header-data="headerData"/>
    <div class="main container clear">
      <section class="code-editor">
        <div class="embed-nav">
          <ul class="g-r-center">
            <li
              v-for="(item, index) of embed_nav.list"
              :key="index"
              :class="{active: index === embed_nav.index}"
              @click="embed_nav.index = index"
            >{{ item }}</li>
          </ul>
        </div>
        <pre class="line-numbers active" v-if="embed_nav.index == 0">
          <code ref="code0">
/** 大转盘
  * @param {Object} rotaryImg - 转动的对象
  * @param {Number} awardsNum - 奖项个数
  * @param {Number} rotary_direction -旋转方向 (1:  顺时针，2：逆时针)  默认为: 1
  * @param {Number} duration - 转动时间
  * @param {Number} isRandom - 是否随机偏移 (1: 否，2：是)  默认为: 1
  *
  *@function  run - 运行函数
  *   @param {Number} result - 获奖结果
  *   @param {Function} callback - 回调函数
  */
  window.$turntable = function(param) {
    this.$duration = 2000
    for (let x in param) {
      this['$' + x] = param[x]
    }
  }

  $turntable.prototype = {
    run: function(result, callback) {
      let area_size = 360 / this.$awardsNum,
        $angle =
          this.$isRandom == 2
            ? area_size * result -
              area_size / 2 +
              parseInt(Math.random() * (area_size + 1), 10)
            : area_size * result

      this.rotate($angle, callback)
    },
    rotate: function(angle, callback) {
      let rotaryNum = this.$duration / 50, //转动次数
        rotarySpeed =
          ((this.$rotary_direction === 2 ? -1800 : 1800) - angle) / rotaryNum, // 转动速度
        ratio = [1.9,1.8,1.7,1.6,1.5,1.4,1.3,1.2,1.1,1,1,0.9,0.8,0.7,0.6,0.5,0.4,0.3,0.2,0.1], //转动速率比例
        total = 0, //用于存储当前位置
        curRotaryNum = 0 //记录当前转动次数

      let timer = setInterval(() => {
        ration = ratio[Math.floor(curRotaryNum / (rotaryNum / ratio.length))] //设置速率
        total += rotarySpeed * ration

        this.$rotaryImg.style.cssText = `transform: rotate(${total}deg); -webkit-transform: rotate(${total}deg)`

        // end
        if (curRotaryNum + 1 >= rotaryNum) {
          clearInterval(timer)

          this.$rotaryImg.style.cssText = `transform: rotate(${-angle}deg); -webkit-transform: rotate(${-angle}deg)`

          callback()
        }

        curRotaryNum++
      }, 50)
    }
  }
          </code>
          <span class="line-numbers-rows">
            <span v-for="item of line_number" :key="item"></span>
          </span>
        </pre>
      </section>
      <section class="form">
        <label>
          获奖结果：
          <input v-model="param.result" type="number" placeholder="请输入获奖结果">
        </label>
        <label>
          转动时间：
          <input v-model="param.duration" type="number" placeholder="请输入转动时间">
        </label>
        <div>
          <label class="radio">
            <input name="random" type="radio" v-model="param.isRandom" value="1">居中
          </label>
          <label class="radio">
            <input name="random" type="radio" v-model="param.isRandom" value="2">随机偏移
          </label>
        </div>
        <div>
          <label class="radio">
            <input name="Fruit" type="radio" v-model="param.rotary_direction" value="1">顺时针
          </label>
          <label class="radio">
            <input name="Fruit" type="radio" v-model="param.rotary_direction" value="2">逆时针
          </label>
        </div>
        <div>
          <button @click="turntableStart">转动</button>
          <span>{{ result_text }}</span>
        </div>
      </section>
      <div class="turntable">
        <img class="bg" ref="turntable" src="~/assets/images/laboratory/turntable.png" alt>
        <img
          @click="turntableStart"
          class="start-btn"
          src="~/assets/images/laboratory/startBtn.png"
          alt
        >
      </div>
    </div>
    <footer-box/>
  </div>
</template>

<script lang="ts">
'use strict'
import { Vue, Component, Watch } from 'vue-property-decorator'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'
import { $turntable }  from '~/assets/js/utils'
import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/a11y-dark.css'
hljs.registerLanguage('javascript', javascript)

@Component({
  head: {
    title: '大转盘-朱为鹏的个人网站'
  },
  components: {
    headerBox,
    footerBox
  }
})
export default class Turntable extends Vue {
  // data
  embed_nav: any = { list: ['js'], index: 0 }
  line_number: number = 0
  result_text: string = ''
  turntable_status: boolean = false // 转盘状态 false：未开始 true 运行中 默认false
  param: any = {
    result: 1,
    rotary_direction: 1,
    duration: 2000,
    isRandom: 1
  }
  headerData: any = {
    searchStatus: false,
    isStatic: true,
    type: 'laboratory'
  }

  @Watch('embed_nav.index')
  onChanged() {
    this.setLineNumber()
  }

  mounted() {
    this.setLineNumber()
    let code_obj: any = document.querySelectorAll('pre code')

    code_obj.forEach(block => {
      hljs.highlightBlock(block)
    })
  }

  /**
   * 设置代码行数
   */
  setLineNumber(): void {
    let index = this.embed_nav.index

    this.$nextTick(() => {
      let code_obj: any = this.$refs[`code${index}`]

      this.line_number = Math.ceil((code_obj.offsetHeight - 40) / 20)
    })
  }

  /**
   * 开始转盘
   */
  turntableStart(): void {
    if (!this.turntable_status) {
      this.turntable_status = true

      let result = this.param.result,
        turntable = new $turntable({
          rotaryImg: this.$refs.turntable,
          rotary_direction: this.param.rotary_direction,
          awardsNum: 10,
          duration: this.param.duration,
          isRandom: this.param.isRandom
        })

      turntable.run(result, () => {
        this.turntable_status = false
        this.result_text = `恭喜获得奖品${result}`
      })
    }
  }
}
</script>
<style lang='scss' scoped>
#turntable {
  .main {
    height: 100vh;
    margin: 0 auto -100px;
    padding-top: 90px !important;
    .code-editor {
      float: left;
      margin: 0 20px 20px 0;
      .embad-nav,
      pre.line-numbers {
        max-width: 500px;
      }
    }
    .form {
      float: left;
      max-width: 300px;
      label {
        display: block;
        margin-bottom: 15px;
        input {
          height: 24px;
          padding: 0 10px;
          border: 1px solid #ccc;
        }
        &.radio {
          display: inline-block;
          margin-right: 10px;
          input {
            height: auto;
            margin-right: 5px;
          }
        }
      }
      button {
        width: 50px;
        height: 24px;
        border-radius: 4px;
      }
      span {
        padding-left: 20px;
        color: #f00;
      }
    }
    .turntable {
      position: relative;
      float: left;
      padding: 10px 0 20px;
      .bg {
        display: block;
        width: 300px;
        margin: 0 auto;
      }
      .start-btn {
        position: absolute;
        top: 90px;
        left: 50%;
        width: 80px;
        margin-left: -40px;
        cursor: pointer;
      }
    }
  }
}

@media (max-width: 767px) {
  #turntable .main {
    padding-top: 70px !important;
  }
}
</style>
