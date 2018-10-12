'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex);

const isWebp = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;

const state = {
    APIHOST: process.env.NODE_ENV === 'production' ? 'http://api.zhuweipeng.me/' : 'http://localhost:8989/',
    IMGHOST: 'http://omdiu1qhf.bkt.clouddn.com/', // 七牛图片host
    isSupportWebp: isWebp,
    qnConfig: '?imageView2/2/interlace/1' + (isWebp ? '/format/webp' : '') + '/w/',
    isMoblie: /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent),
    searchCnt: {}, // 搜索内容
    first_load: true, // 是否第一次加载
    articleList_hot: '', // 热门文章列表
    tags: '' // 文章标签
}

export default new Vuex.Store({
    state,
    mutations
})