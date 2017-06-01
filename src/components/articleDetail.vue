<template>
    <div id="articleDetail">
        <!-- loading -->
        <loadIng :loadingStatus="loadStatus"></loadIng>
        <!-- header -->
        <blogHeader v-on:searchCnt="searchList" :elseClass="elseClass"></blogHeader>
        <div class="titlebar clear">
            <div class="container">
                <p class="breadcrumbs">
                    <router-link :to="{path: '/'}">首页</router-link>
                    <span>&gt;</span>
                    <strong v-if="articleInfo.title">{{articleInfo.title}}</strong>
                </p>
            </div>
        </div>
        <!-- main -->
        <div id="main">
            <div class="container">
                <div class="content">
                    <div class="articleContent col-lg-9 col-md-8 col-sm-12">
                        <header class="clear">
                            <h1>{{articleParam.title}}</h1>
                            <p class="fl">
                                <span>{{articleParam.update_at | dateFormat('YYYY-MM-DD')}}</span>
                                <span style="padding-left: 13px;">访问数：{{articleParam.browsing}}</span>
                            </p>
                            <div class="fr">
                                <span v-for="(categories,index) in articleParam.categories">
                                    {{index == 0 ? '':', '}}
                                    <router-link class="u_transition u_hover_gray" :to="{path: '/searchResult', query: {Category: categories}}">
                                        {{categories}}
                                    </router-link>
                                </span>
                                <a style="padding-left: 13px;">
                                    <i class="glyphicon glyphicon-comment"></i>
                                    {{articleParam.review}}
                                </a>
                            </div>
                        </header>
                        <article>{{articleParam.content}}</article>
                        <div class="blog-tags">
                            <h5>Tags In</h5>
                            <div class="blog-tags-list clear">
                                <router-link v-for="tag in articleParam.tags" class="fl u_transition u_hover_blue_bg" :to="{path: '/searchResult', query: {Tag: tag}}">
                                    {{tag}}
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <rightBox v-on:searchCnt="searchList"></rightBox>
                </div>
            </div>
        </div>
        <!-- footer -->
        <blogFooter v-on:searchCnt="searchList" :elseClass="elseClass"></blogFooter>
    </div>
</template>

<script>
"use strict";
import loadIng      from './layout/loadIng.vue'
import blogHeader   from './layout/header.vue'
import blogFooter   from './layout/footer.vue'
import rightBox     from './layout/rightBox.vue'

export default {
    mounted() {
        let that = this,
            imgHost = this.$store.state.IMGHOST,
            apiHost = this.$store.state.APIHOST;

        document.getElementsByTagName('body')[0].scrollTop = 0;

        this.articleInfo = {
            _id: this.$route.query.articleId,
            title: this.$route.query.title
        };

        this.$http.jsonp(apiHost + 'api/getArticlesList?_id='+this.articleInfo._id).then((res) => {
            if (res.body.code === 0) {
                let param = res.body.data.data[0];

                that.loadStatus = true;
                that.articleParam = param;
            }
        },(res) => console.log(res));
    },
    data() {
        return {
            loadStatus: false,
            elseClass: "search_detail",
            articleInfo: {},
            articleParam: {
                categories: []
            },
            swiperOption: {
                effect : 'coverflow',
                initialSlide: 0,
                lazyLoading : true,
                pagination: '.swiper-pagination'
            }
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
        loadIng,
        blogHeader,
        blogFooter,
        rightBox
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
                color: #8d8d8d!important;
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
                text-indent: 2em;
            }
            .blog-tags {
                padding-bottom: 32px;
                border-bottom: 1px solid #ebebeb;
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