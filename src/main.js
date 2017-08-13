"use strict";
import Vue 				from 'vue'
import App 				from './App.vue'
import VueResource 		from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload 		from 'vue-lazyload'

import store        	from './store/store'
import router       	from './router/router'
import * as filters 	from './filter/filter'

Vue.use(VueResource);
Vue.use(VueAwesomeSwiper);
Vue.http.options.emulateJSON = true;

Vue.use(VueLazyload, {
  error: 'dist/assets/image_error.png',
  loading: 'dist/assets/image_default.png',
  filter:{
    webp ({ src }) {
          return src
      },
  },
  try: 3
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})

router.afterEach(to =>{document.title = to.meta.title})

const app = new Vue({
	store,
	router,
  	render: h => h(App)
}).$mount('#app');