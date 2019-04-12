<template>
  <div id="fallsFlow">
    <header-box :header-data="headerData"/>
    <div class="main container clear">
      <section class="code-editor">
        <div class="embed-nav">
          <ul class="g-r-center">
            <li
              v-for="(item, index) of embed_nav.list"
              :key="index"
              :class="{active: index === embed_nav.index}"
              @click="setLineNumber(index)"
            >{{ item }}</li>
          </ul>
        </div>
        <pre class="line-numbers" :class="{active: embed_nav.index === 0}">
          <code ref="code0">
let imgs = [
  "http://image.zhuweipeng.top/风景:2018:07-29:杭州市-余杭区，梦想小镇夜景1.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/风景:2018:06-22:杭州市-千岛湖，公司团建之千岛湖夜景1.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "",
  "http://image.zhuweipeng.top/风景:2018:07-29:杭州市-余杭区，梦想小镇夜景2.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/点滴:2018:09-09:杭州市-西湖区，去舅舅家吃饭帮表妹完成下家庭作业.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/点滴:2018:12-09:杭州市-余杭区，和娜娜一起堆的雪人嘻嘻是不是很像.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/风景:2018:01-27:杭州市-西湖区，中山公园7.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/风景:2018:07-29:杭州市-余杭区，梦想小镇夜景1.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/风景:2018:06-22:杭州市-千岛湖，公司团建之千岛湖夜景1.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "",
  "http://image.zhuweipeng.top/风景:2018:07-29:杭州市-余杭区，梦想小镇夜景2.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/点滴:2018:09-09:杭州市-西湖区，去舅舅家吃饭帮表妹完成下家庭作业.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/点滴:2018:12-09:杭州市-余杭区，和娜娜一起堆的雪人嘻嘻是不是很像.jpg?imageView2/2/interlace/1/format/jpg/w/",
  "http://image.zhuweipeng.top/风景:2018:01-27:杭州市-西湖区，中山公园7.jpg?imageView2/2/interlace/1/format/jpg/w/"
],
content,
img_styles = [], // 图片样式参数
img_width = 0, // 图片的宽度
row_number = 0, // 图片行数
row_tops = [], // 记录最好一行图片的位置
load_type = "init", // 加载类型 默认：init - 初始化  scroll - 滚动加载  resize - 视图变化
beforeScrollTop = 0, // 记录滚动条变化前的数值 用于区分上下滚动
timer;

window.onload = function() {
  content = document.getElementsByClassName("content")[0];
  beforeScrollTop =
    document.documentElement.scrollTop || document.body.scrollTop动;

  imgRrgodic(imgs);
  window.addEventListener("scroll", scrollChange, false);
  window.addEventListener("resize", windowResize, false);
};

/*
  * 浏览器窗口变化
  */
let windowResize = () => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    let offsetWidth = content.offsetWidth;

    load_type = "resize";
    row_tops = [];
    row_number = offsetWidth >= 1200 ? 4 : offsetWidth > 750 ? 3 : 2; // 基于不同宽度设置不同行数
    img_width = offsetWidth / row_number;

    img_styles.forEach((item, index) => {
      setImgPosition(index);
    });
  }, 50);
};

/**
  * 滚动条变化
  */
let scrollChange = () => {
  let afterScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
    scrollHeight = document.documentElement.scrollHeight, // 内容高度
    seeHeight = document.documentElement.clientHeight; // 可见区域高度

  forEach_envent();

  if (
    afterScrollTop > beforeScrollTop &&
    afterScrollTop >= scrollHeight - seeHeight - 100
  ) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      load_type = "scroll";
      imgRrgodic(imgs);
    }, 50);
  }

  beforeScrollTop = afterScrollTop;
};

/**
  * 图片加载遍历
  * @param {Array} img_list - 图片列表
  */
let imgRrgodic = img_list => {
  let offsetWidth = content.offsetWidth, // 容器的宽度
    img_dom_length = img_styles.length;

  row_number = offsetWidth >= 1200 ? 4 : offsetWidth > 750 ? 3 : 2; // 基于不同宽度设置不同行数
  img_width = offsetWidth / row_number;

  img_list.forEach((src, index) => {
    // 图片加载成功、失败处理
    new Promise((resolve, reject) => {
      imgLoad(src + 100, e => {
        if (e.type === "load") {
          let ratio = e.path[0].height / e.path[0].width;

          resolve({ type: e.type, ratio: ratio });
        } else {
          resolve({ type: e.type });
        }
      });
    }).then(res => {
      index = index + img_dom_length;

      img_styles[index] = {
        src: src,
        type: res.type,
        ratio: res.ratio
      };

      setImgPosition(index);
    });
  });
};

