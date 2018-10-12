<template>
    <div id="search">
        <header-box :headerData="headerData"></header-box>
        <div class="titlebar">
            <div class="container clear">
                <h1 v-if="(searchCnt.type || routeQuery.type) == '_s'">
                    "{{searchCnt.text || routeQuery.text}}"的搜索结果
                </h1>
                <h1 v-else>
                    {{(searchCnt.type || routeQuery.type) == 'Category' ? '分类' :
                    (searchCnt.type || routeQuery.type)}}：{{searchCnt.text || routeQuery.text}}
                </h1>
                <p class="breadcrumbs">
                    <router-link class="u_transition_300 u_hover_active" :to="{path: '/blog'}">博客</router-link>
                    <span>&gt;</span>
                    <strong v-if="(searchCnt.type || routeQuery.type) == '_s'">
                        "{{searchCnt.text || routeQuery.text}}"
                    </strong>
                    <strong v-else>{{searchCnt.text || routeQuery.text}}</strong>
                </p>
            </div>
        </div>
        <article-list :searchCnt="searchCnt"></article-list>
        <footer-box :blogPage="true"></footer-box>
    </div>
</template>

<script>
    "use strict";
    import headerBox from '../../components/header.vue'
    import footerBox from '../../components/footer.vue'
    import articleList from './articleList.vue'

    export default {
        data() {
            return {
                headerData: {
                    title: 'Search Result',
                    searchStatus: true,
                    isStatic: true,
                    type: 'blog'
                },
                routeQuery: {}
            }
        },
        mounted() {
            // 判断 搜索记录是否存在
            if (!this.$store.state.searchCnt.text) {
                for (var i in this.$route.query) {
                    this.routeQuery = {
                        type: i,
                        text: this.$route.query[i]
                    };
                }

                if (!this.routeQuery.type)
                    this.routeQuery = {
                        type: "Category",
                        text: "全部"
                    };
            };
        },
        computed: {
            searchCnt() {
                return this.$store.state.searchCnt;
            }
        },
        components: {
            headerBox,
            footerBox,
            articleList
        }
    }
</script>

<style lang="scss" scoped>
    #search {
        .titlebar {
            position: relative;
            top: -1px;
            background-color: #fff;
            .container {
                min-height: 60px;
                margin: 0 auto;
                line-height: 60px;
            }
            h1 {
                float: left;
                font-size: 24px;
                font-weight: normal;
            }
        }
        .breadcrumbs {
            float: right;
            a,
            strong {
                color: #8d8d8d;
            }
            span {
                padding: 0 10px;
            }
        }
    }

    #rightBox .box {
        background-color: null;
    }
</style>
