<template>
  	<div id="leftBox" ref="leftBox" class="col-lg-9 col-md-8 col-sm-12">
        <!-- 文章 -->
        <div v-if="article.length >= 1" :class="imgLoadStatus?'articleList loadSucceed':'articleList'" :style="'height:'+Math.max.apply(Math,(articleHeight.length>=1?articleHeight:[0]))+'px;'">
            <article v-for="(item,index) in article" :style="imgLoadStatus?('top:'+position[index].top+'px;left:'+position[index].left+'px;z-index:'+(10-index)+';'):'top:0;left:0;z-index:'+(10-index)+';'">
                <div class="u_transition post-content-container">
                    <!-- 单张图片 -->
                    <a v-if="item.images_src.length === 1" class="articleImg"  @click="articleDetail(item._id,item.title)">
                        <img ondragstart="return false;" @mouseover="item.imgMouseStatus=true" @mouseout="item.imgMouseStatus=false" :class="{u_transition: true,scale: item.imgMouseStatus}" :src="item.images_src" @error="imgError();"/>
                    </a>
                    <!-- 多张图片 -->
                    <div v-else class="swiper-container">
                        <a @click="articleDetail(item._id,item.title)">
                            <swiper :options="swiperOption[index]" ref="mySwiper">
                                <swiper-slide v-for="banner in item.images_src">
                                    <img style="width: 100%;" ondragstart="return false;" class="swiper-lazy" :data-src="banner" @error="imgError();"/>
                                    <div class="swiper-lazy-preloader"></div>
                                </swiper-slide>
                            </swiper>
                        </a>
                        <div :class="'swiper-pagination swiper-pagination'+index+' swiper-pagination-bullets'"></div>
                    </div>
                    <div class="box">
                        <h2><a @click="articleDetail(item._id,item.title)" class="u_transition u_hover_blue">{{item.title}}</a></h2>
                        <strong>{{item.content}}</strong>
                        <p>
                            <b class="article_categories">
                                <span v-for="(categories,index) in item.categories">
                                    {{index == 0 ? '':', '}}
                                    <a @click="$emit('searchCnt', {type: 'Category', text: categories})" class="u_transition u_hover_blue">
                                        {{categories}}
                                    </a>
                                </span>
                            </b>
                            <a class="review u_transition u_hover_blue_bg" @click="articleDetail(item._id,item.title)">
                                <i class="iconfont icon-huifu"></i>
                                <span :id="'sourceId::' + item._id" class = "cy_cmt_count" ></span>
                            </a>
                            <time class="g-c-center">
                                <span class="g-r-center"><i class="iconfont icon-time"></i>{{Date.parse(item.creation_at) | dateFormat('YYYY/MM/DD')}}</span>
                                <span><i class="iconfont icon-chakan"></i>{{item.browsing}}</span>
                            </time>
                        </p>
                    </div>
                </div>
            </article>
        </div>
        <div class="noParam" v-else>
            <i class="iconfont icon-zanwushuju"></i>
            <p>找不到相关 "{{searchText}}" 数据</p>
        </div>
        <!-- 分页 -->
        <div v-if="pageNum > 1 && imgLoadStatus" class="pagination g-c-center">
            <ul class="page-numbers g-c-center">
                <li v-if="page > 1" @click="pageBtn(Number(page)-1,'NoFirst')">
                    <a class="next page-numbers u_transition u_hover_blue">上一页</a>
                </li>
                <li v-for="(item,index) in pageNum" @click="pageBtn(index+1,'NoFirst')">
                    <span v-if="index + 1 == page" class="page-numbers current">{{index+1}}</span>
                    <a v-else class="page-numbers u_transition u_hover_blue">{{index+1}}</a>
                </li>
                <li v-if="pageNum > page" @click="pageBtn(Number(page)+1,'NoFirst')">
                    <a class="next page-numbers u_transition u_hover_blue">下一页</a>
                </li>
            </ul>
        </div>
  	</div>
</template>

<script>
"use strict";
import loadIng      from   './loadIng.vue'

