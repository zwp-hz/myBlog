<template>
  	<div id="weather">
        <section class="g-c-center" v-if="sunlightStatus">
            <i
                v-if="sunlightStatus == 1"
                :class="'iconfont icon-' + weatherInfo.forecast[0].weather[0].day[0].type_py.pinyin">
            </i>
            <i v-else :class="'iconfont icon-night-' + weatherInfo.forecast[0].weather[0].night[0].type_py.pinyin"></i>
            <p class="cityName">{{weatherInfo.city[0]}}</p>
            <div class="info g-r-center">
                <p>
                    <span>{{weatherInfo.city[0]}}</span>
                    <b v-if="sunlightStatus == 1">{{weatherInfo.forecast[0].weather[0].day[0].type[0]}}</b>
                    <b v-else>{{weatherInfo.forecast[0].weather[0].night[0].type[0]}}</b>
                </p>
                <strong>{{weatherInfo.wendu[0]}}ﾟ</strong>
            </div>
        </section>
  	</div>
</template>

<script>
    "use strict";

    export default {
        data() {
            return {
                sunlightStatus: null
            }
        },
        mounted() {
            let {
                APIHOST
            } = this.$store.state;

            //获取天气信息
            this.$http.jsonp(APIHOST + 'api/getWeather').then((res) => {
                if (res.body.code === 0) {
                    this.weatherInfo = res.body.data;
                    this.sunlightStatus = this.getSunlightStatus(res.body.data);
                }
            })
        },
        methods: {
            /** 区分白天的晚上
             * @param {info}    天气信息。
             * @return   1: 白天   2: 晚上
            */
            getSunlightStatus(info) {
                let date = new Date(info.time), //系统时间
                    cur_hh = date.getHours(), //当前时
                    cur_mm = date.getMinutes(), //当前分
                    sunrise_hh = Number(info.sunrise_1[0].substring(0, 2)), //日出时
                    sunrise_mm = Number(info.sunrise_1[0].substring(3, 5)), //日出分
                    sunset_hh = Number(info.sunset_1[0].substring(0, 2)), //日落时
                    sunset_mm = Number(info.sunset_1[0].substring(3, 5)); //日落分

                if ((cur_hh > sunrise_hh && cur_hh < sunset_hh) ||
                    (cur_hh == sunrise_hh && cur_mm >= sunrise_mm) ||
                    (cur_hh == sunset_hh && cur_mm < sunset_mm)) {
                    return 1;
                } else {
                    return 2;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #weather {
        height: 150px;
        width: 100%;
        margin-bottom: 10px;
        .iconfont {
            display: block;
            font-size: 60px;
            &:before {
                content: "\e61c";
            }
        }
        .cityName {
            display: none;
            font-size: 16px;
        }
        .info {
            flex: none;
            p {
                padding: 0 10px;
                text-align: center;
            }
            span {
                font-size: 25px;
            }
            b {
                display: block;
                color: #333;
                font-size: 12px;
            }
            strong {
                font-size: 35px;
            }
        }
    }

    @media (max-width: 375px) {
        #weather {
            .iconfont {
                font-size: 40px;
            }
            .info {
                p {
                    padding: 0 10px;
                }
                span {
                    display: none;
                }
                strong {
                    font-size: 25px !important;
                }
            }
        }
    }

    @media (max-width: 635px) {
        #weather {
            .iconfont {
                font-size: 50px;
            }
            .info {
                span {
                    display: none;
                }
            }
            .cityName {
                display: block;
            }
        }
    }
</style>
