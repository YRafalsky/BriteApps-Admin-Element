import store from '@/store'

function _updateMobileBuildDemoMode (isHeadingToMobileBuildPage) {
  store.commit(
    'login/setMobileBuildDemoMode',
    (isHeadingToMobileBuildPage && (store.state.shared.user === null || store.state.login.token === null))
  )
}

function beforeEach (to, from, next) {
  if (to.name === null) {
    next('/company-select')
  }

  if (to.name === 'login') {
    next()
  }

  let isHeadingToMobileBuildPage = to.name ==='build-details-mobile'

  if (store.state.login.token === null) {
    _updateMobileBuildDemoMode(isHeadingToMobileBuildPage)
    if (isHeadingToMobileBuildPage) {
      next()
    } else {
      console.log('Not allowed to go to the route for unauthorized person')
      next('/login')
    }
  } else {
    if (store.state.shared.user === null) {
      console.log('user is null')
      _updateMobileBuildDemoMode(isHeadingToMobileBuildPage)
      store.dispatch('login/init')
      .then(() => {
        console.log('Init complete')
        _updateMobileBuildDemoMode(isHeadingToMobileBuildPage)
        next()
      })
      .catch(() => {
        _updateMobileBuildDemoMode(isHeadingToMobileBuildPage)
        if (isHeadingToMobileBuildPage) {
          next()
        } else {
          next('/login')
        }
      })
    } else {
      _updateMobileBuildDemoMode(isHeadingToMobileBuildPage)
      next()
    }
  }
}

export default {
  attach (vueRouter) {
    vueRouter.beforeEach(beforeEach)
  }
}
