import { CreateHealthDao } from '@/dao'
import { Health } from '@/model/Health'

const dao = CreateHealthDao()

export const state = () => ({
  latest: {},
  goal: {},
  goalWeightRange: {},
  records: null
})

export const getters = {
  getLatest: state => state.latest,
  getGoal: state => state.goal,
  calcBMI: (state) => {
    const weight = state.latest[Health.TYPE_WEIGHT] // kg
    const height = state.latest[Health.TYPE_HEIGHT] // cm
    if (!weight || !height) {
      return ''
    }
    return (weight / Math.pow(height / 100, 2)).toFixed(2)
  },
  getRecords: state => state.records,
  getGoalWeightRange: state => state.goalWeightRange
}

export const mutations = {
  updateLatest (state, latest) {
    state.latest = latest
  },

  updateGoal (state, goal) {
    if (goal) {
      state.goal = goal
    }
  },

  updateGoalWeightRange (state, value) {
    state.goalWeightRange = { ...value }
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
    commit('updateGoal', list.goal)
    commit('updateGoalWeightRange', list.goalWeightRange)

    console.log('health init')
  },

  async add ({ commit, rootGetters }, params) {
    const userId = rootGetters['User/userId']
    const latest = await dao.addAndUpdateLatest(params, userId)

    commit('updateLatest', latest)
  },

  async updateGoal ({ commit, rootGetters, state }, params) {
    const userId = rootGetters['User/userId']
    const goal = { ...state.goal }
    goal[params.type] = params.value
    await dao.updateGoal(goal, userId)

    commit('updateGoal', goal)
  },

  async updateGoalWeightRange ({ commit, rootGetters }, { start, end }) {
    const userId = rootGetters['User/userId']

    const data = await dao.updateGoalWeightRange({ start, end }, userId)

    commit('updateGoalWeightRange', data)
  },

  async loadRecords ({ commit, rootGetters }) {
    const userId = rootGetters['User/userId']
    commit('setRecords', await dao.getRecords(userId))
  }
}
