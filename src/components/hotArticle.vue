<template>
    <div class="recent_posts">
        <h3>最新动态</h3>
        <div class="article g-r-center" v-for="(item,index) in articleList_hot" :key="index">
            <router-link
                v-if="item.images_src.src"
                :to="{path: '/articleDetail',query: {id: item._id, title: item.title}}"
                ondragstart="return false;"
                class="images"
                :style="item.images_src.status == 1 ? 'background: url('+item.images_src.src+') no-repeat center bottom' : ''"
            >
                <img
                    v-if="item.images_src.status == 0"
                    style="opacity: 0;"
                    @load="imgLoad(index,'load');"
                    @error="imgLoad(index,'error');"
                    :src="item.images_src.src"
                    alt=""
                />
                <i v-if="item.images_src.status == 2" class="iconfont icon-codestore"></i>
                <span>{{item.review.length}}</span>
                <b class="backImg u_transition_300 u_hover_show"><i class="iconfont icon-lianjie"></i></b>
            </router-link>
            <router-link v-else
                :to="{path: '/articleDetail',query: {id: item._id, title: item.title}}"
                ondragstart="return false;"
                class="images"
            >
                <i class="iconfont icon-codestore"></i>
                <span>{{item.review.length}}</span>
                <b class="backImg u_transition_300 u_hover_show"><i class="iconfont icon-lianjie"></i></b>
            </router-link>
            <div style="flex: 1;">
                <div class="categories">
                    <span v-for="(value,index) in item.categories" :key="index">
                        {{index > 0 ? ', ':''}}
                        <a @click="search({type: 'Category', text: value})" class="u_transition_300 u_hover_active">
                            {{value}}
                        </a>
                    </span>
                </div>
                <router-link
                    :to="{path: '/articleDetail',query: {id: item._id, title: item.title}}"
                    class="title u_transition_300 u_hover_active">
                    {{item.title}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    "use strict";
    export default {
        data() {
            return {
                articleList_hot: this.$store.state.articleList_hot || []
            }
        },
        mounted() {
            let { IMGHOST, APIHOST, articleList_hot, QN_POSTFIX } = this.$store.state;

            if (!articleList_hot) {
                //获取热门文章
                this.$http.jsonp(APIHOST + 'api/getArticlesList', {
                    params: {
                        type: 'hot',
                        release: true
                    }
                }).then((res) => {
                    if (res.body.code == 0) {
                        let data = res.body.data.data;

                        for (var item of data) {
                            if (item.images_src.length > 0) {
                                item.images_src = {
                                    src: IMGHOST + item.images_src[0] + QN_POSTFIX + '100',
                                    status: 0 // 0：图片未加载  1：图片加载成功  2：图片加载失败
                                }
                            } else {
                                item.images_src = {};
                            }

                        }
                        this.articleList_hot = data;

                        this.$store.commit('setFooterData', {
                            type: 'articleList_hot',
                            data: data
                        });
                    }
                });
            }
        },
        methods: {
            /**
             * 图片加载
             * @param {index}   下标
             * @param {type}    'load' 加载成功  'error' 加载失败
             */
            imgLoad(index, type) {
                this.articleList_hot[index].images_src.status = type == 'load' ? 1 : 2;
            },
            /**
             * 标签搜索
             * @param {data}    搜索参数
             */
            search(data) {
                this.$store.commit('searchChange', data);
                this.$router.push({
                    path: '/searchResult',
                    query: {
                        Category: data.text
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .recent_posts {
        h3 {
            margin-bottom: 15px;
            font-size: 20px;
            line-height: 30px;
            color: #e3e3e3;
        }
        a {
            color: #fff;
        }
        .article {
            padding-bottom: 10px;
            margin-bottom: 15px;
            border-bottom: 1px solid #cecec4;
            &:last-child {
                border-bottom: none;
            }
            .images {
                position: relative;
                display: block;
                width: 76px;
                height: 76px;
                margin-right: 19px;
                border-radius: 50% 50%;
                background-color: #cecec4;
                background-size: cover !important;
                -webkit-background-size: cover !important;
                .icon-codestore {
                    position: absolute;
                    top: 19.5px;
                    left: 21px;
                    font-size: 34px;
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
                    background: #1ed9be;
                    border-radius: 50% 50%;
                }
                .backImg {
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 50;
                    width: 76px;
                    height: 76px;
                    text-align: center;
                    line-height: 76px;
                    opacity: 0;
                    background: rgba(74, 190, 217, 0.6);
                    border-radius: 50%;
                }
            }
            .categories {
                span {
                    color: #fff;
                }
            }
            .title {
                display: -webkit-box;
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
