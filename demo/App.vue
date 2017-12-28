<template>
  <div :class="['app', state.extraStyle?'extra':'']">
    <div class="controls">
      <button @click="toggleEdit" :class="{active:state.edit}" >Toggle editable <span/></button>
      <button @click="toggleResize" :class="{active:state.resize}">Toggle resizeable <span/></button>
      <button @click="toggleBoth" :class="{active: state.edit && state.resize}">Toggle both</button>
      <button @click="toggleStyle" :class="{active:state.extraStyle}">toggle Style</button>
    </div>

    <Layout :edit="state.edit" :resize="state.resize" :splits="state.splits">
      <div class="nopane">
        <div>Also drag me on the gray area<button>random button </button><ul><li>Random</li><li>list</li></ul><div>{{ state.edit }}</div></div>
      </div>
      <Pane title="Drag me">testing</Pane>
      <Pane title="Drag me too">Stuff<MyInput /></Pane>
    </Layout>
  </div>
</template>

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
    const splits = {
      dir: 'horizontal',
      first: {
        dir: 'vertical',
        first: 0,
        second: 2
      },
      second: 1
    }
    return {
      state: {
        extraStyle: false,
        edit: true,
        resize: true,
        splits: splits
      },
      hi: 'world'

    }
  },
  methods: {
    toggleEdit () {
      this.state.edit = !this.state.edit
    },
    toggleResize () {
      this.state.resize = !this.state.resize
    },
    toggleBoth () {
      if (this.state.edit || this.state.resize) {
        this.state.edit = this.state.resize = false
        return
      }
      this.state.edit = this.state.resize = true
    },
    toggleStyle () {
      this.state.extraStyle = !this.state.extraStyle
    }

  }
}
</script>

<style>
@import './App.scss';
</style>
