import Vue from 'vue'
import App from './app.vue'
import store from './store'
import router from './router'
import i18n from './utils/i18n'
import './utils/extend'
import 'assets/css/index.scss'
import 'assets/fonts/iconfont.scss'
import Notification from './components/common/notification'
import Input from './components/common/input'
import Marquee from './components/common/marquee'
import MessageBox from './components/common/message-box'
import Loading from './components/common/loading'
import Dialog from './components/common/dialog'
import Button from './components/common/button'
import Zan from './components/common/zan'
import './filters/filters'
import './utils/vue.prototype'
import serviceContainer from './container/index'
Vue.use(Notification)
Vue.use(Input)
Vue.use(Marquee)
Vue.use(MessageBox)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Zan)

Vue.config.debug = process.env.BUILD_ENV !== 'prod'
Vue.config.devtools = process.env.BUILD_ENV !== 'prod'
Vue.config.productionTip = process.env.BUILD_ENV !== 'prod'

/* eslint-disable */
new Vue({
  el: '#root',
  provide: serviceContainer,
  router,
  store,
  i18n,
  render: h => h(App)
})
window.$uuid = window.btoa(Math.random())
