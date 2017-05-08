<template>
    <div v-if="pageNum != 0" class="pagination g-c-center">
        <ul class="page-numbers g-c-center">
 			<li v-for="(item,index) in pageNum">
 				<span v-if="index + 1 == page" class="page-numbers current">{{index+1}}</span>
 				<a  v-else class="page-numbers u_transition u_hover_blue" href="javaScript:void(0);">{{index+1}}</a>
 			</li>
            <li v-if="pageNum > page"><a class="next page-numbers u_transition u_hover_blue" href="javaScript:void(0);">Next</a></li>
        </ul>
    </div>
</template>

<script>
"use strict";
export default {
	props: ["page","pageNum"],
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
    .pagination {
        width: 100%;
        ul {
            display: -webkit-box;
            margin: 0 auto;
            list-style: none;
            background-color: #f4f4f4;
            padding: 5px 4px;
            border-radius: 30px;
            border-width: 0px;
            li {
                margin: 0 2px;
                span,a {
                    display: block;
                    height: 40px;
                    width: 40px;
                    text-align: center;
                    line-height: 40px;
                    color: #8d8d8d;
                    cursor: pointer;
                }
                span {
                    background-color: #47c9e5;
                    border-radius: 30px;
                    color: #fff;
                }
            }
        }
    }
</style>