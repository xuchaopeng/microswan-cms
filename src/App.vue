<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.ivu-message {
  width: auto !important;
  top: 50% !important;
  left: 50% !important;
}
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
  .ivu-menu {
    z-index: 11;
  }
}
</style>
