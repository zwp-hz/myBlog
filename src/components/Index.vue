<template>
    <div id="index">
        <blogHeader></blogHeader>
        <div class="blog_title"></div>
        <div class="main">
            
        </div>
        <blogFooter></blogFooter>
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
            tags: ["node"," webpack","vue2"]
        }
    },
    created() {
        this.$http.jsonp('http://localhost:8989/bing').then((res) => {
            if (res.body.code === 0) {
                document.getElementsByClassName("blog_title")[0].style.backgroundImage = 'url("'+ res.body.data[0] +'?imageView2/1/q/100/w/'+ document.documentElement.clientWidth +'")';
                console.log(res.body);
            }
        },(res) => console.log(res));
    },
    components: {
        "blogHeader": blogHeader,
        "blogFooter": blogFooter
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#index {
    margin-bottom: 560px;
    .main {
        position: relative;
        z-index: 100;
        height: 1000px;
        background: #fff;
    }
    .blog_title {
        position: relative;
        z-index: 10;
        height: 470px;
        padding-top: 90px;
        background-position: 50% 50%;
        background-size: cover;
    }
}
</style>