export default {
    props: ["searchData","categoriesName","resizeTime"],
    mounted() {
        //获取文章列表
        let page = this.$route.query.page ? Number(this.$route.query.page) : 1,
            that = this;

        for (var i in this.$route.query) {
            if (i == "_s" || i == "Tag" || i == "Category")
                this.searchText = this.$route.query[i];
        }

        this.getArticlesList(page,"",this.searchText);
    },
    data() {
        return {
            page: null,                                     //当前分页数
            pageNum: null,                                  //总分页数
            imgLoadStatus: false,                           //文章图片是否加载完成状态
            load_success_number: 0,                         //文章图片加载成功数 
            searchText: "",                                 //搜索内容
            article: [],                                    //文章列表
            articleHeight: [],                              //文章容器高度
            position: {},                                   //文章定位信息
            swiperOption: {},                               //滑动图片  索引配置
            timer: null                                     //定时器载体
        }
    },
    methods: {
        /** 获取文章列表
          * @data   page: 分页, type: {hot: '最新动态',NoFirst: '区分是否是一次加载'}, searchCnt: 搜索内容
         */
        getArticlesList(page,type,searchCnt) {

            let that = this,
                imgHost = this.$store.state.IMGHOST,
                apiHost = this.$store.state.APIHOST;

            that.position = [];
            that.article = [];
            that.imgLoadStatus = false;
            that.$emit('imgLoadStatus', false);
            that.load_success_number = 0;
            that.swiperOption = {};

            that.$http.jsonp(apiHost + 'api/getArticlesList?page='+page+(that.categoriesName?'&categories='+that.categoriesName:'')+(searchCnt?'&searchCnt='+searchCnt:'')).then((res) => {
                let clientWidth = document.documentElement.clientWidth,
                    offsetWidth = that.$refs.leftBox.offsetWidth,
                    imgWidth = Math.round((clientWidth>=768)?((offsetWidth - 60) / 2):(offsetWidth - 30));

                if (res.body.code == 0) {

                    if (type == "NoFirst" || searchCnt)
                        document.getElementsByTagName('body')[0].scrollTop = 0;

                    let data = res.body.data;

                    that.page = data.current_page;
                    that.pageNum = data.last_page;

                    if(data.data.length <= 0) {
                        that.imgLoadStatus = true;
                        that.$emit('imgLoadStatus', true);
                    }

                    for (var i in data.data) {
                        let x = i;

                        data.data[i].index = Number(i);
                        data.data[i].imgMouseStatus = false;
                        data.data[i].images_src.forEach( ( item, j ) => {
                            let $img = new Image(),
                                src = imgHost + item + '?imageView2/2/w/' + imgWidth + '/interlace/1';

                            if (j === 0) {
                                data.data[i].images_src[j] = $img.src = src;
                                
                                $img.onload = () => {
                                    this.setArticleLocation({type: "load",event: event,imgHeight: $img.height,imgWidth: imgWidth,clientWidth: clientWidth},data.data);
                                }

                                $img.onerror = () => {
                                    this.setArticleLocation({type: "error",event: event,imgHeight: $img.height,imgWidth: imgWidth,clientWidth: clientWidth},data.data);
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
                    this.$store.dispatch('setCommentNum');
                }
            });
        },
        /** 设置文章位置
          * @data   obj: 浏览器参数, param: 文章参数
         */
        setArticleLocation(obj,param) {
            if (obj.type == "onresize") {
                this.position.forEach((item,i) => {
                    this.position[i].width = obj.imgWidth;
                    this.position[i].height = Math.round((item.height - 279) * obj.ratio) + 279;
                });
            } else {
                var imgSrc = obj.event.srcElement.src;

                //记录每张图片高度
                for (var x in param) {
                    if (imgSrc === param[x].images_src[0]) {
                        this.position[x] = {
                            width: obj.imgWidth,
                            height: (obj.type==="error" ? Number(obj.imgWidth / 2) : obj.imgHeight) + 279
                        }
                        break;
                    }
                }
            }

            //设置定位信息
            if (this.load_success_number >= param.length-1) {
                this.articleHeight = [];

                for (var y in this.position) {
                    if (y <= (obj.clientWidth>768?1:0)) {
                        this.position[y].left = y % 2 === 0 ? 0 : obj.imgWidth + 15;
                        this.position[y].top = 0;
                        this.articleHeight.push(this.position[y].height);
                    } else {
                        this.position[y].top = Math.min.apply(Math,this.articleHeight);
                        this.position[y].left = this.articleHeight[0] > this.articleHeight[1] ? obj.imgWidth + 15 : 0;
                        this.articleHeight[(this.articleHeight[0] > this.articleHeight[1] ? 1 : 0)] += this.position[y].height;
                    }
                }

                this.imgLoadStatus = true;
                this.$emit('imgLoadStatus', true);
            }

            this.load_success_number++;
        },
        /** 跳转详情页
          * @data   id: 文章id, title: 文章title
         */
        articleDetail(id,title) {
            this.$router.push( {path: '/articleDetail', query: {articleId: id, title: title}},function() {
                location.reload();
            });
        },
        /** 分页
          * @data   num: 分页, type: 是否第一次加载 ? '' : 'NoFirst'
         */
        pageBtn(num,type) {
            let data = {
                page: num
            }

            if (this.searchText)
                data._s = this.searchText
            
            this.$router.push({query: data});
            this.getArticlesList(num,type,this.searchText);
        },
        //图片加载失败
        imgError() {
            let img = event.srcElement;
            img.src = "assets/images/image_error.png";
            img.onerror = null;
        }
    },
    watch: {
        //标签切换
    	categoriesName() {
    		this.getArticlesList(1);
    	},
        //搜索侦听
        searchData(val) {
            this.searchText = val.content;
            this.getArticlesList(1,"",val.content);
        },
        //浏览器窗口变化侦听
        resizeTime(val) {
            let that = this,
                clientWidth = document.documentElement.clientWidth,
                offsetWidth = that.$refs.leftBox.offsetWidth,
                imgWidth = Math.round((clientWidth>=768)?((offsetWidth - 60) / 2):(offsetWidth - 30));

            clearTimeout(that.timer);

            that.timer = setTimeout(function() {
                that.setArticleLocation({type: "onresize",imgWidth: imgWidth,clientWidth: clientWidth,ratio: imgWidth/that.position[0].width},that.article);
            },100);
        }
    },
    components: {
        loadIng
    }
}
</script>

<style lang="scss" scoped>
    #leftBox {
        padding-bottom: 20px;
    }
    .articleList {
        position: relative;
        width: 100%;
        opacity: 0;
        &.loadSucceed {
            opacity: 1;
            article {
                width: 50%;
                transition: all .5s ease;
                -moz-transition: all .5s ease;  /* Firefox 4 */
                -webkit-transition: all .5s ease;   /* Safari 和 Chrome */
                -o-transition: all .5s ease;    /* Opera */
            }
            
        }
        article {
            position: absolute;
            padding-right: 15px;
            .articleImg {
                display: block;
                width: 100%;
                overflow: hidden;
                cursor: pointer;
                img {
                    width: 100% !important;
                    &.scale {
                        transform: scale(1.2);
                        -webkit-transform: scale(1.2);
                        -moz-transform: scale(1.2);
                        -o-transform: scale(1.2);
                    }
                }
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
                    font-size: 14px;
                    -webkit-line-clamp: 3;
                }
                p {
                    display: flex;
                    display: -webkit-flex;
                    flex: 1;
                    position: relative;
                    padding: 25px 0 48px 13%;
                    margin-right: 40%;
                    border-top: 1px solid #e9e9e9;
                    .article_categories {
                        margin-right: 15px;
                         a {
                            line-height: 20px;
                            color: #8d8d8d;
                            font-size: 13px;
                         }
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

    .noParam {
        padding-top: 50px;
        text-align: center;
        i {
            font-size: 80px;
        }
        p {
            line-height: 80px;
            font-size: 20px;
            color: #8d8d8d;
        }
    }

    .pagination {
        margin: 20px 0 0 0;
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
                a.next {
                    width: 60px;
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