"use strict";
import Vue 				from 'vue'
import App 				from './App.vue'
import VueResource 		from 'vue-resource'

import store        	from './store/store'
import router       	from './router/router'
import * as filters 	from './filter/filter'

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

// 过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// 标题设置
Vue.directive('title', {
    inserted: function (el, binding) {
        document.title = binding.value
    }
});

router.afterEach(to =>{document.title = to.meta.title})

const app = new Vue({
	store,
	router,
  	render: h => h(App)
});

document.addEventListener('DOMContentLoaded', function () {
  app.$mount('#app')
})