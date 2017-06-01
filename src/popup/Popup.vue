<template>
  <div v-show="show" :class="'popup-' + direction" ref="root" :style="{ left: left + 'px', top: top + 'px' }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    direction: {
      type: String,
      default: 'bottom'
    },
    padding: Number
  },
  data() {
    return {
      show: false,
      left: 0,
      top: 0
    }
  },
  mounted() {
    this.$refs.reference.forEach(item => {
      item.addEventListener('mouseenter', this.handleMouseEnter)
      item.addEventListener('mouseleave', this.handleMouseLeave)
    })

    // 鼠标进入弹出框时，弹出框不消失
    this.$refs.root.addEventListener('mouseenter', () => {
      this.show = true
    })

    // 鼠标离开弹出框时，弹出框消失
    this.$refs.root.addEventListener('mouseleave', () => {
      this.show = false
    })
  },
  methods: {
    handleMouseEnter(e) {
      let root = this.$refs.root
      let target = e.target
      this.show = true
      this.$nextTick(() => {
        if (this.direction === 'top' || this.direction === 'bottom') {
          this.left = target.offsetLeft + (target.offsetWidth - root.offsetWidth) / 2
          if (this.direction === 'top') {
            this.top = target.offsetTop - root.offsetHeight - this.padding
          } else {
            this.top = target.offsetTop + target.offsetHeight + this.padding
          }
        } else if (this.direction === 'left' || this.direction === 'right') {
          this.top = target.offsetTop + (target.offsetHeight - root.offsetHeight) / 2
          if (this.direction === 'left') {
            this.left = target.offsetLeft - root.offsetWidth - this.padding
          } else {
            this.left = target.offsetLeft + target.offsetWidth + this.padding
          }
        }
      })
    },
    handleMouseLeave(e) {
      this.show = false
    }
  }
}
</script>