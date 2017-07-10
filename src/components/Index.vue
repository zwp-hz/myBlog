<template>
    <div id="index">
        <!-- header -->
        <blogHeader v-on:searchCnt="searchList" :headerStatus="headerStatus"></blogHeader>
        <!-- indexBg -->
        <div id="indexBg" ref="indexBg" v-if="getBingImg.showStatus"></div>
        <!-- main -->
        <div id="main">
            <div class="container">
                <ul class="categories g-r-center">
                    <li @click="categoriesName = '全部'"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === '全部'}" :to="{path: '/'}">全部</router-link></li>
                    <li @click="categoriesName = item.name" v-for="item in categories"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === item.name}" :to="{path: '/', query: {categories: encodeURIComponent(item.name)}}">{{item.name}}</router-link></li>
                </ul>
                <div class="content">
                    <leftBox v-on:searchCnt="searchList" :categoriesName="categoriesName" :resizeTime="resizeTime"></leftBox>
                    <rightBox v-on:searchCnt="searchList" v-on:articleInfo="articleDetail" :rightBoxStatus="rightBoxStatus" :scrollTop="scrollTop"></rightBox>
                </div>
            </div>
        </div>
        <!-- tags -->
        <blogFooter v-on:searchCnt="searchList" v-on:articleInfo="articleDetail"></blogFooter>
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

        document.getElementsByTagName('body')[0].scrollTop = 0;

        //获取分类列表
        this.$http.jsonp(apiHost + 'api/getCategoryList').then((res) => {
            if (res.body.code == 0) {
                that.categories = res.body.data;
            }
        });

        window.onresize = (e) => {
            resizeEvent
        }

        window.onscroll = window.onload = window.onresize = (e) => {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                clientHeight = document.documentElement.clientHeight,   //内容可视区域的高度
                clientWidth = document.documentElement.clientWidth,    //内容可视区域的宽度
                scrollHeight = document.documentElement.scrollHeight;   //滚动条高度

            if (e.type == "load" || e.type == "resize")
                that.resizeTime = e.timeStamp;

            //屏幕小于768像素  不显示背景图片
            if (clientWidth > 768) {
                that.getBingImg.showStatus = true;
                if (!that.getBingImg.getStatus) {
                    //获取必应图片
                    that.$http.jsonp(apiHost + 'api/bing').then((res) => {
                        if (res.body.code === 0) {
                            that.getBingImg.getStatus = true;

                            let $img = new Image(),
                                ulr = res.body.data[0] +'?imageView2/1/q/90/interlace/1/w/'+ document.documentElement.clientWidth;
                                
                                that.$refs.indexBg.style.backgroundImage = 'url("'+ ulr +'")';
                        }
                    },(res) => console.log(res));
                }

                if (that.$refs.indexBg) {
                    that.scrollTop = scrollTop;

                    if(scrollHeight - scrollTop - clientHeight > 560 || clientHeight === scrollHeight) {
                         that.$refs.indexBg.style.top = scrollTop + "px";
                         that.rightBoxStatus = false;
                    } else {
                         that.$refs.indexBg.style.top = scrollHeight - clientHeight - 560 + "px";
                         that.rightBoxStatus = true;
                    }
                    that.headerStatus = scrollTop > 0 ? true : false;
                }
            } else {
                that.getBingImg.showStatus = false;
                that.headerStatus = true;
            }
        }        
    },
    data() {
        return {
            headerStatus: false,
            rightBoxStatus: false,
            getBingImg: {
                getStatus: false,
                showStatus: false
            },
            resizeTime: null,                                       //窗口改动时间
            scrollTop: null,
            categories: [],
            categoriesName: (typeof this.$route.query.categories === "undefined" ? "全部" : decodeURIComponent(this.$route.query.categories))
        }
    },
    methods: {
        searchList(text) {
            let data = {};

            data[text.type] = text.text;
            this.$router.push( {path: '/searchResult', query: data} );
        },
        articleDetail(text) {
            this.$router.push( {path: '/articleDetail', query: {articleId: text._id, title: text.title}} );
        },
        resizeEvent() {
            let that = this,
                clientWidth = document.documentElement.clientWidth;    //内容可视区域的宽度
            
            
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