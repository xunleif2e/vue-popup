<template>
  <div>
    <a v-popup:popup-simple class="btn" href="javascript:;" ref="btn">
      <span>Popup on bottom</span>
    </a>
    <popup
      arrow-class="drop-arrow"
      class="drop-msg-fail"
      :display.sync="showPopup"
      ref="popup-simple">
      <p>Popup title</p>
      <div class="drop-wrap">
        <a href="javascript:;">OK</a>
        <a href="javascript:;">Cancel</a>
      </div>
    </popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showPopup: false
    }
  }
}
</script>
