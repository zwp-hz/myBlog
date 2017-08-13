<template>
  	<div ref="rightBox" id="rightBox" class="col-lg-3 col-md-4 col-sm-12">
        <!-- 天气 -->
        <div class="weather">
            <section class="g-c-center" v-if="sunlightStatus">
                <i v-if="sunlightStatus == 1" :class="'iconfont icon-' + weatherInfo.forecast[0].weather[0].day[0].type_py.pinyin"></i>
                <i v-else :class="'iconfont icon-night-' + weatherInfo.forecast[0].weather[0].night[0].type_py.pinyin"></i>
                <div class="info g-r-center">
                    <p>
                        <span>{{ weatherInfo.city[0] }}</span>
                        <b v-if="sunlightStatus == 2">{{weatherInfo.forecast[0].weather[0].day[0].type[0]}}</b>
                        <b v-else>{{ weatherInfo.forecast[0].weather[0].night[0].type[0]}}</b>
                    </p>
                    <strong>{{ weatherInfo.wendu[0] }}ﾟ</strong>
                </div>
            </section>
        </div>
        <div class="box clear">
            <hotArticle v-on:searchCnt="searchList" v-on:articleInfo="articleDeatil"></hotArticle>
            <div class="searchBox col-xs-12 g-r-center">
                <input @keyup.enter="search" v-model="searchCnt" type="search" placeholder="搜点什么吧" name="" />
                <a @click="search" href="javaScript:void(0);"><i class="iconfont icon-search"></i></a>
            </div>
            <tags v-on:searchCnt="searchList"></tags>
        </div>
  	</div>
</template>

<script>
"use strict";
import hotArticle   from './hotArticle.vue'
import tags         from './tags.vue'

export default {
    mounted() {
        let imgHost = this.$store.state.IMGHOST,
            apiHost = this.$store.state.APIHOST;

        //获取天气信息
        this.$http.jsonp(apiHost + 'api/getWeather').then((res) => {
            if (res.body.code === 0) {
                this.weatherInfo = res.body.data;
                this.sunlightStatus = this.getSunlightStatus(res.body.data);
            }
        })
    },
    data() {
        return {
            weatherInfo: {},                                                //天信息
            sunlightStatus: null,                                           //日出落状态
            searchCnt: ""                                                   //搜索内容
        }
    },
    methods: {
        search() {
            this.$emit('searchCnt', {type: "_s", text: this.searchCnt});
        },
        /* 获取日出落状态
            params:   info: 天气信息。    
            return:   1: 日出。   2: 日落。
        */
        getSunlightStatus(info) {
            let date = new Date(info.time),                                 //系统时间
                cur_hh = date.getHours(),                                   //当前时
                cur_mm = date.getMinutes(),                                 //当前分
                sunrise_hh = Number(info.sunrise_1[0].substring(0,2)),      //日出时
                sunset_hh = Number(info.sunset_1[0].substring(0,2)),        //日落时
                sunrise_mm = Number(info.sunrise_1[0].substring(3,5)),      //日出分
                sunset_mm = Number(info.sunset_1[0].substring(3,5));        //日落分

            if ( (cur_hh > sunrise_hh && cur_hh < sunset_hh) || (cur_hh == sunrise_hh && cur_mm >= sunrise_mm) || (cur_hh == sunset_hh && cur_mm < sunset_mm) ) {
                return 1;
            } else {
                return 2;
            }
        },
        searchList(text) {
            this.$emit('searchCnt', text);
        },
        articleDeatil(text) {
            this.$emit('articleInfo',text);
        }
    },
    components: {
        hotArticle,
        tags
    }
}
</script>

<style type="scss">
    .box .article{
        color: #fff;
        border-bottom: 1px solid #ccc !important;
    }
</style>

<style lang="scss" scoped>
    #rightBox {
        float: right;
        position: relative;
        display: block;
        margin-bottom: 20px;
        .weather {
            height: 150px;
            width: 100%;
            margin-bottom: 10px;
            .iconfont {
                display: block;
                font-size: 60px;
            }
            .info {
                flex: none;
                p {
                    padding: 0 20px;
                }
                span {
                    font-size: 25px;
                }
                b {
                    display: block;
                    color: #666;
                    font-size: 12px;
                }
                strong {
                    font-size: 35px;
                }
            }
        }

        .box {
            padding-top: 10px;
            border-radius: 10px;
            background-color: rgba(0,0,0,.3);
        }

        .searchBox {
            margin-bottom: 25px;
            input {
                position: relative;
                flex: 1;
                line-height: 20px;
                padding: 10px 0 10px 10px;
                background-color: #fff;
                border-radius: 10px 0 0 10px;
            }
            a {
                display: block;
                width: 40px;
                height: 40px;
                padding-top: 10px;
                text-align: center;
                background-color: #f0f0f0;
                color: #505050!important;
                border-radius: 0 10px 10px 0;
            }
        }
    }
</style>