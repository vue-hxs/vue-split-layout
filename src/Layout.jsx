import Vue from 'vue'
import Split from './Split'
import Tree from './tree'
import _ from 'lodash' // Just for deepClone?
import './Layout.css'

// I know its not ideal to mess with the DOM, but it doesn't seem to exist a
// clean way to reparent components in react without losing DOM state.
// My objective here was keep updating views either in DOM (e.g input box) or
// simple on a component as shown on <Clock /> example
//
// How this works:
//  * we receive a list of components that can be usable as views
//  * The state contains a tree with nodes pointing to the viewId
//  * render() will render all views inside a hidden DOM element with
// specific DOM properties and will render the tree elements with designated
// props
//  * componentDidUpdate, componentDidMount grab all views from hidden element
//  and place it on respective tree components as soon as we render(again) the
//  view components are moved back to the original place
//
//

// DOM
function checkAttach (targetDom, e, amount) {
  amount = amount || 33
  var size = amount / 100

  var trect = targetDom.getBoundingClientRect()
  var tW = trect.width * size
  var tH = trect.height * size
  var rPos = {x: e.clientX - trect.left, y: e.clientY - trect.top}

  // Calc dists and check the closest one
  var pos = [
    rPos.y - tH,
    (trect.width - tW) - rPos.x,
    (trect.height - tH) - rPos.y,
    rPos.x - tW
  ]
  // only matches if less than 0
  var min = 0
  var minI = -1
  pos.forEach((v, i) => {
    if (v < min) {
      min = v
      minI = i
    }
  })
  return minI
}

