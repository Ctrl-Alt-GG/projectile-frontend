<template>
  <div id="network-error-overlay" v-if="active">Network error!</div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
div#network-error-overlay {
  position: fixed;
  top: 0;
  right: 0;
  background-color: red;
  padding: 0.3em;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 1.1em;
  color: black;
  border: solid 1px #f90;
}
</style>