<template>
    <div id="photoList">
        <loading :loadStatus="loadStatus"></loading>
        <headerBox :headerData="headerData"></headerBox>
        <div class="main">
            <section class="container" v-for="(m,y_key) in imgList" :key="y_key">
                <h2>{{y_key.replace(/:/g,'')}}</h2>
                <div class="month_box" v-for="(d,m_key) in m" :key="m_key">
                    <h3>{{m_key.replace(/-/g,'')|number_to_chinese}}</h3>
                    <div class="day_box g-r-center" v-for="(list,d_key) in d" :key="d_key">
                        <span>{{d_key.replace(/:/g,'')}}<i></i></span>
                        <ul>
                           <li v-for="item in list" :key="item" @click="img_modal($event,item.src)">
                                <a href="javaScript:void(0);" data_type="img" :data-url="item.src" class="progressive--not-loaded">
                                    <img :style="'opacity:'+(item.status === 2 ? 0 : 1)" @load="item.status=1" @error="item.status=2" :src="item.src_small" alt="" />
                                    <i class="iconfont icon-codestore" :style="'display:'+(item.status === 2 ? 'block' : 'none')"></i>
                                    <span class="u_transition_300"><b class="iconfont icon-time"></b>{{y_key.replace(/:/g,'')+'-'+m_key+d_key.replace(/:/g,'')}}<br/><b class="iconfont icon-dingwei"></b>{{item.city}}<br/><b class="iconfont icon-biaoqian"></b>{{item.title}}</span>
                                </a>
                            </li>
                        </ul>
                    </div> 
                </div>
            </section>
        </div>
        <div id="modal" v-if="modal.status">
            <div class="mask" @click="img_modal('','','hide')"></div>
            <div class="centent" :class="{active: modal.move_status !== 0,textShow: modal.move_status === 2}" :style="modal.style">
                <div class="box"  v-html="modal.html"></div>
            </div>
            <div class="u_loading" v-if="modal.load_status"></div>
        </div>
    </div>
</template>

<script>
"use strict";
import loading      from './layout/loading.vue'
import headerBox   from './layout/header.vue'

let lazyloads = new lazyload(), timer;

