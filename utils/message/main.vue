<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div
      class="message-content"
      v-show="visible"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      :style="`top: ${verticalOffset}px;`"
    >
      <i class="iconfont" :class="`icon-${type}`"></i>
      <span>{{ title }}</span>
    </div>
  </transition>
</template>

<script>
'use strict'

export default {
  data() {
    return {
      duration: 3000,
      verticalOffset: 0,
      visible: false,
      type: '',
      title: ''
    }
  },
  mounted() {
    this.startTimer()
  },
  methods: {
    clearTimer() {
      clearTimeout(this.timer)
    },
    startTimer() {
      this.timer = setTimeout(() => {
        this.visible = false
        this.onClose()
      }, this.duration)
    },
    /**
     * 销毁dom
     */
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.message-content {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 1000;
  padding: 10px 16px 10px 32px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  pointer-events: all;
  transform: translateX(-50%);
  transition: all 0.3s, transform 0.4s;
  i {
    position: absolute;
    top: 12px;
    left: 10px;
    &.icon-success {
      color: #67c23a;
    }
    &.icon-error {
      color: #f56c6c;
    }
  }
}
</style>
