"use strict";
import Vue 				from 'vue'
import App 				from './App.vue'
import VueResource 		from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import store        	from './store/store'
import router       	from './router/router'
import * as filters 	from './filter/filter'

Vue.use(VueResource);
Vue.use(VueAwesomeSwiper);
Vue.http.options.emulateJSON = true;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

router.afterEach(to =>{document.title = to.meta.title})

const app = new Vue({
	store,
	router,
  	render: h => h(App)
}).$mount('#app');