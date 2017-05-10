<template>
  	<div id="leftBox" ref="leftBox" class="col-lg-9 col-md-8 col-sm-12">
        <div class="articleList" :style="'height:' + Math.max.apply( Math, (articleHeight.length >= 1 ? articleHeight : [0])) + 'px;'">
            <article v-for="(item,index) in article" v-if="item.status" :style="'top:'+position[index].top+'px;left:'+position[index].left+'px;'">
                <div class="u_transition post-content-container">
                    <img v-if="item.images_src.length === 1" :src="item.images_src" @error="imgError();"/>
                    <div v-else class="swiper-container">
                        <swiper :options="swiperOption[index]" ref="mySwiper">
                            <swiper-slide v-for="banner in item.images_src">
                                <img class="swiper-lazy" :data-src="banner" @error="imgError();"/>
                                <div class="swiper-lazy-preloader"></div>
                            </swiper-slide>
                        </swiper>
                        <div :class="'swiper-pagination swiper-pagination'+index+' swiper-pagination-bullets'"></div>
                    </div>
                    <div class="box">
                        <h2><a class="u_transition u_hover_blue" href="javaScript:void(0);">{{item.title}}</a></h2>
                        <strong>{{item.content}}</strong>
                        <p>
                            <router-link class="article_categories" v-for="(categories,index) in item.categories" :to="{path: ''}">
                                {{index > 0 ? '，':''}}{{categories}}
                            </router-link>
                            <router-link class="review u_transition u_hover_blue_bg":to="{path: ''}">
                                <i class="glyphicon glyphicon-comment"></i>
                                {{item.review}}
                            </router-link>
                            <time class="g-c-center">
                                <span><i class="glyphicon glyphicon-time"></i>{{Date.parse(item.creation_at) | dateFormat('YYYY-MM-DD')}}</span>
                                <span><i class="glyphicon glyphicon-eye-open"></i>{{item.browsing}}</span>
                            </time>
                        </p>
                    </div>
                </div>
            </article>
        </div>
        <!-- 分页 -->
        <div v-if="pageNum != 0" class="pagination g-c-center">
            <ul class="page-numbers g-c-center">
                <li v-for="(item,index) in pageNum" @click="getArticlesList(index+1,'NoFirst')">
                    <span v-if="index + 1 == page" class="page-numbers current">{{index+1}}</span>
                    <router-link v-else class="page-numbers u_transition u_hover_blue" :to="{path: '/', query: {page: index+1}}" >{{index+1}}</router-link>
                </li>
                <li v-if="pageNum > page" @click="getArticlesList(Number(page)+1,'NoFirst')">
                    <router-link class="next page-numbers u_transition u_hover_blue" :to="{path: '/', query: {page: Number(page)+1}}">Next</router-link>
                </li>
            </ul>
        </div>
  	</div>
</template>

<script>
"use strict";

export default {
    props: ["searchData","categoriesName"],
    mounted() {
        //获取文章列表
        let page = this.$route.query.page ? Number(this.$route.query.page) : 1;

        if (this.$route.query.searchCnt) {
            this.getArticlesList(page,"",decodeURIComponent(this.$route.query.searchCnt));
        } else {
            this.getArticlesList(page);
        }
    },
    data() {
        return {
            page: null,
            pageNum: null,
            article: [],
            articleHeight: [],
            position: {},
            swiperOption: {}
        }
    },
    methods: {
        /** 获取文章类别
          * @data   page: 分页, type: {hot: '最新动态'}, searchCnt: 搜索内容
         */
        getArticlesList(page,type,searchCnt) {
            let that = this,
                imgHost = this.$store.state.IMGHOST,
                apiHost = this.$store.state.APIHOST;

            that.articleHeight = [];

            that.$http.jsonp(apiHost + 'api/getArticlesList?page='+page+'&categories='+that.categoriesName+(searchCnt?'&searchCnt='+searchCnt:'')).then((res) => {
                let imgWidth = Math.round((that.$refs.leftBox.offsetWidth - 60) / 2),
                    number = 0;

                if (res.body.code == 0) {

                    if (type == "NoFirst" || searchCnt)
                        document.getElementsByTagName('body')[0].scrollTop = 320;

                    let data = res.body.data;

                    that.page = data.current_page;
                    that.pageNum = data.last_page;

                    for (var i in data.data) {
                        let x = i;

                        data.data[i].status = false;
                        data.data[i].images_src.forEach( ( item, j ) => {
                            let $img = new Image(),
                                src = imgHost + item + '?imageView2/2/w/' + imgWidth + '/interlace/1&v=1';

                            if (j === 0) {
                                data.data[i].images_src[j] = $img.src = src;
                                
                                $img.onload = () => {
                                    setArticleLocation("load");
                                }

                                $img.onerror = () => {
                                    setArticleLocation("error");
                                }

                                //设置文章定位
                                function setArticleLocation(type) {
                                    let length = that.articleHeight.length;
                                    data.data[x].status = true;

                                    if (length < 2) {
                                        that.position[x] = number % 2 === 0 ? {top: 0, left: 0} : {top: 0, left: imgWidth + 15};
                                        that.articleHeight.push((type === "error" ? Number(imgWidth / 2) : $img.height) + 279);
                                    } else {
                                        that.position[x] = {top: Math.min.apply(Math,that.articleHeight),left: that.articleHeight[0] > that.articleHeight[1] ? imgWidth + 15 : 0};

                                        that.articleHeight[(that.articleHeight[0] > that.articleHeight[1] ? 1 : 0)] += (type === "error" ? Number(imgWidth / 2) : $img.height) + 279;
                                    }

                                    number ++;
                                }
                            } else {
                                data.data[i].images_src[j] = src;

                                //swiper插件   同个页面多个滑动  动态配置
                                that.swiperOption[i] = {
                                    effect : 'coverflow',
                                    initialSlide: 0,
                                    lazyLoading : true,
                                    pagination: '.swiper-pagination' + i
                                }
                            } 
                        });
                    }
     
                    that.article = data.data;
                }
            });
        },
        imgError() {
            var img = event.srcElement;
            img.src = "../dist/images/image_error.png";
            img.onerror = null;
        }
    },
    watch: {
    	categoriesName(val) {
    		this.getArticlesList(1);
    	},
        searchData(val) {
            this.getArticlesList(1,"",val.content);
        }
    }
}
</script>

<style lang="scss">
    .articleList {
        position: relative;
        width: 100%;
        article {
            position: absolute;
            width: 50%;
            padding-right: 15px;
            transition: all 1s;
            -moz-transition: all 1s;  /* Firefox 4 */
            -webkit-transition: all 1s;   /* Safari 和 Chrome */
            -o-transition: all 1s;    /* Opera */
            img {
                width: 100%;
            }
            .box {
                height: 264px;
                padding-top: 20px;
                overflow-y: hidden;
                background-color: #fff;
                h2, strong {
                    width: 100%;
                    height: 58px;
                    padding: 0 13%;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;                
                    -webkit-box-orient: vertical;
                }
                h2 {
                    font-size: 28px;
                    margin: 12px 0 14px;
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

    .swiper-wrapper {
        display: -webkit-box;
        -webkit-box-pack:center;
        -webkit-box-align:center;
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