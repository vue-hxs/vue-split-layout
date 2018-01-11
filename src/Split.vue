<script>
export default {
  props: {
    resizeable: {type: Boolean, default: false},
    dir: {type: String, default: 'horizontal'},
    split: {type: String, default: '50%'}
  },
  data () {
    return {
      state: {
        resizing: false,
        split: this.split || '50%'
      }
    }
  },
  computed: {
    splitClass () {
      return [
        'split',
        this.dir,
        this.state.resizing ? 'resizing' : '',
        this.resizeable ? 'resizeable' : ''
      ]
    }
  },

  methods: {
    startResize (event) {
      if (!this.resizeable || event.button !== 0) return
      event.stopPropagation()
      event.preventDefault()
      this.state.resizing = true

      const drag = (event) => {
        if (event.button !== 0) return
        const h = this.dir === 'horizontal'
        var splitter = (h ? this.$el.children[1].clientWidth : this.$el.children[1].clientHeight) / 2
        var parentRect = this.$el.getBoundingClientRect()
        var splitSize = h
          ? (event.x - parentRect.left - splitter) / this.$el.clientWidth * 100
          : (event.y - parentRect.top - splitter) / this.$el.clientHeight * 100
        this.state.split = splitSize + '%'
        this.$emit('onSplitResize', event, this, this.state.split)
      }
      const drop = (event) => {
        if (event.button !== 0) return
        this.state.resizing = false
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', drop)
      }
      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', drop)
    }

  },
  render (h) {
    // const items = this.$slots.default.map(vnode => h('div', { class: { column: true }, vnode })
    const items = []
    items.push(h('div', {class: 'content', attrs: {style: 'flex-basis:' + this.state.split}}, [this.$slots.default[0]]))
    items.push(h('div', {class: 'splitter', on: {mousedown: this.startResize}}))
    items.push(h('div', {class: 'content'}, [this.$slots.default[1]]))
    return h('div', {class: this.splitClass}, items)
  }

}
</script>
<style>
.split {
  display: flex;
  flex: 1;
  height: 100%;
}

.split > .content {
  position: relative;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
}

.split > .content > * {
  flex: 1;
  height: 100%;
}

.split > .content:last-child {
  flex: 1;
}

.split > .splitter {
  flex-basis: 6px;
}

.split.vertical {
  flex-direction: column;
}

.split.horizontal {
  flex-direction: row;
}

.split.resizeable.vertical > .splitter {
  cursor: row-resize;
}

.split.resizeable.horizontal > .splitter {
  cursor: col-resize;
}
</style>
