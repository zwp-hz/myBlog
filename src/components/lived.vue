<template>
    <div id="lived">
        <blogHeader v-on:searchCnt="searchList"></blogHeader>
        <div class="wrap">
            <div class="content">
                <div class="row">
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/arch" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/animals" alt=""></span>
                        <span class="layer three">One</span>
                        <img src="https://placeimg.com/256/256/tech" alt="">
                    </a>
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer three">Two</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer three">Two</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer three">Two</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                </div>
                <div class="row">
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer three">Six</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/arch" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/animals" alt=""></span>
                        <span class="layer three">Seven</span>
                        <img src="https://placeimg.com/256/256/tech" alt="">
                    </a>
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer three">Eight</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                </div>
                <div class="row">
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer three">Eleven</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer three">Twelve</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                </div>
                 <div class="row">
                    <a class="set" href="#">
                        <span class="layer one"><img src="https://placeimg.com/256/256/animal" alt=""></span>
                        <span class="layer two"><img src="https://placeimg.com/256/256/tech" alt=""></span>
                        <span class="layer three">Eleven</span>
                        <img src="https://placeimg.com/256/256/arch" alt="">
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
"use strict";
import blogHeader   from './layout/header.vue'

export default {
    mounted() {
        let that = this;
    },
    data() {
        return {
            
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
        blogHeader
    }
}

</script>

<style lang="scss" scoped>
    @import "../style/lived";
</style>