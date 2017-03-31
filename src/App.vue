<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
"use strict";
export default {
    created(){
    	window.onload = () => {
    		setTimeout(function(){
    			document.getElementsByTagName('body')[0].scrollTop = 0;
    		},10)
    	}
    }
}
</script>
<style lang='scss'>
@import 'style/common'
</style>