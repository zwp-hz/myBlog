<template>
    <div class="error404">
    	<div class="main">
    		<img class="img_404" :src="img_404_url" alt="" />
    		<p>很抱歉，您访问的页面不在地球上...</p>
    		<div class="buttonBox">
    			<router-link href="javaScript:void(0);" class="back_index" :to="{path: '/'}">返回首页</router-link>
    			<a href="javaScript:void(0);" class="back_next" @click="$router.go(-1);" >返回上一页</a>
    		</div>
    	</div>
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
        	img_404_url: this.$store.state.IMGHOST + 'error_404.png?imageView2/2/w/' + parseInt(document.documentElement.clientWidth*0.35) + '/interlace/1&v=1'
        }
    }
}

</script>

<style lang="scss" scoped>
	.error404 {
		width: 100vw;
		height: 100vh;
		background-color: #f6f6f6;
		.img_404 {
			display: block;
			width: 35%;
			margin: 0 auto;
			padding-top: 10%;
		}
		p {
			padding-top: 30px;
			font-size: 30px;
			text-align: center;
		}
		.buttonBox {
			text-align: center;
			a {
				display: inline-block;
				height: 40px;
				margin: 30px 15px 0;
				padding: 0 30px;
				line-height: 40px;
				color: #fff;
				background-color: #c80f05;
				border-radius: 5px;
			}
		}
	}
</style>