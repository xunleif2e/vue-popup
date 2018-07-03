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
    },
    // 页面滚动时弹出框是否可见
    scrollShow: {
      type: Boolean,
      default: true
    }
  },

  data () {
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
    directionClass () {
      const reg = /(top)|(bottom)|(left)|(right)/i
      let transDirection = reg.exec(this.direction) || []
      let secDirection = this.secondDirection ? reg.exec(this.secondDirection)[0] : ''
      let direction = transDirection[0] || ''

      if (secDirection === '') return 'popup-' + direction
      else return 'popup-' + secDirection
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

  mounted () {
    this.appendToBody && document.body.appendChild(this.$el) // 将弹出框移动到 body 下

    // 鼠标进入弹出框时，弹出框不消失
    this.$el.addEventListener(this.triggerEvent, this.handlePopupVisible)

    // 鼠标离开弹出框时，弹出框消失
    this.unTriggerEl.addEventListener(this.unTriggerEvent, this.handlePopupInvisible)
  },

  beforeDestroy () {
    this.$el.removeEventListener(this.triggerEvent, this.handlePopupVisible)
    this.unTriggerEl.removeEventListener(this.unTriggerEvent, this.handlePopupInvisible)
  },

  destroyed () {
    // 将弹出框手动移除
    if (this.appendToBody && this.$el && document.body.hasChildNodes(this.$el)) {
      document.body.removeChild(this.$el)
    }
  },

  methods: {
    // 添加触发元素
    addItem (item) {
      item.el.handleVisible = this.handleVisible.bind(this, item.value, item.el)
      item.el.addEventListener(this.triggerEvent, item.el.handleVisible)

      if (this.trigger !== 'click') {
        item.el.handleInvisible = this.handleInvisible.bind(this, item.value)
        item.el.addEventListener(this.unTriggerEvent, item.el.handleInvisible)
      }

      this.bindScroll(item.el) // bind scroll event
    },

    // 移除触发元素
    removeItem (item) {
      item.el.removeEventListener(this.triggerEvent, item.el.handleVisible)

      if (this.trigger !== 'click') {
        item.el.removeEventListener(this.unTriggerEvent, item.el.handleInvisible)
      }

      this.unbindScroll(item.el)
    },

    // 绑定滚动事件
    bindScroll (el) {
      el = el.parentNode
      while (el) {
        el.addEventListener('scroll', this.handleScroll)
        el = el.parentNode
      }
    },

    // 解绑滚动事件
    unbindScroll (el) {
      el = el.parentNode
      while (el) {
        el.removeEventListener('scroll', this.handleScroll)
        el = el.parentNode
      }
    },

    // compute the popup left and top relative to viewport
    computePosition (root, target) {
      root = root.getBoundingClientRect() // get popup root dom rect
      target = target.getBoundingClientRect() // get trigger el rect

      let left = 0
      let top = 0
      let topValue = target.top - root.height - this.padding
      let rightValue = target.left + target.width + this.padding
      let bottomValue = target.top + target.height + this.padding
      let leftValue = target.left - root.width - this.padding
      const updownReg = /(top)|(bottom)/i
      const lergtReg = /(left)|(right)/i
      if (updownReg.test(this.direction)) {
        left = target.left + (target.width - root.width) / 2
        if (this.direction === 'bottomStart' || this.direction === 'topStart') {
          left = target.left
        }
        if (this.direction === 'bottomEnd' || this.direction === 'topEnd') {
          left = target.left - root.width + target.width
        }

        if (left < 0) { // 弹出框左边缘超出视区时
          left = 0
          this.arrowStyle = { left: (target.left + target.right) / 2 + 'px' }
        } else if (left + root.width > window.innerWidth) { // 弹出框右边缘超出视区时
          left = window.innerWidth - root.width
          this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
        } else { // 弹出框水平方向完全在视区
          this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
        }

        if (this.direction === 'top' || this.direction === 'topStart' || this.direction === 'topEnd') {
          if (topValue < 0 && bottomValue + root.height <= window.innerHeight) {
            top = bottomValue
            this.secondDirection = 'bottom'
            if (this.direction === 'topStart') {
              this.secondDirection = 'bottomStart'
              this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
            }
            if (this.direction === 'topEnd') {
              this.secondDirection = 'bottomEnd'
              this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
            }
          } else {
            top = topValue
            this.secondDirection = ''
            this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
          }
        } else {
          if (bottomValue + root.height > window.innerHeight && topValue >= 0) {
            top = topValue
            this.secondDirection = 'top'
            if (this.direction === 'bottomStart') {
              this.secondDirection = 'topStart'
              this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
            }
            if (this.direction === 'bottomEnd') {
              this.secondDirection = 'topEnd'
              this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
            }
          } else {
            top = bottomValue
            this.secondDirection = ''
            this.arrowStyle = { left: (target.left + target.right) / 2 - left + 'px' }
          }
        }
      } else if (lergtReg.test(this.direction)) {
        top = target.top + (target.height - root.height) / 2
        if (this.direction === 'leftStart' || this.direction === 'rightStart') {
          top = target.top
        }
        if (this.direction === 'leftEnd' || this.direction === 'rightEnd') {
          top = target.top - root.height + target.height
        }
        if (top < 0) { // 弹出框上边缘超出视区时
          top = 0
          this.arrowStyle = { top: (target.top + target.bottom) / 2 + 'px' }
        } else if (top + root.height > window.innerHeight) { // 弹出框右边缘超出视区时
          top = window.innerHeight - root.height
          this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
        } else { // 弹出框水平方向完全在视区
          this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
        }

        if (this.direction === 'left' || this.direction === 'leftStart' || this.direction === 'leftEnd') {
          if (leftValue < 0 && rightValue + root.width <= window.innerWidth) {
            left = rightValue
            this.secondDirection = 'right'
            if (this.direction === 'leftStart') {
              this.secondDirection = 'rightStart'
              this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
            }
            if (this.direction === 'leftEnd') {
              this.secondDirection = 'rightEnd'
              this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
            }
          } else {
            left = leftValue
            this.secondDirection = ''
            this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
          }
        } else {
          if (rightValue + root.width > window.innerWidth && leftValue >= 0) {
            left = leftValue
            this.secondDirection = 'left'
            if (this.direction === 'rightStart') {
              this.secondDirection = 'leftStart'
              this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
            }
            if (this.direction === 'rightEnd') {
              this.secondDirection = 'leftEnd'
              this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
            }
          } else {
            left = rightValue
            this.secondDirection = ''
            this.arrowStyle = { top: (target.top + target.bottom) / 2 - top + 'px' }
          }
        }
      }

      this.top = top
      this.left = left
    },

    // 处理弹出框可见时
    handleVisible (value, el, e) {
      this.willHide = false
      this.currentElement = el
      this.$emit('update:display', true)
      this.$emit('show', value)
      this.$nextTick(() => {
        this.computePosition(this.$el, this.currentElement)
      })
    },

    // 处理弹出框不可见时
    handleInvisible (value, e) {
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
    handleScroll () {
      // 滚动时可见，计算弹出框位置
      // 滚动时不可见，隐藏弹出框
      if (this.scrollShow) {
        if (this.display) {
          this.computePosition(this.$el, this.currentElement)
        }
      } else {
        this.$emit('update:display', false)
        this.$emit('hide')
      }
    },

    handlePopupVisible (e) {
      e.stopPropagation()
      this.willHide = false
      this.$emit('update:display', true)
      this.$emit('show', this.value)
    },

    handlePopupInvisible (e) {
      // 若触发类型为点击，且点击发生在当前触发元素上时，弹出框不消失，
      if (this.trigger === 'click' && this.isClosest(e.target, this.currentElement)) {
        return
      }

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
    },

    // 展示弹出框
    show (el, value) {
      this.handleVisible(value, el)
    },

    hide () {
      this.handleInvisible()
    },

    // whether it is in direction line
    isDirectionLine (direction) {
      if (direction === 'top' || direction === 'bottom') {
        return this.direction === 'top' || this.direction === 'bottom'
      } else {
        return this.direction === 'left' || this.direction === 'right'
      }
    },

    // 是否是祖先元素
    isClosest (target, element) {
      if (target === document) {
        return false
      } else if (target === element) {
        return true
      } else {
        return this.isClosest(target.parentNode, element)
      }
    }
  }
}
</script>