export default Vue.component('Layout', {
  props: ['edit', 'resize', 'splits'],
  created () {
    this.views = this.$slots.default.filter(v => v.tag !== undefined)
  },
  data () {
    console.log('Building tree from:', this.splits)
    const root = []
    const tree = Tree.from(root)

    const walk = (node) => {
      // See node check if object or viewId
      if (node instanceof Object) {
        let split = tree.push({type: 'split', dir: node.dir, split: node.size})
        walk(node.first).parent = split
        walk(node.second).parent = split
        return split
      }
      return tree.push({type: 'view', viewId: node})
      // Its a view, with only id
    }
    walk(this.splits)
    // Read splits properly
    //
    //
    return {
      state: {
        nodes: root, // this is an array
        drag: null
      }
    }
  },
  methods: {
    // wait on this
    onSplitResize (split, size) {
      // Slow probably
      const nodeId = split.props['node-id']
      this.setState(ps => {
        const node = Tree.from(ps.nodes).findById(nodeId)
        node.split = size
        return ps
      })
    },
    previewPane (attach, targetDom, amount) {
      if (attach === -1) {
        this.$refs.preview.style.opacity = 0
        return
      }
      if (targetDom === undefined) {
        return -1
      }
      amount = amount || 33 // default 33%
      const size = amount / 100

      // Precalc styles
      const targetRect = targetDom.getBoundingClientRect()
      const previewPos = {
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height
      }

      if (attach === 1) {
        previewPos.left += previewPos.width - previewPos.width * size
      } else if (attach === 2) {
        previewPos.top += previewPos.height - previewPos.height * size
      }
      if ((attach % 2) === 0) {
        previewPos.height *= size
      } else if ((attach % 2) === 1) {
        previewPos.width *= size
      }
      // Update DOM style
      this.$refs.preview.style.opacity = 1
      this.$refs.preview.style.position = 'fixed'
      for (const k in previewPos) {
        this.$refs.preview.style[k] = previewPos[k] + 'px'
      }
    },
    onViewDragStart (e) { // We could pass dom here?
      const nodeId = parseInt(e.target.getAttribute('node-id'), 10)
      if (nodeId === undefined) {
        return
      }
      const node = this.state.nodes.find(n => { return n.id === nodeId })
      if (node === undefined) {
        return
      }
      const containerRect = this.$refs.container.getBoundingClientRect()
      const trect = e.target.getBoundingClientRect()

      const savedNodes = _.cloneDeep(this.state.nodes)
      const rel = {
        x: e.clientX,
        y: e.clientY
      }

      this.state.drag = {
        node: node,
        offset: {x: rel.x - trect.left, y: rel.y - trect.top}
      }
      this.state.savedNodes = savedNodes
      Tree.from(this.state.nodes).removeChild(node)

      // Direct DOM because its faster and we don't need state
      this.$refs.drag.style.top = (trect.y - containerRect.top) + 'px' // Copy x/y?
      this.$refs.drag.style.left = (trect.x - containerRect.left) + 'px'
      this.$refs.drag.style.width = trect.width + 'px'
      this.$refs.drag.style.height = trect.height + 'px'

      // Initialize event
      document.addEventListener('mousemove', this.onViewDrag)
      document.addEventListener('mouseup', this.onViewDrop)
    },
    onViewDrag (e) {
      e.preventDefault()
      e.stopPropagation()

      const containerRect = this.$refs.container.getBoundingClientRect()
      const rel = {
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top
      }

      this.$refs.drag.style.left = (rel.x - this.state.drag.offset.x) + 'px'
      this.$refs.drag.style.top = (rel.y - this.state.drag.offset.y) + 'px'

      var viewDom = e.target
      for (; viewDom && viewDom.matches && !viewDom.matches('.view'); viewDom = viewDom.parentNode) {}
      if (!viewDom || !viewDom.matches) {
        this.previewPane(-1)
        return
      }

      var attach = checkAttach(viewDom, e)
      this.previewPane(attach, viewDom)
    },
    onViewDrop (e) {
      document.removeEventListener('mousemove', this.onViewDrag)
      document.removeEventListener('mouseup', this.onViewDrop)
      this.previewPane(-1) // disable preview

      var viewDom = e.target
      for (; viewDom && viewDom.matches && !viewDom.matches('.view'); viewDom = viewDom.parentNode) {}
      if (!viewDom || !viewDom.matches) {
        this.state.drag = null
        this.state.nodes = this.state.savedNodes
        return
      }
      var attach = checkAttach(viewDom, e)
      if (attach === -1) {
        this.state.drag = null
        this.state.nodes = this.state.savedNodes
        return
      }

      var nodeId = parseInt(viewDom.getAttribute('node-id'), 10)
      var tree = Tree.from(this.state.nodes)
      var node = tree.findById(nodeId)
      tree.attachChild(node, attach, this.state.drag.node)
      this.state.drag = null
    },
    attachViews () {
      console.log('this', this)
    }

  },
  // DOM VUE/REACT HACK
  beforeUpdate () {
    if (!this.$refs.container) { return }
    var els = this.$refs.container.querySelectorAll('[target-view]')
    Array.from(els).forEach((e, i) => {
      var el = this.$refs.container.querySelector('[src-view=' + e.getAttribute('target-view') + ']')
      el.appendChild(e.children[0])
    })
  },
  render () {
    this.$nextTick(() => {
      var els = this.$refs.container.querySelectorAll('[target-view]')
      Array.from(els).forEach((e, i) => {
        e.appendChild(this.$refs.container.querySelector('[src-view=' + e.getAttribute('target-view') + ']').children[0])
      })
    })

    // Layout renderer, build children
    const walk = (node) => {
      switch (node.type) {
        case 'split':
          var children = Tree.from(this.state.nodes).childrenOf(node).map(k => walk(k))
          return (<Split key={node.id} node-id={node.id} resizeable={!this.state.drag ? this.resize : false} dir={node.dir} split={node.split}>
            {children}
          </Split>)
        default:
          if (this.edit) {
            return (<div class={'view'} node-id={node.id} target-view={'view-' + node.viewId} onmousedown={this.onViewDragStart}></div>)
          }
          return (<div class={'view'} node-id={node.id} target-view={'view-' + node.viewId}></div>)
      }
    }
    const tree = walk(this.state.nodes[0])
    const layoutClass = [
      'layout-container',
      this.edit ? 'edit' : ''
    ]
    return (
      <div class={layoutClass.join(' ')} ref="container">
        {tree}
        <div class="preview" ref="preview"></div>
        <div
          class={'drag ' + (this.state.drag ? 'dragging' : '')}
          ref="drag"
          style={{'transformOrigin': this.state.drag ? (this.state.drag.offset.x + 'px ' + this.state.drag.offset.y + 'px') : ''}}>
          {
            this.state.drag &&
            <div
              class="view"
              target-view={'view-' + this.state.drag.node.viewId}
            />
          }
        </div>
        <div ref={(el) => { this._viewcontainer = el }} style={{display: 'none'}}>
          {this.views.map((view, i) => {
            return (<div key={i} src-view={'view-' + i}> {view} </div>)
          })}
        </div>
      </div>
    )
  }
})
