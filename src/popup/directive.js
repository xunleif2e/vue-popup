module.exports = {
  bind(el, binding, vnode) {
    let popup = vnode.context.$refs[binding.arg]
    let item = {
      el,
      value: binding.value
    }

    if (popup.$refs.reference instanceof Array) {
      popup.$refs.reference.push(item)
    } else {
      popup.$refs.reference = [item]
    }
  }
}