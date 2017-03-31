<template>
    <div id="index">
        <blogHeader :headerStatus="headerStatus"></blogHeader>
        <div id="indexBg"></div>
        <div id="main">
            <div class="container"></div>
        </div>
        <blogFooter :footerStatus="footerStatus"></blogFooter>
    </div>
</template>

<script>
"use strict";
import blogHeader from './layout/header.vue'
import blogFooter from './layout/footer.vue'

export default {
    data() {
        return {
            msg: '',
            tags: ["node"," webpack","vue2"],
            headerStatus: false,
            footerStatus: false
        }
    },
    created() {
        let that = this,
            apiHost = this.$store.state.APIHOST;

        //获取必应图片
        that.$http.jsonp(apiHost + 'api/bing').then((res) => {
            if (res.body.code === 0) {
                document.getElementById("indexBg").style.backgroundImage = 'url("'+ res.body.data[0] +'?imageView2/1/q/100/w/'+ document.documentElement.clientWidth +'")';
            }
        },(res) => console.log(res));

        //获取分类列表
        that.$http.jsonp(apiHost + 'api/getCategoryList').then((res) => {
            console.log(res.body)
        });

        window.onscroll = window.onload = () => {
            let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;

            document.getElementById("indexBg").style.top = scrollTop + "px";

            that.headerStatus = scrollTop > 0 ? true : false;
        }
    },
    components: {
        "blogHeader": blogHeader,
        "blogFooter": blogFooter
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#index {
    position: relative;
    margin-bottom: 560px;
    #main {
        position: relative;
        z-index: 100;
        width: 100%;
        padding-top: 400px;
        .container {
            z-index: 10;
            width: 100%;
            height: 2000px;
            background-color: rgba(255,255,255,.8);
            border-radius: 20px;
            box-shadow: 4px 4px 10px;
        }
    }
    #indexBg {
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: #fff;
        background-position: 50% 50%;
        background-size: cover;
        background-repeat: no-repeat;
    }
}
</style>