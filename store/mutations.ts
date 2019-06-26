const mutations = {
  /**
   * 初始化参数
   * @param {Object} data - 设备信息
   */
  init(state, data) {
    Object.assign(state, data)
  },
  searchChange(state, data) {
    state.search = data
  },
  loadChange(state) {
    state.first_load = false
  },
  setFooterData(state, data) {
    state[data.type] = data.data
  }
}

export default mutations
