<template>
    <div id="author">
    	<blogHeader :headerStatus="headerStatus"></blogHeader>
        <div style="height:1500px;" data-0="background-color:rgb(0,0,255);transform:rotate(0deg);" data-500="background-color:rgb(255,0,0);transform:rotate(360deg);">WOOOT</div>
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
            forceHeight: false
        })
    },
    data () {
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
        height: 1500px;
    }
</style>