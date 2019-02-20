import Vuex from 'vuex'
import mutations from './mutations'

/**
 * @var {Object}
 * @desc store 定义
 * @property {Object} device - 设备属性
 * @property {String} device.isMobile - true: pc  false：h5
 * @property {String} device.browser - wechat: 微信浏览器  qq: qq浏览器
 * @property {String} device.system - ios: 苹果系统  android: 安卓系统
 * @property {String} default_img - 认图片
 * @property {String} QN_POSTFIX - 去牛云图片后缀
 * @property {String} IMGHOST - 七牛云host
 * @property {Object} search - 搜索内容
 * @property {String} first_load - 是否第一次加载
 * @property {Array} article_hots - 热门文章列表
 * @property {Array} tags - 文章标签
 */
let state = {
  device: {
    isMobile: false,
    browser: '',
    system: ''
  },
  default_avator:
    'http://flashfish.oss-cn-hangzhou.aliyuncs.com/CDN/Images/avator/mrtx.png',
  QN_POSTFIX: '?imageView2/2/interlace/1/format/jpg/w/',
  IMGHOST: 'http://image.zhuweipeng.top/',
  search: {},
  first_load: true,
  article_hots: [],
  tags: []
}

const createStore = () => {
  return new Vuex.Store({
    state: state,
    mutations
  })
}

export default createStore