/**
  * 设置图片位置
  * @param {Number} index - 图片下标
  */
let setImgPosition = index => {
  let number = load_type === 'resize' ? 0 : content.getElementsByClassName('box').length

  // 加载图片下标大于当前设置图片的下标时不执行
  if (index > number) {
    return;
  } else {
    for (let i = number; img_styles.length > i; i++) {
      let item = img_styles[i];

      if (item) {
        item.height = item.ratio ? img_width * item.ratio : 80; // 计算图片高度
        let left = 0,
          top = 0;

        // 第一行图片不需要计算最小值
        if (row_number > row_tops.length) {
          left = i * img_width;
          top = 0;
          row_tops[i] = item.height;
        } else {
          // 得到最小值
          let min = Math.min(...row_tops);

          // 通过最小值得到对应下标 设置 top、left值
          for (let j = 0; row_tops.length > j; j++) {
            if (min === row_tops[j]) {
              top = min + 10;
              left = j * img_width;
              row_tops[j] = top + item.height; // 重新设置高度
              break;
            }
          }
        }

        // 重新设置图片位置
        if (load_type === "resize") {
          let div = content.getElementsByClassName("box")[i];

          div.style.cssText = `width: ${img_width}px; top: ${top}px; left: ${left}px;`;
          if (item.ratio) {
            div.getElementsByTagName("img")[0].style.height =
              item.height + "px";
          }

          number = i
        } else {
          // 创建dom节点、设置属性
          let div = document.createElement("div");
          div.className = "box";
          div.style = `width: ${img_width}px;top: ${top}px; left: ${left}px;`;
          div.innerHTML =
            item.type === "load"
              ? `&lt;p&gt;&lt;img class="not-loaded" style="height: ${
                  item.height
                }px;" data-src="${item.src + 1024}" src="${item.src +
                  100}" alr=""/&gt;&lt;/p&gt;`
              : '&lt;i class="iconfont icon-load-error"&gt;&lt;/i&gt;';

          content.appendChild(div);
        }
        forEach_envent();
      } else {
        break;
      }
    }
  }
};

/**
  * 遍历图片元素
  */
let forEach_envent = () => {
  let object = document.querySelectorAll("[data-src]"),
    scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
    seeHeight = document.documentElement.clientHeight; // 可见区域高度

  // 遍历需要懒加载的对象
  for (let i = 0; object.length > i; i++) {
    let item = object[i],
      cur_offsetTop =
        item.offsetTop ||
        item.offsetParent.offsetTop + content.offsetTop ||
        content.offsetParent.offsetTop,
      clientHeight = item.clientHeight || 0;

    if (scrollTop + seeHeight - 50 > cur_offsetTop) {
      let image_url = item.getAttribute("data-src");

      item.removeAttribute("data-src");
      imgLoad(image_url, e => {
        if (e.type === "error") {
          item.getElementsByTagName("i")[0].style.opacity = "1";
        } else if (e.type === "load") {
          item.src = image_url;
        }

        item.className = "u_transition_300 is-loaded";
      });
    }
  }
};

/**
  * 图片加载
  * @param {String} src - 图片地址
  * @param {Function} callback - 回调函数
  */
let imgLoad = (src, callback) => {
  let img = new Image();
  img.src = src;

  // 加载成功
  img.onload = function(e) {
    callback(e);
  };
  // 加载失败
  img.onerror = function(e) {
    callback(e);
  };
};
          </code>
          <span class="line-numbers-rows">
            <span v-for="item of line_number" :key="item"></span>
          </span>
        </pre>
        <pre class="line-numbers" :class="{active: embed_nav.index === 1}">
          <code ref="code1">
&lt;div class="content"&gt;&lt;/div&gt;
          </code>
          <span class="line-numbers-rows">
            <span v-for="item of line_number" :key="item"></span>
          </span>
        </pre>
        <pre class="line-numbers" :class="{active: embed_nav.index === 2}">
          <code ref="code2">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.u_transition_300 {
  transition: 0.3s all ease-in-out;
  -webkit-transition: 0.3s all ease-in-out;
}

.content {
  position: relative;
  margin: 10px -5px;
}

.content .box {
  position: absolute;
  display: inline-block;
  padding: 0 5px;
  transition: 0.3s all ease-in-out;
  -webkit-transition: 0.3s all ease-in-out;
}

.content .box p {
  overflow: hidden;
}

.content .box img {
  width: 100%;
}

.content .box .icon-load-error {
  display: block;
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #fff;
  font-size: 36px;
  background: #ccc;
}

/* 高斯模糊 */
.not-loaded {
  filter: blur(20px);
}

.is-loaded {
  filter: blur(20px);
  animation: sharpen 1.2s ease-out both;
  -webkit-animation: sharpen 1.2s ease-out both;
}

