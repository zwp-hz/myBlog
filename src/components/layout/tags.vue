<template>
    <div class="tags clear">
        <h3>tags</h3>
        <a class="fl u_transition_300 u_button" v-for="item in tags" :key="item" @click="search({type: 'Tag', text: item.name})">
            {{item.name}}
        </a>
    </div>
</template>

<script>
"use strict";
export default {
    mounted() {
        if (!this.$store.state.tags) {
            //获取标签列表
            this.$http.jsonp(this.$store.state.APIHOST + 'api/getTagsList').then((res) => {
                if (res.body.code == 0) {
                    this.tags = res.body.data;
                    this.$store.commit('setFooterData', {type: 'tags',data: res.body.data});
                }
            });
        }
    },
    data() {
        return {
        	tags: this.$store.state.tags || []
        }
    },
    methods: {
        /** 标签搜索
          * @data   搜索参数
         */
        search(data) {
            this.$store.commit('searchChange', data);
            this.$router.push({path: '/searchResult', query: {Tag: data.text}});
        }
    }
}

</script>

<style lang="scss" scoped>
    .tags {
        h3 {
            margin-bottom: 15px;
            font-size: 20px;
            line-height: 30px;
            color: #e3e3e3;
        }
        .u_button {
            margin-bottom: 15px;
        }
    }
</style>