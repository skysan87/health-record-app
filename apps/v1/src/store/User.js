import { CreateUserDao } from '@/dao'

const dao = CreateUserDao()

export const state = () => ({
  id: '',
  email: '',
  displayName: '',
  isGuest: true
})

export const getters = {
  isLogin: (state) => {
    return !!state.id
  },

  displayName: (state) => {
    return state.displayName
  },

  userId: (state) => {
    return state.id
  }
}

export const mutations = {
  setUser (state, user) {
    if (user.isAnonymous !== undefined) {
      state.isGuest = user.isAnonymous
    }
    state.id = user.uid
    state.email = user.email
    state.displayName = user.displayName
  },

  resetUser (state) {
    state.isGuest = true
    state.id = ''
    state.email = ''
    state.displayName = ''
  }
}

export const actions = {
  stateChanged ({ commit }, user) {
    if (user !== null) {
      // login
      commit('setUser', user)
    } else {
      // logout
      commit('resetUser')
    }
  },

  async login () {
    return await dao.login()
  },

  async logout ({ commit }) {
    await dao.logout()
    commit('resetUser')
  },

  async checkLogin ({ commit }) {
    const user = await dao.getAuthChanged()
    if (user !== null) {
      // login
      commit('setUser', user)
      return true
    } else {
      // logout
      commit('resetUser')
      return false
    }
  }
}
