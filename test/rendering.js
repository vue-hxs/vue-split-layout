const test = require('node:test')
const assert = require('node:assert/strict')
const {JSDOM} = require('jsdom')

const dom = new JSDOM('<div id="app"></div>')

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.Node = dom.window.Node
global.Element = dom.window.Element
global.HTMLElement = dom.window.HTMLElement

const Vue = require('vue')
const {Layout, Pane, Split, Tree} = require('../dist/vue-split-layout')

function nextRender () {
  return new Promise(resolve => {
    Vue.nextTick(() => Vue.nextTick(resolve))
  })
}

test('updates slotted view props without recreating view state', () => {
  let created = 0
  let destroyed = 0
  let pane
  let stateful
  let input

  const StatefulView = Vue.extend({
    data () {
      return {
        value: 'initial value'
      }
    },
    created () {
      created++
    },
    destroyed () {
      destroyed++
    },
    render (h) {
      return h('input', {
        attrs: {'data-stateful-view': ''},
        domProps: {value: this.value},
        on: {
          input: event => {
            this.value = event.target.value
          }
        }
      })
    }
  })

  const vm = new Vue({
    data () {
      return {
        title: 'Initial title',
        changes: [],
        splits: {
          dir: 'horizontal',
          first: 'pane',
          second: 'stateful'
        }
      }
    },
    render (h) {
      return h(Layout, {
        ref: 'layout',
        props: {splits: this.splits},
        on: {
          'layout:change': splits => this.changes.push(splits)
        }
      }, [
        h(Pane, {
          key: 'pane',
          ref: 'pane',
          props: {title: this.title}
        }, ['content']),
        h(StatefulView, {
          key: 'stateful',
          ref: 'stateful'
        })
      ])
    }
  }).$mount('#app')

  return nextRender().then(() => {
    pane = vm.$refs.pane
    stateful = vm.$refs.stateful
    input = document.querySelector('[data-stateful-view]')

    assert.equal(document.querySelector('.view .header').textContent.trim(), 'Initial title')
    assert.equal(created, 1)

    stateful.value = 'preserved value'
    vm.title = 'Updated title'
    return nextRender()
  }).then(() => {
    assert.equal(document.querySelector('.view .header').textContent.trim(), 'Updated title')
    assert.equal(document.querySelector('[data-stateful-view]'), input)
    assert.equal(document.querySelector('[data-stateful-view]').value, 'preserved value')
    assert.equal(vm.$refs.pane, pane)
    assert.equal(vm.$refs.stateful, stateful)
    assert.equal(created, 1)
    assert.equal(destroyed, 0)

    const layout = vm.$refs.layout
    const split = layout.$children.find(child => child.$el.matches('.split'))
    const splitter = split.$el.children[1]

    Object.defineProperty(split.$el, 'clientWidth', {value: 100})
    Object.defineProperty(splitter, 'clientWidth', {value: 6})
    split.$el.getBoundingClientRect = () => ({left: 0})

    splitter.dispatchEvent(new window.MouseEvent('mousedown', {
      bubbles: true,
      button: 0
    }))
    document.dispatchEvent(new window.MouseEvent('mousemove', {
      button: 0,
      clientX: 40
    }))
    assert.equal(vm.changes.length, 0)
    document.dispatchEvent(new window.MouseEvent('mouseup', {button: 0}))

    assert.deepEqual(vm.changes[0], {
      dir: 'horizontal',
      first: 'pane',
      second: 'stateful',
      split: '37%'
    })

    const paneNode = layout.state.nodes.find(node => node.viewId === 'pane')
    Tree.from(layout.state.nodes).removeChild(paneNode)

    layout.drag = {
      node: paneNode,
      over: {
        viewDom: document.querySelector('[target-view="view-stateful"]'),
        attach: 1
      }
    }
    layout.onViewDrop({button: 0})

    assert.deepEqual(vm.changes[1], {
      dir: 'horizontal',
      first: 'stateful',
      second: 'pane',
      split: '67%'
    })

    vm.$destroy()
  })
})

test('reports when splitter resizing finishes', () => {
  const mount = document.createElement('div')
  document.body.appendChild(mount)

  let resized
  const vm = new Vue({
    render (h) {
      return h(Split, {
        props: {resizeable: true},
        on: {
          onSplitResizeEnd: (event, split, size) => {
            resized = {event, split, size}
          }
        }
      }, [h('div'), h('div')])
    }
  }).$mount(mount)

  vm.$el.children[1].dispatchEvent(new window.MouseEvent('mousedown', {
    bubbles: true,
    button: 0
  }))
  document.dispatchEvent(new window.MouseEvent('mouseup', {button: 0}))

  assert.equal(resized.split, vm.$children[0])
  assert.equal(resized.size, '50%')

  vm.$destroy()
})

test('serializes nested layouts without internal node data', () => {
  const mount = document.createElement('div')
  document.body.appendChild(mount)

  const splits = {
    dir: 'horizontal',
    split: '30%',
    first: 'navigation',
    second: {
      dir: 'vertical',
      first: 'editor',
      second: 'preview'
    }
  }

  const vm = new Vue({
    render (h) {
      return h(Layout, {
        ref: 'layout',
        props: {splits}
      }, [
        h('div', {key: 'navigation'}),
        h('div', {key: 'editor'}),
        h('div', {key: 'preview'})
      ])
    }
  }).$mount(mount)

  return nextRender().then(() => {
    const serialized = vm.$refs.layout.serializeSplits()

    assert.deepEqual(serialized, splits)
    assert.equal(JSON.stringify(serialized).includes('"id"'), false)
    assert.equal(JSON.stringify(serialized).includes('"parent"'), false)

    vm.$destroy()
  })
})
