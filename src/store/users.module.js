/* eslint-disable */
import axios from 'axios'
import config from '@/config'


let usersModule = {
  namespaced: true,
  state: {
    superUsers: null,
  },
  mutations: {
    updateUsers (state, payload) {
      state.superUsers = payload
    }
  },
  actions: {
    loadUsers (context, payload) {
      console.log('Loading users...')
      return new Promise((resolve, reject) => {
        let data = {
          token: localStorage.carrierToken
        }
        axios.get(`${config.url}/company/${payload.companyId}/portal-users/`, data)
        .then((response) => {
          // success
          context.commit('updateUsers', response.data)
          resolve(response)
        }, (e) => {
          console.log(e)
          reject(e)
          return false
        })
        .catch((e) => {
          console.log(e)
          reject(e)
          return false
        })
      })
    }
  },
  getters: {

  }
}

export default usersModule