export default {
    mounted() {
        let { APIHOST } = this.$store.state,
            prefix = this.$route.query.prefix;

        // 获取对应相册列表
        this.$http.jsonp(APIHOST + 'api/getQiniuList',{params: {
            prefix: prefix
        }}).then((res) => {
            if (res.body.code === 0) {
                this.qn_resource.list = res.body.data.items;
                this.laodImgs('first');

                document.addEventListener("scroll", this.seeScroll, false);
            }
        },(res) => console.log(res));
    },
    data() {
        return {
            loadStatus: false,              // 加载状态。false：加载中。true：加载完成。
            headerData: {                       // 头部配置
                searchStatus: false,
                isStatic: true,
                type: 'static'
            },
            qn_resource: {                      // 七牛资源
                list: [],
                number: 0
            },
            imgList: {},                        // 显示的图片列表
            modal: {                            // 弹出层样式、信息
                html: '',
                status: false,
                move_status: 0,
                load_status: false,
                style: {}
            },
            befoer_modal: {                     // 记录之前的弹出层样式
                top: '',
                height: ''
            }                        
        }
    },
    methods: {
        /** 图片弹出层
          * @event      元素属性
          * @src        图片地址
          * @type       显示隐藏状态。 默认：show。 可选 hide
         */
        img_modal(event,src,type) {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            if (type === 'hide') {
                this.modal.move_status = 0;
                this.modal.style.top = this.befoer_modal.top;
                this.modal.style.height = this.befoer_modal.height;

                setTimeout( () => {
                    document.body.style.overflow = 'auto';
                    this.modal.status = false;
                },500)
            } else {
                let obj = event.path ? event.path[0].tagName === 'A' ? event.path[0] : event.path[1] : event.target,
                    src_1080 = src.replace(/w\/(.*)/g,'w/1080'),
                    $img = new Image();

                document.body.style.overflow = 'hidden';

                // 设置modal 样式
                this.modal.status = true;
                this.befoer_modal = {
                    top: obj.offsetTop - scrollTop + 'px',
                    height: obj.clientHeight + 'px'
                };
                this.modal.style = {
                    width: obj.clientWidth + 'px',
                    height: obj.clientHeight + 'px',
                    top: obj.offsetTop - scrollTop  + 'px',
                    left: obj.offsetLeft + 'px'
                }

                // 根据图片尺寸获取弹出层的top值
                let clientWidth = document.documentElement.clientWidth,
                    clientHeight = document.documentElement.clientHeight,
                    ratio = clientWidth >= 1110 ? 0.4 : clientWidth <= 700 ? 0.8 : 0.5,
                    img_header = (clientWidth * ratio) / (obj.clientWidth / obj.clientHeight);

                setTimeout( () => {
                    this.modal.html = obj.innerHTML;
                    setTimeout( () => {
                        this.modal.move_status = 1;
                        this.modal.style.top = clientHeight - img_header <= 0 ? '1vh' : (clientHeight - img_header) / 2 + 'px';
                        this.modal.style.height = img_header + 'px';
                    },99)
                },1)
                
                // 加载1080p图片资源
                setTimeout( () => {
                    this.modal.move_status = 2;
                    this.modal.load_status = true;
                    $img.src = src_1080;
                    $img.onload = (e) => {
                        if (e.type === 'load') {
                            document.getElementById('modal').getElementsByTagName('img')[0].src = src_1080;
                            this.modal.load_status = false;
                        }
                    }
                },600);
            }
        },
        /** 滚动侦听 */
        seeScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop, // 滚动条距离顶部高度
                scrollHeight = document.documentElement.scrollHeight, // 内容高度
                seeHeight = document.documentElement.clientHeight; // 可见区域高度
            
            if ( scrollTop >= scrollHeight - seeHeight - 100 ) {
                clearTimeout(timer);
                timer = setTimeout( () => {
                    this.laodImgs();
                },50);
            }
        },
        /** 加载图片
          * @type           判断是否第一次加载
         */
        laodImgs(type) {
            // 初始化图片信息
            let { IMGHOST, qnConfig } = this.$store.state,
                { list, number } = this.qn_resource,
                n = document.documentElement.clientWidth > 900 ? 4 : 2,
                imgJson = {}, imgTime = '', imgNumbe = 0, timeNumber = 0;

            // 加载完成  中止运行
            if (list.slice(number).length <= 0) {
                document.removeEventListener("scroll", this.seeScroll, false);
            }

            for (let item of list.slice(number)) {
                let imgArray = item.img_name.match(/.*?(:|-|\.|，)/g),
                    timeString = imgArray[0] + imgArray[1] + imgArray[2],
                    clientWidth = document.documentElement.clientWidth,
                    imgWidth = parseInt((clientWidth > 767 ? clientWidth/3 : clientWidth/2)*0.8,10);

                // 记录数量
                timeNumber = timeString !== imgTime ? ++timeNumber : timeNumber;

                // 中断数据遍历
                if (type !== "first") {
                    if (timeNumber > 1 || imgNumbe >= n) {
                        break;
                    }
                } else if (imgNumbe >= 15 || timeNumber > 3) {
                    break;
                }

                // 数据分割
                imgArray.forEach( (val,index) => {
                    if (index === 0 && !imgJson[val]) {
                        imgJson[val] = {};
                    } else if (index === 1 && !imgJson[imgArray[0]][val]) {
                        imgJson[imgArray[0]][val] = {}
                    } else if (index === 2 && !imgJson[imgArray[0]][imgArray[1]][val]) {
                        imgJson[imgArray[0]][imgArray[1]][val] = [];
                    } else if(index === 3) {
                        imgJson[imgArray[0]][imgArray[1]][imgArray[2]].push({
                            key: [imgArray[0],imgArray[1],imgArray[2]],
                            city: imgArray[3].replace(/-/g,'') + ' ' + imgArray[4].replace(/，/g,''),
                            title: imgArray[5].replace(/\./g,''),
                            src: IMGHOST + item.key + qnConfig + imgWidth,
                            src_small: IMGHOST + item.key + qnConfig + 60,
                            status: 0
                        })
                    }
                });

                // 记录图片信息
                this.qn_resource.number++; imgNumbe++;
                imgTime = timeString;
            };

            if (type === "first") {
                this.imgList = imgJson;
                this.loadStatus = true;
            } else {
                // 列表递归
                let factorical = (data) => {
                    if (Array.isArray(data)) {
                        for (let item of data) {
                            item.key.forEach( (key,index) => {
                                if (index === 0 && !this.imgList[key])
                                    this.imgList[key] = {};
                                else if (index === 1 && !this.imgList[item.key[0]][key])
                                    this.imgList[item.key[0]][key] = {};
                                else if (index === 2 && !this.imgList[item.key[0]][item.key[1]][key])
                                    this.imgList[item.key[0]][item.key[1]][key] = [];
                            });
                            this.imgList[item.key[0]][item.key[1]][item.key[2]].push(item);
                        }
                    } else if (typeof data === "object") {
                        for (let item in data) {
                            factorical(data[item]);
                        }
                    }
                }

                factorical(imgJson);
            }
            
            // 重定向数据
            this.imgList = Object.assign({},this.imgList);
            // DOM渲染完成
            this.$nextTick( () => {
                lazyloads.init();
            })
        }
    },
    components: {
        loading,
        headerBox
    }
}

</script>

