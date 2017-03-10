<template>
  	<div class="header" :class="{ fixed: fixed_status }">
  		<div class="container g-r-center">
  			<a v-if="!fixed_status" class="logo" href="javaScritp:void(0);"><img src="../../images/logo_white.png" /></a>
            <a v-else class="logo" href="javaScritp:void(0);"><img src="../../images/logo_black.png" /></a>
  			<nav class="g-r-center">
  				<ul class="menuList clearfix">
		  			<li><a href="javaScritp:void(0);">首頁</a></li>
		  			<li><a href="javaScritp:void(0);">生活</a></li>
		  			<li><a href="javaScritp:void(0);">个人信息</a></li>
		  			<li><a href="javaScritp:void(0);">联系</a></li>
		  		</ul>
		  		<a @click="search_status = !search_status" href="javaScritp:void(0);" class="glyphicon glyphicon-search searchBtn"></a>
  			</nav>
  		</div>
        <div class="header-search" :class="{ search_show: search_status, fixed: fixed_status }">
            <div class="container g-r-center">
                <input @keyup.enter="searchStart" v-model="searchCnt" type="search" placeholder="搜点什么吧..." />
                <a @click="searchStart" href="javaScritp:void(0);" class="glyphicon glyphicon-search searchBtn"></a>
                <a @click="search_status = !search_status" href="javaScritp:void(0);" class="glyphicon removeBtn">×<a>
            </div>
        </div>
  	</div>
</template>

<script>
"use strict";
export default {
    data () {
        return {
        	search_status: false,
            fixed_status: false,
        	searchCnt: ""
        }
    },
    created(){
        let that = this;

        window.onscroll = window.onload = () => {
            let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;

            that.fixed_status = scrollTop > 0 ? true : false;
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