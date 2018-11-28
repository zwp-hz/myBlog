import Vue from 'vue'
// 标题设置
Vue.directive('title', {
  inserted: function(el, binding) {
    document.title = binding.value
  }
})
