import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	APIHOST: window.location.href.indexOf("www") != -1 ? "http://106.14.157.57:8989/" : "http://localhost:8989/",
  	IMGHOST: "http://omdiu1qhf.bkt.clouddn.com/"
}

const actions = {
	//设置评论数
	setCommentNum(store) {
		if(document.getElementById("cy_cmt_num")) {
	        let listCount = document.getElementById("cy_cmt_num"),
	            count = listCount.nextSibling;

	        listCount.parentNode.removeChild(listCount);
	        count.parentNode.removeChild(count);
	    }
	    
	    let head = document.getElementsByTagName('head')[0];
	    let script = document.createElement('script');

	    script.id = "cy_cmt_num";
	    script.src = 'http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cyt8K1Rab';
	    head.appendChild(script);
	}
}

export default new Vuex.Store({
  state,
  actions
})