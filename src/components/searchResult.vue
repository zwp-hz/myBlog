<template>
    <div id="search">
        <!-- header -->
        <blogHeader v-on:searchCnt="searchList" :elseClass="elseClass"></blogHeader>
        <!-- loading -->
        <loadIng v-if="!loading"></loadIng>
        <div class="titlebar clear">
            <div class="container">
                <h1 v-if="searchCnt.type=='_s'">"{{searchCnt.text}}"的搜索结果</h1>
                <h1 v-else>{{searchCnt.type=='Category'?'分类':searchCnt.type}}：{{searchCnt.text}}</h1>
                <p class="breadcrumbs">
                    <router-link :to="{path: '/'}">首页</router-link>
                    <span>&gt;</span>
                    <strong v-if="searchCnt.type=='_s'">"{{searchCnt.text}}"的搜索结果</strong>
                    <strong v-else>{{searchCnt.text}}</strong>
                </p>
            </div>
        </div>
        <!-- main -->
        <div id="search_main">
            <div class="container">
                <div class="content">
                    <leftBox v-on:searchCnt="searchList" v-on:imgLoadStatus="loadingStatus" :searchData="searchData" :resizeTime="resizeTime"></leftBox>
                    <rightBox v-on:searchCnt="searchList" v-on:articleInfo="articleDetail"></rightBox>
                </div>
            </div>
        </div>
        <!-- footer -->
        <blogFooter v-on:searchCnt="searchList" v-on:articleInfo="articleDetail" :elseClass="elseClass"></blogFooter>
    </div>
</template>

<script>
"use strict";
import loadIng      from './layout/loadIng.vue'
import blogHeader   from './layout/header.vue'
import blogFooter   from './layout/footer.vue'
import leftBox      from './layout/leftBox.vue'
import rightBox     from './layout/rightBox.vue'

export default {
    mounted() {
        for (var i in this.$route.query) {
            this.searchCnt = {type: i,text: this.$route.query[i]};
        }

        if (!this.searchCnt.type) 
            this.searchCnt = {type: "Category",text: "全部"};

        window.onresize = (e) => {
            this.resizeTime = e.timeStamp;
        }     
    },
    data() {
        return {
            loading: false,
        	elseClass: "search_detail",                             //其他样式 
            resizeTime: null,                                       //窗口改动时间
        	searchCnt: {                                            //搜索内容、类别      
                type: "",
                text: ""
            },
            searchData: {}                                          //搜索触发对象                                          
        }
    },
    methods: {
        //侦听搜索内容
        searchList(text) {
            if (text.text != this.$route.query.Category) {
                var data = {};

                data[text.type] = text.text;
                this.searchCnt = text;
                this.$router.push({ query: data} );

                this.searchData = {
                    date: Date.parse(new Date()),
                    content:  text.text
                };
            }
        },
        //跳转详情页
        articleDetail(text) {
            this.$router.push( {path: '/articleDetail', query: {articleId: text._id, title: text.title}} );
            setTimeout(function() {
                location.reload();
            },100)
        },
        //加载过渡
        loadingStatus(status) {
            this.loading = status;
        }
    },
    components: {
        loadIng,
        blogHeader,
        blogFooter,
        leftBox,
        rightBox
    }
}
</script>

<style lang="scss" scoped>
	#search {
		.titlebar {
			min-height: 60px;
            margin-bottom: 60px;
			padding: 25px 0 !important;
			background-color: #fbfbfb; 
			h1 {
				float: left;
				font-size: 24px;
	    		font-weight: normal;
			}
		}

		.breadcrumbs {
			float: right;
			a,strong {
				color: #8d8d8d!important;
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