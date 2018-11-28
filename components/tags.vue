<template>
  <div class="tags clear">
    <h3>tags</h3>
    <a
      class="fl u_transition_300 u_button"
      v-for="(item, index) in tags"
      :key="index"
      @click="search({type: 'Tag', text: item.name})"
    >
      {{ item.name }}
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['tags'])
  },
  mounted() {
    if (this.tags.length === 0) {
      //获取标签列表
      this.$axios.post('api/getTagsList').then(res => {
        if (res.code == 0) {
          this.$store.commit('setFooterData', {
            type: 'tags',
            data: res.data
          })
        }
      })
    }
  },
  methods: {
    /**
     * 标签搜索
     * @param {data}    搜索参数
     */
    search(data) {
      this.$store.commit('searchChange', data)
      this.$router.push({
        path: '/blog/searchResult',
        query: {
          Tag: data.text
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tags {
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
