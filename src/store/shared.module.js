import axios from 'axios'
import config from '@/config'
import qs from 'qs'

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
      console.log('actions getInsureds company_id: ', payload)
      return new Promise((resolve, reject) => {
        axios.post(config.get_insureds_by_company_id, qs.stringify({company_id: payload})).then((response) => {
          console.log('getInsureds response: ', response)
          context.commit('getUsers', response.data)
          resolve(response)
        }, (e) => {
          reject(e)
        }).catch((e) => {
          reject(e)
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
