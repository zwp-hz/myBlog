<template>
    <div id="index" :style="!loadingStatus ? 'margin-bottom: 0;' : ''">
        <!-- loading -->
        <div class="loading g-r-center" v-if="!loadingStatus">
            <div class="item-loader-container">
                <div class="la-square-jelly-box la-2x">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <blogHeader v-on:searchCnt="searchList" :headerStatus="headerStatus"></blogHeader>
        <div id="indexBg" ref="indexBg"></div>
        <div id="main" :style="!loadingStatus ? 'height: 100vh; overflow-y: hidden;' : ''">
            <div class="container">
                <ul class="categories g-r-center">
                    <li @click="categoriesName = '全部'"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === '全部'}" :to="{path: '/'}">全部</router-link></li>
                    <li @click="categoriesName = item.name" v-for="item in categories"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === item.name}" :to="{path: '/', query: {categories: encodeURIComponent(item.name)}}">{{item.name}}</router-link></li>
                </ul>
                <div class="content">
                    <leftBox :searchData="searchData" :categoriesName="categoriesName"></leftBox>
                    <rightBox v-on:searchCnt="searchList" :rightBoxStatus="rightBoxStatus" :scrollTop="scrollTop"></rightBox>
                </div>
            </div>
        </div>
        <blogFooter :tags="tags"></blogFooter>
    </div>
</template>

<script>
"use strict";
import blogHeader   from './layout/header.vue'
import blogFooter   from './layout/footer.vue'
import leftBox      from './layout/leftBox.vue'
import rightBox     from './layout/rightBox.vue'

export default {
    mounted() {
        let that = this,
            apiHost = this.$store.state.APIHOST;

        //获取必应图片
        that.$http.jsonp(apiHost + 'api/bing').then((res) => {
            if (res.body.code === 0) {
                let $img = new Image(),
                    ulr = res.body.data[0] +'?imageView2/1/q/90/interlace/1/w/'+ document.documentElement.clientWidth;
                    
                    that.$refs.indexBg.style.backgroundImage = 'url("'+ ulr +'")';
                    that.loadingStatus = true;
            }
        },(res) => console.log(res));

        //获取分类列表
        that.$http.jsonp(apiHost + 'api/getCategoryList').then((res) => {
            if (res.body.code == 0) {
                this.categories = res.body.data;
            }
        });

        window.onscroll = window.onload = () => {

            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                clientHeight = document.documentElement.clientHeight,   //内容可视区域的高度
                scrollHeight = document.documentElement.scrollHeight;   //滚动条高度

            this.scrollTop = scrollTop;

            if(scrollHeight - scrollTop - clientHeight > 560 || clientHeight === scrollHeight) {
                 that.$refs.indexBg.style.top = scrollTop + "px";
                 this.rightBoxStatus = false;
            } else {
                 that.$refs.indexBg.style.top = scrollHeight - clientHeight - 560 + "px";
                 this.rightBoxStatus = true;
            }

            that.headerStatus = scrollTop > 0 ? true : false;
        }
    },
    data() {
        return {
            searchData: {},
            loadingStatus: false,
            msg: '',
            tags: [],
            headerStatus: false,
            rightBoxStatus: false,
            scrollTop: null,
            article: [],
            categories: [],
            categoriesName: (typeof this.$route.query.categories === "undefined" ? "全部" : decodeURIComponent(this.$route.query.categories))
        }
    },
    methods: {
        searchList(text) {
            let data = {page: 1};
            if (this.$route.query.categories)
                data.categories = decodeURIComponent(this.$route.query.categories)
            if (text)
                data.searchCnt = encodeURIComponent(text)

            this.$router.push( {path: '/', query: data} );

            this.searchData = {
                date: Date.parse(new Date()),
                content: text
            };
        }
    },
    components: {
        blogHeader,
        blogFooter,
        leftBox,
        rightBox
    }
}
</script>

<style lang="scss" scoped>
    @import "../style/index";
</style>