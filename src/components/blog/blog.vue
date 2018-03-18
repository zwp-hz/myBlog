<template>
    <div id="blog">
    	<headerBox :headerData="headerData"></headerBox>
        <div id="blogMain" class="g-r-center">
            <div class="container">
                <ul class="categories g-r-center">
                    <li @click="categoriesName = '全部'"><router-link class="u_transition_300 u_hover_active_bg" :class="{cur: categoriesName === '全部'}" :to="{path: '/blog'}">全部</router-link></li>
                    <li @click="categoriesName = item.name" v-for="item in categories" :key="item"><router-link class="u_transition_300 u_hover_active_bg" :class="{cur: categoriesName === item.name}" :to="{path: '/blog', query: {categories: item.name}}">{{item.name}}</router-link></li>
                </ul>
            </div>
        </div>
        <articleList :categoriesName="categoriesName"></articleList>
    	<footerBox :blogPage="true"></footerBox>
    </div>
</template>

<script>
"use strict";
import headerBox  from '../layout/header.vue'
import footerBox  from '../layout/footer.vue'
import articleList from './articleList.vue'

export default {
    mounted() {
        let { APIHOST } = this.$store.state,
            github_code = this.$route.query.code;

        // 获取分类列表
        this.$http.jsonp(APIHOST + 'api/getCategoryList').then((res) => {
            if (res.body.code == 0) this.categories = res.body.data;
        });
    },
    data() {
        return {
        	headerData: {
                title: 'Blog',
        		searchStatus: true,
	            isStatic: true,
	            type: 'blog'
        	},
            categories: [],
            categoriesName: (typeof this.$route.query.categories === "undefined" ? "全部" : this.$route.query.categories)
        }
    },
    methods: {
        
    },
    components: {
    	headerBox,
    	footerBox,
        articleList
    }
}
</script>

<style lang="scss" scoped>
    #blogMain {
        position: relative;
        top: -1px;
        background: #fff;
        .categories {
            flex-wrap: wrap;
            li {
                margin: 1px 8px 8px 8px;
                a {
                    display: block;
                    height: 34px;
                    line-height: 34px;
                    padding: 0 15px;
                    background-color: #fff;
                    border-radius: 100px;
                    color: #8d8d8d;
                    border: 1px solid #e6e6e6;
                    &.cur {
                        color: #fff;
                        background-color: #1ed9be;
                        border: 1px solid #1ed9be
                    }
                    &.u_hover_active_bg:hover {
                        color: #fff;
                        border: 1px solid #1ed9be;
                    }
                }
            }
        }
    }
</style>