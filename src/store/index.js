import Vuex from 'vuex'
import { db } from '../boot/firebase'
import { Cookies } from 'quasar'
import Vue, { ssrContext } from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      uid: null
    },
    version: '',
    folderActive: {
      id: null
    },
    boardActive: {
      id: null
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getVersion: state => {
      return state.version
    },
    getCurrentFolder (state) {
      return state.folderActive
    },
    getCurrentBoard (state) {
      return state.boardActive
    }
  },
  mutations: {
    async boot (state) {
      state.version = process.env.VERSION
      const cookies = process.env.SERVER
        ? Cookies.parseSSR(ssrContext)
        : Cookies // otherwise we're on client
      const user = await cookies.get('user')
      if (await user !== undefined) {
        try {
          const result = await db
            .collection('app')
            .doc(user.uid)
            .get()
          state.user = {
            uid: user.uid,
            email: user.email,
            username: result.data().username
          }
        } catch (error) {
          await cookies.remove('user')
          console.log('Erro ao tentar verificar nome do usuário')
        }
      } else {
        state.user = { uid: null, email: 'email@email.com', username: 'no name' }
      }
    },
    setCurrentFolder (state, payload) {
      state.folderActive = payload
    },
    setCurrentBoard (state, payload) {
      state.boardActive = payload
    }
  },
  actions: {
    boot ({ commit }) {
      commit('boot')
    },
    setCurrentFolder ({ commit }, payload) {
      commit('setCurrentFolder', payload)
    },
    setCurrentBoard ({ commit }, payload) {
      commit('setCurrentBoard', payload)
    }
  }
})
