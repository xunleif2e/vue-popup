module.exports = {
  inserted (el, binding, vnode) {
    let popup = vnode.context.$refs[binding.arg]

    popup && popup.addItem({
      el,
      value: binding.value
    })
  },
  unbind (el, binding, vnode) {
    let popup = vnode.context.$refs[binding.arg]

    popup && popup.removeItem({
      el,
      value: binding.value
    })
  }
}
