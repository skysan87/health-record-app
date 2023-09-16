import { dateFactory } from '@/util/DateFactory'

export const state = () => ({
  isMenuExpanded: false,
  today: dateFactory()
})

export const getters = {
  isMenuExpanded: (state) => {
    return state.isMenuExpanded
  },

  getDate: (state) => {
    return state.today.getDateNumber()
  }
}

export const mutations = {
  isMenuExpanded (state, value) {
    state.isMenuExpanded = value
  }
}

export const actions = {
  isMenuExpanded ({ commit }, value) {
    commit('isMenuExpanded', value)
  }
}
