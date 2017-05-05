<template>
  	<div id="header" :class="{ fixed: headerStatus }">
  		<div class="container g-r-center">
  			<a v-if="!headerStatus" class="logo" href="javaScritp:void(0);"><img src="../../images/logo_white.png" /></a>
            <a v-else class="logo" href="javaScritp:void(0);"><img src="../../images/logo_black.png" /></a>
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
                <input @keyup.enter="searchStart" v-model="searchCnt" type="search" placeholder="搜点什么呢" />
                <a @click="searchStart" href="javaScritp:void(0);" class="glyphicon glyphicon-search searchBtn"></a>
                <a @click="search_status = !search_status" href="javaScritp:void(0);" class="glyphicon removeBtn">×</a>
            </div>
        </div>
  	</div>
</template>

<script>
"use strict";
export default {
    props: ["headerStatus"],
    data () {
        return {
        	search_status: false,
        	searchCnt: ""
        }
    },
    methods: {
        searchStart() {
            console.log(this.searchCnt)
        }
    },
    watch: {
    	searchCnt(val) {
    		
    	}
    }
}
</script>

<style lang="scss" scoped>
	@import "../../style/header";
</style>