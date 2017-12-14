# vue-split-layout

> vue split drag layout

`place image gif here`

## Install

## Usage

```vue
...
<template>
  <div id="app">
  <Layout :splits="this.tree">
    <div class="view1"></div>
    <Pane title="pane">content</Pane>
    <div class="view2"></div>
  </Layout>

  </div>
</template>
<script>
  import {Layout,Pane} from 'vue-split-layout'

  export default {
    components: {Layout}
    data () {
      // Setup initial tree
      // and pass it as a prop
      return {
        tree: // ...
      }
    }
</script>
...
```

`place functional demo somewhere`

## Build Setup

```bash
# install dependencies
npm install vue-split-layout
```
