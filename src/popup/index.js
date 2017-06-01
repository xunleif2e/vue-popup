import directive from './directive'
import Popup from './Popup.vue'

Popup.install = Vue => {
  Vue.directive('popup', directive)
  Vue.component(Popup.name, Popup)
}

export default Popup
