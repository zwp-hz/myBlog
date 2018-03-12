<template>
    <div id="prod">
    	<header>
    		<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3640597061,995535649&fm=27&gp=0.jpg" alt="" />
    		<p><strong>现货</strong><span>1/1</span></p>
    	</header>
    	<div class="main">
    		<div class="header">
    			<h2>{{data.title}}</h2>
    			<h3><span>¥</span>{{data.price}}</h3>
    			<p>货号：{{data.goodson}}|品牌：{{data.brand}}</p>
    		</div>
    		<div class="info">
    			<strong>商品信息</strong>
    			<p><span>颜色</span><b v-for="(item,index) in data.goods"><i v-if="index != 0">，</i>{{item.color}}</b></p>
    			<p><span>尺码</span><b v-for="(item,index) in data.goods[0].detail"><i v-if="index != 0">，</i>{{item.size}}</b></p>
    		</div>
    		<footer @click="popupStatus = true">立即购买</footer>
    		<div class="popup" :class="{active: popupStatus}">
    			<div class="mask" @click="popupStatus = false"></div>
    			<div class="popupCnt">
    				<h3>单价：{{data.price}}/件</h3>
    				<div class="title">
    					<span>尺码</span>
    					<span v-for="item in data.goods[0].detail">{{item.size}}</span>
    					<span>小记</span>
    				</div>
    				<p v-for="(item,index) in data.goods"><span>
    					{{item.color}}</span>
    					<input :focusStatus="size.status" @input="sizeInput(index);" v-model="size.value" v-for="size in item.detail" type="number" name="" />
    					<strong>{{Number(data.price)*(item.color_sum||0)}}</strong>
    				</p>
    				<div class="massage" v-if="massage">{{massage}}</div>
    				<div class="footer">
    					合计：{{data.sum}}件
    					<strong>总价：<span>¥{{(Number(data.price)*(data.sum||0)).toFixed(2)}}</span></strong>
    					<a :class="{active: submitStatus}" @click="submit()" href="javaScript:void(0);">立即下单</a>
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>

<script>
"use strict";

export default {
    mounted() {
    	this.data.sum = 0;

        for (let i of this.data.goods) {
        		i.color_sum = 0;
        	for (let x of i.detail) {
        		x.value = 0;
        		x.status = false;
        	}
        }
    },
    data() {
        return {
        	submitStatus: false,
        	massage: "",
        	popupStatus: false,
        	data:{
				"title" : "美丽的连衣裙",
				"price" : "100",
				"goodsno" : "test002",
				"brand" : "海贝",
				"sum": 0,
				"goods" : [
					{
						"color" : "灰色",
						"color_sum": 0,
						"detail" : [
							{
								"size" : "M",
								"stock" : "99",
								"value": 0
							},
							{
								"size" : "L",
								"stock" : "199",
								"value": 0
							},
							{
								"size" : "S",
								"stock" : "299",
								"value": 0
							}
						]
					},
					{
						"color" : "红色",
						"color_sum": 0,
						"detail" : [
							{
								"size" : "M",
								"stock" : "991",
								"value": 0
							},
							{
								"size" : "L",
								"stock" : "1991",
								"value": 0
							},
							{
								"size" : "S",
								"stock" : "2991",
								"value": 0
							}
						]
					},
					{
						"color" : "黄色",
						"color_sum": 0,
						"detail" : [
							{
								"size" : "M",
								"stock" : "929",
								"value": 0
							},
							{
								"size" : "L",
								"stock" : "1919",
								"value": 0
							},
							{
								"size" : "S",
								"stock" : "2939",
								"value": 0
							}
						]
					}
				]
			}
        }
    },
    methods: {
    	sizeInput: function(index) {
    		let color_sum = 0,sum = 0;

    		// 清空提示
    		this.massage = '';
    		// 获取每个颜色的总件数
			for (let x of this.data.goods[index].detail) {
				color_sum += Number(x.value);
			}

			//获取全部件数
			for (let i of this.data.goods) {
				for (let x of i.detail) {
					sum += Number(x.value);
				}
			}

			if (sum > 0) this.submitStatus = true;

    		this.data.goods[index].color_sum = color_sum;
    		this.data.sum = sum;
    	},
    	submit: function() {
    		if(this.submitStatus) {
    			for (let i of this.data.goods) {
    				let color = i.color;
    				for (let x of i.detail) {
    					if (Number(x.value) > Number(x.stock)) {
    						this.massage = '颜色' + color + '尺码' + x.size + '的' + '只剩下' + x.stock + '件';
    						x.status = true;
    						this.$nextTick( () => {
		                        document.querySelectorAll('[focusStatus]')[0].focus();
							})
    						return
    					}
    				}
    			}

    			alert('下单成功');

    		}else {
    			return false;
    		}
    	}
    }
}

