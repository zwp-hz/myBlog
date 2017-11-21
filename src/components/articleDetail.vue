<template>
    <div id="articleDetail" v-if="articleInfo.title" v-title="articleInfo.title">
        <!-- loading -->
        <loadIng :loadingStatus="loadStatus"></loadIng>
        <!-- header -->
        <blogHeader v-on:searchCnt="searchList" :elseClass="elseClass"></blogHeader>
        <div class="titlebar clear">
            <div class="container">
                <p class="breadcrumbs">
                    <router-link :to="{path: '/'}">首页</router-link>
                    <span>&gt;</span>
                    <strong>{{articleInfo.title}}</strong>
                </p>
            </div>
        </div>
        <!-- main -->
        <div id="articleDetail_main">
            <div class="container">
                <div class="content">
                    <div class="articleContent col-lg-9 col-md-8 col-sm-12">
                        <header class="clear">
                            <h1>{{articleParam.title}}</h1>
                            <p class="fl">
                                <span>{{articleParam.update_at | dateFormat('YYYY/MM/DD')}}</span>
                                <span style="padding-left: 13px;">访问数：{{articleParam.browsing}}</span>
                            </p>
                            <div class="fr">
                                <span v-for="(categories,index) in articleParam.categories">
                                    {{index == 0 ? '':', '}}
                                    <router-link class="u_transition u_hover_blue" :to="{path: '/searchResult', query: {Category: categories}}">
                                        {{categories}}
                                    </router-link>
                                </span>
                            </div>
                        </header>
                        <article v-html="articleParam.content"></article>
                        <div class="blog-tags">
                            <h5>Tags In</h5>
                            <div class="blog-tags-list clear">
                                <router-link v-for="tag in articleParam.tags" class="fl u_transition u_hover_blue_bg" :to="{path: '/searchResult', query: {Tag: tag}}">
                                    {{tag}}
                                </router-link>
                            </div>
                        </div>
                        <comment></comment>
                    </div>
                    <rightBox v-on:searchCnt="searchList" v-on:articleInfo="articleDetail"></rightBox>
                </div>
            </div>
        </div>
        <!-- footer -->
        <blogFooter v-on:searchCnt="searchList" v-on:articleInfo="articleDetail" :elseClass="elseClass"></blogFooter>
    </div>
</template>

<script>
"use strict";
import loadIng      from './layout/loadIng.vue'
import blogHeader   from './layout/header.vue'
import blogFooter   from './layout/footer.vue'
import rightBox     from './layout/rightBox.vue'
import comment      from './layout/comment.vue'

const Remarkable = require('remarkable');
const md = new Remarkable();

export default {
    mounted() {
        document.getElementsByTagName('body')[0].scrollTop = 0;

        this.articleInfo = {
            _id: this.$route.query.articleId,
            title: this.$route.query.title
        };

        this.getArticleDetail();
    },
    data() {
        return {
            loadStatus: false,                              //加载状态
            elseClass: 'article',                           //其他样式
            articleInfo: {},                                //文章信息
            articleParam: {                                 //文章内容
                categories: []
            }
        }
    },
    methods: {
        //获取文章详情
        getArticleDetail() {
            let imgHost = this.$store.state.IMGHOST,
                apiHost = this.$store.state.APIHOST;

            this.articleParam = {
                categories: []
            };
            this.loadStatus = false;

            this.$http.jsonp(apiHost + 'api/getArticlesList',{params: {_id: this.articleInfo._id}}).then((res) => {
                if (res.body.code === 0) {
                    let param = res.body.data.data[0];

                    param.content = md.render(param.content);

                    this.loadStatus = true;
                    this.articleParam = param;
                }
            });
        },
        //侦听搜索内容
        searchList(text) {
            var data = {};

            data[text.type] = text.text;
            this.$router.push( {path: '/searchResult', query: data} );
        },
        //跳转详情页
        articleDetail(text) {
            if (text._id != this.articleInfo._id) {
                this.$router.push( {path: '/articleDetail', query: {articleId: text._id, title: text.title}});
            }
        }
    },
    components: {
        loadIng,
        blogHeader,
        blogFooter,
        rightBox,
        comment
    }
}
</script>

<style lang="scss" scoped>
    #articleDetail {
        .titlebar {
            min-height: 60px;
            margin-bottom: 60px;
            padding: 25px 0 !important;
            background-color: #fbfbfb; 
        }

        .breadcrumbs {
            float: right;
            a,strong {
                color: #8d8d8d !important;
            }
            span {
                padding: 0 10px;
            }
        }

        .articleContent {
            color: #8d8d8d;
            header {
                margin-bottom: 20px;
                border-bottom: 1px solid #ebebeb;
                h1 {
                    padding-top: 15px;
                    margin: 16px 0 10px;
                    font-size: 30px;
                    font-weight: bold;
                    color: #3f3f3f;
                }
                p,div { padding-bottom: 20px; }
                a { color: #8d8d8d; }
            }

            article {
                padding-bottom: 40px;
                margin-bottom: 15px;
                line-height: 1.8;
                color: #516272;
            }
            .blog-tags {
                padding-bottom: 32px;
                h5 {
                    margin-bottom: 22px;
                    color: #3f3f3f;
                    font-size: 16px;
                    font-weight: bold;
                }
                a {
                    display: block;
                    padding: 0 12px;
                    margin: 0 10px 12px 0;
                    font-weight: bold;
                    border-radius: 5px;
                    line-height: 32px;
                    color: #8d8d8d;
                    background-color: #f0f0f0;
                }
            }
        }
    }
</style>