import store from '@/store'

function beforeEach (to, from, next) {
  if (to.name === null) {
    next('/company-select')
  }

  if (to.name === 'login') {
    next()
  }

  let isHeadingToMobileBuildPage = to.name ==='build-details-mobile'

  if (store.state.login.token === null) {
    if (isHeadingToMobileBuildPage) {
      next()
    } else {
      console.log('Not allowed to go to the route for unauthorized person')
      next('/login')
    }
  } else {
    if (store.state.shared.user === null) {
      console.log('user is null')
      store.dispatch('login/init')
      .then(() => {
        console.log('Init complete')
        next()
      })
      .catch(() => {
        if (isHeadingToMobileBuildPage) {
          next()
        } else {
          next('/login')
        }
      })
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
