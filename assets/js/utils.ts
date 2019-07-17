/**
 * 获取设备信息
 * @return {Object}
 */
export const getDeviceInfo = (): object => {
  let u = navigator.userAgent,
    device = {
      isMobile: /(iPhone|iPad|iPod|iOS|Android|Linux)/i.test(u),
      browser:
        u.indexOf('MicroMessenger') !== -1
          ? 'wechat'
          : u.indexOf('QQ') !== -1
            ? 'qq'
            : 'else',
      system: /(Android|Linux)/i.test(u) ? 'Android' : 'ios'
    }

  return device
}

interface turntableParam {
  rotaryImg: object
  awardsNum: number
  rotary_direction: number
  duration: number
  isRandom: number
}

/** 大转盘
 * @param {Object} rotaryImg - 转动的对象
 * @param {Number} awardsNum - 奖项个数
 * @param {Number} rotary_direction -旋转方向 (1:  顺时针，2：逆时针)  默认为: 1
 * @param {Number} duration - 转动时间  默认 2000毫秒
 * @param {Number} isRandom - 是否随机偏移 (1: 否，2：是)  默认为: 1
 *
 *@function  run - 运行函数
 *   @param {Number} result - 获奖结果
 *   @param {Function} callback - 回调函数
 */
export class $turntable {
  $rotaryImg: any
  $awardsNum: number
  $rotary_direction: number = 1
  $duration: number = 2000
  $isRandom: number = 1
  constructor(param: turntableParam) {
    for (let x in param) {
      this['$' + x] = param[x]
    }
  }

  run(result: number, callback: any) {
    let area_size: number = 360 / this.$awardsNum,
      $angle: any =
        this.$isRandom == 2
          ? area_size * result -
            area_size / 2 +
            parseInt((Math.random() * area_size) as any, 10)
          : area_size * result

    this.rotate($angle, callback)
  }

  rotate(angle: number, callback: any) {
    let rotaryNum = this.$duration / 50, //转动次数
      rotarySpeed =
        ((this.$rotary_direction == 2 ? -1800 : 1800) - angle) / rotaryNum, // 转动速度
      ratio = (() => {
        let array = []
        for (let i = 1; i < 20; i++) {
          array.push((20 - i) / 10)
        }
        array.splice(10, 0, 1)

        return array
      })(), //转动速率比例
      total = 0, //用于存储当前位置
      curRotaryNum = 0 //记录当前转动次数

      console.log(ratio)

    let timer = setInterval(() => {
      let ration = ratio[Math.floor(curRotaryNum / (rotaryNum / ratio.length))] //设置速率
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

/**
 * 懒加载
 */
export class lazyload {
  init() {
    let forEach_envent = () => {
      let object = document.querySelectorAll('[data-url]'),
        scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
        seeHeight = document.documentElement.clientHeight // 可见区域高度
      // 解除绑定
      if (object.length <= 0) {
        window.removeEventListener('scroll', forEach_envent, false)
      }
      // 遍历需要懒加载的对象
      for (let i = 0; object.length > i; i++) {
        let item: any = object[i],
          cur_offsetTop = item.offsetTop || item.offsetParent.offsetTop,
          clientHeight = item.clientHeight || 0

        if (
          cur_offsetTop < scrollTop + seeHeight + 30 &&
          cur_offsetTop + clientHeight - 30 > scrollTop
        ) {
          let image_url = item.getAttribute('data-url')

          item.removeAttribute('data-url')
          this.imgLoad(image_url, e => {
            if (e.type === 'error') {
              item.style.cssText = ''
              item.getElementsByTagName('i')[0].style.opacity = '1'
            } else if (e.type === 'load') {
              if (item.getAttribute('data-type') === 'img') {
                item.getElementsByTagName('img')[0].src = image_url
              } else {
                item.style.background = "url('" + image_url + "')"
              }
            }
            item.className = 'u_transition_300 progressive is-loaded'
            setTimeout(() => {
              // item.style.filter = ' blur(0px)'
              item.className = 'u_transition_300 progressive'
            }, 1300)
          })
        }
      }
    }

    window.removeEventListener('scroll', forEach_envent, false)
    window.addEventListener('scroll', forEach_envent, false)
    forEach_envent()
  }

  imgLoad(url: string, callback: any) {
    let img = new Image()
    img.src = url
    // 加载成功
    img.onload = function(e) {
      callback(e)
    }
    // 加载失败
    img.onerror = function(e) {
      callback(e)
    }
  }
}
