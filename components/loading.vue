<template>
  <div id="loader-wrapper" v-if="$store.state.first_load" :class="{loaded: loadStatus}">
    <div id="loader"/>
    <div class="loader-section section-left"/>
    <div class="loader-section section-right"/>
    <div class="load_title"/>
  </div>
</template>

<script>
export default {
  props: ['loadStatus'],
  data() {
    return {}
  },
  watch: {
    loadStatus(val) {
      if (val) {
        document.body.style.overflow = 'auto'

        setTimeout(() => {
          this.$store.commit('loadChange')
        }, 1000)
      }
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  }
}
</script>

<style lang="scss" scoped>
$activeColor: #1ed9be;
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 100%;
  .loader-section {
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 51%;
    height: 100%;
    background: linear-gradient(#1ed9be, #cecec4);
    transform: translateX(0);
    transition: all 0.7s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    &.section-left {
      left: 0;
    }
    &.section-right {
      right: 0;
    }
  }
  .load_title {
    position: absolute;
    top: 62%;
    color: #fff;
    font-size: 16px;
    width: 100%;
    line-height: 30px;
    text-align: center;
    z-index: 9999999999999;
    opacity: 0.7;
  }
  &.loaded {
    visibility: hidden;
    transform: translateY(-100%);
    transition: all 0.3s 1s ease-out;
    .loader-section.section-left {
      transform: translateX(-100%);
    }
    .loader-section.section-right {
      transform: translateX(100%);
    }
    .load_title {
      display: none;
    }
  }
}

#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  z-index: 1001;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  animation: spin 2s linear infinite;
}

.loaded #loader {
  opacity: 0;
  -webkit-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}

#loader:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  animation: spin 3s linear infinite;
}

#loader:after {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  animation: spin 1.5s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
