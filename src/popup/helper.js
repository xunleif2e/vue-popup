export function throttle (fn, delay) {
  let last = 0
  return (...args) => {
    const curr = +new Date()
    if (curr - last > delay) {
      fn.apply(this, args)
      last = curr
    }
  }
}
