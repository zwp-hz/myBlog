<template>
  <div class="tags clear g-box">
    <h3>tags</h3>
    <a
      class="fl u_transition_300 u_button"
      v-for="(item, index) in tags"
      :key="index"
      @click="search({type: 'Tag', text: item.name})"
    >{{ item.name }}</a>
  </div>
</template>

<script lang='ts'>
'use strict'
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class tags extends Vue {
  @State('tags')
  tags

  mounted() {
    if (this.tags.length === 0) {
      //获取标签列表
      ;(<any>this).$axios.post('api/getTagsList').then((res: any) => {
        if (res.code == 0) {
          this.$store.commit('setFooterData', {
            type: 'tags',
            data: res.data
          })
        }
      })
    }
  }

  search(data) {
    this.$store.commit('searchChange', data)
    this.$router.push({
      path: '/article/searchResult',
      query: {
        Tag: data.text
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.tags {
  flex: 1;
  h3 {
    margin-bottom: 15px;
    font-size: 20px;
    line-height: 30px;
    color: #e3e3e3;
  }
  .u_button {
    margin-bottom: 15px;
  }
}
</style>
