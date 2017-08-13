<template>
  	<div id="footer" :class="elseClass">
        <div class="container">
            <div class="about_me col-sm-12 col-md-4">
                <img ondragstart="return false;" src="../../images/logo_white.png" alt="" />
                <p>思想（且不论好坏与否）——行为——习惯，这就是人 生的规律。 —— 特赖因
科学家不是依赖于个人的思想，而是综合了几千人的智慧，所有的人想一个问题，并且每人做它的部分工作，添加到正建立起来的伟大知识大厦之中。 —— 卢瑟福</p>
            </div>
            <hotArticle v-on:searchCnt="searchList" v-on:articleInfo="articleDeatil" class="col-sm-12 col-md-4"></hotArticle>
            <tags v-on:searchCnt="searchList" class="col-sm-12 col-md-4"></tags>
        </div>
        <p class="put-on-record">©2017-2017&nbsp;&nbsp;朱为鹏&nbsp;&nbsp;<a href="http://www.miitbeian.gov.cn/" target="_blank">浙ICP备17031040号-1</a></p>
  	</div>
</template>

<script>
"use strict";
import hotArticle   from './hotArticle.vue'
import tags         from './tags.vue'

export default {
    props: ["elseClass"],
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
        position: fixed;
        bottom: 0;
        z-index: -1;
        width: 100%;
        height: 560px;
        overflow: hidden;
        background: #262626;
        &.search_detail {
            position: static;
            height: auto;
        }
        .container {
            margin: 0 auto;
            padding: 100px 0 0 !important;
            .about_me {
                img { width: 150px; }
                p { 
                    color: #e3e3e3;
                    padding: 20px 0;
                    text-indent: 2em;
                }
            }
        }
        .put-on-record {
            padding-bottom: 40px;
            color: #fff;
            text-align: center;
            a {
                color: #fff;
            }
        }
    }
</style>