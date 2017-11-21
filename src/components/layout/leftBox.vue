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
                                <span>0</span>
                            </a>
                            <time class="g-c-center">
                                <span class="g-r-center"><i class="iconfont icon-time"></i>{{item.creation_at | dateFormat('YYYY/MM/DD')}}</span>
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

            that.$http.jsonp(apiHost + 'api/getArticlesList',{params: {
                page: page,
                release: true,
                categories: that.categoriesName || '',
                searchCnt: searchCnt || ''
            }}).then((res) => {
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
            this.$router.push( {path: '/articleDetail', query: {articleId: id, title: title}});
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
    @import "../../style/article";
</style>