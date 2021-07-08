import Vue from 'vue'

Vue.filter('isEmpty', function (value, replaceStr) {
  replaceStr = replaceStr || '--'
  return value || replaceStr
})

Vue.filter('fmtTime', (value) => {
  let h = (((value / 3600) >> 0) + '').padStart(2, 0)
  let m = (((value / 60) % 60 >> 0) + '').padStart(2, 0)
  let s = ((value % 60 >> 0) + '').padStart(2, 0)
  return `${h}:${m}:${s}`
})

Vue.filter('chatTime', (value) => {
  if (value < 15) return value
  if (value.substring(0, 10) === new Date(value).format('yyyy-MM-dd')) {
    return value.substring(11, 16)
  }
  return value.substring(0, 16)
})

Vue.filter('overHidden', function (value = '', len = 0) {
  if (value === null || value === undefined) return ''
  if (value.length > len) {
    return value.substring(0, len) + '...'
  }
  return value
})

Vue.filter('gender', (val) => {
  if (val === 'M') {
    return '男'
  }
  if (val === 'W') {
    return '女'
  }
  if (val === 'U') {
    return '未知'
  }
  return '未知'
})
