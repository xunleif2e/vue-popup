module.exports = {
  inserted(el, binding, vnode) {
    let popup = vnode.context.$refs[binding.arg]

    popup.addItem({
      el,
      value: binding.value
    })
  }
}