import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	APIHOST: process.env.NODE_ENV === "production" ? "http://api.zhuweipeng.me/" : "http://localhost:8989/",
  	IMGHOST: "http://image.zhuweipeng.me/",		// 七牛图片host
  	searchCnt: {},								// 搜索内容
  	first_load: true,							// 是否第一次加载
  	articleList_hot: '',						// 热门文章列表
  	tags: ''									// 文章标签
}

const mutations = {
	searchChange(state,data) {
		state.searchCnt = data;
	},
	loadChange(state) {
		state.first_load = false;
	},
	setFooterData(state,data) {
		state[data.type] = data.data;
	}
}

export default new Vuex.Store({
  	state,
  	mutations
})