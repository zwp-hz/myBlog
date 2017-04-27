"use strict";
import Vue      from 'vue';
import Router   from 'vue-router';

const index = r => require.ensure([], () => r(require('../components/index.vue')), 'index');

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    { path: "/", component: index, name: "index", meta: {title: "首页"}},
    { path: "/index", component: index, name: "index2", meta: {title: "首页"}}
  ]
})