<template>
  <div id="app">
    <a href="javscript:;" @click="show = !show">切换显示</a>
    <div v-if="show">
    <popup
      arrow-class="drop-arrow"
      class="drop-msg-fail"
      direction="leftStart"
      :display.sync="showPopup"
      :padding="0"
      trigger="click"
      :scroll-show="false"
      ref="popup-ico"
      @show="handlePopupShow">
      <p>消息发送失败</p>
      <div class="drop-wrap">
        <a href="javascript:;" @click="handleRetry">重发</a>
        <a href="javascript:;" @click="handleRemove">删除</a>
      </div>
    </popup>
    <div v-for="(b, i) in list" class="row" :key="i">
      <a v-popup:popup-ico="i" class="btn" :class="{ gray: b }" href="javascript:;">
        <span>{{ b ? '发送成功' : '发送失败' }}</span>
      </a>
    </div>
    <a href="javascript:;" @click="list.pop(false)">删除</a>
    </div>
  </div>
</template>

<script>
import './demo.css'

export default {
  name: 'app',
  data () {
    return {
      show: true,
      current: 0,
      showPopup: false,
      list: Array.from({ length: 10 }, () => false)
    }
  },
  methods: {
    handlePopupShow (value) {
      this.current = value
    },
    handleRetry () {
      this.showPopup = false
      this.$set(this.list, this.current, true)
    },
    handleRemove () {
      this.showPopup = false
      this.list.splice(this.current, 1)
    }
  }
}
</script>
