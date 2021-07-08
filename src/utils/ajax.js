import axios from 'axios'
import qs from 'qs'
const BASE_URL = process.env.API_PATH
const defaultOptions = {
  timeout: 30000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.params)
      delete config.params
    }
    const vmpvisit = sessionStorage.getItem('vmpvisit')
    if (vmpvisit) {
      config.headers.vmpvisit = vmpvisit
    }
    const vmpbId = sessionStorage.getItem('vmpbId')
    if (vmpbId) {
      config.headers.vmpbId = vmpbId
    }
    const vmpcId = sessionStorage.getItem('vmpcId')
    if (vmpcId) {
      config.headers.vmpcId = vmpcId
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  res => {
    if (res.data.code && res.data.code !== 200) {
      return Promise.reject(res.data)
    }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default Vue => {
  Vue.prototype.$ajax = options => {
    if (options.params && options.params.__errHandler) {
      options.headers = Object.assign({}, options.headers, {
        noAlert: true
      })
    }
    options.url = options.abPath || BASE_URL + options.url
    if (!options.abPath) {
      options.withCredentials = true
    }
    let _options = Object.assign({}, defaultOptions, options)
    return axios(_options)
      .then(res => {
        return res.data
      })
      .catch(data => {
        if (options.headers && options.headers.noAlert) {
          return Promise.resolve(data)
        }
        return new Promise(() => {})
      })
  }
}

export const ajax = options => {
  options.url = options.abPath || BASE_URL + options.url
  let _options = Object.assign({}, defaultOptions, options)
  return axios(_options)
    .then(res => {
      return res.data
    })
    .catch(data => {
      if (options.headers && options.headers.noAlert) {
        return Promise.resolve(data)
      }
      return Promise.resolve(data)
    })
}
