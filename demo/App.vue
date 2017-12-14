<script>
import Vue from 'vue'
import {Layout, Pane} from '../src'

var MyInput = Vue.component('MyInput', {
  data () {
    return {
      value: ''
    }
  },
  template: `<div><div>{{value}}</div><input type='text' v-model='value'></div>`
})

export default {
  name: 'App',
  components: {Layout, Pane, MyInput},
  data () {
    return {
      hi: 'world'
    }
  }
}
</script>

<template>
  <div id="root">
    <div class="app">
      <div class="app-container">
        <Layout edit='true' resizeable='true' dir='horizontal'>
          <div>Weird</div>
          <Pane title="GOLUCK">testing</Pane>
          <Pane title="stuff">Stuff<MyInput /></Pane>
      </Layout></div>
    </div>
  </div>
</template>

<style>
body {
  margin:0;
  padding:0;
  min-height:100vh;
  height:100vh;
  background: #ddd;

}
#root {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height:100%;
}
.app {
  display:flex;
  flex-direction:column;
  height:100%;
}
.app-container {
  flex:1;
  display:flex;
}

</style>
