<template>
    <div class="recent_posts col-xs-12">
        <h3>最新动态</h3>
        <div class="article g-r-center" v-for="item in articleList">
            <a ondragstart="return false;" class="images" @click="$emit('articleInfo', {_id: item._id, title: item.title})">
                <img ondragstart="return false;" :src="item.images_src[0]" alt="" @error="imgError()" />
                <span :id="'sourceId::' + item._id" class = "cy_cmt_count" ></span>
                <b class="backImg u_transition u_hover_show"><i class="iconfont icon-lianjie"></i></b>
            </a>
            <div style="flex: 1;">
                <div class="categories">
                    <span v-for="(categories,index) in item.categories">
                        {{index > 0 ? ', ':''}}
                        <a class="u_transition u_hover_gray" @click="$emit('searchCnt', {type: 'Category', text: categories})">
                            {{categories}}
                        </a>
                    </span>
                </div>
                <a class="title u_transition u_hover_blue" @click="$emit('articleInfo', {_id: item._id, title: item.title})">{{item.title}}</a>
            </div>
        </div>
    </div>
</template>

<script>
"use strict";
var accessNum = 0;

export default {
    mounted() {
        let imgHost = this.$store.state.IMGHOST,
            apiHost = this.$store.state.APIHOST;

        //获取热门文章
        this.$http.jsonp(apiHost + 'api/getArticlesList?type=hot').then((res) => {
            if (res.body.code == 0) {
                for (var i of res.body.data.data) {
                    i.images_src.forEach( ( item, j ) => {
                        i.images_src[j] = imgHost + item + "?imageView2/1/w/150/h/150/interlace1/q/90";
                    });
                }
                this.articleList = res.body.data.data;

                if (accessNum++ % 2 == 0) {
                    if (this.$route.name == "articleDetail") {
                        this.$store.dispatch('setCommentNum');
                    }
                }
            }
        });
    },
    data() {
        return {
        	articleList: []
        }
    },
    methods: {
        imgError() {
            var img = event.srcElement;
            img.src = "../dist/images/image_error_tag.png";
            img.onerror = null;
        }
    }
}

</script>

<style lang="scss" scoped>
	.recent_posts {
        a {color: #fff;}
        .article {
            padding-bottom: 15px;
            margin-bottom: 25px;
            border-bottom: 1px solid #3E3E3E;
            &:last-child{ border-bottom: none;}
            .images {
                position: relative;
                display: block;
                width: 76px;
                height: 76px;
                margin-right: 19px;
                img { 
                    width: 100%;
                    border-radius: 50% 50%;
                }
                span {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    z-index: 100;
                    width: 19px;
                    height: 19px;
                    text-align: center;
                    line-height: 19px;
                    color: #fff;
                    background: #47c9e5;
                    border-radius: 50% 50%;
                }
                .backImg {
                    position: absolute;
                    top: 0;
                    z-index: 50;
                    width: 76px;
                    height: 76px;
                    text-align: center;
                    line-height: 86px;
                    opacity: 0;
                    background: rgba(74,190,217,0.6);
                    border-radius: 50%;
                }
            }
            .categories {
                span { color: #fff; }
            }
            .title{
                display:-webkit-box;
                font-size: 16px;
                font-weight: 700;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break: break-all;
                overflow: hidden;
            }
        }
    }
</style>