<template>
  <div v-show="show" :class="'popup-' + direction" :style="{ left: left + 'px', top: top + 'px' }">
    <slot></slot>
    <span
      class="popup-arrow"
      :class="arrowClass"
      :style="arrowStyle">
    </span>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    // 是否放到 body 下
    appendToBody: {
      type: Boolean,
      default: true
    },
    arrowClass: String, // class of the arrow
    direction: {
      type: String,
      default: 'bottom'
    },
    // 弹出框与触发元素的间距
    padding: {
      type: Number,
      defualt: 0
    },
  },
  data() {
    return {
      arrowStyle: {},
      show: false,
      left: 0,
      top: 0,
      currentElement: null // current trigger element
    }
  },
  mounted() {
    this.appendToBody && document.body.appendChild(this.$el) // 将弹出框移动到 body 下

    this.$refs.reference.forEach(item => {
      item.el.addEventListener('mouseenter', this.handleMouseEnter.bind(this, item.value))
      item.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this, item.value))
      this.bindScroll(item.el) // bind scroll event
    })

    // 鼠标进入弹出框时，弹出框不消失
    this.$el.addEventListener('mouseenter', () => {
      this.show = true
    })

    // 鼠标离开弹出框时，弹出框消失
    this.$el.addEventListener('mouseleave', () => {
      this.show = false
    })
  },
  methods: {
    // bind all element's grandparent scroll event
    bindScroll(el) {
      el = el.parentNode
      while (el) {
        el.addEventListener('scroll', this.handleScroll)
        el = el.parentNode
      }
    },
    // compute the popup left and top relative to viewport
    computePosition(root, target) {
      root = root.getBoundingClientRect() // get popup root dom rect
      target = target.getBoundingClientRect() // get trigger el rect

      let left = 0
      let top = 0

      if (this.direction === 'top' || this.direction === 'bottom') {
        left = target.left + (target.width - root.width) / 2
        if (this.direction === 'top') {
          top = target.top - root.height - this.padding
        } else {
          top = target.top + target.height + this.padding
        }
      } else if (this.direction === 'left' || this.direction === 'right') {
        top = target.top + (target.height - root.height) / 2
        if (this.direction === 'left') {
          left = target.left - root.width - this.padding
        } else {
          left = target.left + target.width + this.padding
        }
      }

      this.edgeCheck(root, target, top, left)
    },
    // border check
    edgeCheck(root, target, top, left) {
      if (top < 0) {
        if (this.direction === 'left' || this.direction === 'right') {
          top = 0
          this.arrowStyle = { top:  (target.bottom + target.top) / 2 - top + 'px' }
        }
      } else {
        this.arrowStyle = {}
      }
      this.top = top
      this.left = left
    },
    handleMouseEnter(value, e) {
      this.currentElement = e.target
      this.show = true
      this.$emit('show', value)
      this.$nextTick(() => {
        this.computePosition(this.$el, e.target)
      })
    },
    handleMouseLeave(value, e) {
      this.show = false
      this.$emit('hide', value)
    },
    // recompute when scroll
    handleScroll() {
      if (this.show) {
        this.computePosition(this.$el, this.currentElement)
      }
    }
  }
}
</script>
