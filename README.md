# vue-popup

> A popup component for Vue.js

![popup](./popup.jpg)

## Installation

### CDN

```html
<script src="//cdn.jsdelivr.net/gh/beyoursun/vue-popup@v0.1-beta.1/dist/vue-popup.js"></script>
```

### NPM

```bash
npm install vue-popup --save
```

## Usage

First, you need to use the plugin.

```js
import Vue from 'vue'
import VuePopup from 'vue-popup'

Vue.use(VuePopup) // use plugin
```

Then, use the `<popup>` component on your `.vue` file.

```html
<template>
  <div>
    <popup ref="popup1">
      <h3>Title in popup</h3>
      <p>This is a paragraph in popup.</p>
    </popup>
    <a v-popup:popup1 href="javascript">Show Popup</a>
  </div>
</template>

<script>
export default {}
</script>
```

Add `ref` in your popup, then in your button, use `v-popup` directive to link the button and the popover.

There is a [simple live demo](https://jsfiddle.net/jwdon3fg/).

## Build Setup

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
