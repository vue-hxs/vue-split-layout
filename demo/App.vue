<template>
  <div class="app">
    <div class="controls">
      <button :class="{active:state.edit}" @click="toggleEdit">Toggle editable <span></span></button>
      <button :class="{active:state.resize}" @click="toggleResize">Toggle resizeable <span></span></button>
      <button @click="bothOn">Toggle On both</button>
    </div>

    <Layout :edit="state.edit" :resize="state.resize" :splits="state.splits">
      <div class="nopane" >Also drag me <button>random button </button><ul><li>Random</li><li>list</li></ul><div>{{state.edit}}</div></div>
      <Pane title="Drag me'">testing</Pane>
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
        edit: false,
        resize: false,
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
    bothOn () {
      this.state.edit = this.state.resize = true
    }

  }
}
</script>

<style>
* { text-shadow: 0px 0px 1px rgba(0,0,0,0.2); }
body {
  margin:0;
  padding:0;
  min-height:100vh;
  height:100vh;
  background: #ddd;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root { height:100%; }
.app { display:flex; flex-direction:column; height:100%; }

.controls { background: #123; }
.controls button {
  position: relative;
  cursor: pointer;
  padding:10px 20px;
  margin:8px;

  color:#FFF;
  outline: none;
  border: solid 1px transparent;
  background: rgba(250,250,250,0.2);

  transition: all .3s;
}
.controls button.active { border: solid 1px rgba(50,200,50,0.8); }
.controls button:hover { background: rgba(250,250,250,0.5);}
.controls button::after{
  position:absolute;
  border-radius:30px;
  left:50%;
  width:0%;
  bottom: 5px;
  height: 1px;
  content:" ";
  background: rgba(50,250,50,0.7);
  transition: all .3s;
}
.controls button.active::after { left: 10%; width:80%; }
/* Custom Styling */
.layout-container, .split { background: #ddd; }
.layout-container > * { margin: 8px; }
.layout-container .view { border: solid 1px transparent; transition: all 0.3s; }
.layout-container.edit .view { border: dotted 1px rgba(100, 100, 100, 0.4); }
.layout-container > .preview {
  background: rgba(0, 0, 0, 0.2);
  border: dashed 1px #666;
  transition: all 0.3s;
}
.layout-container > .drag { display: block; opacity: 0; transform: scale(1); }
.layout-container > .drag.dragging {
  opacity: 0.7;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.4);
  transform: scale(0.5);
  transition: transform 0.3s;
}
.layout-container > .drag * { pointer-events: none !important; }

.split > .splitter {
  flex-basis: 6px;
  position: relative;
  background: transparent;
  transition: all 0.3s;
}
.split.resizeable > .splitter { background: rgba(100, 100, 100, 0.2); }
.split.resizeable > .splitter::after {
  position: absolute;
  content: " ";
  z-index:10;
  transition:all .3s;
  top:0; right: 0; bottom:0; left:0;
}
.split.resizeable.horizontal > .splitter::after { right: -4px; left: -4px; }
.split.resizeable.vertical > .splitter::after { top: -4px; bottom: -4px; }

.split.resizeable.resizing > .splitter::after,
.split.resizeable > .splitter:hover::after {
  background: rgba(100, 100, 100, 0.2);
}

.pane { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3); overflow: hidden; }
.pane > .header { text-transform: uppercase; background: #eee; color: #444; }
.pane > .content { background: #fefefe; padding: 10px; }
</style>
