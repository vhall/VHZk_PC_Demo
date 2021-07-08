import Vue from 'vue'
import Com from './com.vue'
const ComConstructor = Vue.extend(Com)
export default (options = {}) => {
  let root = options.el || document.body
  if (options.el) {
    root = document.querySelectorAll(options.el)[0]
    if (!root) return
  }
  let chList = root.querySelectorAll('.com-zan')
  if (chList.length >= 15) { // 最多15个同时启动
    return
  }
  let instance = new ComConstructor({
    propsData: {
      showIdx: Math.round(Math.random() * 7)
    }
  })
  instance.vm = instance.$mount()
  let autoDestory = options.autoDestroy === undefined || options.autoDestroy
  if (instance) {
    root.appendChild(instance.vm.$el)
    if (autoDestory) {
      let st = setTimeout(() => {
        clearTimeout(st)
        root.removeChild(instance.vm.$el)
        instance.vm.$destroy()
      }, 4000)
    }
  }
  return instance ? instance.vm : null
}
