<template>
  	<div id="leftBox" class="col-lg-9 col-md-8 col-sm-12">
        <div class="articleList">
            <article class="u_transition post-content-container" v-for="list in article">
                <img v-if="list.images_src.length === 1" :src="list.images_src"/>
                <div v-else class="swiper-container">
                    <swiper :options="swiperOption" ref="mySwiper">
                        <swiper-slide v-for="banner in list.images_src">
                            <img :src="banner" />
                        </swiper-slide>
                    </swiper>
                    <div class="swiper-pagination swiper-pagination-bullets"></div>
                </div>
                <div class="box">
                    <h2><a class="u_transition u_hover_blue" href="javaScript:void(0);">{{list.title}}</a></h2>
                    <strong>{{list.content}}</strong>
                    <p>
                        <router-link class="article_categories" v-for="(categories,index) in list.categories" :to="{path: ''}">
                            {{index > 0 ? '，':''}}{{categories}}
                        </router-link>
                        <router-link class="review u_transition u_hover_blue_bg":to="{path: ''}">
                            <i class="glyphicon glyphicon-comment"></i>
                            {{list.review}}
                        </router-link>
                        <time class="g-c-center">
                            <span><i class="glyphicon glyphicon-time"></i>{{Date.parse(list.creation_at) | dateFormat('YYYY-MM-DD')}}</span>
                            <span><i class="glyphicon glyphicon-eye-open"></i>{{list.browsing}}</span>
                        </time>
                    </p>
                </div>
            </article>
        </div>
        <div class="pagination g-c-center">
            <ul class="page-numbers g-c-center">
                <li><span class="page-numbers current">1</span></li>
                <li><a class="page-numbers u_transition u_hover_blue" href="javaScript:void(0);">2</a></li>
                <li><a class="next page-numbers u_transition u_hover_blue" href="javaScript:void(0);">Next</a></li>
            </ul>
        </div>
  	</div>
</template>

<script>
"use strict";
import hotArticle   from './hotArticle.vue'
import tags         from './tags.vue'

export default {
    props: ["categoriesName"],
    mounted() {
       let that = this,
            imgHost = this.$store.state.IMGHOST,
            apiHost = this.$store.state.APIHOST;

        //获取文章列表
        that.$http.jsonp(apiHost + 'api/getArticlesList').then((res) => {
            if (res.body.code == 0) {
                for (var i of res.body.data) {
                    i.images_src.forEach( ( item, j ) => {
                        i.images_src[j] = imgHost + item + '?imageView2/1/q/90/w/428';
                    });
                }
                that.article = res.body.data;
            }
        }); 
    },
    data () {
        return {
            article: [],
            swiperOption: {
                effect : 'coverflow',
                initialSlide: 0,
                loop: true,
                pagination: '.swiper-pagination'
            }
        }
    },
    methods: {
        searchStart() {
            console.log(this.searchCnt)
        }
    },
    watch: {
    	searchCnt(val) {
    		
    	}
    },
    components: {
        hotArticle,
        tags
    }
}
</script>

<style lang="scss">
    .articleList {
        -webkit-column-count: 2;
        column-count: 2;
        -moz-column-width: 300px;
        -webkit-column-width: 300px;
        column-width: 300px;
        -moz-column-gap: 1em;
        -webkit-column-gap: 1em;
        column-gap: 1em;
        article {
            break-inside: avoid;
            margin-bottom: 1em;
            img {
                width: 100%;
            }
            .box {
                padding-top: 20px;
                background-color: #fff;
                h2, strong {
                    width: 100%;
                    padding-left: 13%;
                    padding-right: 13%;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;                
                    -webkit-box-orient: vertical;
                }
                h2 {
                    font-size: 28px;
                    margin-top: 12px;
                    margin-bottom: 14px;
                    line-height: 100%!important;
                    -webkit-line-clamp: 2;
                    a {
                        color: #000;
                    }
                }
                strong {
                    margin-bottom: 28px;
                    color: #8d8d8d;
                    text-indent: 1em;
                    font-weight: 400;
                    font-size: 14px;
                    -webkit-line-clamp: 3;
                }
                p {
                    position: relative;
                    padding: 25px 0 48px 13%;
                    margin-right: 40%;
                    border-top: 1px solid #e9e9e9;
                    .article_categories {
                        display: block;
                        float: left;
                        line-height: 20px;
                        color: #8d8d8d!important;
                        font-size: 13px;
                    }
                    time{
                        position: absolute;
                        right: -66%;
                        width: 67%;
                        padding-right: 20px;
                        color: #8d8d8d !important;
                        align-items: flex-end;
                        i { padding-right: 5px; }
                    }
                    .review {
                        position: absolute;
                        top: -20px;
                        right: -45%;
                        width: 35%;
                        height: 40px;
                        text-align: center;
                        line-height: 40px;
                        color: #8d8d8d;
                        background-color: #f6f6f6;
                        border-radius: 100px;
                        &.u_hover_blue_bg:hover {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }

    .pagination {
        width: 100%;
        ul {
            display: -webkit-box;
            margin: 0 auto;
            list-style: none;
            background-color: #f4f4f4;
            padding: 5px 4px;
            border-radius: 30px;
            border-width: 0px;
            li {
                margin: 0 2px;
                span,a {
                    display: block;
                    height: 40px;
                    width: 40px;
                    text-align: center;
                    line-height: 40px;
                    color: #8d8d8d;
                    cursor: pointer;
                }
                span {
                    background-color: #47c9e5;
                    border-radius: 30px;
                    color: #fff;
                }
            }
        }
    }
</style>