<template>
    <div class="recent_posts col-xs-12">
        <h3>最新动态</h3>
        <div class="article clear" v-for="item in articleList">
            <router-link class="images fl" :to="{}">
                <img :src="item.images_src[0]" alt="" />
                <span>{{item.review}}</span>
                <b class="backImg u_transition u_hover_show"><i class="glyphicon glyphicon-link"></i></b>
            </router-link>
            <div class="rl">
                <div class="categories">
                    <span v-for="(categories,index) in item.categories">
                        {{index > 0 ? '，':''}}
                        <router-link class="u_transition u_hover_gray" :to="{}">
                            {{categories}}
                        </router-link>
                    </span>
                </div>
                <router-link class="title u_transition u_hover_blue" :to="{}">{{item.title}}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
"use strict";
export default {
    mounted() {
        let imgHost = this.$store.state.IMGHOST,
            apiHost = this.$store.state.APIHOST,
            that = this;

        //获取热门文章
        that.$http.jsonp(apiHost + 'api/getArticlesList?type=hot').then((res) => {
            if (res.body.code == 0) {
                for (var i of res.body.data) {
                    i.images_src.forEach( ( item, j ) => {
                        i.images_src[j] = imgHost + item + "?imageView2/1/w/150/h/150/interlace1/q/90";
                    });
                }
                that.articleList = res.body.data;
            }
        });
    },
    data() {
        return {
        	articleList: []
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
                    line-height: 76px;
                    opacity: 0;
                    background: rgba(74,190,217,0.6);
                    border-radius: 50%;
                }
            }
            .title{
                display:-webkit-box;
                width: 60%;
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