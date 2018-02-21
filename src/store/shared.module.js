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
    companyName: state => {
      // return state.user ? state.user.company.name : ''
    },

    getterName: state => {
      return state.var1
    },
  }
}

export default module
