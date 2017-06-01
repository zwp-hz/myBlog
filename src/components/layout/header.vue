<template>
  	<div id="header" :class="{ fixed: headerStatus, search_detail: elseClass}">
  		<div class="container g-r-center">
  			<router-link v-if="!headerStatus && !elseClass" :to="{path: '/'}" class="logo" href="javaScritp:void(0);"><img ondragstart="return false;" src="../../images/logo_white.png" /></router-link>
        <router-link v-else class="logo" :to="{path: '/'}" href="javaScritp:void(0);"><img ondragstart="return false;" src="../../images/logo_black.png" /></router-link>
  			<nav class="g-r-center">
  				<ul class="menuList clearfix">
		  			<li><router-link :to="{path: '/'}">首頁</router-link></li>
		  			<li><a href="javaScritp:void(0);">生活</a></li>
		  			<li><router-link :to="{path: 'author'}">个人信息</router-link></li>
		  		</ul>
		  		<a @click="search_status = !search_status" href="javaScritp:void(0);" class="glyphicon glyphicon-search searchBtn"></a>
  			</nav>
  		</div>
        <div class="header-search" :class="{ search_show: search_status, fixed: headerStatus }">
            <div class="container g-r-center">
                <input @keyup.enter="search" ref="search" v-model="searchCnt" type="search" placeholder="搜点什么吧" />
                <a @click="search" href="javaScritp:void(0);" class="glyphicon glyphicon-search searchBtn"></a>
                <a @click="search_status = !search_status" href="javaScritp:void(0);" class="glyphicon removeBtn">×</a>
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