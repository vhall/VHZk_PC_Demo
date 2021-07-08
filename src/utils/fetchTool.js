import qs from 'qs'
import { MessageBox } from 'components/common/message-box'
const BASE_URL = process.env.API_PATH
const MOCK_BASE_URL = 'http://yapi.vhall.domain/mock/60'

const defaultOptions = {
  timeout: 60 * 1000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}

class $Http {
  constructor () {
    this.config = {}
    this.options = {}
  }
  $config (config = {}) {
    this.config = config
    if (this.config.headers) {
      this.options.headers = this.config.headers
    }
    if (!this.options.headers) {
      this.options.headers = {}
    }
    const vmpvisit = sessionStorage.getItem('vmpvisit')
    if (vmpvisit) {
      this.options.headers.vmpvisit = vmpvisit
    }
    const vmpcId = sessionStorage.getItem('vmpcId')
    if (vmpcId) {
      this.options.headers.vmpcId = vmpcId
    }
    const vmpbId = sessionStorage.getItem('vmpbId')
    if (vmpbId) {
      this.options.headers.vmpbId = vmpbId
    }
    return this
  }
  $get (url, data = {}) {
    this.options.method = 'get'
    this.options.data = data
    return this.$fetch(url)
  }
  $post (url, data = {}) {
    this.options.method = 'post'
    this.options.data = qs.stringify(data)
    return this.$fetch(url)
  }
  $fetch (url) {
    this.options.url = url
    if (!~url.indexOf('http')) {
      // mock开关 和 接口mack配置同时打开时才使用mock数据
      if (process.env.MOCK && this.config.mock) {
        this.options.url = MOCK_BASE_URL + url
      } else {
        this.options.url = BASE_URL + url
      }
    }
    return new Promise((resolve, reject) => {
      let st = null
      if (this.config.handlers === true) {
        st = setTimeout(() => {
          clearTimeout(st)
          reject(new Error({
            code: 500,
            msg: '服务网络异常'
          }))
        }, defaultOptions.timeout)
      }
      if (this.options.method === 'get') {
        if (this.options.data) {
          let params = ''
          Object.keys(this.options.data).forEach((key) => {
            params += `${key}=${this.options.data[key]}&`
          })
          params = params.substring(0, params.length - 1)
          if (!~url.indexOf('?')) {
            this.options.url = this.options.url + '?' + params
          } else {
            this.options.url = this.options.url + params
          }
        }
        if (this.config.openSession === true) {
          try {
            let res = JSON.parse(sessionStorage.getItem(`URL_${this.options.url}`))
            if (res && res.code === 200) {
              resolve(res)
              return
            }
          } catch (e) {
            console.log(e)
          }
        }
        fetch(this.options.url, {
          method: this.options.method,
          credentials: 'same-origin',
          mode: 'cors',
          // mode: 'no-cors',
          headers: {
            ...defaultOptions.headers,
            ...this.options.headers
          }
        }).then((response) => {
          clearTimeout(st)
          try {
            return response.json()
          } catch (e) {
            return {
              code: 6000,
              msg: '数据格式解析异常'
            }
          }
        }).then(res => {
          clearTimeout(st)
          if (!res.code || res.code === 200 || res.cities || res.code === 790091 || res.code === 790090) { // 已开始和结束抽奖
            if (this.config.openSession === true) {
              sessionStorage.setItem(`URL_${this.options.url}`, JSON.stringify(res))
            }
            resolve(res)
          } else {
            if (this.config.handlers === true) {
              reject(res)
            } else {
              let errorMsg = res.msg || '网络异常'
              MessageBox({
                header: '提示',
                content: errorMsg,
                autoClose: 10,
                confirmText: '知道了'
              })
            }
          }
        })
      } else {
        if (this.config.openSession === true) {
          try {
            let res = JSON.parse(sessionStorage.getItem(`URL_${this.options.url}`))
            if (res && res.code === 200) {
              resolve(res)
              return
            }
          } catch (e) {
            console.log(e)
          }
        }
        return fetch(this.options.url, {
          method: this.options.method,
          credentials: 'same-origin',
          mode: 'cors',
          // mode: 'no-cors',
          headers: {
            ...defaultOptions.headers,
            ...this.options.headers
          },
          body: this.options.data
        }).then((response) => {
          clearTimeout(st)
          try {
            return response.json()
          } catch (e) {
            return {
              code: 6000,
              msg: '数据格式解析异常'
            }
          }
        }).then((res) => {
          clearTimeout(st)
          if (res.code === 200) {
            if (this.config.openSession === true) {
              sessionStorage.setItem(`URL_${this.options.url}`, JSON.stringify(res))
            }
            resolve(res)
          } else {
            if (this.config.handlers === true) {
              reject(res)
            } else {
              let errorMsg = res.msg || '网络异常'
              MessageBox({
                header: '提示',
                content: errorMsg,
                autoClose: 10,
                confirmText: '知道了'
              })
            }
          }
        })
      }
    })
  }
}

export default {
  $get (url, data, config = { loading: false, handlers: false, mock: false, openSession: false }) {
    let http = new $Http()
    return http.$config(config).$get(url, data)
  },
  $post (url, data, config = { loading: false, handlers: false, mock: false, openSession: false }) {
    let http = new $Http()
    return http.$config(config).$post(url, data)
  }
}
