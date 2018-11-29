<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import { getDeviceInfo } from '~/assets/js/utils'
export default {
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
