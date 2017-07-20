export default class Popup {
  constructor (el, params) {
    this.el = el

    if (params.appendToBody) {
      document.body.appendChild(this.el)
    }
  }
}
