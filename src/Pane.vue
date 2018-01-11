<template>
  <div class="pane">
    <div class="header">
      {{ title }}
    </div>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {type: String, default: ''}
  }
}

</script>
 <style scoped>
.pane {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  height: 100%;
  width: 100%;
  flex-direction: column;
  pointer-events: none;
}

.pane > .header {
  height: 40px;
  padding: 10px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.pane > .content {
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  pointer-events: initial;
}
</style>
