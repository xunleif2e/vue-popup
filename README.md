# vue-popup

> 一个 Vue.js 弹出框组件，供迅雷内部使用。

![popup](./popup.jpg)

## 安装 Installation

### CDN

```html
<script src="//cdn.jsdelivr.net/gh/beyoursun/vue-popup/dist/vue-popup.js"></script>
```

### NPM

```bash
npm install @xunlei/vue-popup --save
```

## 使用 Usage

首选，你需要注册插件。

```js
import Vue from 'vue'
import VuePopup from 'vue-popup'

Vue.use(VuePopup)
```

在你的 `.vue` 文件中使用 `popup` 组件。

```html
<template>
  <div>
    <popup ref="popup1">
      <h3>标题</h3>
      <p>这是一段内容。</p>
    </popup>
    <a v-popup:popup1 href="javascript:;">展示弹出框</a>
  </div>
</template>

<script>
export default {}
</script>
```

在你的 `popup` 组件上添加 `ref` 引用，然后使用 `v-popup` 指令来将按钮映射到弹出框上。

这是一个简单的[在线示例](https://jsfiddle.net/bbsun/ftdtdu3r/)。

## 接口 API

### 属性 Prop

属性名 | 描述 | 类型 | 可选值 | 默认值
-- | -- | -- | -- | --
append-to-body | 是否放到 body 下 | Boolean | - | true
arrow-class | 箭头的类 | String | - | -
direction | 弹出框方向 | String | top/right/bottom/left | bottom
padding | 弹出框与触发元素的间距 | Number | - | 0

### 指令 Directive

#### `v-popup`

- **描述：** 指令需要添加在触发弹出框的元素上。

- **参数：**
  - `popupRef (required)` - 用于匹配特定弹出框。

- **类型：**
  - `any (optional)` - 在触发事件时传入的回调参数。

- **示例：**

```html
<popup
  ref="popup1"
  @show="handleShow"
  @hide="handleHide">
</popup>
<a v-popup:popup1="val"></a>

<scirpt>
export default {
  ...
  methods: {
    handleShow (val) { },
    handleHide (val) { }
  }
}
</script>
```

### 事件 Event

事件名 | 描述 | 回调参数
-- | -- | --
show | 弹出框展示事件 | value
hide | 弹出框隐藏事件 | value

## 构建流程 Build Setup

```bash
# clone the project repo
git clone git@github.com:beyoursun/vue-popup.git

# install dependencies
cd vue-popup && npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## 更新日志 ChangeLog

### 0.2.0 | 2017.6.11

- 新增 弹出框边缘不会超出视区
- 新增 滚动时对弹出框位置进行重新计算
- 更新 使用 `getBoundingClientRect` 方法来获取元素位置
- 新增 `append-to-body` 属性
