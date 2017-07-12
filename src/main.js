import Vue from 'vue'
import App from './App.vue'
import Popup from './popup'

Vue.use(Popup)

export default new Vue({
  el: '#app',
  render: h => h(App)
})
