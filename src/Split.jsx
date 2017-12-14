import Vue from 'vue'

import './Split.css'

// onDrag could be used here but performance was sloppy on chrome

export default Vue.component('Split', {
  // static defaultProps = {
  // resizeable: true
  // }
  // define props here on static
  props: ['resizeable', 'dir', 'split'],
  data () {
    return {
      state: {
        resizing: false,
        split: this.split || '50%'
      }
    }
  },

  methods: {
    startResize (event) {
      event.stopPropagation()
      this.state.resizing = true
      document.addEventListener('mousemove', this.splitResize)
      document.addEventListener('mouseup', this.stopResize)
    },
    splitResize (event) {
      event.stopPropagation()
      event.preventDefault()
      // Resizing operation else where?
      const objProps = {
        'horizontal': {dimProp: 'width', mouseProp: 'clientX', posProp: 'left'},
        'vertical': {dimProp: 'height', mouseProp: 'clientY', posProp: 'top'}
      }
      const {dimProp, mouseProp, posProp} = objProps[this.dir]

      var el = this.$el
      var splitter = el.children[1].getBoundingClientRect()[dimProp] / 2
      var parentRect = el.getBoundingClientRect()
      var splitSize = (event[mouseProp] - parentRect[posProp] - splitter) / parentRect[dimProp] * 100
      var splitStyle = splitSize + '%'
      // Set local referer state
      this.state.split = splitStyle

      // Callback ??? emit
      // if (this.props.onSplitResize) {
      // this.props.onSplitResize(this, splitStyle)
      // }
    },
    stopResize (event) {
      this.state.resizing = false
      document.removeEventListener('mousemove', this.splitResize)
      document.removeEventListener('mouseup', this.stopResize)
    }

  },
  render () {
    const splitClass = [
      'split',
      this.dir,
      this.state.resizing ? 'resizing' : '',
      this.resizeable ? 'resizeable' : ''
    ]

    var splitter
    if (this.resizeable) {
      splitter = <div class="splitter" onmousedown={this.startResize}></div>
    } else {
      splitter = <div class="splitter"></div>
    }

    const children = this.$slots.default.filter(v => v.tag !== undefined)

    // Optionally a splitter
    return (
      <div class={splitClass.join(' ')}>
        <div class="content" style={{flexBasis: this.state.split}}> {children[0]} </div>
        {splitter}
        <div class="content"> {children[1]} </div>
      </div>
    )
  }
})
