<template>
  	<div ref="rightBox" id="rightBox" class="col-lg-3 col-md-4 col-sm-12">
        <div class="weather">
            <img ondragstart="return false;" src="../../images/weather_bg.png" alt="" />
            <img ondragstart="return false;" class="weatherIcon" v-if="key == 0 ? getDayStatus(weatherInfo.time) : !getDayStatus(weatherInfo.time) " v-for="(item,key) in weatherInfo.type" :src="'../dist/images/'+(key==0 ? item.pinyin : 'night_' + item.pinyin)+'.png'" />
            <strong class="g-r-center">{{ weatherInfo.time | dateFormat('hh:mm') }}</strong>
            <div class="elseInfo g-c-center">
                <span>{{ weatherInfo.city + " " + weatherInfo.wendu }}℃</span>
                <span v-if="key == 0 ? getDayStatus(weatherInfo.time) : !getDayStatus(weatherInfo.time) " v-for="(item,key) in weatherInfo.type">{{ item.name }}</span>
            </div>
            <p class="g-r-center date">
                <span>{{ weatherInfo.time | dateFormat('MM') }}</span>
                <span>{{ weatherInfo.time | dateFormat('DD') }}</span>
                <span>{{ weatherInfo.time | dateFormat('W') }}</span>
            </p>
        </div>
        <div class="box clear">
            <hotArticle v-on:searchCnt="searchList" v-on:articleInfo="articleDeatil"></hotArticle>
            <div class="searchBox col-xs-12 g-r-center">
                <input @keyup.enter="search" v-model="searchCnt" type="search" placeholder="搜点什么吧" name="" />
                <a @click="search" href="javaScript:void(0);" class="glyphicon glyphicon-search"></a>
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
    props: ["rightBoxStatus","scrollTop"],
    mounted() {
        let that = this,
            apiHost = this.$store.state.APIHOST;

        //获取天气信息
        that.$http.jsonp(apiHost + 'api/getWeather').then((res) => {
            if (res.body.code === 0) {
                that.weatherInfo = res.body.data;

                setInterval(() => {
                    that.weatherInfo.time = that.weatherInfo.time + 1000;
                },1000)
            }
        })
    },
    data() {
        return {
            weatherInfo: {
                type: []
            },
            searchCnt: ""
        }
    },
    methods: {
        search() {
            this.$emit('searchCnt', {type: "_s", text: this.searchCnt});
        },
        getDayStatus(time) {
            let date = new Date(time),
                cur_hh = date.getHours(),
                cur_mm = date.getMinutes(),
                sunrise_hh = Number(this.weatherInfo.sunrise_1.substring(0,2)),
                sunset_hh = Number(this.weatherInfo.sunset_1.substring(0,2)),
                sunrise_mm = Number(this.weatherInfo.sunrise_1.substring(3,5)),
                sunset_mm = Number(this.weatherInfo.sunset_1.substring(3,5)),
                status;

            if ( cur_hh > sunrise_hh && cur_hh < sunset_hh) {
                status = true;
            } else if (cur_hh < sunrise_hh && cur_hh > sunset_hh) {
                status = false;
            }

            return status;
        },
        searchList(text) {
            this.$emit('searchCnt', text);
        },
        articleDeatil(text) {
            this.$emit('articleInfo',text);
        }
    },
    watch: {
        scrollTop(val) {
            if (val > 445) {
                let clientHeight = document.documentElement.clientHeight,   //内容可视区域的高度
                    scrollHeight = document.documentElement.scrollHeight;   //滚动条高度

                if (!this.rightBoxStatus) 
                    this.$refs.rightBox.style.top = val - 420 + "px";
                else
                    this.$refs.rightBox.style.top = scrollHeight - clientHeight - 980 + "px";
            } else {
                this.$refs.rightBox.style.top = 0;
            }
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
            position: relative;
            margin-bottom: 20px;
            img {width: 100%;}
            .weatherIcon {
                position: absolute;
                top: 5%;
                left: 2.2%;
                z-index: 100;
                width: 21.45%;
            }
            .elseInfo {
                position: absolute;
                top: 37%;
                right: 0;
                width: 23%;
                height: 27.55%;
                color: #fff;
                font-size: 12px;
            }
            p.date {
                position: absolute;
                bottom: 20%;
                right: 2%;
                width: 25.33%;
                height: 13.38%;
                text-align: center;
                span {
                    flex: 1;
                }
            }
            strong {
                position: absolute;
                top: 37.79%;
                left: 26.43%;
                width: 46.25%;
                height: 37.79%;
                text-align: center;
                font-size: 30px;
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
                top: 1px;
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
                line-height: 40px;
                text-align: center;
                background-color: #f0f0f0;
                color: #505050!important;
                border-radius: 0 10px 10px 0;
            }
        }
    }
</style>