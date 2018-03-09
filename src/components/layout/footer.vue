<template>
  	<footer id="footer">
        <div v-if="blogPage">
            <div class="g-bolang">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 14" height="70" preserveAspectRatio="none"><path class="g-bolang-svg" d="M 27 10C 21 12 14 14 0 14L 0 0L 54 0L 54 3C 40 3 33 8 27 10Z"></path></svg>
            </div>
            <div class="container g-r-center clear">
                <div class="about_me g-box">
                     <p><span><b>朱为鹏</b>，🥚生于94年<br/><br/>浙江温州苍南人，<br/>现居杭州。<br/>前端菜🐦一枚，<br/>搬砖ing...</span></p>
                </div>
                <div class="more g-r-center">
                    <hotArticle :class="'g-box'" style="flex: 1;" class="hotArticle" v-on:searchCnt="searchList" v-on:articleInfo="articleDeatil"></hotArticle>
                    <tags :class="'g-box'" style="flex: 1;" class="tags" v-on:searchCnt="searchList"></tags>
                </div>
            </div>
        </div>
        <div class="put-on-record g-c-center">
            <p>©2017-2018&nbsp;&nbsp;朱为鹏&nbsp;&nbsp;<a href="http://www.miitbeian.gov.cn/" target="_blank">浙ICP备17031040号</a></p>
            <p>感谢 <a href="https://www.qiniu.com/" target="_blank">七牛云存储</a> 提供图片存储空间</p>
            <p>服务器、域名购置于 <a href="https://www.aliyun.com/" target="_blank">阿里云</a>&nbsp;&nbsp;&nbsp;&nbsp;icon图标来源于 <a href="http://www.iconfont.cn/" target="_blank">阿里巴巴矢量图标库</a></p>
        </div>
  	</footer>
</template>

<script>
"use strict";
import hotArticle   from './hotArticle.vue'
import tags         from './tags.vue'

export default {
    props: ['blogPage'],
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
        overflow: hidden;
        background: -webkit-linear-gradient(45deg,#1e212b,#373b4d);
        background: linear-gradient(45deg,#1e212b,#373b4d);
        &.article {
            position: static;
            height: auto;
        }
        .container {
            margin: 0 auto;
            padding: 100px 0 0 !important;
            .about_me {
                width: 33%;
                p {
                    color: #e3e3e3;
                    text-align: center;
                    span {
                        display: inline-block;
                        text-align: left;
                        b {
                            font-size: 25px;
                        }
                    }
                }
            }
            .more {
                width: 66%;
                align-items: flex-start;
            }
        }
        .put-on-record {
            height: 85px;
            color: #fff;
            text-align: center;
            font-size: 10px;
            a {
                color: #cecec4;
            }
        }
    }

    @media (max-width: 800px){
        .container {
            .more {
                display: block !important;
            }
        }
    }

    @media (max-width: 550px){
        .container {
            display: block !important;
            .about_me {
                width: 100% !important;
                padding-bottom: 20px;
            }
            .more {
                display: block !important;
                width: 100% !important;
            }
        }
    }
</style>