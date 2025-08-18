<template>
  <div id="app">
    <TestIntegration />
  </div>
</template>

<script>
import TestIntegration from './components/TestIntegration.vue'

export default {
  name: 'App',
  components: {
    TestIntegration
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