@keyframes sharpen {
  0% {
    filter: blur(15px);
  }

  80% {
    filter: blur(0px);
  }

  100% {
    filter: blur(0px);
  }
}
          </code>
          <span class="line-numbers-rows">
            <span v-for="item of line_number" :key="item"></span>
          </span>
        </pre>
      </section>
      <div class="content" ref="content"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import headerBox from '~/components/header.vue'
import footerBox from '~/components/footer.vue'
import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/a11y-dark.css'
hljs.registerLanguage('javascript', javascript)

let imgs = [
    '风景:2018:07-29:杭州市-余杭区，梦想小镇夜景1.jpg',
    '风景:2018:06-22:杭州市-千岛湖，公司团建之千岛湖夜景1.jpg',
    '风景:2018:01-27:杭州市-西湖区，植物园外围31.jpg',
    '风景:2018:07-29:杭州市-余杭区，梦想小镇夜景2.jpg',
    '点滴:2018:09-09:杭州市-西湖区，去舅舅家吃饭帮表妹完成下家庭作业.jpg',
    '点滴:2018:12-09:杭州市-余杭区，和娜娜一起堆的雪人嘻嘻是不是很像.jpg',
    '风景:2018:01-27:杭州市-西湖区，中山公园7.jpg'
  ],
  img_styles = [], // 图片样式参数
  img_width = 0, // 图片的宽度
  row_number = 0, // 图片行数
  row_tops = [], // 记录最好一行图片的位置
  load_type = 'init', // 加载类型 默认：init - 初始化  scroll - 滚动加载  resize - 视图变化
  beforeScrollTop = 0, // 记录滚动条变化前的数值 用于区分上下滚动
  timer

