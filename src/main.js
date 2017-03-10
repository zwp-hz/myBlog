"use strict";
import Vue from 'vue'
import App from './App.vue'
import VueResource 	from 'vue-resource'

import store        from './store/store'
import router       from './router/router'

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

router.afterEach(to =>{document.title = to.meta.title})

const app = new Vue({
	store,
	router,
  	render: h => h(App)
}).$mount('#app');
