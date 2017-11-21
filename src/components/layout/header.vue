<template>
  	<div id="header" :class="elseClass" data-top="background-color: rgba(255,255,255,0);height: 99px;" data--20p-top="background-color: rgba(255,255,255,0);height: 99px;" data--45p-top="background-color: rgba(255,255,255,1);height: 70px;">
  		<div class="container headerBox g-r-center" data-top="color: rgba(255,255,255,1);" data--20p-top="color: rgba(255,255,255,1);" data--45p-top="color: rgba(141,141,141,1);">
  			<div class="home"><router-link  :to="{path: '/'}"><i class="iconfont icon-home"></i></router-link></div>
            <div class="menu">
                <span @click="toggleMenu=!toggleMenu" class="c-hamburger c-hamburger--htx" :class="{is_active: toggleMenu}">
                    <span>menu</span>
                </span>
                <nav class="col-sm-menu g-r-center clearfix">
                    <div class="fr searchBox" data-top="background-color: rgba(255,255,255,1);color: rgba(141,141,141,1);" data--20p-top="background-color: rgba(255,255,255,1);color: rgba(141,141,141,1);" data--45p-top="background-color: rgba(141,141,141,1);color: rgba(255,255,255,1);">
                        <input @keyup.enter="search" ref="search" v-model="searchCnt" class="fl u_transition" type="text" name="search" placeholder="search" />
                        <a href="javaScritp:void(0);" class="fl g-c-center">
                            <i class="fr iconfont icon-search"></i>
                        </a>
                    </div>
                    <ul class="menuList fr">
                        <li><router-link :to="{path: '/'}">首頁</router-link></li>
                        <li><router-link :to="{path: '/lived'}">生活</router-link></li>
                        <li><router-link :to="{path: '/author'}">个人信息</router-link></li>
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
  	</div>
</template>

<script>
"use strict";
export default {
    props: ["elseClass"],
    mounted() {
        skrollr.init({
            forceHeight: false
        });
    },
    data () {
        return {
            toggleMenu: false,
        	searchCnt: ""
        }
    },
    methods: {
        search() {
            this.$emit('searchCnt', {type: "_s", text: this.searchCnt});
        }
    },
    watch: {
    }
}
</script>

<style lang="scss" scoped>
	@import "../../style/header";
</style>