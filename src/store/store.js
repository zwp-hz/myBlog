import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	APIHOST: "http://localhost:8989/",
  	IMGHOST: "http://omdiu1qhf.bkt.clouddn.com/"
}

const actions = {
    increment (store,type) {
    	store.zwp = 3;
      	console.log(type)
    }
 }

export default new Vuex.Store({
  state,
  actions
})