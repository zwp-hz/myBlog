<template>
    <div id="index">
        <!-- header -->
        <blogHeader v-on:searchCnt="searchList" :headerStatus="headerStatus"></blogHeader>
        <!-- indexBg -->
        <div id="indexBg" ref="indexBg"></div>
        <!-- main -->
        <div id="main">
            <div class="container">
                <ul class="categories g-r-center">
                    <li @click="categoriesName = '全部'"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === '全部'}" :to="{path: '/'}">全部</router-link></li>
                    <li @click="categoriesName = item.name" v-for="item in categories"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === item.name}" :to="{path: '/', query: {categories: encodeURIComponent(item.name)}}">{{item.name}}</router-link></li>
                </ul>
                <div class="content">
                    <leftBox v-on:searchCnt="searchList" :categoriesName="categoriesName"></leftBox>
                    <rightBox v-on:searchCnt="searchList" :rightBoxStatus="rightBoxStatus" :scrollTop="scrollTop"></rightBox>
                </div>
            </div>
        </div>
        <!-- tags -->
        <blogFooter v-on:searchCnt="searchList"></blogFooter>
    </div>
</template>

<script>
"use strict";
import { mapActions }   from 'vuex'
import blogHeader   from './layout/header.vue'
import blogFooter   from './layout/footer.vue'
import leftBox      from './layout/leftBox.vue'
import rightBox     from './layout/rightBox.vue'

export default {
    mounted() {
        let that = this,
            apiHost = this.$store.state.APIHOST;

        document.getElementsByTagName('body')[0].scrollTop = 0;

        //获取必应图片
        this.$http.jsonp(apiHost + 'api/bing').then((res) => {
            if (res.body.code === 0) {
                let $img = new Image(),
                    ulr = res.body.data[0] +'?imageView2/1/q/90/interlace/1/w/'+ document.documentElement.clientWidth;
                    
                    that.$refs.indexBg.style.backgroundImage = 'url("'+ ulr +'")';
            }
        },(res) => console.log(res));

        //获取分类列表
        this.$http.jsonp(apiHost + 'api/getCategoryList').then((res) => {
            if (res.body.code == 0) {
                that.categories = res.body.data;
            }
        });

        window.onscroll = window.onload = () => {

            if (that.$refs.indexBg) {
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
        }

        // this.$store.dispatch("increment",1)
        
    },
    data() {
        return {
            headerStatus: false,
            rightBoxStatus: false,
            scrollTop: null,
            categories: [],
            categoriesName: (typeof this.$route.query.categories === "undefined" ? "全部" : decodeURIComponent(this.$route.query.categories))
        }
    },
    methods: {
        searchList(text) {
            var data = {};

            data[text.type] = text.text;
            this.$router.push( {path: '/searchResult', query: data} );
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