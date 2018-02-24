<template>
    <div id="index" :style="'background: #fff url('+bg_image_src+') no-repeat center bottom fixed;'">
        <loading :loadStatus="loadStatus"></loading>
        <headerBox :headerData="headerData"></headerBox>
        <section id="intro" class="g-r-center" data-0="opacity: 1" data-50p="opacity: 0;">
            <i class="iconfont icon-codestore"></i>
            <h1>Welcome to visit My Blog</h1>
        </section>
        <section id="indexMain">
            <div class="u_arrow" data-0="opacity: block;" data-30p="display: none;"></div>
            <div class="box box1 g-r-center">
                <div class="weather_box">
                    <Weather data-0="left: -150px; opacity: -1;" data-60p="left: 0; opacity: 1;"></Weather>
                </div>
                <div v-if="biying_images.url" class="wallpaper" :style="'background: url(http://www.bing.com/'+biying_images.url+') #000 no-repeat center bottom'">
                    <p class="g-c-center">
                        <strong>必应每日壁纸欣赏</strong>
                        <span>{{biying_images.copyright}}</span>
                    </p>
                </div>
            </div>
        </section>
        <footerBox></footerBox>
    </div>
</template>

<script>
"use strict";
import loading      from './layout/loading.vue'
import headerBox    from './layout/header.vue'
import footerBox    from './layout/footer.vue'
import Weather      from './layout/weather.vue'

export default {
    mounted() {
    	let { APIHOST } = this.$store.state,
            img = new Image();

        // 判断背景图片是否加载完成
        img.src = this.bg_image_src;
        img.onload = img.onerror = () => this.loadStatus = true;

    	// 获取必应图片
        this.$http.jsonp(APIHOST + 'api/bing').then((res) => {
            if (res.body.code === 0) {
                this.biying_images = res.body.data.images[0];
            }
        },(res) => console.log(res));
    },
    data() {
        return {
            loadStatus: false,              // 加载状态。false：加载中。true：加载完成。
            bg_image_src: this.$store.state.IMGHOST + 'blog_index_bg.jpg?imageView2/2/interlace/1',
            headerData: {                   // 头部出参数
                searchStatus: false,
                isStatic: false,
            },
            biying_images: {}
        }
    },
    methods: {
        searchList(text) {
            let data = {};

            data[text.type] = text.text;
            this.$router.push( {path: '/searchResult', query: data} );
        }
    },
    components: {
        loading,
        headerBox,
        footerBox,
        Weather
    }
}

</script>

<style lang="scss" scoped>
	@import "../style/index";
</style>