<template>
  	<footer id="footer">
        <div class="g-bolang">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 14" height="70" preserveAspectRatio="none"><path class="g-bolang-svg" d="M 27 10C 21 12 14 14 0 14L 0 0L 54 0L 54 3C 40 3 33 8 27 10Z"></path></svg>
        </div>
        <div class="container g-r-center">
            <div class="about_me g-box">
                <img ondragstart="return false;" src="../../images/logo_white.png" alt="" />
                <p>思想（且不论好坏与否）——行为——习惯，这就是人 生的规律。 —— 特赖因</p>
                <p>科学家不是依赖于个人的思想，而是综合了几千人的智慧，所有的人想一个问题，并且每人做它的部分工作，添加到正建立起来的伟大知识大厦之中。 —— 卢瑟福</p>
            </div>
            <hotArticle :class="'g-box'" style="flex: 1;" class="hotArticle" v-on:searchCnt="searchList" v-on:articleInfo="articleDeatil"></hotArticle>
            <tags :class="'g-box'" style="flex: 1;" class="tags" v-on:searchCnt="searchList"></tags>
        </div>
        <p class="put-on-record">©2017-2018&nbsp;&nbsp;朱为鹏&nbsp;&nbsp;<a href="http://www.miitbeian.gov.cn/" target="_blank">浙ICP备17031040号-1</a></p>
  	</footer>
</template>

<script>
"use strict";
import hotArticle   from './hotArticle.vue'
import tags         from './tags.vue'

export default {
    data () {
        return {}
    },
    methods: {
        searchList(text) {
            this.$emit('searchCnt', text);
        },
        articleDeatil(text) {
            this.$emit('articleInfo',text);
        }
    },
    components: {
        hotArticle,
        tags
    }
}

</script>

<style lang="scss" scoped>
	#footer {
        position: relative;
        width: 100%;
        margin-top: -1px;
        padding-bottom: 15px;
        overflow: hidden;
        background: -webkit-linear-gradient(45deg,#1e212b,#373b4d);
        background: linear-gradient(45deg,#1e212b,#373b4d);
        &.article {
            position: static;
            height: auto;
        }
        .container {
            min-height: 50vh;
            margin: 0 auto;
            padding: 100px 0 0 !important;
            align-items: flex-start;
            .about_me {
                flex: 1;
                margin-bottom: 15px;
                img { width: 150px; }
                p { 
                    color: #e3e3e3;
                    padding-top: 15px;
                    text-indent: 2em;
                }
            }
        }
        .put-on-record {
            color: #fff;
            text-align: center;
            a {
                color: #fff;
            }
        }
    }

    @media (max-width: 800px){
        .container {
            display: block !important;
        }
    }
</style>