export default {
  head: {
    title: '瀑布流-实验室'
  },
  components: {
    headerBox,
    footerBox
  },
  data() {
    return {
      code0: '',
      code1: '',
      code2: '',
      line_number: 0,
      embed_nav: { list: ['js', 'html', 'css'], index: 0 },
      headerData: {
        searchStatus: false,
        isStatic: true,
        type: 'laboratory'
      }
    }
  },
  computed: {
    ...mapState(['IMGHOST', 'QN_POSTFIX'])
  },
  mounted() {
    this.imgRrgodic(imgs)
    window.addEventListener('scroll', this.scrollChange, false)
    window.addEventListener('resize', this.windowResize, false)
    beforeScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    this.setLineNumber()
    document.querySelectorAll('pre code').forEach(block => {
      hljs.highlightBlock(block)
    })
  },
  beforeDestroy() {
    row_tops = []
    img_styles = []
    window.removeEventListener('scroll', this.scrollChange, false)
    window.removeEventListener('scroll', this.windowResize, false)
  },
  methods: {
    /**
     * 浏览器窗口变化
     */
    windowResize() {
      clearTimeout(timer)

      timer = setTimeout(() => {
        let offsetWidth = this.$refs.content.offsetWidth

        load_type = 'resize'
        row_tops = []
        row_number = offsetWidth >= 1200 ? 4 : offsetWidth > 750 ? 3 : 2 // 基于不同宽度设置不同行数
        img_width = offsetWidth / row_number

        this.setImgPosition()
      }, 50)
    },
    /**
     * 设置代码行数
     * @param {Number} index - 代码块下标
     */
    setLineNumber(index = 0) {
      this.embed_nav.index = index

      this.$nextTick(() => {
        this.line_number = Math.ceil(
          (this.$refs[`code${index}`].offsetHeight - 40) / 20
        )
      })
    },
    /**
     * 图片加载遍历
     * @param {Array} img_list - 图片列表
     */
    imgRrgodic(img_list) {
      let offsetWidth = this.$refs.content.offsetWidth, // 容器的宽度
        img_dom_length = img_styles.length

      row_number = offsetWidth >= 1200 ? 4 : offsetWidth < 750 ? 2 : 3 // 基于不同宽度设置不同行数
      img_width = offsetWidth / row_number

      img_list.forEach((src, index) => {
        src = this.IMGHOST + src + this.QN_POSTFIX

        // 图片加载成功、失败处理
        new Promise((resolve, reject) => {
          this.imgLoad(src + 100, e => {
            if (e.type === 'load') {
              let ratio = e.path[0].height / e.path[0].width

              resolve({ type: e.type, ratio: ratio })
            } else {
              resolve({ type: e.type })
            }
          })
        }).then(res => {
          index = index + img_dom_length

          img_styles[index] = {
            src: src,
            type: res.type,
            ratio: res.ratio
          }

          this.setImgPosition(index)
        })
      })
    },
    /**
     * 设置图片位置
     * @param {Number} index - 图片下标
     */
    setImgPosition(index = 0) {
      let number =
        load_type === 'resize'
          ? 0
          : this.$refs.content.getElementsByClassName('box').length

      // 加载图片下标大于当前设置图片的下标时不执行
      if (index > number) {
        return
      } else {
        for (let i = number; img_styles.length > i; i++) {
          let item = img_styles[i]

          if (item) {
            item.height = item.ratio ? img_width * item.ratio : 80 // 计算图片高度
            let left = 0,
              top = 0

            // 第一行图片不需要计算最小值
            if (row_tops.length < row_number) {
              left = i * img_width
              top = 0
              row_tops[i] = item.height
            } else {
              // 得到最小值
              let min = Math.min(...row_tops)

              // 通过最小值得到对应下标 设置 top、left值
              for (let j = 0; row_tops.length > j; j++) {
                if (min === row_tops[j]) {
                  top = min + 10
                  left = j * img_width
                  row_tops[j] = top + item.height // 重新设置高度
                  break
                }
              }
            }

            // 重新设置图片位置
            if (load_type === 'resize') {
              let div = this.$refs.content.getElementsByClassName('box')[i]

              div.style.cssText = `width: ${img_width}px; top: ${top}px; left: ${left}px;`
              if (item.ratio) {
                div.getElementsByTagName('img')[0].style.height =
                  item.height + 'px'
              }

              number = i
            } else {
              // 创建dom节点、设置属性
              let div = document.createElement('div')
              div.className = 'box'
              div.style = `width: ${img_width}px;top: ${top}px; left: ${left}px;`
              div.innerHTML =
                item.type === 'load'
                  ? `<p><img class="progressive not-loaded" style="height: ${
                      item.height
                    }px;" data-src="${item.src + 1024}" src="${item.src +
                      100}" alr=""/></p>`
                  : '<i class="iconfont icon-load-error"></i>'
              this.$refs.content.appendChild(div)
            }

            this.forEach_envent()
          } else {
            break
          }
        }
      }
    },
    /**
     * 图片加载
     * @param {String} src - 图片地址
     * @param {Function} callback - 回调函数
     */
    imgLoad(src, callback) {
      let img = new Image()
      img.src = src

      // 加载成功
      img.onload = function(e) {
        callback(e)
      }
      // 加载失败
      img.onerror = function(e) {
        callback(e)
      }
    },
    /**
     * 遍历图片元素
     */
    forEach_envent() {
      let object = document.querySelectorAll('[data-src]'),
        scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
        seeHeight = document.documentElement.clientHeight // 可见区域高度

      // 遍历需要懒加载的对象
      for (let i = 0; object.length > i; i++) {
        let item = object[i],
          cur_offsetTop =
            item.offsetTop ||
            item.offsetParent.offsetTop + this.$refs.content.offsetTop ||
            this.$refs.content.offsetParent.offsetTop,
          clientHeight = item.clientHeight || 0

        if (cur_offsetTop < scrollTop + seeHeight - 50) {
          let image_url = item.getAttribute('data-src')

          item.removeAttribute('data-src')
          this.imgLoad(image_url, e => {
            if (e.type === 'error') {
              item.getElementsByTagName('i')[0].style.opacity = '1'
            } else if (e.type === 'load') {
              item.src = image_url
            }

            item.className = 'u_transition_300 progressive is-loaded'
          })
        }
      }
    },
    /**
     * 滚动条变化
     */
    scrollChange() {
      let afterScrollTop =
          document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
        scrollHeight = document.documentElement.scrollHeight, // 内容高度
        seeHeight = document.documentElement.clientHeight // 可见区域高度

      this.forEach_envent()

      if (
        beforeScrollTop < afterScrollTop &&
        afterScrollTop >= scrollHeight - seeHeight - 100
      ) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          load_type = 'scroll'
          this.imgRrgodic(imgs)
        }, 50)
      }

      beforeScrollTop = afterScrollTop
    }
  }
}
</script>
<style lang='scss'>
#fallsFlow {
  .main {
    padding-top: 100px !important;
    margin: 0 auto;
  }
  .code-editor {
    margin: 0 auto;
  }
  .content {
    position: relative;
    margin: 10px -5px;
    .box {
      position: absolute;
      display: inline-block;
      padding: 0 5px;
      transition: 0.3s all ease-in-out;
      p {
        overflow: hidden;
      }
      img {
        width: 100%;
      }
      .icon-load-error {
        display: block;
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: #fff;
        font-size: 36px;
        background: #ccc;
      }
    }
  }
}

@media (max-width: 767px) {
  #fallsFlow .main {
    padding-top: 70px !important;
  }
}
</style>
