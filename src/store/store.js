import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	APIHOST: window.location.href.indexOf("www") != -1 ? "http://106.14.157.57:8989/" : "http://localhost:8989/",
  	IMGHOST: "http://omdiu1qhf.bkt.clouddn.com/"
}

const actions = {
    increment (store,type) {
      	console.log(type)
    }
 }

export default new Vuex.Store({
  state,
  actions
})