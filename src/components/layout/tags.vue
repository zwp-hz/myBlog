<template>
    <div class="tags col-xs-12">
        <h3>tags</h3>
        <router-link class="fl u_transition u_hover_blue_bg" v-for="item in tags" :to="{}">
            {{item.name}}
        </router-link>
    </div>
</template>

<script>
"use strict";
export default {
    mounted() {
        let apiHost = this.$store.state.APIHOST,
            that = this;

        //获取标签列表
        that.$http.jsonp(apiHost + 'api/getTagsList').then((res) => {
            if (res.body.code == 0) {
                that.tags = res.body.data;
            }
        });
    },
    data() {
        return {
        	tags: []
        }
    }
}

</script>

<style lang="scss" scoped>
    .tags {
        a {
            display: block;
            padding: 0 12px;
            margin: 0 10px 12px 0;
            border-radius: 5px;
            line-height: 32px;
            color: #fff;
            background-color: #3a3a3a;
        }
    }
</style>