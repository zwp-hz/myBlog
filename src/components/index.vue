<template>
    <div id="index">
        <!-- header -->
        <blogHeader v-on:searchCnt="searchList" :headerStatus="headerStatus"></blogHeader>
        <!-- loading -->
        <loadIng v-if="!loading"></loadIng>
        <!-- indexBg -->
        <div id="indexBg" ref="indexBg" v-if="getBingImg.showStatus" :style="'backgroundImage: url('+getBingImg.biyingImg+');'"></div>
        <!-- main -->
        <div id="main">
            <div class="container">
                <ul class="categories g-r-center">
                    <li @click="categoriesName = '全部'"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === '全部'}" :to="{path: '/'}">全部</router-link></li>
                    <li @click="categoriesName = item.name" v-for="item in categories"><router-link class="u_transition u_hover_blue_bg" :class="{cur: categoriesName === item.name}" :to="{path: '/', query: {categories: encodeURIComponent(item.name)}}">{{item.name}}</router-link></li>
                </ul>
                <div class="content">
                    <leftBox v-on:searchCnt="searchList" v-on:imgLoadStatus="loadingStatus" :categoriesName="categoriesName" :resizeTime="resizeTime"></leftBox>
                    <rightBox v-on:searchCnt="searchList" v-on:articleInfo="articleDetail"></rightBox>
                </div>
            </div>
        </div>
        <!-- tags -->
        <blogFooter v-on:searchCnt="searchList" v-on:articleInfo="articleDetail"></blogFooter>
    </div>
</template>

<script>
    "use strict";
    import loadIng      from './layout/loadIng.vue'
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

        this.init();

        window.onscroll = window.onresize = (e) => {
            if (e.type == "resize")
                that.resizeTime = e.timeStamp;

            that.init();
        } 
    },
    data() {
        return {
            loading: false,                                                             //加载状态
            headerStatus: false,                                                        //头部状态
            getBingImg: {                                                               //必应壁纸
                biyingImg: sessionStorage.biyingImg ? sessionStorage.biyingImg : '',    //url
                showStatus: false                                                       //显示状态
            },
            resizeTime: null,                                                           //窗口改动时间
            categories: [],                                                             //类别
            categoriesName: (typeof this.$route.query.categories === "undefined" ? "全部" : decodeURIComponent(this.$route.query.categories))
        }
    },
    methods: {
        //init
        init() {
            let apiHost = this.$store.state.APIHOST,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                clientHeight = document.documentElement.clientHeight,   //内容可视区域的高度
                clientWidth = document.documentElement.clientWidth,    //内容可视区域的宽度
                scrollHeight = document.documentElement.scrollHeight;   //滚动条高度

            //屏幕小于768像素  不显示背景图片
            if (clientWidth > 768) {
                this.getBingImg.showStatus = true;
                if (!this.getBingImg.biyingImg) {
                    //获取必应图片
                    this.$http.jsonp(apiHost + 'api/bing').then((res) => {
                        if (res.body.code === 0) {
                            sessionStorage.biyingImg = this.getBingImg.biyingImg = res.body.data;
                        }
                    },(res) => console.log(res));
                }

                if (this.$refs.indexBg) {
                    if(scrollHeight - scrollTop - clientHeight > 560 || clientHeight === scrollHeight) {
                        this.$refs.indexBg.style.position = "fixed";
                        this.$refs.indexBg.style.top = 0;
                    } else {
                        this.$refs.indexBg.style.position = "absolute";
                        this.$refs.indexBg.style.top = scrollHeight - clientHeight - 560 + "px";
                    }
                    this.headerStatus = scrollTop > 0 ? true : false;
                }
            } else {
                this.headerStatus = true;
                this.getBingImg.showStatus = false;
            }
        },
        //搜索侦听
        searchList(text) {
            let data = {};

            data[text.type] = text.text;
            this.$router.push( {path: '/searchResult', query: data} );
        },
        articleDetail(text) {
            this.$router.push( {path: '/articleDetail', query: {articleId: text._id, title: text.title}} );
        },
        //加载过渡
        loadingStatus(status) {
            this.loading = status;
        }
    },
    components: {
        loadIng,
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