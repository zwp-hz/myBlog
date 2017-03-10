<template>
  	<div class="footer">
        <div class="container">
            <div class="about_me col-sm-12 col-md-4">
                <img src="../../images/logo_white.png" alt="" />
                <p>思想（且不论好坏与否）——行为——习惯，这就是人生的规律。 —— 特赖因
科学家不是依赖于个人的思想，而是综合了几千人的智慧，所有的人想一个问题，并且每人做它的部分工作，添加到正建立起来的伟大知识大厦之中。 —— 卢瑟福</p>
            </div>
            <div class="recent_posts col-sm-12 col-md-4">
                <h3>最新动态</h3>
                <div class="article clear" v-for="list in articleList">
                    <router-link class="images fl" :to="{}">
                        <img :src="list.images_src[0]" alt="" />
                        <span>{{list.review}}</span>
                        <b class="backImg u_show"><i class="glyphicon glyphicon-link"></i></b>
                    </router-link>
                    <div class="rl">
                        <div class="classify">
                            <span v-for="(classify,index) in list.classify">
                                {{index > 0 ? '，':''}}
                                <router-link class="u_a_gray" :to="{}" >
                                    {{classify}}
                                </router-link>
                            </span>
                        </div>
                        <router-link class="title u_a_blue" :to="{}">{{list.title}}</router-link>
                    </div>
                </div>
            </div>
            <div class="tags col-sm-12 col-md-4">
                <h3>tags</h3>
                <router-link class="fl u_a_btn" v-for="tag in tags" :to="{}">
                    {{tag}}
                </router-link>
            </div>
        </div>
  	</div>
</template>

<script>
"use strict";
export default {
    data () {
        return {
        	articleList: [],
            tags: ["node"," webpack","vue2"]
        }
    },
    created(){
        let imgHost = this.$store.state.imgHost,
            articleList = [
                {
                    title: "node webpack vue2",
                    describe: "Quisque dictum eros nisl, a maximus massa accumsan non. Aliquam erat volutpat. Quisque at finibus dui. Praesent…",
                    time: 1488556800,
                    classify: ["JavaScript","Node","vue2"],
                    images_src: ["timg1.jpg"],
                    browsing: 1000,
                    review: 5
                },
                {
                    title: "node webpack vue2",
                    describe: "Quisque dictum eros nisl, a maximus massa accumsan non. Aliquam erat volutpat. Quisque at finibus dui. Praesent…",
                    time: 1488556800,
                    classify: ["JavaScript","Node","vue2"],
                    images_src: ["img3.jpg","img4.jpg","img5.jpg"],
                    browsing: 3000,
                    review: 10
                },
                {
                    title: "node webpack vue2",
                    describe: "Quisque dictum eros nisl, a maximus massa accumsan non. Aliquam erat volutpat. Quisque at finibus dui. Praesent…",
                    time: 1488556800,
                    classify: ["JavaScript","Node","vue2"],
                    images_src: ["timg2.jpg"],
                    browsing: 5000,
                    review: 20
                }
            ]

        for (var i of articleList) {
            i.images_src.forEach( ( item, j ) => {
                i.images_src[j] = imgHost + item + "?imageView2/1/w/150/h/150/interlace1/q/90";
            });
        }

        this.articleList = articleList;
    },
    methods: {
        searchStart() {
            console.log(this.searchCnt)
        }
    }
}

</script>

<style lang="scss" scoped>
	@import "../../style/footer";
</style>