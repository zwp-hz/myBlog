<template>
  <nuxt/>
</template>

<script lang='ts'>
'use strict'
import { getDeviceInfo } from '~/assets/js/utils'
import { Vue, Component } from 'vue-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    $message: any
  }
}

@Component
export default class Default extends Vue {
  mounted() {
    this.$store.commit('init', {
      device: getDeviceInfo(),
      M_QN_POSTFIX: `?imageView2/2/interlace/1/format/${
        window.isWebp ? 'webp' : 'jpg'
      }/w/`
    })
  }
}
</script>
