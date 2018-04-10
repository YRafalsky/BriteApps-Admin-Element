const module = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    mutationName (state, payload) {
    },
    updateUser (state, payload) {
      console.log('updateuser')
      state.user = payload
    }
  },
  actions: {
    actionName (context, payload) {
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
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
