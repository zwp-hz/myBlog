'use strict'

const mutations = {
    searchChange(state, data) {
        state.searchCnt = data;
    },
    loadChange(state) {
        state.first_load = false;
    },
    setFooterData(state, data) {
        state[data.type] = data.data;
    }
}

export default mutations