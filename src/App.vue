<template>
  <div id="app">
    <popup class="drop-msg-fail" direction="right" :padding="0" ref="popup-ico">
      <p>消息发送失败</p>
      <div class="drop-wrap">
        <a href="javascript:;">重发</a>
        <a href="javascript:;">删除</a>
      </div>
      <span class="drop-arrow"></span>
    </popup>
    <div v-for="_ in 10" class="row">
      <a v-popup:popup-ico class="btn" href="javascript:;">
        <span>发送失败</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body,dl,dd,h1,h2,h3,h4,h5,h6,p,form{margin:0;}ol,ul,input{margin:0; padding:0;}body,button,input,select,textarea{font:12px/1.5 \5FAE\8F6F\96C5\9ED1,tahoma,arial,\5b8b\4f53,sans-serif;outline:none;}ul,ol{list-style:none;}a{text-decoration:none;outline:0 none;color:#999;}img{border:0;}table{border-collapse:collapse;border-spacing:0;}
body{background: #f0f4f7;--colorLight:#41a1ff;}

.drop-msg-fail{position: absolute;bottom: 15px;background: #fff;height: 75px;text-align: center;left: -64px;box-shadow: 0 0 15px 5px rgba(0,0,0,.1);display: none;padding: 0 10px;}
.msg-fail:hover .drop-msg-fail{display: block;}
.drop-msg-fail .note{width: 180px;line-height: 20px;text-align: left;padding: 7px 0 0 10px ;}
.drop-msg-fail:after{content: '';width: 9px;height: 9px;background: #fff;transform: rotate(45deg);bottom: -4px;left:50%;margin-left:-4px;position: absolute;}
.drop-msg-fail p{line-height: 40px;}
.drop-wrap{display: flex;justify-content: center;}
.drop-wrap a{width: 58px;height: 20px;line-height: 20px;border-radius: 10px;color: #fff;background: var(--colorLight);margin: 0 5px;font-size: 12px;}
.drop-wrap a:hover{background: #58a5f0}
.drop-wrap a:nth-child(2){background: #e0e0e0;color:currentColor;}
.drop-wrap a:nth-child(2):hover{background: var(--colorLight);color: #fff;}
.note-fail .drop-msg-fail{left: -91px;}

.btn { display: inline-block; padding: 10px; }
.btn span { display: inline-block; padding: 5px 15px; background-color: #ff3a2a; border-radius: 14px; color: #fff; }
.drop-msg-fail { display: block; position: fixed; z-index: 1; }
.drop-msg-fail:after { display: none; }
.drop-arrow { width: 9px; height: 9px; background: #fff; transform: rotate(45deg); position: absolute; }
.drop-msg-fail.popup-left .drop-arrow { right: -4px; top: 50%; margin-top: -4px; }
.drop-msg-fail.popup-right .drop-arrow { left: -4px; top: 50%; margin-top: -4px; }
.drop-msg-fail.popup-top .drop-arrow { bottom: -4px; left: 50%; margin-left: -4px; }
.drop-msg-fail.popup-bottom .drop-arrow { top: -4px; left: 50%; margin-left: -4px; }
</style>
