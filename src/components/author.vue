<template>
    <div id="author">
        <headerBox :headerData="headerData"></headerBox>
        <svg id="svg" width="100%" height="100%">
            <path data-300="stroke-dashoffset:580;" data-2052="stroke-dashoffset:0;" d="M153 334
            C153 334 151 334 151 334
            C151 339 153 344 156 344
            C164 344 171 339 171 334
            C171 322 164 314 156 314
            C142 314 131 322 131 334
            C131 350 142 364 156 364
            C175 364 191 350 191 334
            C191 311 175 294 156 294
            C131 294 111 311 111 334
            C111 361 131 384 156 384
            C186 384 211 361 211 334
            C211 300 186 274 156 274"
            style="fill:none;stroke:red;stroke-width:2;stroke-dasharray:580px; stroke-dashoffset:0;"/>
            <path data-0="stroke-dashoffset:200;" data-300="stroke-dashoffset:0;" d="M20,20 C90,40 130,100 180,20" stroke="#000000" fill="none" style="stroke-width: 2px;stroke-dasharray:200px; stroke-dashoffset:0;"></path>
        </svg>
    </div>
</template>

<script>
"use strict";
import headerBox  from './layout/header.vue'

export default {
    mounted() {
        let that = this;
    },
    data() {
        return {
            headerData: {
                searchStatus: false,
                isStatic: true,
                type: "author"
            }
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
        headerBox
    }
}

</script>

<style lang="scss" scoped>
    #author {
        position: relative;
        height: 3000px;
        overflow: hidden;
        background-color: #3498db;
        svg{
            position: fixed;
            top: 100px;
        }
    }
</style>