<style lang="scss" scoped>
    #photoList {
        min-height: 100vh;
        padding-bottom: 40px;
        box-shadow: inset 0 0 100px hsla(0,0,0,.3);
        background-image: linear-gradient(45deg, rgba(194, 233, 221, 0.5) 1%, rgba(104, 119, 132, 0.5) 100%), linear-gradient(-45deg, #494d71 0%, rgba(217, 230, 185, 0.5) 80%);
        .main {
            section {
                margin: 50px auto 0;
                h2 {
                    display: inline-block;
                    padding: 2px 10px;
                    font-size: 30px;
                    border-top: 2px solid #333;
                    border-bottom: 2px solid #333;
                    transform:rotate(-40deg);
                }
                .month_box {
                    padding: 20px 0 0 40px;
                    h3 {
                        font-size: 25px;
                    }
                    .day_box {
                        align-items: flex-start;
                        span {
                            position: relative;
                            display: block;
                            height: 20px;
                            width: 40px;
                            line-height: 20px;
                            text-align: center;
                            font-size: 18px;
                            i {
                                position: absolute;
                                top: 5px;
                                right: -6px;    
                                width: 10px;
                                height: 10px;
                                background-color: #1ed9be;
                                border-radius: 50%;
                            }
                        }
                        ul {
                            flex: 1;
                            padding: 10px 10px 0 10px;
                            border-left: 2px solid #fff;
                            -webkit-column-count: 4;
                            column-count: 4;
                            -webkit-column-gap: 10px;
                            column-gap:10px;
                            overflow: hidden;
                            li {
                                width: 100%;
                                min-height: 50px;
                                margin-bottom: 10px;
                                overflow: hidden;
                                -webkit-column-break-inside: avoid;
                                break-inside: avoid;
                                a {
                                    position: relative;
                                    background-color: #cecec4;
                                    display: flex;
                                    display: -webkit-flex;
                                    flex-direction: column;
                                    flex: 1;
                                    align-items: center;
                                    justify-content: center;
                                    border-radius: 10px;
                                    img {
                                        width: 100%;
                                        border-radius: 10px;
                                    }
                                    .icon-codestore{
                                        position: absolute;
                                        font-size: 80px;
                                        color: #fff;
                                        z-index: 100;
                                    }
                                    span {
                                        position: absolute;
                                        bottom: 5px;
                                        z-index: -1;
                                        width: 100%;
                                        height: 48px;
                                        padding-left: 10px;
                                        text-align: left;
                                        color: #fff;
                                        font-size: 12px;
                                        line-height: 16px;
                                        opacity: 0;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                        b {
                                            font-size: 12px;
                                            padding-right: 5px;
                                        }
                                    }
                                    &:after {
                                            content: '';
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            transition: 0.3s all ease-in-out;
                                            -webkit-transition: 0.3s all ease-in-out;
                                        }
                                    &:hover {
                                        &:after {
                                            content: '';
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            box-shadow: 0 -100px 100px -60px hsla(0,0,0,.5) inset;
                                        }
                                        span {
                                            z-index: 10;
                                            opacity: 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        #modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            .mask {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.65);
            }
            .centent {
                position: fixed;
                max-height: 98vh;
                overflow: auto;
                z-index: 100;
                transition: 0.5s all ease;
                -webkit-transition: 0.5s all ease;
                border-radius: 10px;
                .box {
                    position: relative;
                    &:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        box-shadow: 0 -120px 100px -60px hsla(0,0,0,.8) inset;
                    }
                    img {
                        width: 100%;
                        border-radius: 10px;
                    }
                    span {
                        position: absolute;
                        bottom: 5px;
                        z-index: 10;
                        width: 100%;
                        height: 48px;
                        padding-left: 10px;
                        text-align: left;
                        color: #fff;
                        font-size: 12px;
                        line-height: 16px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        opacity: 0;
                        b {
                            font-size: 12px;
                            padding-right: 5px;
                        }
                    }
                }
                &.active {
                    left: 25% !important;
                    width: 50% !important;
                }
                &.textShow span {
                    opacity: 1;
                }
            }
            .u_loading {
                z-index: 1000;
            }
        }
    }

    @media (min-width: 1110px){
        #photoList #modal {
            .centent {
                &.active {
                    left: 30% !important;
                    width: 40% !important;
                }
            }
        }
    }

    @media (max-width: 900px){
        ul {
            -webkit-column-count: 2 !important;
            column-count: 2!important;
            padding: 10px 3px 0 6px !important;
            -webkit-column-gap: 6px !important;
            column-gap: 6px !important;
            li {
                margin-bottom: 6px !important;
            }
        }
    }

    @media (max-width: 767px){
        #photoList .main section{
            h2 {
                font-size: 20px;
            }
            .month_box {
                padding: 20px 0 0 10px;
            }
        }
    }

    @media (max-width: 700px) {
        #photoList #modal {
            .centent {
                &.active {
                    left: 10% !important;
                    width: 80% !important;
                }
            }
        }
    }
</style>