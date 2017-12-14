// Create better model
// with a class maybe

export default
class Tree {
  static gid = 0
  constructor (tree) {
    this.tree = tree || []
  }
  push (node) {
    if (node.id === undefined) {
      node.id = Tree.gid++
    }
    this.tree.push(node)
    return node
  }
  findById (nodeId) {
    var node = this.tree.find(n => n.id === nodeId)
    return node
  }
  childrenOf (parent) {
    return this.tree.filter(k => k.parent === parent)
  }
  removeChild (toRemove) {
    var ci = this.tree.indexOf(toRemove)
    if (ci === -1) { // There is no child
      return
    }
    this.tree.splice(ci, 1) // remove child
    var pindex = this.tree.indexOf(toRemove.parent) // find parentIndex
    // Substitute pindex with sibling
    // Possible slow
    var [sibling] = this.childrenOf(toRemove.parent) // Should be only one now
    var siblingIndex = this.tree.indexOf(sibling) // find siblingIndex
    this.tree.splice(siblingIndex, 1) // remove sibling
    // Swap parent to grand parent
    this.tree[pindex] = sibling // Replace parent with sibling
    sibling.parent = sibling.parent.parent // Set new parent for sibling as grandparent
  }
  attachChild (target, position, child, size) {
    if (child.id === undefined) {
      child.id = Tree.gid++
    }
    // 33 %
    size = size || 33
    var targetI = this.tree.indexOf(target)
    var newSplit = {
      id: Tree.gid++,
      type: 'split',
      parent: target.parent,
      dir: (position % 2 === 0) ? 'vertical' : 'horizontal'
    }
    // our node parent is the new split
    target.parent = newSplit // detached node parent
    child.parent = newSplit // drag node parent
    this.tree[targetI] = newSplit // Same location as node
    if (position === 0 || position === 3) {
      newSplit.split = size + '%'
      this.tree.push(child, target)
    } else {
      newSplit.split = (100 - size) + '%'
      this.tree.push(target, child)
    }
    return child
  }
}
Tree.from = function (tree) {
  return new Tree(tree)
}
