import axios from 'axios'
import config from '@/config'

const module = {
  namespaced: true,
  state: {
    user: null,
    users: null,
    healthcheck: null,
  },
  mutations: {
    updateUser (state, payload) {
      console.log('updateuser')
      state.user = payload
    },
    healthcheckDidLoad (state, payload) {
      console.log('healthcheckDidLoad')
      state.healthcheck = payload
    },
    getUsers (state, payload) {
      state.users = payload
    },
  },
  actions: {
    getSuperuserCredentials (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(config.url + '/get_superuser_credentials/', {user_id: payload}).then((response) => {
          resolve(response)
        }, (e) => {
          reject(e)
        })
      })
    },
    getInsureds (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`${config.url}/company/${payload}/get_insureds/`).then((response) => {
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
    },
    async loadHealthcheck (context, payload) {
      let response = await axios.post(`${config.url}/up/`)
      context.commit('healthcheckDidLoad', response.data.britecores)
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
    healthcheckByCompany: (state) => (companyId) => {
      if (!companyId || !state.healthcheck) {
        return null
      }
  
      return state.healthcheck.find(_ => _.id === companyId)
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
