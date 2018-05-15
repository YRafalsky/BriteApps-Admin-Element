import axios from 'axios'
import config from '@/config'

const module = {
  namespaced: true,
  state: {
    user: null,
    users: null
  },
  mutations: {
    mutationName (state, payload) {
    },
    updateUser (state, payload) {
      console.log('updateuser')
      state.user = payload
    },
    getUsers (state, payload) {
      state.users = payload
    },
  },
  actions: {
    actionName (context, payload) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    getInsureds (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${config.url}/company/${payload}/get_insureds/`).then((response) => {
          context.commit('getUsers', response.data.data)
          resolve(response.data.data)
        }, (e) => {
          reject(e)
          return false
        }).catch((e) => {
          reject(e)
          return false
        })
      })
    }
  },
  getters: {
    availableCompanies: state => {
      if (!state.user) {
        return []
      }
      
      return state.user.available_companies
    },
    isSuperuser: state => {
      return state.user && state.user.is_superuser
    },
    companyNameById: (state) => (companyId) => {
      if (!companyId) {
        return null
      }
      return state.user.available_companies.find(_ => _.id === companyId).name
    },
  }
}

export default module
