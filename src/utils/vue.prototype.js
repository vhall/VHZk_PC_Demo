import Vue from 'vue'
Vue.prototype.$imgHost = window.VHALL_ZK.$imgHost
let debounceTimeout
Vue.prototype.$debounce = (func, wait = 1000) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  let callNow = !debounceTimeout
  debounceTimeout = setTimeout(() => {
    clearTimeout(debounceTimeout)
    debounceTimeout = null
  }, wait)
  if (callNow) func()
}
Vue.prototype.$throttle = (func, wait) => {
  let previous = 0
  return function() {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
Vue.prototype.$inIframe = self != top
