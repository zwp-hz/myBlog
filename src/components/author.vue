<template>
    <div id="author">
    	<blogHeader :headerStatus="headerStatus"></blogHeader>
        <!-- <div style="height:1500px;" data-0="background-color:rgb(0,0,255);transform:rotate(0deg);" data-end="background-color:rgb(255,0,0);transform:rotate(360deg);"></div> -->
        <div class="img" data-0="left[pathx]:0%;top[pathy]:0%;transform:rotate(-120deg) scale(0.5);" data-666="left[pathx]:33%;top[pathy]:33%;transform:rotate(-140deg) scale(0.6);" data-1600="left[pathx]:70%;top[pathy]:70%;transform:rotate(-480deg) scale(0.8);" data-2000="left[pathx]:95%;top[pathy]:98%;transform:rotate(-480deg) scale(1);">
        </div>
        
    </div>
</template>

<script>
"use strict";
import blogHeader   from './layout/header.vue'

export default {
    mounted() {
        let that = this;
        
        window.onscroll = window.onload = () => {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            that.headerStatus = scrollTop > 0 ? true : false;
        }

        skrollr.init({
            forceHeight: false,
            easing: {
                pathy: function(p) {
                    // return (Math.sin(p * Math.PI * 2 - Math.PI/2) + 1) / 2;
                    return p;
                },
                pathx: function(p) {
                    return p;
                    // return (Math.cos(p * Math.PI * 2 - Math.PI/2) + 1) / 2;
                },
            }
        })
    },
    data() {
        return {
        	headerStatus: false
        }
    },
    components: {
        blogHeader
    }
}

</script>

<style lang="scss" scoped>
    #author {
        position: relative;
        height: 3000px;
        overflow: hidden;
        background-color: #3498db;
        .img {
            position: absolute;
            width: 100px;
            height: 150px;
            background: url("../images/icon_author.png") no-repeat;
            background-size: 100% auto;
        }
    }
</style>