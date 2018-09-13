"use strict";
import Vue from 'vue';
import Router from 'vue-router';

const index = r => require.ensure([], () => r(require('../page/index.vue')), 'index');
const blog = r => require.ensure([], () => r(require('../page/blog/blog.vue')), 'blog');
const searchResult = r => require.ensure([], () => r(require('../page/blog/searchResult.vue')), 'searchResult');
const articleDetail = r => require.ensure([], () => r(require('../page/blog/articleDetail.vue')), 'articleDetail');
const author = r => require.ensure([], () => r(require('../page/author.vue')), 'author');
const photoWall = r => require.ensure([], () => r(require('../page/photoWall.vue')), 'photoWall');
const photoList = r => require.ensure([], () => r(require('../page/photoList.vue')), 'photoList');
const error = r => require.ensure([], () => r(require('../page/404.vue')), 'error');

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        { path: "/", component: index, name: "index", meta: { title: "朱为鹏的网站" } },
        { path: "/blog", component: blog, name: "blog", meta: { title: "朱为鹏的博客" } },
        { path: "/searchResult", component: searchResult, name: "blog_searchResult", meta: { title: "搜索结果" } },
        { path: "/articleDetail", component: articleDetail, name: "blog_articleDetail", meta: { title: "文章详情" } },
        { path: "/photoWall", component: photoWall, name: "photoWall", meta: { title: "照片墙" } },
        { path: "/photoList", component: photoList, name: "photoWall_list", meta: { title: "照片列表" } },
        { path: "/author", component: author, name: "author", meta: { title: "个人信息" } },
        { path: "*", component: error, name: "404", meta: { title: "404" } }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
});