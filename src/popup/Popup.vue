<template>
  <div :class="directionClass" :style="{ display: display ? 'block' : 'none', left: left + 'px', top: top + 'px' }" tabindex="999">
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
    // 是否显示弹出框
    display: {
      type: Boolean,
      default: false
    },
    // 弹出框与触发元素的间距
    padding: {
      type: Number,
      default: 0
    },
    // 触发方式
    trigger: {
      type: String,
      default: 'hover'
    }
  },
  data() {
    return {
      arrowStyle: {},
      delay: 100, // 鼠标离开元素时，延迟隐藏时间
      directionMap: {
        top: 'height',
        left: 'width'
      },
      secondDirection: '',
      left: 0,
      top: 0,
      currentElement: null, // current trigger element
      willHide: false // 延时后是否消失
    }
  },
  computed: {
    directionClass() {
      if (this.secondDirection === '') return 'popup-' + this.direction
      else return 'popup-' + this.secondDirection
    },
    // 触发事件
    triggerEvent () {
      switch (this.trigger) {
        case 'hover': return 'mouseenter'
        case 'focus': return 'focus'
        case 'click': return 'click'
      }
    },
    // 逆触发元素
    unTriggerEl () {
      return this.trigger === 'click' ? document : this.$el
    },
    // 逆触发事件
    unTriggerEvent () {
      switch (this.trigger) {
        case 'hover': return 'mouseleave'
        case 'focus': return 'blur'
        case 'click': return 'click'
      }
    }
  },
  mounted() {
    this.appendToBody && document.body.appendChild(this.$el) // 将弹出框移动到 body 下

    // 鼠标进入弹出框时，弹出框不消失
    this.$el.addEventListener(this.triggerEvent, e => {
      e.stopPropagation()
      this.willHide = false
      this.$emit('update:display', true)
      this.$emit('show', this.value)
    })

    // 鼠标离开弹出框时，弹出框消失
    this.unTriggerEl.addEventListener(this.unTriggerEvent, () => {
      if (this.trigger === 'click') {
        this.$emit('update:display', false)
        this.$emit('hide', this.value)
      } else {
        this.willHide = true
        setTimeout(() => {
          if (this.willHide) {
            this.$emit('update:display', false)
            this.$emit('hide', this.value)
          }
        }, this.delay)
      }
    })
  },
  methods: {
    // 添加触发元素
    addItem (item) {
      item.el.addEventListener(this.triggerEvent, this.handleVisible.bind(this, item.value, item.el))

      if (this.trigger !== 'click')
        item.el.addEventListener(this.unTriggerEvent, this.handleInvisible.bind(this, item.value))
      
      this.bindScroll(item.el) // bind scroll event
    },
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
      let topValue = target.top - root.height - this.padding
      let rightValue = target.left + target.width + this.padding
      let bottomValue = target.top + target.height + this.padding
      let leftValue = target.left - root.width - this.padding

      if (this.direction === 'top' || this.direction === 'bottom') {
        left = target.left + (target.width - root.width) / 2

        if (left < 0) { // 弹出框左边缘超出视区时
          left = 0
          this.arrowStyle = { left: (target.left + target.right) / 2 + 'px' }
        } else if (left + root.width > window.innerWidth) { // 弹出框右边缘超出视区时
          left = window.innerWidth - root.width
          this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
        } else { // 弹出框水平方向完全在视区
          delete this.arrowStyle.left
        }

        if (this.direction === 'top') {
          if (topValue < 0 && bottomValue + root.height <= window.innerHeight) {
            top = bottomValue
            this.secondDirection = 'bottom'
          } else {
            top = topValue
            this.secondDirection = ''
          }
        } else {
          if (bottomValue + root.height > window.innerHeight && topValue >= 0) {
            top = topValue
            this.secondDirection = 'top'
          } else {
            top = bottomValue
            this.secondDirection = ''
          }
        }
      } else if (this.direction === 'left' || this.direction === 'right') {
        top = target.top + (target.height - root.height) / 2

        if (top < 0) { // 弹出框上边缘超出视区时
          top = 0
          this.arrowStyle = { top: (target.top + target.bottom) / 2 + 'px' }
        } else if (top + root.height > window.innerHeight) { // 弹出框右边缘超出视区时
          top = window.innerHeight - root.height
          this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
        } else { // 弹出框水平方向完全在视区
          delete this.arrowStyle.top
        }

        if (this.direction === 'left') {
          if (leftValue < 0 && rightValue + root.width <= window.innerWidth) {
            left = rightValue
            this.secondDirection = 'right'
          } else {
            left = leftValue
            this.secondDirection = ''
          }
        } else {
          if (rightValue + root.width > window.innerWidth && leftValue >= 0) {
            left = leftValue
            this.secondDirection = 'left'
          } else {
            left = rightValue
            this.secondDirection = ''
          }
        }
      }

      this.top = top
      this.left = left
    },
    // 处理弹出框可见时
    handleVisible(value, el, e) {
      e.stopPropagation()
      this.willHide = false
      this.currentElement = el
      this.$emit('update:display', true)
      this.$emit('show', value)
      this.$nextTick(() => {
        this.computePosition(this.$el, this.currentElement)
      })
    },
    // 处理弹出框不可见时
    handleInvisible(value, e) {
      if (this.trigger === 'click') {
        this.$emit('update:display', false)
        this.$emit('hide', value)          
      } else {
        this.willHide = true
        setTimeout(() => {
          if (this.willHide) {
            this.$emit('update:display', false)
            this.$emit('hide', value)
          }
        }, this.delay)
      }
    },
    // recompute when scroll
    handleScroll() {
      if (this.display) {
        this.computePosition(this.$el, this.currentElement)
      }
    },
    // whether it is in direction line
    isDirectionLine(direction) {
      if (direction === 'top' || direction === 'bottom') {
        return this.direction === 'top' || this.direction === 'bottom'
      } else {
        return this.direction === 'left' || this.direction === 'right'
      }
    }
  }
}
</script>
