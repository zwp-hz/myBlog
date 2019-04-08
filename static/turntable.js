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
        ((this.$rotary_direction == 2 ? -1800 : 1800) - angle) / rotaryNum, // 转动速度
      ratio = [
        1.9,
        1.8,
        1.7,
        1.6,
        1.5,
        1.4,
        1.3,
        1.2,
        1.1,
        1,
        1,
        0.9,
        0.8,
        0.7,
        0.6,
        0.5,
        0.4,
        0.3,
        0.2,
        0.1
      ], //转动速率比例
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
