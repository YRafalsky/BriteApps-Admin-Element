import store from '@/store'

function beforeEach (to, from, next) {
  if (to.name === null) {
    next('/company-select')
  }

  if (to.name === 'login') {
    next()
  }

  if (store.state.login.token === null) {
    console.log('Not allowed to go to the route for unathorized person')
    next('/login')
  } else {
    if (store.state.shared.user === null) {
      console.log('user is null')
      store.dispatch('login/init')
      .then(() => {
        console.log('Init complete')
        next()
      })
      .catch(() => next('/login'))
    } else {
      next()
    }
  }
}

export default {
  attach (vueRouter) {
    vueRouter.beforeEach(beforeEach)
  }
}
