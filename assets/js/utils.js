/**
 * 获取设备信息
 * @return {Object}
 */
exports.getDeviceInfo = () => {
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

/**
 * 滚动条置顶
 */
exports.scrollToPosition = number => {
  let smoothscroll = () => {
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    if (scrollTop > number) {
      window.requestAnimationFrame(smoothscroll)
      window.scrollTo(0, scrollTop - scrollTop / 5)
    }
  }

  smoothscroll()
}

/**
 * 懒加载
 */
exports.lazyload = function() {
  this.init = () => {
    window.removeEventListener('scroll', forEach_envent, false)

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
        let item = object[i],
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
          })
        }
      }
    }
    forEach_envent()
    window.addEventListener('scroll', forEach_envent, false)
  }
  this.imgLoad = (url, callback) => {
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
