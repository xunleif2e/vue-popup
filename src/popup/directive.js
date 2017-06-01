export default {
  bind(el, binding, vnode) {
    let popup = vnode.context.$refs[binding.arg]

    if (popup.$refs.reference instanceof Array) {
      popup.$refs.reference.push(el)
    } else {
      popup.$refs.reference = [el]
    }
  }
}