</script>

<style lang="scss" scoped>
    #prod {
        width: 100%;
        min-height: 100vh;
        display: flex;
	    display: -webkit-flex;
	    flex-direction: column;
	    flex: 1;
	    align-items: center;
        header {
        	position: relative;
        	height: 30vh;
        	width: 100%;
        	img {
	        	height: 100%;
	        	width: 100%;
	        }
	        p {
	        	position: absolute;
	        	bottom: 10px;
	        	width: 100%;
	        	padding: 0 20px;
	        	color: #fff;

	        	strong {
	        		float: left;
	        		height: 20px;
	        		line-height: 20px;
	        		padding: 0 5px;
	        		background-color: rgba(0,0,0,.5);
	        		border-radius: 10px;
	        	}
	        	span {
	        		float: right;
	        		height: 20px;
	        		line-height: 20px;
	        		padding: 0 5px;
	        		background-color: rgba(0,0,0,.5);
	        		border-radius: 10px;
	        	}
	        }
        }
        .main {
        	width: 100%;
        	flex: 1;
        	background-color: #fff;
        	.header {
        		padding: 5px 0 10px 0;
        		margin-bottom: 10px;
        		text-align: center;
        		color: #ccc;
        		font-size: 12px;
        		border-bottom: 10px solid #eeebeb;
        		h2 {
        			font-size: 14px;
        			font-weight: normal;
        		}
        		h3 {
        			padding: 10px 0;
        			font-size: 20px;
        			font-weight: normal;
        			color: red;
        			span {
        				font-size: 12px;
        			}
        		}
        	}
        	.info {
        		width: 100%;
        		strong {
        			display: block;
        			width: 40%;
        			margin: 0 auto;
        			padding: 3px 0;
        			text-align: center;
        			background-color: #eeebeb;
        			border-radius: 10px;
        		}
        		p {
        			height: 40px;
        			line-height: 40px;
        			margin: 0 10px;
        			border-bottom: 1px solid #eeebeb;
        			span {
        				padding-right: 20px;
        				color: #ccc;
        			}
        		}
        	}
        	footer {
        		position: fixed;
        		bottom: 0;
        		width: 100%;
        		text-align: center;
        		height: 40px;
        		line-height: 40px;
        		background-color: red;
        		color: #fff;
        	}
        	.popup {
        		display: none;
        		position: fixed;
        		top: 0;
        		right: 0;
        		bottom: 0;
        		left: 0;
        		z-index: 100;
        		height: 100vh;
        		width: 100vw;
        		&.active {
        			display: block;
        		}
        		.mask {
        			position: absolute;
        			top: 0;
	        		right: 0;
	        		bottom: 0;
	        		left: 0;
        			height: 100vh;
        			width: 100vw;
        			background-color: rgba(0,0,0,.5);
        		}
        		.popupCnt {
        			position: absolute;
        			bottom: 0;
        			left: 0;
        			width: 100%;
        			color: #ccc;
        			background-color: #fff;
        			h3 {
        				padding: 5px 10px 5px 0;
        				font-weight: normal;
        				color: red;
        				text-align: right;
        				font-size: 16px;
        			}
        			.title {
        				display: flex;
        				height: 30px;
        				line-height: 30px;
        				color: #fff;
        				background-color: #ccc;
        				span {
        					flex: 1;
        					text-align: center;
        				}
        			}
        			p {
        				display: flex;
        				padding-top: 10px;
        				input, span, strong {
        					display: inline-block;
        					width: 20%;
        					text-align: center;
        				}
        				input {
        					margin: 0 5px;
        					border-bottom: 1px solid #ccc;
        				}
        			}
        			.massage {
        				padding: 10px 0 0 10px;
        				color: red;
        			}
        		}
        		.footer {
        			display: flex;
        			padding-left: 10px;
        			margin-top: 30px;
        			height: 30px;
        			line-height: 30px;
        			color: #fff;
        			background-color: #ccc;
        			strong {
        				flex: 1;
        				padding-right: 10px;
        				text-align: right;
        				span {
        					color: red;
        				}
        			}
        			a {
        				height: 30px;
        				padding: 0 15px;
        				line-height: 30px;
        				background-color: #999;
        				color: #fff;
        				&.active {
        					background-color: red;
        				}
        			}
        		}
        	}
        }
    }
</style>