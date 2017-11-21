<template>
    <div class="recent_posts col-xs-12">
        <h3>最新动态</h3>
        <div class="article g-r-center" v-for="(item, index) in articleList">
            <a ondragstart="return false;" class="images" @click="$emit('articleInfo', {_id: item._id, title: item.title})">
                <img v-if="!item.imgLoadState" ondragstart="return false;" :src="item.images_src[0]" alt="" @error="imgError(index)" />
                <i class="iconfont icon-lietu" v-else></i>
                <span>0</span>
                <b class="backImg u_transition u_hover_show"><i class="iconfont icon-lianjie"></i></b>
            </a>
            <div style="flex: 1;">
                <div class="categories">
                    <span v-for="(categories,index) in item.categories">
                        {{index > 0 ? ', ':''}}
                        <a class="u_transition u_hover_blue" @click="$emit('searchCnt', {type: 'Category', text: categories})">
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
        this.$http.jsonp(apiHost + 'api/getArticlesList',{params: {type: 'hot',release: true}}).then((res) => {
            if (res.body.code == 0) {
                for (var i of res.body.data.data) {
                    i.images_src.forEach( ( item, j ) => {
                        i.images_src[j] = imgHost + item + "?imageView2/1/w/150/h/150/interlace1/q/90";
                    });

                    i.imgLoadState = false;
                }
                this.articleList = res.body.data.data;
            }
        });
    },
    data() {
        return {
        	articleList: []
        }
    },
    methods: {
        imgError(index) {
            this.articleList[index].imgLoadState = true;

            var img = event.srcElement;
            img.src = "../assets/images/image_error.png";
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
            border-bottom: 1px solid #3e3e3e;
            &:last-child{ border-bottom: none;}
            .images {
                position: relative;
                display: block;
                width: 76px;
                height: 76px;
                margin-right: 19px;
                background-color: #ebebeb;
                border-radius: 50% 50%;
                img { 
                    width: 100%;
                    border-radius: 50% 50%;
                }
                .icon-lietu {
                    position: absolute;
                    top: 21px;
                    left: 26px;
                    font-size: 24px;
                    color: #000;
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
                    line-height: 76px;
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