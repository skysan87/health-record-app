import { CreateActivityDao } from '@/dao'
import { dateFactory } from '@/util/DateFactory'
import { Activitylist } from '@/model/Activitylist'

const dao = CreateActivityDao()

export const state = () => ({
  activitylist: null,
  activity: null
})

export const getters = {
  getMenu: state => state.activitylist ? state.activitylist.menu : [],
  getTotal: state => state.activity ? state.activity.total : 0,
  getRecords: state => state.activity ? state.activity.records : []
}

export const mutations = {
  updateList (state, list) {
    state.activitylist = list
  },

  updateActivity (state, item) {
    state.activity = item
  }
}

export const actions = {
  async init ({ commit, rootGetters }) {
    const userId = rootGetters['User/userId']
    let list = await dao.getList(userId)

    if (!list) {
      list = await dao.createList(userId)
    }
    commit('updateList', list)

    console.log('activitylist init')

    const item = await dao.getActivity(userId, dateFactory().getDateNumber().toString())
    commit('updateActivity', item)

    console.log('activity init')
  },

  async updateMenu ({ commit, state }, params) {
    const list = Activitylist.valueOf(state.activitylist)
    list.menu = params

    await dao.updateList(list)

    commit('updateList', list)
  },

  async addRecord ({ commit, rootGetters }, params) {
    const userId = rootGetters['User/userId']
    const item = await dao.addRecord(params, userId, dateFactory().getDateNumber().toString())

    commit('updateActivity', item)
  }
}
