<template>
  <div v-show="show" :class="'popup-' + direction" :style="{ left: left + 'px', top: top + 'px' }">
    <slot></slot>
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
      show: false,
      left: 0,
      top: 0
    }
  },
  mounted() {
    this.appendToBody && document.body.appendChild(this.$el) // 将弹出框移动到 body 下

    this.$refs.reference.forEach(item => {
      item.el.addEventListener('mouseenter', this.handleMouseEnter.bind(this, item.value))
      item.el.addEventListener('mouseleave', this.handleMouseLeave.bind(this, item.value))
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
    handleMouseEnter(value, e) {
      this.show = true
      this.$emit('show', value)
      this.$nextTick(() => {
        let root = this.$el.getBoundingClientRect() // get popup root dom rect
        let target = e.target.getBoundingClientRect() // get trigger el rect
        if (this.direction === 'top' || this.direction === 'bottom') {
          this.left = target.left + (target.width - root.width) / 2
          if (this.direction === 'top') {
            this.top = target.top - root.height - this.padding
          } else {
            this.top = target.top + target.height + this.padding
          }
        } else if (this.direction === 'left' || this.direction === 'right') {
          this.top = target.top + (target.height - root.height) / 2
          if (this.direction === 'left') {
            this.left = target.left - root.width - this.padding
          } else {
            this.left = target.left + target.width + this.padding
          }
        }
      })
    },
    handleMouseLeave(value, e) {
      this.show = false
      this.$emit('hide', value)
    }
  }
}
</script>
