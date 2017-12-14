import Vue from 'vue'
import './Pane.css'

export default Vue.component('Pane', {
  props: ['title'],
  render () {
    return (
      <div class="pane">
        <div class="header">
          {this.title}
        </div>
        <div class="content">
          {this.$slots.default}
        </div>
      </div>
    )
  }
})
