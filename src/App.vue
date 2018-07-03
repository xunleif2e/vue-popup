<template>
  <component :is="component"></component>
</template>

<script>
import './demo.css'
import ExampleMultiple from './examples/ExampleMultiple.vue'
import ExampleSimple from './examples/ExampleSimple.vue'

export default {
  name: 'app',
  components: {
    ExampleMultiple,
    ExampleSimple
  },
  data () {
    return {
      component: 'example-simple'
    }
  }
}
</script>
