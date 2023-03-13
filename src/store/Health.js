import { CreateHealthDao } from '@/dao'
import { Health } from '@/model/Health'

const dao = CreateHealthDao()

export const state = () => ({
  latest: {},
  records: null
})

export const getters = {
  getLatest: state => state.latest,
  calcBMI: (state) => {
    const weight = state.latest[Health.TYPE_WEIGHT] // kg
    const height = state.latest[Health.TYPE_HEIGHT] // cm
    if (!weight || !height) {
      return ''
    }
    return (weight / Math.pow(height / 100, 2)).toFixed(2)
  },
  getRecords: state => state.records
}

export const mutations = {
  updateLatest (state, latest) {
    state.latest = latest
  },

  setRecords (state, list) {
    state.records = list
  }
}

export const actions = {
  async init ({ commit, rootGetters }) {
    const userId = rootGetters['User/userId']
    let list = await dao.getList(userId)

    if (!list) {
      list = await dao.createList(userId)
    }
    commit('updateLatest', list.latest)

    console.log('health init')
  },

  async add ({ commit, rootGetters }, params) {
    const userId = rootGetters['User/userId']
    const latest = await dao.addAndUpdateLatest(params, userId)

    commit('updateLatest', latest)
  },

  async loadRecords ({ commit, rootGetters }) {
    const userId = rootGetters['User/userId']
    commit('setRecords', await dao.getRecords(userId))
  }
}
