import axios from 'axios'
import router from '@/router'

axios.interceptors.request.use(
  function (config) {
    config.headers['Authorization'] = `Bearer ${localStorage.carrierToken}`
    return config
  },
  function (error) {
    console.warn('axios.interceptors.request.use error', error)
    // Do something with request error
    return Promise.reject(error)
  })

axios.interceptors.response.use(
  function (response) {
    let token = response.data.token
    if (token) {
      // if we have token in responce - update token we have in storage
      localStorage.setItem('carrierToken', token)
    }
    return response
  },
  function (error) {
    // debugger
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }
    // here is only 401 case
    localStorage.setItem('carrierToken', null)
    localStorage.setItem('companyId', null)

    router.push({path: '/login'})
    return Promise.reject(error)
  }
)
