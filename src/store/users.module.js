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
    loadSuperUsers (context, payload) {
      console.log('Loading superusers...')
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
    },
    deleteSuperUser (context, payload) {
      return new Promise((resolve, reject) => {
        console.log('payload: ', payload)
        let data = {
          token: localStorage.carrierToken
        }
        let promise = axios.delete(`${config.url}/company/${payload.companyId}/portal-users/${payload.userId}/`, data)
        promise.then((response) => {
          console.log('response: ', response)
          if (response.data.success) {
            resolve(response)
          }
        }, (e) => {
          reject(e)
          return false
        })
          .catch((e) => {
            reject(e)
            return false
          })
      })
    },
    addSuperUser (context, payload) {
      console.log('Add superUser...')
      return new Promise ((resolve, reject) => {
        console.log('payload: ', payload)
        let promise = axios.post(`${config.url}/company/${payload.company_id}/portal-users/`, payload)
        promise.then((response) => {
          if (response.data.success) {
            resolve(response)
          }
        }, (e) => {
          reject(e)
          return false
        })
          .catch((e) => {
            reject(e)
            return false
        })
      })
    },
    resetSuperUserPassword (context, payload) {
      return new Promise((resolve, reject) => {
        let data = {
          new_password: payload.password,
          token: localStorage.carrierToken
        }
        let promise = axios.post(`${config.url}/company/${payload.companyId}/portal-users/${payload.userId}/reset-password`, data)
        promise.then((response) => {
          if (response.data.success) {
            console.log('response.data: ', response)
            resolve(response)
          }
        }, (e) => {
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