# vue-split-layout

> vue split drag layout

[https://vue-hxs.github.io/vue-split-layout/](https://vue-hxs.github.io/vue-split-layout/)

## Install

```bash
npm install --save vue-split-layout
```

## Usage

```vue
...
<template>
  <div id="app">
  <Layout :splits="tree">
    <div class="view1"></div> <!-- 0 - view -->
    <Pane title="pane">content</Pane> <!-- 1 - view -->
    <div class="view2"></div> <!-- 2 - view -->
  </Layout>

  </div>
</template>
<script>
import {Layout,Pane} from 'vue-split-layout'
export default {
    components: {Layout}
    data () {
      return {
        tree: {
          dir: 'horizontal', // Left | Right
          // Other split
          first: {
            dir: 'vertical',
            first: 0,    // these numbers represents the views slot ID
            second: 2
          },
          second: 1
        }
     }
  }
}
</script>
...
```

## TODO

* [ ] Better way for naming views instead of their indexes
* [ ] Improve rendering, if a view state(props) is update outside layout, the
      view isn't updated
* [ ] Persist creating an change $emit with possibily the tree json (also for
      split)
* [ ] Makes views draggable from some menu so we can add new views
