<template>
  	<div id="header" :class="{ fixed: headerStatus, search_detail: elseClass}">
  		<div class="container headerBox g-r-center">
  			<router-link v-if="!headerStatus && !elseClass" :to="{path: '/'}" class="logo" href="javaScritp:void(0);"><img ondragstart="return false;" src="../../images/logo_white.png" /></router-link>
            <router-link v-else class="logo" :to="{path: '/'}" href="javaScritp:void(0);"><img ondragstart="return false;" src="../../images/logo_black.png" /></router-link>
            <div class="menu">
                <span @click="toggleMenu=!toggleMenu" class="c-hamburger c-hamburger--htx" :class="{is_active: toggleMenu}">
                    <span>menu</span>
                </span>
                <nav class="col-sm-menu g-r-center clearfix">
                    <a href="javaScritp:void(0);" @click="search_status = !search_status">
                        <i class="fr iconfont icon-search"></i>
                    </a>
                    <ul class="menuList fr">
                        <li><router-link :to="{path: '/'}">首頁</router-link></li>
                        <li><a href="javaScritp:void(0);">生活</a></li>
                        <li><router-link :to="{path: 'author'}">个人信息</router-link></li>
                    </ul>
                </nav>
            </div>
  		</div>
        <nav class="col-xs-menu g-r-center u_transition" :class="{is_active: toggleMenu}">
            <ul class="menuList container clearfix">
                <li><router-link :to="{path: '/'}">首頁</router-link></li>
                <li><a href="javaScritp:void(0);">生活</a></li>
                <li><router-link :to="{path: 'author'}">个人信息</router-link></li>
            </ul>
            <div class="container searchBox g-r-center">
                <input @keyup.enter="search" ref="search" v-model="searchCnt" type="search" placeholder="搜点什么吧" />
                <i @click="search"></i>
            </div>
        </nav>
        <div class="header-search g-r-center" :class="{ search_show: search_status, fixed: headerStatus }">
            <div class="container g-r-center">
                <input @keyup.enter="search" ref="search" v-model="searchCnt" type="search" placeholder="搜点什么吧" />
                <a href="javaScritp:void(0);" @click="search">
                    <i class="iconfont icon-search"></i>
                </a>
                <a @click="search_status = !search_status" href="javaScritp:void(0);">
                    <i class="iconfont icon-quxiao"></i>
                </a>
            </div>
        </div>
  	</div>
</template>

<script>
"use strict";
export default {
    props: ["headerStatus","elseClass"],
    data () {
        return {
            toggleMenu: false,
        	search_status: false,
        	searchCnt: ""
        }
    },
    methods: {
        search() {
            this.$emit('searchCnt', {type: "_s", text: this.searchCnt});
        }
    },
    watch: {
        search_status(val) {
            if (val)
                this.$refs.search.focus();
        }
    }
}
</script>

<style lang="scss" scoped>
	@import "../../style/header";
</style>