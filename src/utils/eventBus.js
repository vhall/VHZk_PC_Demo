import Vue from 'vue'
let EventBus = {}
let eventArray = []
if (!EventBus.instance) {
  EventBus.instance = new Vue()
}

EventBus.$on = function (eventName, fn) {
  if (eventArray.indexOf(eventName) === -1) {
    eventArray.push(eventName)
  }
  EventBus.instance.$on(eventName, fn)
}

EventBus.$emit = function (eventName, data) {
  EventBus.instance.$emit(eventName, data)
}

EventBus.$remove = function (eventName) {
  eventArray.forEach((item, idx) => {
    if (item === eventName) {
      EventBus.instance.$off(eventName)
      eventArray.splice(idx, 1)
    }
  })
}

EventBus.offAll = function () {
  eventArray.forEach((item) => {
    EventBus.instance.$off(item)
  })
  eventArray = []
}
export default EventBus
