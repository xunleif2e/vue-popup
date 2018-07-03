<template>
  <component :is="component"></component>
</template>

<script>
import './demo.css'
import ExampleMultiple from './examples/ExampleMultiple.vue'

export default {
  name: 'app',
  components: {
    ExampleMultiple
  },
  data () {
    return {
      component: 'example-multiple'
    }
  }
}
</script>
