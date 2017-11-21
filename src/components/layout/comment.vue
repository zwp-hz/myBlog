<template>
  	<div id="comment">
        <div class="comment-form">
            <div class="comment-avatar">
                <div class="box">
                    <i class="iconfont icon-huifu" style="font-size: 30px;"></i>
                </div>
            </div>
            <form class="form" @submit.prevent="submit">
                <div class="form-row clear">
                    <textarea class="input" v-model="comment.content" placeholder="说点什么吧..." required></textarea>
                </div>
                <div class="form-row clear">
                    <input v-if="checkbox_status" class="input" v-model="comment.email" placeholder="邮箱" type="email" required/>
                    <input v-else class="input" disabled placeholder="邮箱" type="email" />
                </div>
                <div class="form-row text-right">
                    <label for="comment-anonymous">
                        <input id="comment-anonymous" type="checkbox" @click="checkbox_status = !checkbox_status" style="float: inherit;"  />
                        匿名发表
                    </label>
                </div>
                <div class="form-row clear">
                    <input type="submit" value="发表评论" />
                </div>
            </form>
        </div>
  	</div>
</template>

<script>
"use strict";

export default {
    mounted() {
        // 获取评论信息
        this.$http.jsonp(this.$store.state.APIHOST + 'api/getCommentList',{
            params: {
                article_id: this.$route.query.articleId
            }
        }).then((res) => {
            console.log(res);
        },(res) => console.log(res));
    },
    data () {
        return {
            comment: {},
            checkbox_status: true
        }
    },
    methods: {
        submit() {
            if (!this.checkbox_status) delete this.comment.email;

            // 添加评论
            this.$http.jsonp(this.$store.state.APIHOST + 'api/setComment',{
                params: Object.assign(this.comment,{
                    articleId: this.$route.query.articleId
                })
            }).then((res) => {
                if (res.body.code === 0) {
                    this.comment = {};
                }
            },(res) => console.log(res));
        }
   	}
}

</script>

<style lang="scss" scoped>
    @import "../../style/comment";
</style>