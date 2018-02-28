<template>
    <div v-if="$store.state.first_load" class="loading-overlay" :class="{loaded: loadStatus && status}">
        <div class="loading-reveal">
            <div class="loading-left"></div>
            <div class="loading-right">
                <div class="loading-reveal-b">loading</div>
            </div>
        </div>
        <div class="bustle-gem">
        </div>
    </div>
</template>

<script>
"use strict";
export default {
    props: ["loadStatus"],
    mounted() {
        let _this = this;

        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            document.body.style.overflow = 'auto';
            _this.status = true;
            // 0.8s 动画结束后。更改首次加载状态
            setTimeout(() => {
                _this.$store.commit('loadChange');
            },800)
        },1000);
    },
    data() {
        return {
        	status: false              // 状态。 false：表示时间未过1秒。 true：表示时间已经过了1秒
        }
    },
    methods: {
    	
    }
}
</script>

<style lang="scss" scoped>
$activeColor: #1ed9be;
.loading-overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    color: #fff;
    .loading-reveal {
        position: absolute;
        left: -100%;
        top: -100%;
        width: 300%;
        height: 300%;
        transform: rotate(45deg);
    }
    .loading-left {
        position: absolute;
        top: 0%;
        right: 50%;
        width: 50%;
        height: 100%;
        background-color: #FFF;
        border-right: 1px solid #F9F9F9;
    }
    .loading-right {
        position: absolute;
        bottom: 0%;
        left: 50%;
        width: 50%;
        height: 100%;
        background-color: #F9F9F9;
        overflow: hidden;
        border-left: 1px solid #F9F9F9;
        .loading-reveal-b {
            position: absolute;
            left: -70px;
            top: 42%;
            font-size: 200px;
            line-height: 400px;
            transform: rotate(-45deg);
        }
    }
}


.bustle-gem {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin-left: -50px;
    margin-top: -50px;
    width: 100px;
    height: 100px;
    font-size: 60px;
    line-height: 100px;
    text-align: center;
    background-color: $activeColor;
    border-radius: 6px;
    -webkit-animation: init-gem 0.8s ease 0s 1;
    &:before {
        content: ' ';
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 0;
        width: 100px;
        height: 100px;
        background-color: $activeColor;
        border-radius: 6px;
        transform: rotate(45deg);
        -webkit-animation: init-gem-before 0.8s ease-in-out 0s 1;
    }
    &:after {
        content: 'zZ';
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 2;
        transform: rotate(0deg);
        -webkit-animation: init-gem-after 0.9s cubic-bezier(0,0.6,0.4,0) 0s 1;
    }
}

@keyframes init-gem {
  0% {
    top: -50%;
    margin-top: -200px;
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 50%/50%;
  }
  20% {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  30% {
    top: 90%;
    width: 100px;
    height: 70px;
    line-height: 70px;
    border-radius: 50%/50%;
  }
  60% {
    top: 50%;
    margin-top: -140px;
    margin-left: -35px;
    width: 70px;
    height: 100px;
    line-height: 100px;
    border-radius: 50%/50%;
    transform: rotate(0deg);
  }
  70% {
    margin-top: -50px;
    margin-left: -50px;
    width: 100px;
    height: 100px;
    border-radius: 8%/8%;
  }
  80% {
    transform: rotate(-20deg);
  }
  90% {
    transform: rotate(30deg);
  }
}

@keyframes init-gem-before {
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  70% {
    opacity: 0;
    transform: rotate(0deg);
  }
  71% {
    opacity: 0.8;
    transform: rotate(0deg);
  }
  78% {
    opacity: 0.8;
    transform: rotate(-10deg);
  }
  91% {
    opacity: 1;
    transform: rotate(50deg);
  }
}

@keyframes init-gem-after {
  0%, 20% {
    transform: rotate(-50deg);
  }
  30% {
    transform: rotate(30deg);
  }
  80% {
    transform: rotate(-20deg);
  }
}

.loaded {
    animation: zIndex 0s both 0.8s;
    -webkit-animation: zIndex 0s both 0.8s;
    .bustle-gem {
        margin-left: 1500px;
        margin-top: -1500px;
        animation: loaded-gem 0.8s ease-in-out 0s 1;
        -webkit-animation: loaded-gem 0.8s ease-in-out 0s 1;
    }
    .loading-left {
        width: 0%;
        border-color: $activeColor;
        border-right-width: 5px;
        top: -100%;
        animation: loaded-left 0.8s ease-in-out 0s 1;
        -webkit-animation: loaded-left 0.8s ease-in-out 0s 1;
    }
    .loading-right {
        width: 0%;
        border-color: $activeColor;
        border-left-width: 5px;
        bottom: -100%;
        animation: loaded-right 0.8s ease-in-out 0s 1;
        -webkit-animation: loaded-right 0.8s ease-in-out 0s 1;
    }
}

@keyframes zIndex {
    100% {
        z-index: -1; 
    }
}

@keyframes loaded-gem {
  0%, 50% {
    margin-left: -50px;
    margin-top: -50px;
  }
}
@keyframes loaded-left {
  0% {
    top: 0%;
    width: 100%;
    border-color: #F5F5F5;
    border-right-width: 1px;
  }
  50% {
    top: 0%;
    width: 0%;
    border-color: $activeColor;
    border-right-width: 5px;
  }
}
@keyframes loaded-right {
  0% {
    bottom: 0%;
    width: 100%;
    border-color: #F5F5F5;
    border-left-width: 1px;
  }
  50% {
    bottom: 0%;
    width: 0%;
    border-color: $activeColor;
    border-left-width: 5px;
  }
}</style>